import express from 'express'
import { addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentData, getMentees, updateRoleToEducator } from '../controllers/educatorController.js'
import upload from '../configs/multer.js'
import { protect, protectEducator } from '../middlewares/authMiddleware.js'

const educatorRouter = express.Router()

// ADD EDUCATOR ROLE
educatorRouter.get('/update-role', protect, updateRoleToEducator)
educatorRouter.post('/add-course',upload.single('thumbnail'),protect,protectEducator,addCourse)
educatorRouter.get('/courses',protect,protectEducator,getEducatorCourses)
educatorRouter.get('/dashboard',protect,protectEducator,educatorDashboardData)
educatorRouter.get('/enrolledStudent',protect,protectEducator,getEnrolledStudentData)
educatorRouter.get('/mentees',protect,protectEducator,getMentees)

export default educatorRouter;


