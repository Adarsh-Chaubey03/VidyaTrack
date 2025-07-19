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

// connecting to database

await connectDB()
await connectCloudinary()

//middleware
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}))
app.use(clerkMiddleware())

// Stripe webhook route (needs raw body)
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook)

// JSON parser for all other routes
app.use(express.json());

//routes
app.get('/', (req, res) => { res.send("API Working") })
app.post('/clerk', express.json(), clerkWebhooks)
app.use('/api/educator', educatorRouter)
app.use('/api/course', courseRouter)
app.use('/api/progress', courseProgressRouter)
app.use('/api/user', userRouter)

//server port
const PORT = process.env.PORT || 5000

// listening
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})