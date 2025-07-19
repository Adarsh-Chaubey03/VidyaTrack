import express from 'express'
import { 
    getUserData, 
    userEnrolledCourses, 
    createPaymentIntent, 
    confirmPayment,
    purchaseCourse 
} from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get('/data', getUserData)
userRouter.get('/enrolled-courses', userEnrolledCourses)

// Stripe payment routes
userRouter.post('/create-payment-intent', createPaymentIntent)
userRouter.post('/confirm-payment', confirmPayment)

// Legacy route (keeping for backward compatibility)
userRouter.post('/purchase-course', purchaseCourse)

export default userRouter