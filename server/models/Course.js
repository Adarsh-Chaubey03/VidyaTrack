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

// ── Indexes ─────────────────────────────────────────────────────────────────
//
// 1. Primary listing query: { isPublished: true } + sort by createdAt DESC
//    getAllCourses default path hits this index for both the find() and countDocuments().
//    isPublished first because it has very low cardinality (true/false) and filters
//    out unpublished courses before sorting — keeps the working set small.
courseSchema.index({ isPublished: 1, createdAt: -1 });

// 2. Category + listing — supports category filter combined with date sort.
//    Educator dashboard: Course.find({ educator: educatorId }) uses educator field.
courseSchema.index({ isPublished: 1, category: 1, createdAt: -1 });

// 3. Educator courses — used by getEducatorCourses and educatorDashboardData.
//    educator is already selective enough; no need to include isPublished here
//    since educator queries don't filter by isPublished.
courseSchema.index({ educator: 1, createdAt: -1 });

// 4. Price filter — supports price-asc / price-desc sorts and free/paid filter.
courseSchema.index({ isPublished: 1, coursePrice: 1 });

// 5. Level filter — supports level= query parameter.
courseSchema.index({ isPublished: 1, level: 1, createdAt: -1 });

// Write tradeoff: each index adds ~a few KB per document and slows inserts/updates
// marginally. For a course catalog that is read-heavy and write-light, this is
// an acceptable tradeoff. The popular sort uses an aggregation pipeline
// ($addFields + $sort on enrolledCount) which cannot use a simple field index,
// but benefits from the isPublished+createdAt index for the initial $match.

const Course = mongoose.model('Course', courseSchema)

export default Course;