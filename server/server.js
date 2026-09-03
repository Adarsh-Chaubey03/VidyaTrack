import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './configs/mongodb.js';
import educatorRouter from './routes/educatorRoutes.js';
import educatorAccessRouter from './routes/educatorAccessRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoutes.js';
import courseProgressRouter from './routes/courseProgressRoutes.js';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';
import { razorpayWebhook } from './controllers/paymentController.js';
import blogRouter from './routes/blogRoutes.js';
import feedbackRouter from './routes/feedbackRoutes.js';
import mentorRouter from './routes/mentorRoutes.js';
import mentorWorkspaceRouter from './routes/mentorWorkspaceRoutes.js';
import resumeReviewRouter from './routes/resumeReviewRoutes.js';
import aiRouter from './routes/aiRoutes.js';

// ── Initialize express app ─────────────────────────────────────────────────
const app = express();

console.log('🚀 Starting VidyaTrack Server...');

// ── Connection management ──────────────────────────────────────────────────
//
// Strategy: use a single Promise as a mutex so that concurrent requests during
// cold-start (common in serverless) only trigger one connectDB() call.
// Once resolved, all subsequent awaits return immediately.
//
// Previously, a boolean `dbConnected` flag was used, which had a race condition:
// multiple simultaneous cold-start requests could all read false, then all call
// connectDB() concurrently before any of them set the flag to true.
//
// The Promise-based approach eliminates the race: the second caller awaits the
// same Promise that the first caller is already resolving.

let _initPromise = null;

async function ensureConnections() {
    if (_initPromise) return _initPromise;

    _initPromise = (async () => {
        try {
            await connectDB();
        } catch (error) {
            // Log but do not suppress — let callers decide how to handle
            console.error('⚠️  Database connection failed:', error.message);
            // Reset so the next request can retry (useful in serverless)
            _initPromise = null;
            throw error;
        }
        try {
            await connectCloudinary();
        } catch (error) {
            // Cloudinary is non-critical — log and continue
            console.warn('⚠️  Cloudinary configuration failed:', error.message);
        }
    })();

    return _initPromise;
}

// For local (non-Vercel) environments: connect eagerly at startup so the first
// real request does not pay the connection overhead.
// For Vercel serverless: connect lazily per-request (cold-start model).
if (process.env.VERCEL !== '1') {
    ensureConnections().catch((err) => {
        console.error('❌ Startup connection failed:', err.message);
        // Exit the process so the process manager (nodemon/PM2) restarts it.
        // This prevents a zombie server that silently fails all DB queries.
        process.exit(1);
    });
}

// Per-request guard — ensures Vercel cold starts connect before handling requests.
// In local mode this is a no-op after the first successful connect.
app.use(async (req, res, next) => {
    try {
        await ensureConnections();
        next();
    } catch (err) {
        // DB is unavailable — return 503 instead of letting requests hang or crash
        res.status(503).json({ success: false, message: 'Service temporarily unavailable. Please try again.' });
    }
});

// ── CORS ───────────────────────────────────────────────────────────────────
app.use(cors({
    origin: [
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:5176',
        'http://localhost:5177',
        'http://localhost:3000',
        'http://localhost:5173',
        'https://vidya-track-xi.vercel.app',
        'https://vidya-track-n45f.vercel.app',
        'https://vidya-track-nd5f.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Explicitly handle OPTIONS preflight for all routes (fixes Vercel redirect issue)
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

console.log('✅ Custom authentication system configured');

// ── Razorpay webhook (needs raw body for HMAC signature verification) ──────
app.post('/api/payments/webhook/razorpay', express.raw({ type: 'application/json' }), (req, res, next) => {
    req.rawBody = req.body;
    try {
        req.body = JSON.parse(req.body.toString('utf8'));
    } catch (e) {
        return res.status(400).send('Invalid JSON');
    }
    next();
}, razorpayWebhook);

// ── JSON body parser for all other routes ─────────────────────────────────
app.use(express.json());

// ── Health check ──────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({
        message: 'VidyaTrack API Working',
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

// ── Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',            authRouter);
app.use('/api/educator',        educatorRouter);
app.use('/api/educator-access', educatorAccessRouter);
app.use('/api/course',          courseRouter);
app.use('/api/progress',        courseProgressRouter);
app.use('/api/user',            userRouter);
app.use('/api/payments',        paymentRouter);
app.use('/api/posts',           blogRouter);
app.use('/api/feedback',        feedbackRouter);
app.use('/api/resume-reviews',  resumeReviewRouter);
app.use('/api/ai',              aiRouter);

// ── Mentorship routes ─────────────────────────────────────────────────────
// All mentorship logic lives in mentorRouter.
// Mount it at three prefixes so both the primary API paths and the
// spec-exact URL aliases all work:
//
//  /api/mentors/request                         → sendMentorRequest
//  /api/mentors/teachers                        → getApprovedTeachers
//  /api/mentors/mentors (student)               → getStudentMentors
//  /api/mentors/requests (teacher)              → getTeacherRequests
//  /api/mentors/requests/:id/respond            → respondToRequest
//
//  /api/student/dashboard/mentors               → getStudentMentors  (spec URL)
//  /api/teacher/dashboard/requests              → getTeacherRequests (spec URL)
//  /api/teacher/requests/:id/respond            → respondToRequest   (spec URL)
app.use('/api/mentors',           mentorRouter);
app.use('/api/student/dashboard', mentorRouter);
app.use('/api/teacher/dashboard', mentorRouter);
app.use('/api/teacher',           mentorRouter);
app.use('/api/mentor-workspace',  mentorWorkspaceRouter);

// ── 404 catch-all ─────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler ───────────────────────────────────────────────────
// Catches any unhandled synchronous throws or next(err) calls from routes.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

// ── Start HTTP server (local only) ────────────────────────────────────────
const PORT = process.env.PORT || 5000;

if (process.env.VERCEL !== '1') {
    // In local mode, ensureConnections() was already called above.
    // app.listen is called immediately; the per-request middleware will wait
    // for the connection to resolve on the first request if startup connect
    // hasn't finished yet (very short window on fast machines).
    app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
        console.log(`🌐 API Base URL: http://localhost:${PORT}`);
        console.log(`📚 Course Progress API: http://localhost:${PORT}/api/progress`);
        console.log(`📖 Courses API: http://localhost:${PORT}/api/course`);
    });
}

// Export for Vercel serverless
export default app;
