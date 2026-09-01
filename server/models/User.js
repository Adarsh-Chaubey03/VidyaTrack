import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        role: {type: String, enum: ['user', 'educator', 'admin'], default: 'user'},
        activeRole: {type: String, enum: ['user', 'educator'], default: 'user'},
        educatorApproved: {type: Boolean, default: false},
        imageUrl: {type: String, default: 'https://via.placeholder.com/150'},
        enrolledCourses: [
            {
                type:mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }
        ],
    }, {timestamps: true});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// ── Indexes ─────────────────────────────────────────────────────────────────
//
// email already has a unique index from the schema definition above.
//
// role index — admin queries like getAllApplications populate users by role.
// Low cardinality (3 values) but fast for targeted role lookups.
userSchema.index({ role: 1 });

// enrolledCourses $in scan — getEnrolledStudentData: User.find({ enrolledCourses: { $in: courseIds } })
// A multikey index on enrolledCourses lets MongoDB use the index for $in queries
// instead of doing a collection scan.
userSchema.index({ enrolledCourses: 1 });

const User = mongoose.model("User", userSchema);

export default User