import express from 'express'
import { 
    getUserData, 
    userEnrolledCourses, 
    purchaseCourse 
} from '../controllers/userController.js'
import { protect } from '../middlewares/authMiddleware.js'

const userRouter = express.Router()

userRouter.get('/data', protect, getUserData)
userRouter.get('/enrolled-courses', protect, userEnrolledCourses)

// Legacy route (keeping for backward compatibility)
userRouter.post('/purchase-course', protect, purchaseCourse)

// Free course enrollment route (no authentication required)
userRouter.post('/enroll-free-course', purchaseCourse)

export default userRouter