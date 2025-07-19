import express from 'express';
import { 
    getCourseProgress, 
    updateLectureProgress, 
    updateWatchTime, 
    getUserProgress, 
    resetCourseProgress, 
    getCourseAnalytics 
} from '../controllers/courseProgressController.js';
import { protect } from '../middlewares/authMiddleware.js';

const courseProgressRouter = express.Router();

// Apply authentication middleware to all routes
courseProgressRouter.use(protect);

// Get course progress for a specific user and course
courseProgressRouter.get('/:userId/:courseId', getCourseProgress);

// Update lecture progress (mark as completed/incomplete)
courseProgressRouter.put('/:userId/:courseId/:chapterId/:lectureId', updateLectureProgress);

// Update watch time for a lecture
courseProgressRouter.patch('/:userId/:courseId/:chapterId/:lectureId/watchtime', updateWatchTime);

// Get all progress for a user
courseProgressRouter.get('/user/:userId', getUserProgress);

// Reset course progress
courseProgressRouter.delete('/:userId/:courseId', resetCourseProgress);

// Get course analytics (for educators)
courseProgressRouter.get('/analytics/:courseId', getCourseAnalytics);

export default courseProgressRouter; 