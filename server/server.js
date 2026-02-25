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
import paymentRouter from './routes/paymentRoutes.js';
import { razorpayWebhook } from './controllers/paymentController.js';

//initialize express app
const app = express()

console.log('🚀 Starting VidyaTrack Server...');

// Lazy init for serverless — connect on first request
let dbConnected = false;
async function ensureConnections() {
    if (dbConnected) return;
    try {
        await connectDB();
    } catch (error) {
        console.log('⚠️  Database connection failed, but server will continue...');
    }
    try {
        await connectCloudinary();
    } catch (error) {
        console.log('⚠️  Cloudinary connection failed, but server will continue...');
    }
    dbConnected = true;
}

// Connect on every request (no-op after first call)
app.use(async (req, res, next) => {
    await ensureConnections();
    next();
});

//middleware
app.use(cors({
    origin: [
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:5176',
        'http://localhost:5177',
        'http://localhost:3000',
        'http://localhost:5173',
        'https://vidya-track-xi.vercel.app',
        'https://vidya-track-n45f.vercel.app'
    ],
    credentials: true
}))

// Authentication middleware will be applied per route as needed
console.log('✅ Custom authentication system configured');

// Razorpay webhook route (needs raw body for signature verification)
app.post('/api/payments/webhook/razorpay', express.raw({ type: 'application/json' }), (req, res, next) => {
    // Preserve raw body for HMAC verification (mirrors khatakhat-backend pattern)
    req.rawBody = req.body;
    // Re-parse as JSON for the controller
    try {
        req.body = JSON.parse(req.body.toString('utf8'));
    } catch (e) {
        return res.status(400).send('Invalid JSON');
    }
    next();
}, razorpayWebhook)

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
app.use('/api/payments', paymentRouter)

//server port
const PORT = process.env.PORT || 5000

// listening
// Only listen when running locally (not in Vercel serverless)
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`)
        console.log(`🌐 API Base URL: http://localhost:${PORT}`)
        console.log(`📚 Course Progress API: http://localhost:${PORT}/api/progress`)
        console.log(`📖 Courses API: http://localhost:${PORT}/api/course`)
    })
}

// Export for Vercel serverless
export default app;