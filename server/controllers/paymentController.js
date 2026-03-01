import crypto from 'crypto';
import razorpay from '../configs/razorpay.js';
import PaymentTransaction from '../models/PaymentTransaction.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Purchase from '../models/Purchase.js';
import CourseProgress from '../models/CourseProgress.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mapRazorpayMethod = (method) => {
  const map = { upi: 'upi', card: 'card', netbanking: 'netbanking', wallet: 'wallet' };
  return map[method] || 'unknown';
};

// ---------------------------------------------------------------------------
// 1. Create Payment Order
// ---------------------------------------------------------------------------

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

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'A positive amount is required' });
    }
    if (!referenceId) {
      return res.status(400).json({ success: false, message: 'referenceId is required' });
    }

    if (referenceType === 'course') {
      const course = await Course.findById(referenceId);
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }
      const user = await User.findById(userId);
      if (user.enrolledCourses?.includes(referenceId)) {
        return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
      }
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: `vt_${referenceType}_${Date.now()}`,
      payment_capture: 1,
    });

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
        amount: razorpayOrder.amount,
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
// ---------------------------------------------------------------------------

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

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'razorpayOrderId, razorpayPaymentId, and razorpaySignature are required',
      });
    }

    const txn = await PaymentTransaction.findOne({ razorpayOrderId, userId });
    if (!txn) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (txn.status === 'paid') {
      return res.json({ success: true, message: 'Payment already confirmed', data: txn });
    }

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

    txn.status = 'paid';
    txn.razorpayPaymentId = razorpayPaymentId;
    txn.razorpaySignature = razorpaySignature;
    txn.paymentMethod = mapRazorpayMethod(razorpayPayment.method);
    txn.paidAt = new Date();
    await txn.save();

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
// ---------------------------------------------------------------------------

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
        return res.status(200).send('OK');
      }

      if (txn.status === 'paid') {
        return res.status(200).send('OK');
      }

      txn.status = 'paid';
      txn.razorpayPaymentId = razorpayPaymentId;
      txn.paymentMethod = mapRazorpayMethod(payment.method);
      txn.paidAt = new Date();
      await txn.save();

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
// Domain Fulfilment
// ---------------------------------------------------------------------------

async function fulfillPayment(txn) {
  switch (txn.referenceType) {
    case 'course':
      await fulfillCoursePurchase(txn);
      break;
    case 'subscription':
      console.log(`Subscription fulfilment not yet implemented for txn ${txn._id}`);
      break;
    case 'test_series':
      console.log(`Test-series fulfilment not yet implemented for txn ${txn._id}`);
      break;
    case 'mentorship':
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

  // Add user to course enrolledStudent list (idempotent)
  try {
    const course = await Course.findById(txn.referenceId);
    if (course && !course.enrolledStudent?.map(String).includes(txn.userId.toString())) {
      course.enrolledStudent = course.enrolledStudent || [];
      course.enrolledStudent.push(txn.userId);
      await course.save();
    }
  } catch (err) {
    console.error('Error adding student to course:', err);
  }

  // Auto-create CourseProgress record (idempotent)
  try {
    const existingProgress = await CourseProgress.findOne({ userId: txn.userId, courseId: txn.referenceId });
    if (!existingProgress) {
      const course = await Course.findById(txn.referenceId);
      if (course) {
        let totalLectures = 0;
        const chapterProgress = (course.courseContent || []).map(chapter => {
          const lectures = (chapter.chapterContent || []).map(lecture => {
            totalLectures++;
            return {
              lectureId: lecture.lectureId || lecture._id?.toString() || `lec_${totalLectures}`,
              isCompleted: false
            };
          });
          return {
            chapterId: chapter.chapterId || chapter._id?.toString(),
            completedLectures: lectures
          };
        });

        await CourseProgress.create({
          userId: txn.userId,
          courseId: txn.referenceId,
          totalLectures,
          chapterProgress
        });
        console.log(`CourseProgress created for user ${txn.userId}, course ${txn.referenceId}`);
      }
    }
  } catch (err) {
    console.error('Error creating CourseProgress:', err);
  }

  // Update legacy Purchase record for backwards compatibility & earnings tracking
  await Purchase.findOneAndUpdate(
    { courseId: txn.referenceId, userId: txn.userId },
    { status: 'completed', amount: txn.amount },
    { upsert: true, setDefaultsOnInsert: true }
  );
}
