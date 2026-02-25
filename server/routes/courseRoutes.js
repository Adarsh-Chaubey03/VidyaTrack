import express from 'express'
import { getAllCourses, getCourseId, getEnrolledCourseDetail } from '../controllers/courseController.js'
import { protect } from '../middlewares/authMiddleware.js'

const courseRouter = express.Router()

courseRouter.get('/all', getAllCourses)
courseRouter.get('/enrolled/:id', protect, getEnrolledCourseDetail)
courseRouter.get('/:id', getCourseId)

export default courseRouter;