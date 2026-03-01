import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import { v2 as cloudinary } from 'cloudinary';

/* ──────────────────────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────────────────────── */

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 120);
}

function sanitiseHtml(html) {
  // Minimal server-side sanitisation — strip <script> and event attrs
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '');
}

// Simple spam keyword list (extend as needed)
const SPAM_KEYWORDS = ['buy now', 'click here', 'free money', 'casino', 'viagra', 'loan offer'];

function isSpammy(text) {
  const lower = text.toLowerCase();
  if (SPAM_KEYWORDS.some(kw => lower.includes(kw))) return true;
  // Flag if > 3 URLs
  const urls = lower.match(/https?:\/\//g) || [];
  if (urls.length > 3) return true;
  return false;
}

/* ──────────────────────────────────────────────────────────────
   Posts — Public
   ────────────────────────────────────────────────────────────── */

// GET /api/posts?status=published&page=1&tag=&limit=12
export const listPublishedPosts = async (req, res) => {
  try {
    const { page = 1, limit = 12, tag } = req.query;
    const filter = { status: 'published' };
    if (tag) filter.tags = tag;

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('authorId', 'name imageUrl')
      .lean();

    res.json({ success: true, posts, total, totalPages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/posts/:slug
export const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, status: 'published' })
      .populate('authorId', 'name imageUrl')
      .lean();
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    // Increment views (fire-and-forget)
    Post.updateOne({ _id: post._id }, { $inc: { views: 1 } }).catch(() => {});

    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────
   Posts — Authenticated user
   ────────────────────────────────────────────────────────────── */

// POST /api/posts/submit
export const submitPost = async (req, res) => {
  try {
    const { title, content, excerpt, tags, heroImageUrl, saveDraft } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: 'Title and content are required' });
    if (content.length > 50000) return res.status(400).json({ success: false, message: 'Content too long (max 50 000 chars)' });

    const cleanContent = sanitiseHtml(content);
    let slug = slugify(title);
    // Ensure unique slug
    const existing = await Post.findOne({ slug });
    if (existing) slug += '-' + Date.now().toString(36);

    const status = saveDraft ? 'draft' : 'pending';

    const post = await Post.create({
      title: title.substring(0, 200),
      slug,
      excerpt: (excerpt || '').substring(0, 500),
      content: cleanContent,
      tags: (tags || []).slice(0, 10),
      authorId: req.user._id,
      status,
      heroImageUrl: heroImageUrl || '',
    });

    // Telemetry
    console.log(`[telemetry] post_submitted id=${post._id} status=${status} author=${req.user._id}`);

    res.json({ success: true, post, message: status === 'pending' ? 'Post submitted for review' : 'Draft saved' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/posts/:id  — Update own draft / resubmit
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (post.authorId.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not your post' });
    if (!['draft', 'rejected'].includes(post.status)) return res.status(400).json({ success: false, message: 'Can only edit drafts or rejected posts' });

    const { title, content, excerpt, tags, heroImageUrl, saveDraft } = req.body;
    if (title) { post.title = title.substring(0, 200); post.slug = slugify(title) + '-' + Date.now().toString(36); }
    if (content) post.content = sanitiseHtml(content).substring(0, 50000);
    if (excerpt !== undefined) post.excerpt = excerpt.substring(0, 500);
    if (tags) post.tags = tags.slice(0, 10);
    if (heroImageUrl !== undefined) post.heroImageUrl = heroImageUrl;

    post.status = saveDraft ? 'draft' : 'pending';
    post.rejectionReason = undefined;
    await post.save();

    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/posts/me
export const myPosts = async (req, res) => {
  try {
    const posts = await Post.find({ authorId: req.user._id })
      .sort({ updatedAt: -1 })
      .lean();
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/posts/upload-image  — upload hero image via Cloudinary
export const uploadHeroImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No image file provided' });
    const result = await cloudinary.uploader.upload(req.file.path, { folder: 'blog_heroes' });
    res.json({ success: true, url: result.secure_url });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────
   Posts — Admin
   ────────────────────────────────────────────────────────────── */

// GET /api/admin/posts?status=pending
export const adminListPosts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .populate('authorId', 'name email imageUrl')
      .lean();
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/admin/posts/:id/approve
export const approvePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    post.status = 'published';
    post.rejectionReason = undefined;
    await post.save();
    console.log(`[telemetry] post_approved id=${post._id} admin=${req.user._id}`);
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/admin/posts/:id/reject
export const rejectPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    post.status = 'rejected';
    post.rejectionReason = req.body.reason || '';
    await post.save();
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────
   Comments — Public / Authenticated
   ────────────────────────────────────────────────────────────── */

// GET /api/posts/:id/comments?page=1&limit=20
export const getComments = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const filter = { postId: req.params.id, status: 'visible' };
    const total = await Comment.countDocuments(filter);
    const comments = await Comment.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('authorId', 'name imageUrl')
      .lean();
    res.json({ success: true, comments, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/posts/:id/comments
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.length > 2000) return res.status(400).json({ success: false, message: 'Comment required (max 2 000 chars)' });

    // Rate-limit: max 10 comments per minute per user
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentCount = await Comment.countDocuments({ authorId: req.user._id, createdAt: { $gte: oneMinuteAgo } });
    if (recentCount >= 10) return res.status(429).json({ success: false, message: 'Too many comments. Wait a minute.' });

    const post = await Post.findById(req.params.id);
    if (!post || post.status !== 'published') return res.status(404).json({ success: false, message: 'Post not found' });

    const status = isSpammy(content) ? 'pending' : 'visible';

    const comment = await Comment.create({
      postId: post._id,
      authorId: req.user._id,
      content: sanitiseHtml(content),
      status,
    });

    if (status === 'visible') {
      await Post.updateOne({ _id: post._id }, { $inc: { commentCount: 1 } });
    }

    console.log(`[telemetry] comment_posted id=${comment._id} post=${post._id} status=${status}`);

    const populated = await Comment.findById(comment._id).populate('authorId', 'name imageUrl').lean();
    res.json({ success: true, comment: populated, autoModerated: status === 'pending' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/comments/:id/flag
export const flagComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    if (comment.flaggedBy.includes(req.user._id)) return res.json({ success: true, message: 'Already flagged' });

    comment.flaggedBy.push(req.user._id);
    comment.flagCount += 1;
    // Auto-hide after 3 flags
    if (comment.flagCount >= 3) comment.status = 'flagged';
    await comment.save();

    res.json({ success: true, message: 'Comment flagged' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────
   Comments — Admin
   ────────────────────────────────────────────────────────────── */

// GET /api/admin/comments?status=pending
export const adminListComments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const comments = await Comment.find(filter)
      .sort({ createdAt: -1 })
      .populate('authorId', 'name email imageUrl')
      .populate('postId', 'title slug')
      .lean();
    res.json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/admin/comments/:id/approve
export const adminApproveComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    const wasPending = comment.status !== 'visible';
    comment.status = 'visible';
    await comment.save();
    if (wasPending) {
      await Post.updateOne({ _id: comment.postId }, { $inc: { commentCount: 1 } });
    }
    res.json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/admin/comments/:id
export const adminDeleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    const wasVisible = comment.status === 'visible';
    await Comment.deleteOne({ _id: comment._id });
    if (wasVisible) {
      await Post.updateOne({ _id: comment.postId }, { $inc: { commentCount: -1 } });
    }
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
