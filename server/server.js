import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webhook.js';

//initialize express app
const app = express()

// connecting to database

await connectDB()

//middleware
app.use(cors())

//routes
app.get('/', (req, res) => { res.send("API Working") })
app.post('/clerk' express.json(), clerkWebhooks)

//server port
const PORT = process.env.PORT || 5000

// listening
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})