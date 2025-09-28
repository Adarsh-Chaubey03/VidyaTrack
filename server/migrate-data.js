// Migration script to convert string IDs to ObjectIds
import mongoose from 'mongoose';
import connectDB from './configs/mongodb.js';
import Course from './models/Course.js';
import CourseProgress from './models/CourseProgress.js';
import Purchase from './models/Purchase.js';
import User from './models/User.js';

const migrateData = async () => {
    try {
        console.log('🔄 Starting data migration...');
        
        // Connect to database
        await connectDB();
        
        // First, let's check what data we have
        const courses = await Course.find({});
        console.log(`📚 Found ${courses.length} courses`);
        
        const courseProgresses = await CourseProgress.find({});
        console.log(`📊 Found ${courseProgresses.length} course progress records`);
        
        const purchases = await Purchase.find({});
        console.log(`💳 Found ${purchases.length} purchase records`);
        
        // Check for string IDs that need conversion
        const coursesWithStringEducators = courses.filter(course => 
            typeof course.educator === 'string' && course.educator.length !== 24
        );
        
        console.log(`⚠️  Found ${coursesWithStringEducators.length} courses with string educator IDs`);
        
        if (coursesWithStringEducators.length > 0) {
            console.log('🔧 Converting string educator IDs to ObjectIds...');
            
            for (const course of coursesWithStringEducators) {
                // Create a new ObjectId for the educator
                const newEducatorId = new mongoose.Types.ObjectId();
                
                // Update the course
                await Course.findByIdAndUpdate(course._id, {
                    educator: newEducatorId
                });
                
                console.log(`✅ Updated course ${course.courseTitle} with new educator ID`);
            }
        }
        
        // Check course progress records
        const progressWithStringUsers = courseProgresses.filter(progress => 
            typeof progress.userId === 'string' && progress.userId.length !== 24
        );
        
        console.log(`⚠️  Found ${progressWithStringUsers.length} progress records with string user IDs`);
        
        if (progressWithStringUsers.length > 0) {
            console.log('🔧 Converting string user IDs in progress records...');
            
            for (const progress of progressWithStringUsers) {
                // Create a new ObjectId for the user
                const newUserId = new mongoose.Types.ObjectId();
                
                // Update the progress record
                await CourseProgress.findByIdAndUpdate(progress._id, {
                    userId: newUserId
                });
                
                console.log(`✅ Updated progress record for course ${progress.courseId}`);
            }
        }
        
        // Check purchase records
        const purchasesWithStringUsers = purchases.filter(purchase => 
            typeof purchase.userId === 'string' && purchase.userId.length !== 24
        );
        
        console.log(`⚠️  Found ${purchasesWithStringUsers.length} purchase records with string user IDs`);
        
        if (purchasesWithStringUsers.length > 0) {
            console.log('🔧 Converting string user IDs in purchase records...');
            
            for (const purchase of purchasesWithStringUsers) {
                // Create a new ObjectId for the user
                const newUserId = new mongoose.Types.ObjectId();
                
                // Update the purchase record
                await Purchase.findByIdAndUpdate(purchase._id, {
                    userId: newUserId
                });
                
                console.log(`✅ Updated purchase record for course ${purchase.courseId}`);
            }
        }
        
        console.log('✅ Data migration completed successfully!');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        process.exit(0);
    }
};

// Run migration
migrateData();

