import mongoose from "mongoose";

// Connect to MongoDB Database
const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error('MONGODB_URI is not set in environment variables');
    }

    mongoose.connection.on('connected', () =>
        console.log('✅ MongoDB Database Connected'));

    mongoose.connection.on('error', (err) =>
        console.error('❌ MongoDB connection error:', err));

    mongoose.connection.on('disconnected', () =>
        console.warn('⚠️  MongoDB disconnected'));

    await mongoose.connect(mongoUri, {
        // Mongoose 8.x uses the Node.js driver v5+ which manages its own
        // connection pool. These options control that pool.
        //
        // maxPoolSize: maximum simultaneous open connections.
        //   Default is 5. Increase for high-concurrency workloads.
        //   Under a load test with 50–100 VUs, each needing a DB connection,
        //   5 connections creates a queue. 20 is a reasonable starting point
        //   for a medium-traffic app; tune up if you see query wait times.
        maxPoolSize: 20,
        //
        // minPoolSize: connections kept alive during idle periods.
        //   Avoids the overhead of establishing connections on demand.
        minPoolSize: 2,
        //
        // serverSelectionTimeoutMS: how long the driver waits to find a
        //   suitable server before throwing. 10s is the Mongoose default;
        //   we keep it explicit so it is visible and tunable.
        serverSelectionTimeoutMS: 10000,
        //
        // socketTimeoutMS: how long a socket can be idle before being closed.
        //   30s is a good default for interactive web traffic.
        socketTimeoutMS: 30000,
    });
};

export default connectDB;
