import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true, maxlength: 200 },
    slug:         { type: String, required: true, unique: true, index: true },
    excerpt:      { type: String, maxlength: 500 },
    content:      { type: String, required: true, maxlength: 50000 },
    tags:         [{ type: String }],
    authorId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status:       { type: String, enum: ['draft', 'pending', 'published', 'rejected'], default: 'draft', index: true },
    rejectionReason: { type: String },
    heroImageUrl: { type: String },
    readingTime:  { type: Number, default: 1 }, // minutes
    views:        { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-compute reading time before save
postSchema.pre('save', function (next) {
  if (this.isModified('content')) {
    const words = this.content.replace(/<[^>]+>/g, '').split(/\s+/).length;
    this.readingTime = Math.max(1, Math.ceil(words / 200));
  }
  next();
});

const Post = mongoose.model('Post', postSchema);
export default Post;
