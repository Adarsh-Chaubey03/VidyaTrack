import mongoose from 'mongoose';

/**
 * PaymentTransaction model — domain-agnostic payment record.
 *
 * Tracks every payment attempt through the Razorpay gateway.
 * Linked to the purchasing user and an optional reference entity
 * (e.g. courseId for course purchases, but extensible to any purchasable
 * resource via `referenceType`).
 */
const PaymentTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // ---- Generic reference (education-platform agnostic) ----
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    referenceType: {
      type: String,
      enum: ['course', 'subscription', 'test_series', 'mentorship'],
      default: 'course',
    },

    // ---- Monetary ----
    amount: { type: Number, required: true },          // in base currency units (INR)
    currency: { type: String, default: 'INR' },

    // ---- Razorpay specifics ----
    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    paymentMethod: {
      type: String,
      enum: ['upi', 'card', 'netbanking', 'wallet', 'unknown'],
    },

    // ---- Lifecycle ----
    status: {
      type: String,
      enum: ['created', 'pending', 'paid', 'failed', 'refunded'],
      default: 'created',
    },
    paidAt: { type: Date },
    failedAt: { type: Date },
    failureReason: { type: String },

    // ---- Metadata bucket for domain-specific extras ----
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Compound index for idempotency checks
PaymentTransactionSchema.index({ razorpayOrderId: 1, userId: 1 });

const PaymentTransaction = mongoose.model(
  'PaymentTransaction',
  PaymentTransactionSchema
);

export default PaymentTransaction;
