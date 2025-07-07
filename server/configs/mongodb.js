import mongoose from "mongoose";
import { ExportEventTypeOut } from "svix";

// Connect to MongoDB Database

const connectDB = async () => {
    mongoose.connnection.on('connected', () => 
        console.log('MongoDB Database Connected'));   

    await mongoose.connect(`${process.env.MONGODB_URI}/vidyatrack`)
}

export default connectDB
