import CourseProgress from "../models/CourseProgress.js";
import Course from "../models/Course.js";

export const getCourseProgress = async (req, res) => {
    try {
        const { userId, courseId } = req.params;

        let progress = await CourseProgress.findOne({ userId, courseId })
            .populate('courseId', 'courseTitle courseThumbnail');

        if (!progress) {
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }

            let totalLectures = 0;
            course.courseContent.forEach(chapter => {
                totalLectures += chapter.chapterContent.length;
            });

            const chapterProgress = course.courseContent.map(chapter => ({
                chapterId: chapter.chapterId,
                completedLectures: chapter.chapterContent.map(lecture => ({
                    lectureId: lecture.lectureId,
                    isCompleted: false
                }))
            }));

            progress = new CourseProgress({
                userId,
                courseId,
                totalLectures,
                chapterProgress
            });

            await progress.save();
        }

        res.json({ success: true, progress });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateLectureProgress = async (req, res) => {
    try {
        const { userId, courseId, chapterId, lectureId } = req.params;
        const { isCompleted, watchTime } = req.body;

        const progress = await CourseProgress.findOne({ userId, courseId });
        if (!progress) {
            return res.status(404).json({ success: false, message: 'Progress record not found' });
        }

        const chapterIndex = progress.chapterProgress.findIndex(ch => ch.chapterId === chapterId);
        if (chapterIndex === -1) {
            return res.status(404).json({ success: false, message: 'Chapter not found' });
        }

        const lectureIndex = progress.chapterProgress[chapterIndex].completedLectures.findIndex(
            lec => lec.lectureId === lectureId
        );
        if (lectureIndex === -1) {
            return res.status(404).json({ success: false, message: 'Lecture not found' });
        }

        const lecture = progress.chapterProgress[chapterIndex].completedLectures[lectureIndex];
        const wasCompleted = lecture.isCompleted;
        
        lecture.isCompleted = isCompleted;
        lecture.lastWatchedAt = new Date();
        
        if (watchTime !== undefined) {
            lecture.watchTime = watchTime;
        }

        if (isCompleted && !wasCompleted) {
            lecture.completedAt = new Date();
            progress.completedLectures += 1;
        } else if (!isCompleted && wasCompleted) {
            lecture.completedAt = undefined;
            progress.completedLectures -= 1;
        }

        const chapter = progress.chapterProgress[chapterIndex];
        const allLecturesCompleted = chapter.completedLectures.every(lec => lec.isCompleted);
        chapter.isCompleted = allLecturesCompleted;
        if (allLecturesCompleted) {
            chapter.completedAt = new Date();
        } else {
            chapter.completedAt = undefined;
        }

        progress.lastAccessedAt = new Date();
        await progress.save();

        res.json({ success: true, progress });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateWatchTime = async (req, res) => {
    try {
        const { userId, courseId, chapterId, lectureId } = req.params;
        const { watchTime, totalWatchTime } = req.body;

        const progress = await CourseProgress.findOne({ userId, courseId });
        if (!progress) {
            return res.status(404).json({ success: false, message: 'Progress record not found' });
        }

        const chapterIndex = progress.chapterProgress.findIndex(ch => ch.chapterId === chapterId);
        if (chapterIndex !== -1) {
            const lectureIndex = progress.chapterProgress[chapterIndex].completedLectures.findIndex(
                lec => lec.lectureId === lectureId
            );
            if (lectureIndex !== -1) {
                progress.chapterProgress[chapterIndex].completedLectures[lectureIndex].watchTime = watchTime;
                progress.chapterProgress[chapterIndex].completedLectures[lectureIndex].lastWatchedAt = new Date();
            }
        }

        if (totalWatchTime !== undefined) {
            progress.totalWatchTime = totalWatchTime;
        }

        progress.lastAccessedAt = new Date();
        await progress.save();

        res.json({ success: true, progress });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserProgress = async (req, res) => {
    try {
        const { userId } = req.params;

        const progress = await CourseProgress.find({ userId })
            .populate('courseId', 'courseTitle courseThumbnail courseDescription')
            .sort({ lastAccessedAt: -1 });

        res.json({ success: true, progress });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const resetCourseProgress = async (req, res) => {
    try {
        const { userId, courseId } = req.params;

        const progress = await CourseProgress.findOne({ userId, courseId });
        if (!progress) {
            return res.status(404).json({ success: false, message: 'Progress record not found' });
        }

        progress.chapterProgress.forEach(chapter => {
            chapter.isCompleted = false;
            chapter.completedAt = undefined;
            chapter.completedLectures.forEach(lecture => {
                lecture.isCompleted = false;
                lecture.completedAt = undefined;
                lecture.watchTime = 0;
            });
        });

        progress.completedLectures = 0;
        progress.progressPercentage = 0;
        progress.isCompleted = false;
        progress.completedAt = undefined;
        progress.totalWatchTime = 0;

        await progress.save();

        res.json({ success: true, progress });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCourseAnalytics = async (req, res) => {
    try {
        const { courseId } = req.params;

        const progress = await CourseProgress.find({ courseId })
            .populate('userId', 'name email imageUrl');

        const analytics = {
            totalEnrollments: progress.length,
            completedCourses: progress.filter(p => p.isCompleted).length,
            averageProgress: progress.length > 0 
                ? Math.round(progress.reduce((sum, p) => sum + p.progressPercentage, 0) / progress.length)
                : 0,
            averageWatchTime: progress.length > 0
                ? Math.round(progress.reduce((sum, p) => sum + p.totalWatchTime, 0) / progress.length)
                : 0,
            recentActivity: progress
                .sort((a, b) => new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt))
                .slice(0, 10)
        };

        res.json({ success: true, analytics });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}; 