import mongoose from 'mongoose';

const studentNoteSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, trim: true, maxlength: 120, default: 'Untitled note' },
  body: { type: String, trim: true, required: true, maxlength: 10000 },
}, { timestamps: true });

studentNoteSchema.index({ studentId: 1, updatedAt: -1 });

export default mongoose.model('StudentNote', studentNoteSchema);
