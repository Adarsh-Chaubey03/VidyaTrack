import express from 'express';
import { protect, protectEducator } from '../middlewares/authMiddleware.js';
import upload from '../configs/multer.js';
import {
  submitResumeReview,
  getMyReview,
  listPendingReviews,
  submitTeacherReview,
} from '../controllers/resumeReviewController.js';

const router = express.Router();

/* ── Student ───────────────────────────────────────────────── */
// Submit (or resubmit) a resume for review
router.post('/submit', protect, upload.single('resume'), submitResumeReview);

// Get the calling student's own latest review record
router.get('/my-review', protect, getMyReview);

/* ── Educator ──────────────────────────────────────────────── */
// List all pending review requests
router.get('/pending', protect, protectEducator, listPendingReviews);

// Submit score + feedback for a specific review
router.post('/:id/review', protect, protectEducator, submitTeacherReview);

export default router;
