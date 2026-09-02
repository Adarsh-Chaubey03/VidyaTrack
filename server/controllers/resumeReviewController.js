import { v2 as cloudinary } from 'cloudinary';
import ResumeReview from '../models/ResumeReview.js';

/* ──────────────────────────────────────────────────────────────
   Student — submit a new resume for review
   POST /api/resume-reviews/submit
   Body (multipart/form-data): resume (file), industry, experienceLevel,
                                targetRole, notes
   ────────────────────────────────────────────────────────────── */
export const submitResumeReview = async (req, res) => {
  try {
    const { industry, experienceLevel, targetRole, notes } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a resume PDF.' });
    }
    if (!industry || !experienceLevel || !targetRole) {
      return res.status(400).json({
        success: false,
        message: 'Industry, experience level, and target role are required.',
      });
    }

    // Upload PDF to Cloudinary
    let resumeUrl = '';
    let fileName = req.file.originalname || 'resume.pdf';
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'resume-reviews',
        resource_type: 'raw', // PDFs must use resource_type: raw
        public_id: `resume_${req.user._id}_${Date.now()}`,
      });
      resumeUrl = result.secure_url;
    } catch (uploadErr) {
      console.error('Cloudinary upload failed:', uploadErr);
      return res.status(500).json({ success: false, message: 'File upload failed. Please try again.' });
    }

    // Upsert: if the student already has a pending review, replace it.
    // If their last review is 'reviewed', create a fresh one.
    const existing = await ResumeReview.findOne({ studentId: req.user._id, status: 'pending' });
    if (existing) {
      // Update in-place so the educator queue always has fresh data
      existing.resumeUrl = resumeUrl;
      existing.fileName = fileName;
      existing.industry = industry;
      existing.experienceLevel = experienceLevel;
      existing.targetRole = targetRole;
      existing.notes = notes || '';
      await existing.save();
      return res.json({ success: true, review: existing, message: 'Resume updated and resubmitted for review.' });
    }

    const review = await ResumeReview.create({
      studentId: req.user._id,
      resumeUrl,
      fileName,
      industry,
      experienceLevel,
      targetRole,
      notes: notes || '',
    });

    console.log(`[telemetry] resume_review_submitted id=${review._id} student=${req.user._id}`);
    res.status(201).json({ success: true, review, message: 'Resume submitted for review.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────
   Student — get own latest review record
   GET /api/resume-reviews/my-review
   Returns the most recent review for the calling student.
   Feedback and score are only included once status = 'reviewed'.
   ────────────────────────────────────────────────────────────── */
export const getMyReview = async (req, res) => {
  try {
    const review = await ResumeReview.findOne({ studentId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    if (!review) {
      return res.json({ success: true, review: null });
    }

    // Strip private fields if still pending — belt-and-suspenders in case
    // someone calls this endpoint directly.
    if (review.status === 'pending') {
      delete review.score;
      delete review.feedback;
      delete review.reviewedBy;
    }

    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────
   Educator — list all pending resumes
   GET /api/resume-reviews/pending
   ────────────────────────────────────────────────────────────── */
export const listPendingReviews = async (req, res) => {
  try {
    const reviews = await ResumeReview.find({ status: 'pending' })
      .sort({ createdAt: 1 }) // oldest first — FIFO queue
      .populate('studentId', 'name email imageUrl')
      .lean();

    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────
   Educator — submit a review (score + feedback)
   POST /api/resume-reviews/:id/review
   Body: { score: Number(0-10), feedback: String }
   ────────────────────────────────────────────────────────────── */
export const submitTeacherReview = async (req, res) => {
  try {
    const { score, feedback } = req.body;

    // Validate score
    const numScore = Number(score);
    if (score === undefined || score === null || score === '' || isNaN(numScore) || numScore < 0 || numScore > 10) {
      return res.status(400).json({ success: false, message: 'Score must be a number between 0 and 10.' });
    }
    if (!feedback || !feedback.trim()) {
      return res.status(400).json({ success: false, message: 'Feedback is required.' });
    }

    const review = await ResumeReview.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review request not found.' });
    }
    if (review.status === 'reviewed') {
      return res.status(400).json({ success: false, message: 'This resume has already been reviewed.' });
    }

    review.score = numScore;
    review.feedback = feedback.trim();
    review.reviewedBy = req.user._id;
    review.reviewedAt = new Date();
    review.status = 'reviewed';
    await review.save();

    console.log(`[telemetry] resume_reviewed id=${review._id} educator=${req.user._id} score=${numScore}`);
    res.json({ success: true, review, message: 'Review submitted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
