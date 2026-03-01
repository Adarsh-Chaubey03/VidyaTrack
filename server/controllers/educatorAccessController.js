import EducatorApplication from "../models/EducatorApplication.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";

// ─── Helpers ──────────────────────────────────────────────
const generateToken = (id, role, email) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ id, role, email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Auto-approval criteria (Option B)
const AUTO_APPROVE_MIN_EXPERIENCE = 5; // years
const AUTO_APPROVE_QUALIFICATIONS = [
  "phd",
  "doctorate",
  "professor",
  "masters",
  "mtech",
  "mba",
];

function meetsAutoApprovalCriteria(application) {
  const qualLower = application.qualification.toLowerCase();
  const hasQualification = AUTO_APPROVE_QUALIFICATIONS.some((q) =>
    qualLower.includes(q)
  );
  const hasExperience =
    application.yearsOfExperience >= AUTO_APPROVE_MIN_EXPERIENCE;
  const hasDocument = !!application.documentUrl;
  return hasQualification && hasExperience && hasDocument;
}

// ─── Submit Application ───────────────────────────────────
// POST /api/educator-access/apply
export const submitApplication = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      fullName,
      email,
      qualification,
      expertise,
      yearsOfExperience,
      portfolio,
      linkedIn,
      bio,
    } = req.body;

    // Check if user already has educator role
    if (req.user.role === "educator" && req.user.educatorApproved) {
      return res.status(400).json({
        success: false,
        message: "You are already an approved educator.",
      });
    }

    // Check for existing pending application
    const existingApp = await EducatorApplication.findOne({
      userId,
      status: "pending",
    });
    if (existingApp) {
      return res.status(400).json({
        success: false,
        message:
          "You already have a pending application. Please wait for review.",
      });
    }

    // Handle document upload if provided
    let documentUrl = "";
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "educator-applications",
          resource_type: "auto",
        });
        documentUrl = result.secure_url;
      } catch (uploadErr) {
        console.error("Document upload failed:", uploadErr);
        // Continue without document — not a hard blocker
      }
    }

    const application = await EducatorApplication.create({
      userId,
      fullName,
      email,
      qualification,
      expertise,
      yearsOfExperience: Number(yearsOfExperience),
      portfolio: portfolio || "",
      linkedIn: linkedIn || "",
      documentUrl,
      bio: bio || "",
    });

    // ─── Option B: Conditional Auto-Approval ───────────────
    if (meetsAutoApprovalCriteria(application)) {
      application.status = "approved";
      application.adminNotes = "Auto-approved — meets all criteria.";
      application.reviewedAt = new Date();
      await application.save();

      // Upgrade user role
      await User.findByIdAndUpdate(userId, {
        role: "educator",
        educatorApproved: true,
      });

      return res.status(201).json({
        success: true,
        message:
          "Congratulations! Your application has been auto-approved. You can now log in as an Educator.",
        application,
        autoApproved: true,
      });
    }

    res.status(201).json({
      success: true,
      message:
        "Application submitted successfully. You will be notified once reviewed.",
      application,
      autoApproved: false,
    });
  } catch (error) {
    // Handle duplicate key (concurrent pending app)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending application.",
      });
    }
    console.error("Submit application error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Check Own Application Status ─────────────────────────
// GET /api/educator-access/status
export const getApplicationStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const application = await EducatorApplication.findOne({ userId }).sort({
      createdAt: -1,
    });

    if (!application) {
      return res.json({
        success: true,
        hasApplication: false,
        educatorApproved: req.user.educatorApproved || false,
      });
    }

    res.json({
      success: true,
      hasApplication: true,
      application: {
        status: application.status,
        adminNotes: application.adminNotes,
        createdAt: application.createdAt,
        reviewedAt: application.reviewedAt,
      },
      educatorApproved: req.user.educatorApproved || false,
    });
  } catch (error) {
    console.error("Get application status error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Educator Login (role switch) ─────────────────────────
// POST /api/educator-access/login
export const educatorAccessLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    // Must be an approved educator
    if (user.role !== "educator" || !user.educatorApproved) {
      return res.status(403).json({
        success: false,
        message:
          "Your account does not have educator privileges. Please apply first.",
      });
    }

    // Switch active role — enforces single active role
    user.activeRole = "educator";
    await user.save();

    res.json({
      success: true,
      message: "Educator session activated.",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        activeRole: "educator",
        educatorApproved: true,
        imageUrl: user.imageUrl,
        token: generateToken(user._id, "educator", user.email),
      },
    });
  } catch (error) {
    console.error("Educator access login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Switch Back to Student ───────────────────────────────
// POST /api/educator-access/switch-to-student
export const switchToStudent = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(
      userId,
      { activeRole: "user" },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Switched to student mode.",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        activeRole: "user",
        educatorApproved: user.educatorApproved,
        imageUrl: user.imageUrl,
        token: generateToken(user._id, "user", user.email),
      },
    });
  } catch (error) {
    console.error("Switch to student error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ADMIN ENDPOINTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// GET /api/educator-access/admin/applications
export const getAllApplications = async (req, res) => {
  try {
    const { status } = req.query; // ?status=pending
    const filter = status ? { status } : {};
    const applications = await EducatorApplication.find(filter)
      .populate("userId", "name email imageUrl role")
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    console.error("Get all applications error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/educator-access/admin/review/:applicationId
export const reviewApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { decision, adminNotes } = req.body; // decision: 'approved' | 'rejected'

    if (!["approved", "rejected"].includes(decision)) {
      return res
        .status(400)
        .json({ success: false, message: "Decision must be approved or rejected." });
    }

    const application = await EducatorApplication.findById(applicationId);
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found." });
    }

    if (application.status !== "pending") {
      return res
        .status(400)
        .json({ success: false, message: "Application already reviewed." });
    }

    application.status = decision;
    application.adminNotes = adminNotes || "";
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();
    await application.save();

    // If approved, upgrade the user
    if (decision === "approved") {
      await User.findByIdAndUpdate(application.userId, {
        role: "educator",
        educatorApproved: true,
      });
    }

    res.json({
      success: true,
      message: `Application ${decision}.`,
      application,
    });
  } catch (error) {
    console.error("Review application error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/educator-access/admin/stats
export const getApplicationStats = async (req, res) => {
  try {
    const [pending, approved, rejected, total] = await Promise.all([
      EducatorApplication.countDocuments({ status: "pending" }),
      EducatorApplication.countDocuments({ status: "approved" }),
      EducatorApplication.countDocuments({ status: "rejected" }),
      EducatorApplication.countDocuments(),
    ]);

    res.json({
      success: true,
      stats: { total, pending, approved, rejected },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
