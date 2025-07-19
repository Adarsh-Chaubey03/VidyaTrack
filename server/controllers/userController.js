import Course from "../models/Course"
import User from "../models/User"
import Purchase from "../models/Purchase.js"
import stripe from "../configs/stripe.js"

//get user data
export const getUserData = async(req,res) => {
    try {
        const userId = req.auth.userId
        const user = await User.findById(userId)
        if(!user){
            return res.json({sucess:false, message: 'User not found'})
        }
            return res.json({success: true, user}) 
  
    } catch (error) {
        
    }
}

// user enrolled courses with lecture link 

export const userEnrolledCourses = async (req,res)=>{
    try {
        const userId = req.auth.userId
        const user = await User.findById(userId).populate('enrolledCourses')

        res.json({success:true, enrolledCourses:getUserData.enrolledCourses})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

// Create payment intent for course purchase
export const createPaymentIntent = async (req, res) => {
    try {
        const { courseId } = req.body
        const userId = req.auth.userId

        if (!courseId) {
            return res.status(400).json({ success: false, message: "courseId is required" })
        }

        // Get course data
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" })
        }

        // Check if already enrolled
        const user = await User.findById(userId)
        if (user.enrolledCourses && user.enrolledCourses.includes(courseId)) {
            return res.status(400).json({ success: false, message: "Already enrolled in this course" })
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: course.price * 100, // Convert to cents
            currency: 'usd',
            metadata: {
                courseId: courseId,
                userId: userId
            }
        })

        // Create purchase record
        const purchase = new Purchase({
            courseId: courseId,
            userId: userId,
            amount: course.price,
            status: 'pending'
        })
        await purchase.save()

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        })

    } catch (error) {
        console.error('Payment intent creation error:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Confirm payment and enroll user
export const confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId } = req.body
        const userId = req.auth.userId

        if (!paymentIntentId) {
            return res.status(400).json({ success: false, message: "paymentIntentId is required" })
        }

        // Retrieve payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

        if (paymentIntent.status === 'succeeded') {
            const courseId = paymentIntent.metadata.courseId

            // Update purchase status
            await Purchase.findOneAndUpdate(
                { courseId: courseId, userId: userId },
                { status: 'completed' }
            )

            // Enroll user in course
            const user = await User.findById(userId)
            user.enrolledCourses = user.enrolledCourses || []
            user.enrolledCourses.push(courseId)
            await user.save()

            res.json({
                success: true,
                message: "Payment confirmed and course enrolled successfully"
            })
        } else {
            res.status(400).json({
                success: false,
                message: "Payment not completed"
            })
        }

    } catch (error) {
        console.error('Payment confirmation error:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Stripe webhook handler
export const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature']
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

    let event

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message)
        return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    try {
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object
                const courseId = paymentIntent.metadata.courseId
                const userId = paymentIntent.metadata.userId

                // Update purchase status
                await Purchase.findOneAndUpdate(
                    { courseId: courseId, userId: userId },
                    { status: 'completed' }
                )

                // Enroll user in course
                const user = await User.findById(userId)
                if (user && !user.enrolledCourses.includes(courseId)) {
                    user.enrolledCourses = user.enrolledCourses || []
                    user.enrolledCourses.push(courseId)
                    await user.save()
                }
                break

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object
                const failedCourseId = failedPayment.metadata.courseId
                const failedUserId = failedPayment.metadata.userId

                // Update purchase status to failed
                await Purchase.findOneAndUpdate(
                    { courseId: failedCourseId, userId: failedUserId },
                    { status: 'failed' }
                )
                break

            default:
                console.log(`Unhandled event type ${event.type}`)
        }

        res.json({ received: true })
    } catch (error) {
        console.error('Webhook processing error:', error)
        res.status(500).json({ error: 'Webhook processing failed' })
    }
}

// purchase course (legacy function - keeping for backward compatibility)
export const purchaseCourse = async (req, res) => {
    try {
        const origin = req.headers.origin
        const userId = req.auth.userId
        const { courseId } = req.body

        if (!courseId) {
            return res.status(400).json({ success: false, message: "courseId is required", origin })
        }

        // get user data
        const userData = await User.findById(userId)
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found", origin })
        }

        // get course data
        // Assuming you have a Course model
      
        const courseData = await Course.findById(courseId)
        if (!courseData) {
            return res.status(404).json({ success: false, message: "Course not found", origin })
        }

        // Check if already enrolled
        if (userData.enrolledCourses && userData.enrolledCourses.includes(courseId)) {
            return res.status(400).json({ success: false, message: "Already enrolled in this course", origin })
        }

        userData.enrolledCourses = userData.enrolledCourses || []
        userData.enrolledCourses.push(courseId)
        await userData.save()

        return res.json({ 
            success: true, 
            message: "Course purchased successfully", 
            enrolledCourses: userData.enrolledCourses, 
            userData, 
            courseData, 
            origin 
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message, origin: req.headers.origin })
    }
}