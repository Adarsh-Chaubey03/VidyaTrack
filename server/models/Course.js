import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    lectureId: { type: String, required: true },
    lectureTitle: { type: String, required: true },
    lectureDescription: { type: String, default: '' },
    lectureUrl: { type: String, default: '' },
    youtubeVideoId: { type: String, default: '' },
    lectureDuration: { type: Number, default: 0 },
    isPreviewFree: { type: Boolean, default: false },
    lecturOrder: { type: Number, default: 0 },
}, { _id: false })



const chapterSchema = new mongoose.Schema({
    chapterId: { type: String, required: true },
    chapterOrder: { type: Number, required: true },
    chapterTitle: { type: String, required: true },
    chapterContent: [lectureSchema]
}, { _id: false })

const courseSchema = new mongoose.Schema({
    courseTitle: { type: String, required: true },
    courseDescription: { type: String, required: true },
    courseThumbnail: { type: String },
    coursePrice: { type: Number, required: true },
    isPublished: { type: Boolean, default: true },
    discount: { type: Number, required: true, min: 0, max: 100 },
    category: { type: String, default: 'uncategorized', index: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    tags: [{ type: String }],
    language: { type: String, default: 'English' },
    isTrending: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    courseContent: [],
    courseRatings: [
        { userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, rating: { type: Number, min: 1, max: 5 } }
    ],
    educator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    enrolledStudent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

}, { timestamps: true, minimize: false })

const Course = mongoose.model('Course', courseSchema)

export default Course;