import Course from "../models/Course.js";
import Category from "../models/Category.js";

// Get all courses with filtering, sorting, and pagination
export const getAllCourses = async (req, res) => {
    try {
        const {
            category,
            level,
            price,      // 'free' | 'paid'
            rating,     // minimum rating, e.g. '4'
            search,
            sort,       // 'newest' | 'popular' | 'price-asc' | 'price-desc'
            page = 1,
            limit = 12,
        } = req.query;

        // Build filter
        const filter = { isPublished: true };

        if (category && category !== 'all') {
            filter.category = category;
        }
        if (level) {
            filter.level = level;
        }
        if (price === 'free') {
            filter.coursePrice = 0;
        } else if (price === 'paid') {
            filter.coursePrice = { $gt: 0 };
        }
        if (search) {
            filter.$or = [
                { courseTitle: { $regex: search, $options: 'i' } },
                { courseDescription: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } },
            ];
        }

        // Build sort
        let sortObj = { createdAt: -1 }; // default: newest
        if (sort === 'popular') {
            sortObj = { 'enrolledStudent': -1, createdAt: -1 };
        } else if (sort === 'price-asc') {
            sortObj = { coursePrice: 1 };
        } else if (sort === 'price-desc') {
            sortObj = { coursePrice: -1 };
        } else if (sort === 'newest') {
            sortObj = { createdAt: -1 };
        }

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        const [courses, totalCourses] = await Promise.all([
            Course.find(filter)
                .sort(sortObj)
                .skip(skip)
                .limit(limitNum)
                .populate({ path: 'educator', select: 'name imageUrl' }),
            Course.countDocuments(filter),
        ]);

        // Post-query rating filter (since ratings are embedded)
        let filtered = courses;
        if (rating) {
            const minRating = parseFloat(rating);
            filtered = courses.filter(c => {
                if (!c.courseRatings || c.courseRatings.length === 0) return false;
                const avg = c.courseRatings.reduce((s, r) => s + r.rating, 0) / c.courseRatings.length;
                return avg >= minRating;
            });
        }

        res.json({
            success: true,
            courses: filtered,
            totalCourses: rating ? filtered.length : totalCourses,
            totalPages: Math.ceil(totalCourses / limitNum),
            currentPage: pageNum,
        });
    } catch (error) {
        console.error('Error in getAllCourses:', error);
        res.json({ success: false, message: error.message });
    }
};

// Get all categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ group: 1, order: 1 });
        res.json({ success: true, categories });
    } catch (error) {
        console.error('Error in getCategories:', error);
        res.json({ success: false, message: error.message });
    }
};

// Get Course by Id 

export const getCourseId = async (req, res) => {
    const { id } = req.params

    try {
        const courseData = await Course.findById(id).populate({ path: 'educator' })

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
        res.json({ success: false, message: error.message })
    }
}

// Get enrolled course detail — returns ALL lecture URLs (post-purchase)
export const getEnrolledCourseDetail = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(userId);

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
