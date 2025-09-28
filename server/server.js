import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './configs/mongodb.js';
import educatorRouter from './routes/educatorRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoutes.js';
import courseProgressRouter from './routes/courseProgressRoutes.js';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
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
  origin: [
    'http://localhost:5174',
    'http://localhost:5175', 
    'http://localhost:5176',
    'http://localhost:5177',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true
}))

// Authentication middleware will be applied per route as needed
console.log('✅ Custom authentication system configured');

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

// Test authentication endpoint (no middleware)
app.get('/api/auth-test', (req, res) => {
    res.json({
        message: "Auth test endpoint",
        timestamp: new Date().toISOString(),
        cookies: req.headers.cookie ? "Cookies present" : "No cookies",
        authorization: req.headers.authorization ? "Authorization header present" : "No authorization header",
        userAgent: req.headers['user-agent']
    })
})

// Auth routes
app.use('/api/auth', authRouter)

// Test endpoint to manually verify JWT token
app.get('/api/test-token', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.json({
                success: false,
                message: 'No Bearer token provided',
                authHeader: authHeader ? 'Present but not Bearer' : 'Not present'
            });
        }

        const token = authHeader.substring(7);
        res.json({
            success: true,
            message: 'Token received',
            tokenLength: token.length,
            tokenStart: token.substring(0, 10) + '...'
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Error processing token',
            error: error.message
        });
    }
});

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