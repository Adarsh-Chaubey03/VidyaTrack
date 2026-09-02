import mongoose from 'mongoose';

// ─────────────────────────────────────────────────────────────────────────────
// ResumeReview
//
// Tracks every resume review request submitted by a student.
//
// Status state machine:
//   pending  →  reviewed  (educator submits score + feedback)
//
// One active review per student at a time.  A student may re-submit only after
// their current review has been completed (or they delete the old record).
// ─────────────────────────────────────────────────────────────────────────────

const resumeReviewSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Cloudinary secure_url for the uploaded PDF
    resumeUrl: { type: String, required: true },
    // Original file name shown in the UI
    fileName: { type: String, required: true, trim: true },

    // Review-request metadata filled in by the student
    industry: { type: String, required: true, trim: true },
    experienceLevel: { type: String, required: true, trim: true },
    targetRole: { type: String, required: true, trim: true },
    notes: { type: String, default: '', trim: true, maxlength: 2000 },

    // Workflow status
    status: {
      type: String,
      enum: ['pending', 'reviewed'],
      default: 'pending',
      index: true,
    },

    // Educator review — only populated once status = 'reviewed'
    score: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },
    feedback: {
      type: String,
      default: '',
      trim: true,
      maxlength: 5000,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Compound index: fetch a student's own review quickly
resumeReviewSchema.index({ studentId: 1, createdAt: -1 });

// Educator queue: all pending reviews sorted by submission time
resumeReviewSchema.index({ status: 1, createdAt: 1 });

const ResumeReview = mongoose.model('ResumeReview', resumeReviewSchema);
export default ResumeReview;
