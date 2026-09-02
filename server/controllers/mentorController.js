import mongoose from 'mongoose';
import MentorshipRequest from '../models/MentorshipRequest.js';
import User from '../models/User.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: safe select fields for teacher info returned to students
// ─────────────────────────────────────────────────────────────────────────────
const TEACHER_PUBLIC_FIELDS = 'name email imageUrl';
const STUDENT_PUBLIC_FIELDS = 'name email imageUrl';

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/mentors/request
// Authenticated Student only (protect + protectStudent)
//
// Body: { teacherId, introduction }
//
// Logic:
//  1. Validate teacherId & introduction
//  2. Confirm target user is an approved educator
//  3. Block if a pending request already exists for this (student, teacher) pair
//  4. Create new MentorshipRequest with status = 'pending'
// ─────────────────────────────────────────────────────────────────────────────
export const sendMentorRequest = async (req, res) => {
  try {
    const studentId = req.user._id; // always from token — never trusted from client
    const { teacherId, introduction } = req.body;

    // ── Input validation ────────────────────────────────────────────────────
    if (!teacherId || !mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ success: false, message: 'A valid teacherId is required.' });
    }

    if (!introduction || typeof introduction !== 'string' || introduction.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Introduction must be at least 10 characters.',
      });
    }

    if (introduction.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Introduction must not exceed 2000 characters.',
      });
    }

    // ── Cannot request yourself ─────────────────────────────────────────────
    if (studentId.toString() === teacherId.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot request mentorship from yourself.' });
    }

    // ── Verify target teacher exists and is an approved educator ────────────
    const teacher = await User.findById(teacherId).select('name role educatorApproved').lean();
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found.' });
    }
    if (teacher.role !== 'educator' || !teacher.educatorApproved) {
      return res.status(400).json({
        success: false,
        message: 'The specified user is not an approved educator.',
      });
    }

    // ── Duplicate pending check ─────────────────────────────────────────────
    // The partial unique index on the model also enforces this, but we return
    // a friendly 409 before hitting the DB constraint.
    const existingPending = await MentorshipRequest.findOne({
      studentId,
      teacherId,
      status: 'pending',
    }).lean();

    if (existingPending) {
      return res.status(409).json({
        success: false,
        message: 'You already have a pending request for this teacher. Please wait for their response.',
      });
    }

    // ── Also block if already accepted (active mentoring relationship) ──────
    const existingAccepted = await MentorshipRequest.findOne({
      studentId,
      teacherId,
      status: 'accepted',
    }).lean();

    if (existingAccepted) {
      return res.status(409).json({
        success: false,
        message: 'You already have an active mentoring relationship with this teacher.',
      });
    }

    // ── Create the request ──────────────────────────────────────────────────
    const mentorRequest = await MentorshipRequest.create({
      studentId,
      teacherId,
      introduction: introduction.trim(),
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Mentorship request sent successfully.',
      data: {
        requestId: mentorRequest._id,
        teacherId: mentorRequest.teacherId,
        status: mentorRequest.status,
        createdAt: mentorRequest.createdAt,
      },
    });
  } catch (error) {
    // Mongoose duplicate-key error from the partial unique index
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You already have a pending request for this teacher.',
      });
    }
    console.error('sendMentorRequest error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/student/dashboard/mentors
// Authenticated Student only (protect + protectStudent)
//
// Returns all requests for the authenticated student, grouped by status.
// Response shape:
//   {
//     success: true,
//     data: {
//       pending:  [ { requestId, teacher: { id, name, email, imageUrl }, introduction, createdAt } ],
//       accepted: [ ... ],
//       rejected: [ ... ],
//     }
//   }
// ─────────────────────────────────────────────────────────────────────────────
export const getStudentMentors = async (req, res) => {
  try {
    const studentId = req.user._id;

    const requests = await MentorshipRequest.find({ studentId })
      .populate('teacherId', TEACHER_PUBLIC_FIELDS)
      .sort({ createdAt: -1 })
      .lean();

    const grouped = { pending: [], accepted: [], rejected: [] };

    for (const r of requests) {
      const teacher = r.teacherId; // populated
      const entry = {
        requestId: r._id,
        teacher: teacher
          ? { id: teacher._id, name: teacher.name, email: teacher.email, imageUrl: teacher.imageUrl }
          : null,
        introduction: r.introduction,
        status: r.status,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };

      if (grouped[r.status]) {
        grouped[r.status].push(entry);
      }
    }

    return res.status(200).json({
      success: true,
      data: grouped,
    });
  } catch (error) {
    console.error('getStudentMentors error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/teacher/dashboard/requests
// Authenticated Educator only (protect + protectEducator)
//
// Returns pending mentorship requests directed at the logged-in teacher.
// Query param: ?status=pending|accepted|rejected  (default: pending)
// ─────────────────────────────────────────────────────────────────────────────
export const getTeacherRequests = async (req, res) => {
  try {
    const teacherId = req.user._id;

    const allowedStatuses = ['pending', 'accepted', 'rejected'];
    const requestedStatus = req.query.status;
    const statusFilter = allowedStatuses.includes(requestedStatus) ? requestedStatus : 'pending';

    const requests = await MentorshipRequest.find({ teacherId, status: statusFilter })
      .populate('studentId', STUDENT_PUBLIC_FIELDS)
      .sort({ createdAt: -1 })
      .lean();

    const formatted = requests.map((r) => {
      const student = r.studentId; // populated
      return {
        requestId: r._id,
        student: student
          ? { id: student._id, name: student.name, email: student.email, imageUrl: student.imageUrl }
          : null,
        introduction: r.introduction,
        status: r.status,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };
    });

    return res.status(200).json({
      success: true,
      requests: formatted,
    });
  } catch (error) {
    console.error('getTeacherRequests error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/teacher/requests/:requestId/respond
// Authenticated Educator only (protect + protectEducator)
//
// Body: { status: 'accepted' | 'rejected' }
//
// Authorization: teacherId on the request must match req.user._id.
// State guard: only pending requests can be responded to.
// ─────────────────────────────────────────────────────────────────────────────
export const respondToRequest = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { requestId } = req.params;
    const { status: newStatus } = req.body;

    // ── Validate input ──────────────────────────────────────────────────────
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ success: false, message: 'Invalid requestId.' });
    }

    if (!['accepted', 'rejected'].includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: 'status must be either "accepted" or "rejected".',
      });
    }

    // ── Fetch the request ───────────────────────────────────────────────────
    const mentorRequest = await MentorshipRequest.findById(requestId);
    if (!mentorRequest) {
      return res.status(404).json({ success: false, message: 'Mentorship request not found.' });
    }

    // ── Ownership check: only the target teacher may respond ────────────────
    if (mentorRequest.teacherId.toString() !== teacherId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to respond to this request.',
      });
    }

    // ── State guard: only pending requests may be acted on ──────────────────
    if (mentorRequest.status !== 'pending') {
      return res.status(409).json({
        success: false,
        message: `This request has already been ${mentorRequest.status}. No further action is possible.`,
      });
    }

    // ── Update status ───────────────────────────────────────────────────────
    mentorRequest.status = newStatus;
    await mentorRequest.save();

    return res.status(200).json({
      success: true,
      message: `Request ${newStatus} successfully.`,
      data: {
        requestId: mentorRequest._id,
        status: mentorRequest.status,
        updatedAt: mentorRequest.updatedAt,
      },
    });
  } catch (error) {
    console.error('respondToRequest error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/mentors/teachers
// Public (any authenticated user)
//
// Returns the list of approved educators so the frontend can look up
// real MongoDB _ids from names/positions shown in the static mentors array.
// Used by MentorProfile to map the static mentor object → real teacherId.
// ─────────────────────────────────────────────────────────────────────────────
export const getApprovedTeachers = async (req, res) => {
  try {
    const teachers = await User.find(
      { role: 'educator', educatorApproved: true },
      'name email imageUrl'
    )
      .sort({ name: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      teachers: teachers.map((t) => ({
        id: t._id,
        name: t.name,
        email: t.email,
        imageUrl: t.imageUrl,
      })),
    });
  } catch (error) {
    console.error('getApprovedTeachers error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
