import express from 'express'
import { 
    getUserData, 
    updateUserProfile,
    userEnrolledCourses, 
    purchaseCourse 
} from '../controllers/userController.js'
import { protect, protectStudent } from '../middlewares/authMiddleware.js'

const userRouter = express.Router()

userRouter.get('/data',             protect,                        getUserData)
userRouter.put('/update',           protect,                        updateUserProfile)
userRouter.get('/enrolled-courses', protect, protectStudent,        userEnrolledCourses)

// Legacy route (keeping for backward compatibility)
userRouter.post('/purchase-course', protect, protectStudent,        purchaseCourse)

// Free course enrollment route (no authentication required)
userRouter.post('/enroll-free-course',                              purchaseCourse)

export default userRouter
