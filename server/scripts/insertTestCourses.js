/**
 * Production Seeder — Inserts 3 real test courses with YouTube lectures.
 *
 * Usage:  node scripts/insertTestCourses.js
 *
 * Features:
 *   ✔ Connects using existing MONGO_URI / MONGODB_URI
 *   ✔ Checks for duplicates (skips if course title already exists)
 *   ✔ Inserts Course documents with embedded Lecture structure
 *   ✔ Assigns first educator user as course owner
 *   ✔ Closes DB connection safely
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import Course from '../models/Course.js';
import User from '../models/User.js';

// ═══════════════════════════════════════════════════════════════
// Course Data — Real DB Records
// ═══════════════════════════════════════════════════════════════

const TEST_COURSES = [
    // ─────────────────────────────────────────────────────────
    // Course 1: AI & Machine Learning
    // ─────────────────────────────────────────────────────────
    {
        courseTitle: 'AI & Machine Learning – Test Batch',
        courseDescription:
            'Comprehensive introduction to Artificial Intelligence and Machine Learning. Covers core concepts, neural networks, deep learning fundamentals, and practical applications using Python. Curated from top-tier YouTube educators.',
        courseThumbnail: 'https://img.youtube.com/vi/JMUxmLyrhSk/maxresdefault.jpg',
        coursePrice: 0,
        discount: 0,
        isPublished: true,
        courseContent: [
            {
                chapterId: 'ai-ch1',
                chapterOrder: 1,
                chapterTitle: 'AI & ML Foundations',
                chapterContent: [
                    {
                        lectureId: 'ai-l1',
                        lectureTitle: 'AI Full Course — Artificial Intelligence Tutorial',
                        lectureDescription: 'Complete overview of AI concepts, history, and modern applications in industry.',
                        lectureUrl: '',
                        youtubeVideoId: 'JMUxmLyrhSk',
                        lectureDuration: 60,
                        isPreviewFree: true,
                        lecturOrder: 1,
                    },
                    {
                        lectureId: 'ai-l2',
                        lectureTitle: 'Machine Learning Full Course',
                        lectureDescription: 'End-to-end machine learning concepts: supervised, unsupervised, reinforcement learning.',
                        lectureUrl: '',
                        youtubeVideoId: 'GwIo3gDZCVQ',
                        lectureDuration: 55,
                        isPreviewFree: true,
                        lecturOrder: 2,
                    },
                ],
            },
            {
                chapterId: 'ai-ch2',
                chapterOrder: 2,
                chapterTitle: 'Deep Learning & Neural Networks',
                chapterContent: [
                    {
                        lectureId: 'ai-l3',
                        lectureTitle: 'Neural Networks — But What Is a Neural Network?',
                        lectureDescription: 'Visual and intuitive explanation of neural networks by 3Blue1Brown.',
                        lectureUrl: '',
                        youtubeVideoId: 'aircAruvnKk',
                        lectureDuration: 19,
                        isPreviewFree: true,
                        lecturOrder: 1,
                    },
                    {
                        lectureId: 'ai-l4',
                        lectureTitle: 'Deep Learning Crash Course',
                        lectureDescription: 'Practical deep learning concepts including CNNs, RNNs, and real-world projects.',
                        lectureUrl: '',
                        youtubeVideoId: 'VyWAvY2CF9c',
                        lectureDuration: 45,
                        isPreviewFree: false,
                        lecturOrder: 2,
                    },
                ],
            },
        ],
    },

    // ─────────────────────────────────────────────────────────
    // Course 2: Web Development
    // ─────────────────────────────────────────────────────────
    {
        courseTitle: 'Web Development – Test Batch',
        courseDescription:
            'Learn full-stack web development from scratch. Covers HTML, CSS, JavaScript, and React.js with hands-on projects. Industry-standard curriculum from top YouTube educators.',
        courseThumbnail: 'https://img.youtube.com/vi/pQN-pnXPaVg/maxresdefault.jpg',
        coursePrice: 0,
        discount: 0,
        isPublished: true,
        courseContent: [
            {
                chapterId: 'web-ch1',
                chapterOrder: 1,
                chapterTitle: 'HTML & CSS Foundations',
                chapterContent: [
                    {
                        lectureId: 'web-l1',
                        lectureTitle: 'HTML Full Course — Build a Website',
                        lectureDescription: 'Complete HTML tutorial for beginners: tags, structure, forms, semantic HTML.',
                        lectureUrl: '',
                        youtubeVideoId: 'pQN-pnXPaVg',
                        lectureDuration: 65,
                        isPreviewFree: true,
                        lecturOrder: 1,
                    },
                    {
                        lectureId: 'web-l2',
                        lectureTitle: 'CSS Full Course — Flexbox, Grid, Animations',
                        lectureDescription: 'Master CSS from basics to advanced layouts with flexbox, grid, and animations.',
                        lectureUrl: '',
                        youtubeVideoId: 'OXGznpKZ_sA',
                        lectureDuration: 70,
                        isPreviewFree: true,
                        lecturOrder: 2,
                    },
                ],
            },
            {
                chapterId: 'web-ch2',
                chapterOrder: 2,
                chapterTitle: 'JavaScript & React',
                chapterContent: [
                    {
                        lectureId: 'web-l3',
                        lectureTitle: 'JavaScript Full Course for Beginners',
                        lectureDescription: 'Complete JavaScript: variables, functions, objects, DOM, async/await, ES6+.',
                        lectureUrl: '',
                        youtubeVideoId: 'PkZNo7MFNFg',
                        lectureDuration: 75,
                        isPreviewFree: true,
                        lecturOrder: 1,
                    },
                    {
                        lectureId: 'web-l4',
                        lectureTitle: 'React.js Course for Beginners — Components & Hooks',
                        lectureDescription: 'React fundamentals: JSX, components, state, hooks, routing, and project building.',
                        lectureUrl: '',
                        youtubeVideoId: 'bMknfKXIFA8',
                        lectureDuration: 80,
                        isPreviewFree: false,
                        lecturOrder: 2,
                    },
                ],
            },
        ],
    },

    // ─────────────────────────────────────────────────────────
    // Course 3: Programming Fundamentals
    // ─────────────────────────────────────────────────────────
    {
        courseTitle: 'Programming Fundamentals – Test Batch',
        courseDescription:
            'Master programming fundamentals with C, Python, and data structures. Perfect for absolute beginners and those preparing for coding interviews. Curated from the best free courses on YouTube.',
        courseThumbnail: 'https://img.youtube.com/vi/KJgsSFOSQv0/maxresdefault.jpg',
        coursePrice: 0,
        discount: 0,
        isPublished: true,
        courseContent: [
            {
                chapterId: 'prog-ch1',
                chapterOrder: 1,
                chapterTitle: 'C Programming & Python Basics',
                chapterContent: [
                    {
                        lectureId: 'prog-l1',
                        lectureTitle: 'C Programming Full Course',
                        lectureDescription: 'Complete C programming tutorial: syntax, loops, pointers, memory, file I/O.',
                        lectureUrl: '',
                        youtubeVideoId: 'KJgsSFOSQv0',
                        lectureDuration: 60,
                        isPreviewFree: true,
                        lecturOrder: 1,
                    },
                    {
                        lectureId: 'prog-l2',
                        lectureTitle: 'Python Full Course for Beginners',
                        lectureDescription: 'Learn Python from scratch: variables, lists, dictionaries, OOP, and automation.',
                        lectureUrl: '',
                        youtubeVideoId: '_uQrJ0TkZlc',
                        lectureDuration: 70,
                        isPreviewFree: true,
                        lecturOrder: 2,
                    },
                ],
            },
            {
                chapterId: 'prog-ch2',
                chapterOrder: 2,
                chapterTitle: 'Data Structures & Algorithms',
                chapterContent: [
                    {
                        lectureId: 'prog-l3',
                        lectureTitle: 'Data Structures — Full Course Using C and C++',
                        lectureDescription: 'Arrays, linked lists, stacks, queues, trees, graphs, sorting, and searching.',
                        lectureUrl: '',
                        youtubeVideoId: 'RBSGKlAvoiM',
                        lectureDuration: 65,
                        isPreviewFree: true,
                        lecturOrder: 1,
                    },
                    {
                        lectureId: 'prog-l4',
                        lectureTitle: 'Java Programming Full Course',
                        lectureDescription: 'Complete Java tutorial: OOP concepts, collections, exception handling, and projects.',
                        lectureUrl: '',
                        youtubeVideoId: 'pTB0EiLXUC8',
                        lectureDuration: 75,
                        isPreviewFree: false,
                        lecturOrder: 2,
                    },
                ],
            },
        ],
    },
];

// ═══════════════════════════════════════════════════════════════
// Main Seeder Function
// ═══════════════════════════════════════════════════════════════
async function insertTestCourses() {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
        console.error('❌ MONGODB_URI / MONGO_URI not set in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');
        console.log('─'.repeat(50));

        // Find educator to assign as course owner
        let educator = await User.findOne({ role: 'educator' });
        if (!educator) {
            educator = await User.findOne({});
        }
        if (!educator) {
            console.error('❌ No users found in database. Create a user account first.');
            await mongoose.disconnect();
            process.exit(1);
        }
        console.log(`👤 Assigning courses to educator: ${educator.name || educator.email || educator._id}`);
        console.log('─'.repeat(50));

        let inserted = 0;
        let skipped = 0;

        for (const courseData of TEST_COURSES) {
            // Duplicate check by title
            const existing = await Course.findOne({ courseTitle: courseData.courseTitle });
            if (existing) {
                console.log(`⏭  SKIPPED (already exists): ${courseData.courseTitle}`);
                console.log(`   ID: ${existing._id}`);
                skipped++;
                continue;
            }

            // Count total lectures
            const totalLectures = courseData.courseContent.reduce(
                (sum, ch) => sum + ch.chapterContent.length, 0
            );

            // Insert as real Course document
            const newCourse = await Course.create({
                ...courseData,
                educator: educator._id,
            });

            console.log(`✅ INSERTED: ${courseData.courseTitle}`);
            console.log(`   ID: ${newCourse._id}`);
            console.log(`   Chapters: ${courseData.courseContent.length}`);
            console.log(`   Lectures: ${totalLectures}`);
            console.log(`   Published: ${newCourse.isPublished}`);
            console.log(`   Price: ${newCourse.coursePrice === 0 ? 'FREE' : `₹${newCourse.coursePrice}`}`);

            // Print lecture details
            courseData.courseContent.forEach(ch => {
                ch.chapterContent.forEach(lec => {
                    console.log(`     📺 ${lec.lectureTitle} → youtubeVideoId: ${lec.youtubeVideoId}`);
                });
            });

            console.log('─'.repeat(50));
            inserted++;
        }

        console.log('\n═══════════════════════════════════════════════');
        console.log(`  📊 Results: ${inserted} inserted, ${skipped} skipped (duplicates)`);
        console.log(`  📚 Total courses in DB: ${await Course.countDocuments()}`);
        console.log('═══════════════════════════════════════════════\n');

    } catch (error) {
        console.error('❌ Seeder error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔒 DB connection closed safely.');
        process.exit(0);
    }
}

insertTestCourses();
