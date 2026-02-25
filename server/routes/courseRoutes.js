import express from 'express'
import { getAllCourses, getCourseId, getEnrolledCourseDetail, getCategories } from '../controllers/courseController.js'
import { protect } from '../middlewares/authMiddleware.js'

const courseRouter = express.Router()

courseRouter.get('/all', getAllCourses)
courseRouter.get('/categories', getCategories)
courseRouter.get('/enrolled/:id', protect, getEnrolledCourseDetail)
courseRouter.get('/:id', getCourseId)

export default courseRouter;