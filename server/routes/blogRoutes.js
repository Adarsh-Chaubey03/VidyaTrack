import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { protectAdmin } from '../middlewares/adminMiddleware.js';
import upload from '../configs/multer.js';
import {
  listPublishedPosts,
  getPostBySlug,
  submitPost,
  updatePost,
  myPosts,
  uploadHeroImage,
  adminListPosts,
  approvePost,
  rejectPost,
  getComments,
  addComment,
  flagComment,
  adminListComments,
  adminApproveComment,
  adminDeleteComment,
} from '../controllers/blogController.js';

const router = express.Router();

/* ── Public ────────────────────────────────────────────────── */
router.get('/',           listPublishedPosts);          // GET /api/posts?page=&tag=
router.get('/detail/:slug', getPostBySlug);             // GET /api/posts/detail/:slug
router.get('/:id/comments', getComments);               // GET /api/posts/:id/comments

/* ── Authenticated user ────────────────────────────────────── */
router.post('/submit',           protect, submitPost);           // POST /api/posts/submit
router.put('/:id',               protect, updatePost);           // PUT  /api/posts/:id
router.get('/me/list',           protect, myPosts);              // GET  /api/posts/me/list
router.post('/upload-image',     protect, upload.single('image'), uploadHeroImage);
router.post('/:id/comments',    protect, addComment);            // POST /api/posts/:id/comments
router.post('/comments/:id/flag', protect, flagComment);         // POST /api/posts/comments/:id/flag

/* ── Admin ─────────────────────────────────────────────────── */
router.get('/admin/list',              protect, protectAdmin, adminListPosts);
router.post('/admin/:id/approve',      protect, protectAdmin, approvePost);
router.post('/admin/:id/reject',       protect, protectAdmin, rejectPost);
router.get('/admin/comments',          protect, protectAdmin, adminListComments);
router.post('/admin/comments/:id/approve', protect, protectAdmin, adminApproveComment);
router.delete('/admin/comments/:id',   protect, protectAdmin, adminDeleteComment);

export default router;
