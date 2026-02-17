import crypto from 'crypto';
import razorpay from '../configs/razorpay.js';
import PaymentTransaction from '../models/PaymentTransaction.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Purchase from '../models/Purchase.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mapRazorpayMethod = (method) => {
  const map = { upi: 'upi', card: 'card', netbanking: 'netbanking', wallet: 'wallet' };
  return map[method] || 'unknown';
};

// ---------------------------------------------------------------------------
// 1. Create Payment Order
//    Replicates: vendor-dashboard → PaymentModal → ENDPOINTS.vendor.createPaymentOrder
//    Backend:    khatakhat-backend → order/index.ts → razorpay.orders.create
// ---------------------------------------------------------------------------

/**
 * POST /api/payments/create-order
 *
 * Body: { amount, currency?, referenceId, referenceType?, metadata? }
 *
 * Creates a Razorpay order and persists a PaymentTransaction record.
 * Returns the data the client needs to open the Razorpay checkout.
 */
export const createPaymentOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Payment gateway not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
      });
    }

    const userId = req.user._id;
    const {
      amount,
      currency = 'INR',
      referenceId,
      referenceType = 'course',
      metadata = {},
    } = req.body;

    // ---- Validation ----
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'A positive amount is required' });
    }
    if (!referenceId) {
      return res.status(400).json({ success: false, message: 'referenceId is required' });
    }

    // ---- Verify reference exists (course-specific, extensible) ----
    if (referenceType === 'course') {
      const course = await Course.findById(referenceId);
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }

      // Check already enrolled
      const user = await User.findById(userId);
      if (user.enrolledCourses?.includes(referenceId)) {
        return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
      }
    }

    // ---- Create Razorpay order ----
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // convert to paise
      currency,
      receipt: `vt_${referenceType}_${Date.now()}`,
      payment_capture: 1, // auto-capture
    });

    // ---- Persist transaction record ----
    const txn = await PaymentTransaction.create({
      userId,
      referenceId,
      referenceType,
      amount,
      currency,
      razorpayOrderId: razorpayOrder.id,
      status: 'created',
      metadata,
    });

    return res.json({
      success: true,
      data: {
        transactionId: txn._id,
        razorpayOrderId: razorpayOrder.id,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount, // in paise
        currency: razorpayOrder.currency,
      },
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    return res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
};

// ---------------------------------------------------------------------------
// 2. Confirm / Verify Payment
//    Replicates: vendor-dashboard → PaymentModal handler callback
//    Backend:    khatakhat-backend → order/index.ts → /confirm-payment
//    Signature verification via HMAC SHA256
// ---------------------------------------------------------------------------

/**
 * POST /api/payments/confirm
 *
 * Body: { razorpayOrderId, razorpayPaymentId, razorpaySignature }
 *
 * 1. Verifies the Razorpay signature (HMAC SHA256).
 * 2. Fetches the payment from Razorpay API to double-check status & amount.
 * 3. Updates the PaymentTransaction record.
 * 4. Fulfils the domain action (e.g. enrol user in course).
 */
export const confirmPayment = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Payment gateway not configured',
      });
    }

    const userId = req.user._id;
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // ---- Validate ----
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'razorpayOrderId, razorpayPaymentId, and razorpaySignature are required',
      });
    }

    // ---- Find transaction ----
    const txn = await PaymentTransaction.findOne({ razorpayOrderId, userId });
    if (!txn) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Idempotency — already confirmed
    if (txn.status === 'paid') {
      return res.json({ success: true, message: 'Payment already confirmed', data: txn });
    }

    // ---- Signature verification (HMAC SHA256) ----
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({ success: false, message: 'Razorpay secret not configured' });
    }

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      await PaymentTransaction.findByIdAndUpdate(txn._id, {
        status: 'failed',
        failedAt: new Date(),
        failureReason: 'Invalid payment signature',
      });
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // ---- Fetch payment from Razorpay for additional verification ----
    const razorpayPayment = await razorpay.payments.fetch(razorpayPaymentId);
    const amountInRupees = razorpayPayment.amount / 100;

    if (Math.abs(amountInRupees - txn.amount) > 0.01) {
      return res.status(400).json({
        success: false,
        message: `Amount mismatch. Expected ₹${txn.amount}, received ₹${amountInRupees}`,
      });
    }

    if (razorpayPayment.status !== 'captured' || razorpayPayment.order_id !== razorpayOrderId) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // ---- Update transaction ----
    txn.status = 'paid';
    txn.razorpayPaymentId = razorpayPaymentId;
    txn.razorpaySignature = razorpaySignature;
    txn.paymentMethod = mapRazorpayMethod(razorpayPayment.method);
    txn.paidAt = new Date();
    await txn.save();

    // ---- Domain fulfilment (education-specific) ----
    await fulfillPayment(txn);

    return res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        transactionId: txn._id,
        status: txn.status,
        amount: txn.amount,
        referenceType: txn.referenceType,
        referenceId: txn.referenceId,
      },
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return res.status(500).json({ success: false, message: 'Failed to confirm payment' });
  }
};

// ---------------------------------------------------------------------------
// 3. Razorpay Webhook Handler
//    Replicates: khatakhat-backend → webhook/index.ts → /razorpay
//    Server-to-server callback — handles cases where the client callback
//    never fires (network drop, tab closed, etc.).
// ---------------------------------------------------------------------------

/**
 * POST /api/payments/webhook/razorpay
 *
 * Verifies HMAC SHA256 signature from Razorpay webhook,
 * then processes `payment.captured` and `payment.failed` events.
 */
export const razorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET not configured');
      return res.status(500).send('Webhook secret not configured');
    }

    const signature = req.headers['x-razorpay-signature'];
    if (!signature) {
      console.error('Missing x-razorpay-signature header');
      return res.status(400).send('Missing signature');
    }

    // Use raw body for signature verification
    const body = req.rawBody
      ? req.rawBody.toString('utf8')
      : JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Webhook signature verification failed');
      return res.status(400).send('Invalid signature');
    }

    const event = req.body.event;
    const payment = req.body.payload?.payment?.entity;

    if (!payment) {
      return res.status(400).send('Invalid payload');
    }

    const razorpayOrderId = payment.order_id;
    const razorpayPaymentId = payment.id;

    if (event === 'payment.captured') {
      const txn = await PaymentTransaction.findOne({ razorpayOrderId });

      if (!txn) {
        console.warn(`Webhook: No transaction for razorpayOrderId ${razorpayOrderId}`);
        return res.status(200).send('OK'); // ack to Razorpay anyway
      }

      // Idempotency
      if (txn.status === 'paid') {
        return res.status(200).send('OK');
      }

      txn.status = 'paid';
      txn.razorpayPaymentId = razorpayPaymentId;
      txn.paymentMethod = mapRazorpayMethod(payment.method);
      txn.paidAt = new Date();
      await txn.save();

      // Domain fulfilment
      await fulfillPayment(txn);
    } else if (event === 'payment.failed') {
      await PaymentTransaction.findOneAndUpdate(
        { razorpayOrderId, status: { $ne: 'paid' } },
        {
          status: 'failed',
          failedAt: new Date(),
          failureReason: payment.error_description || 'Payment failed',
        }
      );
    }

    return res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook Error:', error);
    return res.status(500).send('Internal Server Error');
  }
};

// ---------------------------------------------------------------------------
// 4. Get Payment Status
// ---------------------------------------------------------------------------

/**
 * GET /api/payments/status/:transactionId
 *
 * Returns the current status of a payment transaction.
 */
export const getPaymentStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { transactionId } = req.params;

    const txn = await PaymentTransaction.findOne({ _id: transactionId, userId });
    if (!txn) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    return res.json({
      success: true,
      data: {
        transactionId: txn._id,
        status: txn.status,
        amount: txn.amount,
        currency: txn.currency,
        referenceType: txn.referenceType,
        referenceId: txn.referenceId,
        paymentMethod: txn.paymentMethod,
        paidAt: txn.paidAt,
        createdAt: txn.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch payment status' });
  }
};

// ---------------------------------------------------------------------------
// 5. Get Payment History
// ---------------------------------------------------------------------------

/**
 * GET /api/payments/history
 *
 * Returns all payment transactions for the authenticated user.
 */
export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, referenceType, page = 1, limit = 20 } = req.query;

    const filter = { userId };
    if (status) filter.status = status;
    if (referenceType) filter.referenceType = referenceType;

    const transactions = await PaymentTransaction.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await PaymentTransaction.countDocuments(filter);

    return res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch payment history' });
  }
};

// ---------------------------------------------------------------------------
// Domain Fulfilment (education-platform specific)
// ---------------------------------------------------------------------------

/**
 * Called after a payment is confirmed (either from client callback or webhook).
 * Maps `referenceType` to the appropriate fulfilment action.
 * Easily extensible — add new cases as VidyaTrack grows.
 */
async function fulfillPayment(txn) {
  switch (txn.referenceType) {
    case 'course':
      await fulfillCoursePurchase(txn);
      break;
    case 'subscription':
      // Future: activate subscription period
      console.log(`Subscription fulfilment not yet implemented for txn ${txn._id}`);
      break;
    case 'test_series':
      // Future: unlock test series
      console.log(`Test-series fulfilment not yet implemented for txn ${txn._id}`);
      break;
    case 'mentorship':
      // Future: book mentorship session
      console.log(`Mentorship fulfilment not yet implemented for txn ${txn._id}`);
      break;
    default:
      console.warn(`Unknown referenceType "${txn.referenceType}" for txn ${txn._id}`);
  }
}

async function fulfillCoursePurchase(txn) {
  const user = await User.findById(txn.userId);
  if (!user) {
    console.error(`fulfillCoursePurchase: user ${txn.userId} not found`);
    return;
  }

  const courseId = txn.referenceId.toString();

  // Enrol user (idempotent)
  if (!user.enrolledCourses?.map(String).includes(courseId)) {
    user.enrolledCourses = user.enrolledCourses || [];
    user.enrolledCourses.push(txn.referenceId);
    await user.save();
  }

  // Update legacy Purchase record for backwards compatibility
  await Purchase.findOneAndUpdate(
    { courseId: txn.referenceId, userId: txn.userId },
    { status: 'completed' },
    { upsert: true, setDefaultsOnInsert: true }
  );
}
