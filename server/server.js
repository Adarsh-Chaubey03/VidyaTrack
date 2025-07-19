import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webhook.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoutes.js';
import courseProgressRouter from './routes/courseProgressRoutes.js';
import userRouter from './routes/userRoutes.js';
import { stripeWebhook } from './controllers/userController.js';

//initialize express app
const app = express()

console.log('🚀 Starting VidyaTrack Server...');

// connecting to database
try {
    await connectDB()
} catch (error) {
    console.log('⚠️  Database connection failed, but server will continue...');
}

// connecting to cloudinary
try {
    await connectCloudinary()
} catch (error) {
    console.log('⚠️  Cloudinary connection failed, but server will continue...');
}

//middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5174',
  credentials: true
}))

// Clerk middleware (only if CLERK_SECRET_KEY is available)
if (process.env.CLERK_SECRET_KEY) {
    app.use(clerkMiddleware())
    console.log('✅ Clerk authentication configured');
} else {
    console.warn('⚠️  CLERK_SECRET_KEY not found. Authentication will be disabled.');
}

// Stripe webhook route (needs raw body)
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook)

// JSON parser for all other routes
app.use(express.json());

//routes
app.get('/', (req, res) => { 
    res.json({ 
        message: "VidyaTrack API Working", 
        status: "success",
        timestamp: new Date().toISOString()
    }) 
})

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
    res.json({
        message: "API is working",
        timestamp: new Date().toISOString(),
        auth: req.auth ? "Auth available" : "No auth",
        headers: req.headers,
        url: req.url
    })
})

// Test endpoint to check courses in database
app.get('/api/debug/courses', async (req, res) => {
    try {
        const Course = (await import('./models/Course.js')).default;
        const allCourses = await Course.find({});
        const publishedCourses = await Course.find({ isPublished: true });
        
        res.json({
            message: "Courses debug info",
            totalCourses: allCourses.length,
            publishedCourses: publishedCourses.length,
            allCourses: allCourses,
            publishedCoursesList: publishedCourses
        });
    } catch (error) {
        res.json({
            message: "Error checking courses",
            error: error.message
        });
    }
})

app.post('/clerk', express.json(), clerkWebhooks)
app.use('/api/educator', educatorRouter)
app.use('/api/course', courseRouter)
app.use('/api/progress', courseProgressRouter)
app.use('/api/user', userRouter)

//server port
const PORT = process.env.PORT || 5000

// listening
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`)
    console.log(`🌐 API Base URL: http://localhost:${PORT}`)
    console.log(`📚 Course Progress API: http://localhost:${PORT}/api/progress`)
    console.log(`📖 Courses API: http://localhost:${PORT}/api/course`)
})