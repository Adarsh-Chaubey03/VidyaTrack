import mongoose from "mongoose";

const educatorApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    qualification: { type: String, required: true, trim: true },
    expertise: { type: String, required: true, trim: true },
    yearsOfExperience: { type: Number, required: true, min: 0 },
    portfolio: { type: String, default: "" },
    linkedIn: { type: String, default: "" },
    documentUrl: { type: String, default: "" }, // Cloudinary URL for verification doc
    bio: { type: String, default: "", maxlength: 500 },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNotes: { type: String, default: "" },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Prevent duplicate pending applications from the same user
educatorApplicationSchema.index(
  { userId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "pending" },
  }
);

const EducatorApplication = mongoose.model(
  "EducatorApplication",
  educatorApplicationSchema
);

export default EducatorApplication;
