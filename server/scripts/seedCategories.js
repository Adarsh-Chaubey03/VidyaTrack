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
    // Core Tech
    { name: 'Machine Learning', slug: 'machine-learning', icon: '🤖', group: 'Core Tech', order: 1, description: 'Build intelligent systems that learn from data', subTags: ['Supervised', 'Unsupervised', 'NLP', 'Computer Vision'] },
    { name: 'Data Science', slug: 'data-science', icon: '📊', group: 'Core Tech', order: 2, description: 'Analyze and interpret complex data sets', subTags: ['Python', 'R', 'Statistics', 'Visualization'] },
    { name: 'Web Development', slug: 'web-development', icon: '🌐', group: 'Core Tech', order: 3, description: 'Build modern web applications and sites', subTags: ['React', 'Node.js', 'MERN', 'Full Stack'] },
    { name: 'App Development', slug: 'app-development', icon: '📱', group: 'Core Tech', order: 4, description: 'Create mobile apps for iOS and Android', subTags: ['React Native', 'Flutter', 'Android', 'iOS'] },
    { name: 'Programming Fundamentals', slug: 'programming-fundamentals', icon: '💻', group: 'Core Tech', order: 5, description: 'Master core programming concepts and logic', subTags: ['C/C++', 'Java', 'Python', 'DSA'] },
    { name: 'Cybersecurity', slug: 'cybersecurity', icon: '🔒', group: 'Core Tech', order: 6, description: 'Protect systems, networks, and data', subTags: ['Ethical Hacking', 'Network Security', 'Forensics'] },
    { name: 'DevOps & Cloud', slug: 'devops-cloud', icon: '☁️', group: 'Core Tech', order: 7, description: 'Automate deployments and manage cloud infra', subTags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'] },
    { name: 'AI & Deep Learning', slug: 'ai-deep-learning', icon: '🧠', group: 'Core Tech', order: 8, description: 'Explore neural networks and advanced AI', subTags: ['TensorFlow', 'PyTorch', 'GANs', 'Transformers'] },

    // Career / Exam
    { name: 'Government Exams', slug: 'government-exams', icon: '🏛️', group: 'Career / Exam', order: 1, description: 'Prepare for SSC, Banking, and Government jobs', subTags: ['SSC', 'Banking', 'Teaching', 'Judiciary'] },
    { name: 'UPSC', slug: 'upsc', icon: '📝', group: 'Career / Exam', order: 2, description: 'Civil Services exam preparation', subTags: ['Prelims', 'Mains', 'Interview'] },
    { name: 'IIT-JEE', slug: 'iit-jee', icon: '⚡', group: 'Career / Exam', order: 3, description: 'JEE Main & Advanced preparation', subTags: ['Class 11', 'Class 12', 'Dropper'] },
    { name: 'NEET', slug: 'neet', icon: '🩺', group: 'Career / Exam', order: 4, description: 'Medical entrance exam preparation', subTags: ['Class 11', 'Class 12', 'Dropper'] },
    { name: 'School Boards', slug: 'school-boards', icon: '🎒', group: 'Career / Exam', order: 5, description: 'CBSE, ICSE, and State Board courses', subTags: ['CBSE', 'ICSE', 'UP Board', 'Maharashtra Board'] },

    // Trending
    { name: 'Trending Now', slug: 'trending-now', icon: '🔥', group: 'Trending', order: 1, description: 'Most popular courses this week', subTags: [] },
    { name: 'Most Enrolled', slug: 'most-enrolled', icon: '👥', group: 'Trending', order: 2, description: 'Courses with the highest enrollments', subTags: [] },
    { name: 'New Releases', slug: 'new-releases', icon: '✨', group: 'Trending', order: 3, description: 'Freshly published courses', subTags: [] },
    { name: 'Free Courses', slug: 'free-courses', icon: '🆓', group: 'Trending', order: 4, description: 'Learn without spending a rupee', subTags: [] },
];

async function seedCategories() {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
        console.error('MONGODB_URI / MONGO_URI not set in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        let upserted = 0;

        for (const cat of CATEGORIES) {
            const courseCount = await Course.countDocuments({ category: cat.slug, isPublished: true });

            await Category.findOneAndUpdate(
                { slug: cat.slug },
                { ...cat, courseCount },
                { upsert: true, new: true }
            );
            console.log(`  ${cat.icon}  ${cat.name} (${cat.group}) - ${courseCount} courses`);
            upserted++;
        }

        console.log(`${upserted} categories upserted.`);
        console.log(`Total categories in DB: ${await Category.countDocuments()}`);

    } catch (error) {
        console.error('Seeder error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('DB connection closed.');
        process.exit(0);
    }
}

seedCategories();
