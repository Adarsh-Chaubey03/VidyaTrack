import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema({
    courseId: {type: mongoose.Schema.Types.ObjectId,
        ref:'Course',
        required:true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {type: Number , required: true},
    status: {type: String, enum:['pending', 'completed','failed'],default:'pending'}
},{timestamps:true})

// ── Indexes ─────────────────────────────────────────────────────────────────
//
// Idempotency check in fulfillCoursePurchase: findOneAndUpdate({ courseId, userId })
// This compound index covers the lookup and prevents the need for a collection scan.
PurchaseSchema.index({ courseId: 1, userId: 1 }, { unique: true });

// getEnrolledStudentData: Purchase.find({ courseId: { $in: courseIds }, status: 'completed' })
// Covers the $in lookup on courseIds with status filter.
PurchaseSchema.index({ courseId: 1, status: 1 });

// getPaymentHistory lookup by userId
PurchaseSchema.index({ userId: 1, createdAt: -1 });

const Purchase = mongoose.model('Purchase', PurchaseSchema)
export default Purchase