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

// ── Indexes ─────────────────────────────────────────────────────────────────
//
// listPublishedPosts: { status: 'published' } + sort { createdAt: -1 }
// The compound index covers both the filter and the sort in one scan, avoiding
// an in-memory sort on the result set.
postSchema.index({ status: 1, createdAt: -1 });

// Tag filter on top of published status — used when tag= query param is passed.
postSchema.index({ status: 1, tags: 1, createdAt: -1 });

// Author's own posts — myPosts(): { authorId } + sort { updatedAt: -1 }
postSchema.index({ authorId: 1, updatedAt: -1 });

const Post = mongoose.model('Post', postSchema);
export default Post;
