/**
 * Seeds all categories into the database.
 * Usage: node scripts/seedCategories.js
 * Idempotent — upserts by slug.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import Category from '../models/Category.js';
import Course from '../models/Course.js';

const CATEGORIES = [
    // ── Core Tech ────────────────────────────────────
    { name: 'Machine Learning', slug: 'machine-learning', icon: '🤖', group: 'Core Tech', order: 1, description: 'Build intelligent systems that learn from data' },
    { name: 'Data Science', slug: 'data-science', icon: '📊', group: 'Core Tech', order: 2, description: 'Analyze and interpret complex data sets' },
    { name: 'Web Development', slug: 'web-development', icon: '🌐', group: 'Core Tech', order: 3, description: 'Build modern web applications and sites' },
    { name: 'App Development', slug: 'app-development', icon: '📱', group: 'Core Tech', order: 4, description: 'Create mobile apps for iOS and Android' },
    { name: 'Programming Fundamentals', slug: 'programming-fundamentals', icon: '💻', group: 'Core Tech', order: 5, description: 'Master core programming concepts and logic' },
    { name: 'Cybersecurity', slug: 'cybersecurity', icon: '🔒', group: 'Core Tech', order: 6, description: 'Protect systems, networks, and data' },
    { name: 'DevOps & Cloud', slug: 'devops-cloud', icon: '☁️', group: 'Core Tech', order: 7, description: 'Automate deployments and manage cloud infra' },
    { name: 'AI & Deep Learning', slug: 'ai-deep-learning', icon: '🧠', group: 'Core Tech', order: 8, description: 'Explore neural networks and advanced AI' },

    // ── Career / Exam ────────────────────────────────
    { name: 'Government Exams', slug: 'government-exams', icon: '🏛️', group: 'Career / Exam', order: 1, description: 'Prepare for SSC, Banking, and Government jobs' },
    { name: 'UPSC', slug: 'upsc', icon: '📝', group: 'Career / Exam', order: 2, description: 'Civil Services exam preparation' },
    { name: 'IIT-JEE', slug: 'iit-jee', icon: '⚡', group: 'Career / Exam', order: 3, description: 'JEE Main & Advanced preparation' },
    { name: 'NEET', slug: 'neet', icon: '🩺', group: 'Career / Exam', order: 4, description: 'Medical entrance exam preparation' },
    { name: 'School Boards', slug: 'school-boards', icon: '🎒', group: 'Career / Exam', order: 5, description: 'CBSE, ICSE, and State Board courses' },

    // ── Trending ─────────────────────────────────────
    { name: 'Trending Now', slug: 'trending-now', icon: '🔥', group: 'Trending', order: 1, description: 'Most popular courses this week' },
    { name: 'Most Enrolled', slug: 'most-enrolled', icon: '👥', group: 'Trending', order: 2, description: 'Courses with the highest enrollments' },
    { name: 'New Releases', slug: 'new-releases', icon: '✨', group: 'Trending', order: 3, description: 'Freshly published courses' },
    { name: 'Free Courses', slug: 'free-courses', icon: '🆓', group: 'Trending', order: 4, description: 'Learn without spending a rupee' },
];

async function seedCategories() {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
        console.error('❌ MONGODB_URI / MONGO_URI not set in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');
        console.log('─'.repeat(50));

        let upserted = 0;

        for (const cat of CATEGORIES) {
            // Count courses matching this category slug
            const courseCount = await Course.countDocuments({ category: cat.slug, isPublished: true });

            await Category.findOneAndUpdate(
                { slug: cat.slug },
                { ...cat, courseCount },
                { upsert: true, new: true }
            );
            console.log(`  ${cat.icon}  ${cat.name} (${cat.group}) — ${courseCount} courses`);
            upserted++;
        }

        console.log('─'.repeat(50));
        console.log(`✅ ${upserted} categories upserted.`);
        console.log(`📚 Total categories in DB: ${await Category.countDocuments()}`);

    } catch (error) {
        console.error('❌ Seeder error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔒 DB connection closed.');
        process.exit(0);
    }
}

seedCategories();
