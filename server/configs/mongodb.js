import mongoose from "mongoose";

// Connect to MongoDB Database
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        
        if (!mongoUri) {
            console.warn('⚠️  MONGODB_URI not found in environment variables. Database connection will fail.');
            return;
        }

        mongoose.connection.on('connected', () => 
            console.log('✅ MongoDB Database Connected'));
        
        mongoose.connection.on('error', (err) => 
            console.error('❌ MongoDB connection error:', err));
        
        await mongoose.connect(mongoUri); 
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        console.log('💡 Make sure to set MONGODB_URI in your environment variables');
    }
}

export default connectDB;