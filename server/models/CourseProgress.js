import mongoose from "mongoose";

const lectureProgressSchema = new mongoose.Schema({
    lectureId: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
    watchTime: { type: Number, default: 0 },
    lastWatchedAt: { type: Date }
}, { _id: false });

const chapterProgressSchema = new mongoose.Schema({
    chapterId: { type: String, required: true },
    completedLectures: [lectureProgressSchema],
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date }
}, { _id: false });

const courseProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
    totalLectures: { type: Number, default: 0 },
    completedLectures: { type: Number, default: 0 },
    chapterProgress: [chapterProgressSchema],
    lastAccessedAt: { type: Date, default: Date.now },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    isCompleted: { type: Boolean, default: false },
    totalWatchTime: { type: Number, default: 0 }
}, { timestamps: true });

courseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

courseProgressSchema.pre('save', function(next) {
    if (this.totalLectures > 0) {
        this.progressPercentage = Math.round((this.completedLectures / this.totalLectures) * 100);
    }
    
    if (this.completedLectures === this.totalLectures && this.totalLectures > 0) {
        this.isCompleted = true;
        this.completedAt = new Date();
    }
    
    next();
});

const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema);

export default CourseProgress; 