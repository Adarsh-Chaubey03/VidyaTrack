import mongoose from 'mongoose';

const mentorSlotSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  status: { type: String, enum: ['available', 'unavailable'], default: 'available' },
}, { timestamps: true });

mentorSlotSchema.index({ mentorId: 1, startsAt: 1 }, { unique: true });

export default mongoose.model('MentorSlot', mentorSlotSchema);
