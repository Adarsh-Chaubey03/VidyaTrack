import mongoose from 'mongoose';

// ─────────────────────────────────────────────────────────────────────────────
// MentorshipRequest
//
// Tracks every mentorship request sent by a student (role='user') to a teacher
// (role='educator', educatorApproved=true).
//
// Status state machine:
//   pending  →  accepted  (teacher accepts)
//   pending  →  rejected  (teacher rejects)
//
// No other transitions are permitted.
// ─────────────────────────────────────────────────────────────────────────────

const mentorshipRequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    introduction: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────────────────────────────

// Partial unique index: a student may have at most ONE pending request per teacher.
// After rejection the student can send a new request (no pending conflict).
mentorshipRequestSchema.index(
  { studentId: 1, teacherId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'pending' },
    name: 'unique_pending_per_student_teacher',
  }
);

// Fast lookup: all pending requests directed at a teacher (dashboard query).
mentorshipRequestSchema.index({ teacherId: 1, status: 1 });

// Fast lookup: all requests for a student (my-mentors query).
mentorshipRequestSchema.index({ studentId: 1, status: 1 });

const MentorshipRequest = mongoose.model('MentorshipRequest', mentorshipRequestSchema);

export default MentorshipRequest;
