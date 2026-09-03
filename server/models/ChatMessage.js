import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String, required: true, trim: true, maxlength: 4000 },
}, { timestamps: true });

chatMessageSchema.index({ studentId: 1, mentorId: 1, createdAt: 1 });

export default mongoose.model('ChatMessage', chatMessageSchema);
