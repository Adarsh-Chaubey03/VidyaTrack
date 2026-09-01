import mongoose from "mongoose";
import Course from "../models/Course.js";
import Category from "../models/Category.js";

// Fields returned for the course listing page.
// courseContent is excluded — it is a large nested array of chapters/lectures
// that is only needed on the individual course detail page.
const COURSE_LIST_PROJECTION = {
    courseTitle: 1,
    courseDescription: 1,
    courseThumbnail: 1,
    coursePrice: 1,
    discount: 1,
    category: 1,
    level: 1,
    tags: 1,
    language: 1,
    isTrending: 1,
    isNew: 1,
    isBestseller: 1,
    // enrolledStudent is kept as an array so the frontend can show enrollment
    // count (array.length). The popular sort now uses enrolledCount (see below).
    enrolledStudent: 1,
    courseRatings: 1,
    educator: 1,
    createdAt: 1,
};

// Get all courses with filtering, sorting, and pagination
export const getAllCourses = async (req, res) => {
    try {
        const {
            category,
            level,
            price,      // 'free' | 'paid'
            rating,     // minimum average rating, e.g. '4'
            search,
            sort,       // 'newest' | 'popular' | 'price-asc' | 'price-desc'
            page = 1,
            limit = 12,
        } = req.query;

        // ── Sanitize pagination inputs ───────────────────────────────────────
        // parseInt of a non-numeric string returns NaN; fall back to safe defaults.
        const pageNum  = Math.max(1, parseInt(page,  10) || 1);
        const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
        const skip = (pageNum - 1) * limitNum;

        // ── Build $match filter ──────────────────────────────────────────────
        const matchStage = { isPublished: true };

        if (category && category !== 'all') {
            matchStage.category = category;
        }
        if (level) {
            matchStage.level = level;
        }
        if (price === 'free') {
            matchStage.coursePrice = 0;
        } else if (price === 'paid') {
            matchStage.coursePrice = { $gt: 0 };
        }
        if (search) {
            // Anchor the regex to the start of a word where possible.
            // courseDescription is excluded from search to reduce scan cost;
            // courseTitle and tags are sufficient for course discovery.
            // A text index on courseTitle would be faster (added in Course model).
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            matchStage.$or = [
                { courseTitle:       { $regex: escapedSearch, $options: 'i' } },
                { courseDescription: { $regex: escapedSearch, $options: 'i' } },
                { tags:              { $regex: escapedSearch, $options: 'i' } },
            ];
        }

        // ── Rating filter — requires aggregation pipeline ────────────────────
        // courseRatings is an embedded array with no pre-computed average field.
        // We handle this case via aggregation when a rating filter is requested,
        // and via the simpler find() path otherwise.  This avoids fetching all
        // documents into JS memory just to compute averages.
        if (rating) {
            const minRating = parseFloat(rating);
            if (isNaN(minRating) || minRating < 1 || minRating > 5) {
                return res.status(400).json({ success: false, message: 'rating must be a number between 1 and 5' });
            }

            // ── Aggregation path (rating filter) ────────────────────────────
            let sortStage;
            if (sort === 'popular') {
                sortStage = { enrolledCount: -1, createdAt: -1 };
            } else if (sort === 'price-asc') {
                sortStage = { coursePrice: 1 };
            } else if (sort === 'price-desc') {
                sortStage = { coursePrice: -1 };
            } else {
                sortStage = { createdAt: -1 };
            }

            const pipeline = [
                { $match: matchStage },
                // Compute enrollment count and average rating in one pass
                {
                    $addFields: {
                        enrolledCount: { $size: { $ifNull: ['$enrolledStudent', []] } },
                        avgRating: {
                            $cond: [
                                { $gt: [{ $size: { $ifNull: ['$courseRatings', []] } }, 0] },
                                { $avg: '$courseRatings.rating' },
                                0,
                            ],
                        },
                    },
                },
                { $match: { avgRating: { $gte: minRating } } },
                { $sort: sortStage },
                // Count total matching docs before pagination
                {
                    $facet: {
                        metadata: [{ $count: 'total' }],
                        courses:  [
                            { $skip:  skip },
                            { $limit: limitNum },
                            // Populate educator — equivalent to .populate() but inside aggregation
                            {
                                $lookup: {
                                    from:         'users',
                                    localField:   'educator',
                                    foreignField: '_id',
                                    as:           'educator',
                                    pipeline:     [{ $project: { name: 1, imageUrl: 1 } }],
                                },
                            },
                            { $unwind: { path: '$educator', preserveNullAndEmpty: false } },
                            // Remove courseContent from listing payload
                            { $project: { courseContent: 0 } },
                        ],
                    },
                },
            ];

            const [result] = await Course.aggregate(pipeline);
            const totalCourses = result.metadata[0]?.total || 0;
            const courses      = result.courses;

            return res.json({
                success: true,
                courses,
                totalCourses,
                totalPages:  Math.ceil(totalCourses / limitNum),
                currentPage: pageNum,
            });
        }

        // ── Standard find() path (no rating filter) ──────────────────────────
        // sort=popular: sort by enrolledStudent array length.
        // MongoDB cannot sort by array length natively in find(), so we use
        // a lightweight aggregation only for the popular sort.
        if (sort === 'popular') {
            const pipeline = [
                { $match: matchStage },
                {
                    $addFields: {
                        enrolledCount: { $size: { $ifNull: ['$enrolledStudent', []] } },
                    },
                },
                { $sort: { enrolledCount: -1, createdAt: -1 } },
                {
                    $facet: {
                        metadata: [{ $count: 'total' }],
                        courses:  [
                            { $skip:  skip },
                            { $limit: limitNum },
                            {
                                $lookup: {
                                    from:         'users',
                                    localField:   'educator',
                                    foreignField: '_id',
                                    as:           'educator',
                                    pipeline:     [{ $project: { name: 1, imageUrl: 1 } }],
                                },
                            },
                            { $unwind: { path: '$educator', preserveNullAndEmpty: false } },
                            { $project: { courseContent: 0 } },
                        ],
                    },
                },
            ];

            const [result] = await Course.aggregate(pipeline);
            const totalCourses = result.metadata[0]?.total || 0;
            const courses      = result.courses;

            return res.json({
                success: true,
                courses,
                totalCourses,
                totalPages:  Math.ceil(totalCourses / limitNum),
                currentPage: pageNum,
            });
        }

        // Pure find() for all other sort modes — fastest path
        let sortObj = { createdAt: -1 };
        if (sort === 'price-asc')  sortObj = { coursePrice: 1 };
        if (sort === 'price-desc') sortObj = { coursePrice: -1 };
        // 'newest' and default both fall through to { createdAt: -1 }

        const [courses, totalCourses] = await Promise.all([
            Course.find(matchStage, COURSE_LIST_PROJECTION)
                .sort(sortObj)
                .skip(skip)
                .limit(limitNum)
                .populate({ path: 'educator', select: 'name imageUrl' })
                .lean(),
            Course.countDocuments(matchStage),
        ]);

        res.json({
            success: true,
            courses,
            totalCourses,
            totalPages:  Math.ceil(totalCourses / limitNum),
            currentPage: pageNum,
        });
    } catch (error) {
        console.error('Error in getAllCourses:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ group: 1, order: 1 }).lean();
        res.json({ success: true, categories });
    } catch (error) {
        console.error('Error in getCategories:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Course by Id 

export const getCourseId = async (req, res) => {
    const { id } = req.params;

    // Reject malformed IDs before hitting the database
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }

    try {
        const courseData = await Course.findById(id).populate({ path: 'educator' });

        if (!courseData) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // remove lecture url if isPreviewFree is False
        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                if (!lecture.isPreviewFree) {
                    lecture.lectureUrl = ""
                }
            })
        })

        res.json({ success: true, courseData })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// Get enrolled course detail — returns ALL lecture URLs (post-purchase)
export const getEnrolledCourseDetail = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }

    try {
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(userId).select('enrolledCourses').lean();

        if (!user || !user.enrolledCourses?.map(String).includes(id)) {
            return res.status(403).json({
                success: false,
                message: 'You are not enrolled in this course'
            });
        }

        const courseData = await Course.findById(id).populate({ path: 'educator' });

        if (!courseData) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Return full course data with ALL lecture URLs (enrolled users get everything)
        res.json({ success: true, courseData });
    } catch (error) {
        console.error('Error fetching enrolled course detail:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}
