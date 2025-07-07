import express from 'express';   
import cors from 'cors';
import 'dotenv/config'
import connectDB from './configs/mongodb.js';

//initialize express app
const app = express()

// connecting to database

await connectDB()

//middleware
app.use(cors())

//routes
app.get('/',(req, res)=>{
    res.send("API Working")
})

//server port
const PORT = process.env.PORT || 5000

// listening
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})