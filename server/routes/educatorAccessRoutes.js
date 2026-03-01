import express from "express";
import upload from "../configs/multer.js";
import { protect, protectEducator } from "../middlewares/authMiddleware.js";
import { protectAdmin } from "../middlewares/adminMiddleware.js";
import {
  submitApplication,
  getApplicationStatus,
  educatorAccessLogin,
  switchToStudent,
  getAllApplications,
  reviewApplication,
  getApplicationStats,
} from "../controllers/educatorAccessController.js";

const router = express.Router();

// ─── Public ───────────────────────────────────────────────
router.post("/login", educatorAccessLogin);

// ─── Authenticated (any role) ─────────────────────────────
router.post("/apply", protect, upload.single("document"), submitApplication);
router.get("/status", protect, getApplicationStatus);
router.post("/switch-to-student", protect, switchToStudent);

// ─── Admin Only ───────────────────────────────────────────
router.get("/admin/applications", protect, protectAdmin, getAllApplications);
router.put("/admin/review/:applicationId", protect, protectAdmin, reviewApplication);
router.get("/admin/stats", protect, protectAdmin, getApplicationStats);

export default router;
