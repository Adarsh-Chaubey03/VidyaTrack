/**
 * One-time migration: backfills existing courses with default category/level if missing.
 * Also updates the 3 test-batch courses with correct categories.
 *
 * Usage: node scripts/migrateCategories.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import Course from '../models/Course.js';

// Map known test-batch courses to their categories
const COURSE_CATEGORY_MAP = {
    'AI & Machine Learning – Test Batch': { category: 'machine-learning', level: 'beginner', tags: ['TEST_AI', 'AI', 'machine-learning', 'neural-networks'] },
    'Web Development – Test Batch': { category: 'web-development', level: 'beginner', tags: ['TEST_WEB', 'HTML', 'CSS', 'JavaScript', 'React'] },
    'Programming Fundamentals – Test Batch': { category: 'programming-fundamentals', level: 'beginner', tags: ['TEST_PROGRAMMING', 'C', 'Python', 'Java', 'DSA'] },
    'Data Structures & Algorithms — Complete Course': { category: 'programming-fundamentals', level: 'intermediate', tags: ['DSA', 'arrays', 'trees'] },
    'Physics — Mechanics for IIT JEE & NEET': { category: 'iit-jee', level: 'intermediate', tags: ['Physics', 'mechanics', 'IIT-JEE', 'NEET'] },
    'Web Development — MERN Stack Bootcamp': { category: 'web-development', level: 'beginner', tags: ['MERN', 'React', 'Node.js', 'MongoDB'] },
};

async function migrate() {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
        console.error('❌ MONGODB_URI / MONGO_URI not set in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');
        console.log('─'.repeat(50));

        // 1. Backfill defaults for all courses missing category
        const defaultResult = await Course.updateMany(
            { $or: [{ category: { $exists: false } }, { category: '' }, { category: null }] },
            { $set: { category: 'uncategorized', level: 'beginner', tags: [] } }
        );
        console.log(`📦 Backfilled ${defaultResult.modifiedCount} courses with default category.`);

        // 2. Apply specific categories to known courses
        let mapped = 0;
        for (const [title, fields] of Object.entries(COURSE_CATEGORY_MAP)) {
            const result = await Course.updateOne(
                { courseTitle: title },
                { $set: fields }
            );
            if (result.modifiedCount > 0) {
                console.log(`  ✅ ${title} → ${fields.category}`);
                mapped++;
            } else if (result.matchedCount > 0) {
                console.log(`  ⏭  ${title} (already set)`);
            } else {
                console.log(`  ⚠️  ${title} (not found in DB)`);
            }
        }

        // 3. Mark recent courses as isNew
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const newResult = await Course.updateMany(
            { createdAt: { $gte: thirtyDaysAgo } },
            { $set: { isNew: true } }
        );
        console.log(`✨ Marked ${newResult.modifiedCount} courses as isNew.`);

        console.log('─'.repeat(50));
        console.log(`✅ Migration complete. ${mapped} courses mapped to categories.`);

    } catch (error) {
        console.error('❌ Migration error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔒 DB connection closed.');
        process.exit(0);
    }
}

migrate();
