import Course from "../models/Course.js"
import User from "../models/User.js"
import Purchase from "../models/Purchase.js"
import stripe from "../configs/stripe.js"

//get user data
export const getUserData = async(req,res) => {
    try {
        const userId = req.auth?.userId || req.auth?.()?.userId
        let user = await User.findById(userId)
        
        if(!user){
            // Create user if they don't exist (for demo purposes)
            try {
                const clerkUser = req.user;
                user = new User({
                    _id: userId,
                    name: clerkUser.firstName + ' ' + clerkUser.lastName,
                    email: clerkUser.emailAddresses[0]?.emailAddress || 'demo@example.com',
                    imageUrl: clerkUser.imageUrl || 'https://via.placeholder.com/150',
                    enrolledCourses: []
                });
                await user.save();
                console.log('Created new user:', userId);
            } catch (createError) {
                console.error('Error creating user:', createError);
                return res.status(500).json({success: false, message: 'Failed to create user'})
            }
        }
        
        return res.json({success: true, user}) 
  
    } catch (error) {
        console.error('Error getting user data:', error)
        return res.status(500).json({success: false, message: error.message})
    }
}

// user enrolled courses with lecture link 

export const userEnrolledCourses = async (req,res)=>{
    try {
        const userId = req.auth?.userId || req.auth?.()?.userId
        const user = await User.findById(userId).populate('enrolledCourses')

        if(!user){
            return res.status(404).json({success: false, message: 'User not found'})
        }

        res.json({success: true, enrolledCourses: user.enrolledCourses || []})
    } catch (error) {
        console.error('Error getting enrolled courses:', error)
        res.status(500).json({success: false, message: error.message})
    }
}

// Create Stripe checkout session for course purchase
export const createPaymentIntent = async (req, res) => {
    try {
        const { courseId } = req.body
        const userId = req.auth?.userId || req.auth?.()?.userId

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

        const discountedPrice = (course.coursePrice - (course.discount * course.coursePrice) / 100) * 100; // Convert to cents

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: course.courseTitle,
                            description: course.courseDescription?.slice(0, 100) + '...',
                            images: [course.courseThumbnail],
                        },
                        unit_amount: Math.round(discountedPrice),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CORS_ORIGIN || 'http://localhost:5174'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CORS_ORIGIN || 'http://localhost:5174'}/course/${courseId}`,
            metadata: {
                courseId: courseId,
                userId: userId
            }
        })

        // Create purchase record
        const purchase = new Purchase({
            courseId: courseId,
            userId: userId,
            amount: discountedPrice / 100,
            status: 'pending'
        })
        await purchase.save()

        res.json({
            success: true,
            sessionId: session.id
        })

    } catch (error) {
        console.error('Checkout session creation error:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Confirm payment and enroll user
export const confirmPayment = async (req, res) => {
    try {
        const { sessionId } = req.body
        const userId = req.auth?.userId || req.auth?.()?.userId

        if (!sessionId) {
            return res.status(400).json({ success: false, message: "sessionId is required" })
        }

        // Retrieve checkout session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if (session.payment_status === 'paid') {
            const courseId = session.metadata.courseId

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
            case 'checkout.session.completed':
                const session = event.data.object
                const courseId = session.metadata.courseId
                const userId = session.metadata.userId

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

            case 'checkout.session.expired':
                const expiredSession = event.data.object
                const expiredCourseId = expiredSession.metadata.courseId
                const expiredUserId = expiredSession.metadata.userId

                // Update purchase status to failed
                await Purchase.findOneAndUpdate(
                    { courseId: expiredCourseId, userId: expiredUserId },
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
        const userId = req.auth?.userId || req.auth?.()?.userId
        const { courseId } = req.body

        if (!courseId) {
            return res.status(400).json({ success: false, message: "courseId is required" })
        }

        // Check if course is free
        const courseData = await Course.findById(courseId)
        if (!courseData) {
            return res.status(404).json({ success: false, message: "Course not found" })
        }

        // For free courses, allow enrollment without authentication
        if (courseData.coursePrice === 0 || courseData.isFree) {
            // Use a demo user ID for free course enrollment
            const demoUserId = userId || 'demo-user-free-course'
            
            // get user data
            let userData = await User.findById(demoUserId)
            if (!userData) {
                // Create demo user for free course enrollment
                userData = new User({
                    _id: demoUserId,
                    name: 'Demo User',
                    email: 'demo@example.com',
                    imageUrl: 'https://via.placeholder.com/150',
                    enrolledCourses: []
                });
                await userData.save();
                console.log('Created demo user for free course enrollment:', demoUserId);
            }

            // Check if already enrolled
            if (userData.enrolledCourses && userData.enrolledCourses.includes(courseId)) {
                return res.status(400).json({ success: false, message: "Already enrolled in this course" })
            }

            // Enroll in free course
            userData.enrolledCourses = userData.enrolledCourses || []
            userData.enrolledCourses.push(courseId)
            await userData.save()

            return res.json({ 
                success: true, 
                message: "Successfully enrolled in free course!",
                courseId: courseId,
                userId: demoUserId
            })
        }

        // For paid courses, require authentication
        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required for paid courses" })
        }

        // get user data
        let userData = await User.findById(userId)
        if (!userData) {
            // Create user if they don't exist (for demo purposes)
            try {
                const clerkUser = req.user;
                userData = new User({
                    _id: userId,
                    name: clerkUser.firstName + ' ' + clerkUser.lastName,
                    email: clerkUser.emailAddresses[0]?.emailAddress || 'demo@example.com',
                    imageUrl: clerkUser.imageUrl || 'https://via.placeholder.com/150',
                    enrolledCourses: []
                });
                await userData.save();
                console.log('Created new user during enrollment:', userId);
            } catch (createError) {
                console.error('Error creating user during enrollment:', createError);
                return res.status(500).json({ success: false, message: "Failed to create user" })
            }
        }

        // Course data already fetched above for free course check

        // Check if already enrolled
        if (userData.enrolledCourses && userData.enrolledCourses.includes(courseId)) {
            return res.status(400).json({ success: false, message: "Already enrolled in this course" })
        }

        // For demo purposes, allow direct enrollment without payment
        userData.enrolledCourses = userData.enrolledCourses || []
        userData.enrolledCourses.push(courseId)
        await userData.save()

        return res.json({ 
            success: true, 
            message: "Course enrolled successfully", 
            enrolledCourses: userData.enrolledCourses, 
            userData, 
            courseData
        })
    } catch (error) {
        console.error('Enrollment error:', error)
        return res.status(500).json({ success: false, message: error.message })
    }
}