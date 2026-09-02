import express from 'express';
import {
  sendMentorRequest,
  getStudentMentors,
  getTeacherRequests,
  respondToRequest,
  getApprovedTeachers,
} from '../controllers/mentorController.js';
import { protect, protectStudent, protectEducator } from '../middlewares/authMiddleware.js';

const mentorRouter = express.Router();

// ── GET /api/mentors/teachers ─────────────────────────────────────────────────
// Authenticated (any role). Returns approved educators for teacherId resolution.
mentorRouter.get('/teachers', protect, getApprovedTeachers);

// ── POST /api/mentors/request ─────────────────────────────────────────────────
// Student only. Creates a new mentorship request.
mentorRouter.post('/request', protect, protectStudent, sendMentorRequest);

// ── GET /api/mentors/student/mentors ─────────────────────────────────────────
// Also served at GET /api/student/dashboard/mentors (via server.js alias mount).
// Student only. Returns all requests grouped by status.
mentorRouter.get('/mentors', protect, protectStudent, getStudentMentors);

// ── GET /api/mentors/teacher/requests ────────────────────────────────────────
// Also served at GET /api/teacher/dashboard/requests (via server.js alias mount).
// Educator only. Returns incoming requests (default: pending).
mentorRouter.get('/requests', protect, protectEducator, getTeacherRequests);

// ── POST /api/mentors/teacher/requests/:requestId/respond ────────────────────
// Also served at POST /api/teacher/requests/:requestId/respond (server.js alias).
// Educator only. Accepts or rejects a pending request.
mentorRouter.post('/requests/:requestId/respond', protect, protectEducator, respondToRequest);

export default mentorRouter;
