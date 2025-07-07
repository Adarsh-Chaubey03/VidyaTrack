import mongoose from "mongoose";
import { ExportEventTypeOut } from "svix";

// Connect to MongoDB Database
const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => 
            console.log('MongoDB Database Connected'));
        await mongoose.connect(process.env.MONGODB_URI); 
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

export default connectDB;