import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorSlot', required: true, unique: true },
  status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' },
  meetingLink: { type: String, default: null },
  meetingProvider: { type: String, enum: ['zoom', 'manual', null], default: null },
  meetingSentAt: { type: Date, default: null },
}, { timestamps: true });

bookingSchema.index({ studentId: 1, startsAt: -1 });
bookingSchema.index({ mentorId: 1, createdAt: -1 });

export default mongoose.model('Booking', bookingSchema);
