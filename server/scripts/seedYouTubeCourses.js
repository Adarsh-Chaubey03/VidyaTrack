/**
 * Seed script: Populates VidyaTrack with courses containing real YouTube lecture videos
 * from Indian EdTech channels (Physics Wallah, College Wallah, Unacademy, etc.)
 *
 * Usage:  node scripts/seedYouTubeCourses.js
 *
 * This script is idempotent — it uses upsert logic based on courseTitle.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import model after dotenv so env is ready
import Course from '../models/Course.js';

// ─────────────────────────────────────────────────────────────
// Curated YouTube Video IDs from public playlists
// Each entry: { videoId, title, duration (min), channel }
// ─────────────────────────────────────────────────────────────

const COURSES = [
    // ═══════════════════════════════════════════════════════════
    // Course 1: Data Structures & Algorithms (College Wallah)
    // ═══════════════════════════════════════════════════════════
    {
        courseTitle: 'Data Structures & Algorithms — Complete Course',
        courseDescription:
            'Master Data Structures and Algorithms from scratch. This comprehensive course covers arrays, linked lists, stacks, queues, trees, graphs, sorting algorithms, and dynamic programming with real-world problem solving. Curated from top Indian EdTech lectures.',
        courseThumbnail: 'https://img.youtube.com/vi/WQoB2z67hvY/maxresdefault.jpg',
        coursePrice: 0,
        discount: 0,
        isPublished: true,
        courseContent: [
            {
                chapterId: 'dsa-ch1',
                chapterOrder: 1,
                chapterTitle: 'Introduction to DSA & Arrays',
                chapterContent: [
                    {
                        lectureId: 'dsa-l1',
                        lectureTitle: 'Introduction to Data Structures & Algorithms',
                        lectureDescription: 'What are data structures? Why are they important? Overview of time & space complexity.',
                        youtubeVideoId: 'WQoB2z67hvY',
                        lectureDuration: 34,
                        isPreviewFree: true,
                        lecturOrder: 1,
                    },
                    {
                        lectureId: 'dsa-l2',
                        lectureTitle: 'Arrays — Basics & Operations',
                        lectureDescription: 'Array declaration, traversal, insertion, deletion, and searching operations.',
                        youtubeVideoId: 'NTHVTY6w2Co',
                        lectureDuration: 42,
                        isPreviewFree: true,
                        lecturOrder: 2,
                    },
                    {
                        lectureId: 'dsa-l3',
                        lectureTitle: 'Sorting Algorithms — Bubble, Selection, Insertion Sort',
                        lectureDescription: 'Understanding basic sorting algorithms with step-by-step visualization.',
                        youtubeVideoId: 'HGk_ypEuS24',
                        lectureDuration: 38,
                        isPreviewFree: false,
                        lecturOrder: 3,
                    },
                ],
            },
            {
                chapterId: 'dsa-ch2',
                chapterOrder: 2,
                chapterTitle: 'Linked Lists & Stacks',
                chapterContent: [
                    {
                        lectureId: 'dsa-l4',
                        lectureTitle: 'Linked List — Singly Linked List',
                        lectureDescription: 'Singly linked list: creation, insertion, deletion, traversal, and reversal.',
                        youtubeVideoId: 'oAja8-Ulz6o',
                        lectureDuration: 45,
                        isPreviewFree: true,
                        lecturOrder: 1,
                    },
                    {
                        lectureId: 'dsa-l5',
                        lectureTitle: 'Stack Data Structure — Concepts & Implementation',
                        lectureDescription: 'Stack ADT, push/pop operations, applications like balanced parentheses.',
                        youtubeVideoId: 'bxRVz8zklWM',
                        lectureDuration: 35,
                        isPreviewFree: false,
                        lecturOrder: 2,
                    },
                ],
            },
            {
                chapterId: 'dsa-ch3',
                chapterOrder: 3,
                chapterTitle: 'Trees & Graphs',
                chapterContent: [
                    {
                        lectureId: 'dsa-l6',
                        lectureTitle: 'Binary Tree — Introduction & Traversals',
                        lectureDescription: 'Binary tree basics, inorder, preorder, postorder traversals.',
                        youtubeVideoId: '_ANrF3FJm7I',
                        lectureDuration: 40,
                        isPreviewFree: true,
                        lecturOrder: 1,
                    },
                    {
                        lectureId: 'dsa-l7',
                        lectureTitle: 'Graph — BFS & DFS Traversals',
                        lectureDescription: 'Graph representation, breadth-first search, depth-first search algorithms.',
                        youtubeVideoId: 'pcKY4hjDrxk',
                        lectureDuration: 48,
                        isPreviewFree: false,
                        lecturOrder: 2,
                    },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════
    // Course 2: Physics — Mechanics (Physics Wallah)
    // ═══════════════════════════════════════════════════════════
    {
        courseTitle: 'Physics — Mechanics for IIT JEE & NEET',
        courseDescription:
            "Complete Mechanics course for IIT JEE and NEET preparation. Covers Newton's Laws, kinematics, work-energy theorem, rotational motion, and gravitation. Lectures sourced from Physics Wallah's popular playlists.",
        courseThumbnail: 'https://img.youtube.com/vi/UGHxKbuh-Ek/maxresdefault.jpg',
        coursePrice: 0,
        discount: 0,
        isPublished: true,
        courseContent: [
            {
                chapterId: 'phy-ch1',
                chapterOrder: 1,
                chapterTitle: 'Kinematics — Motion in a Straight Line',
                chapterContent: [
                    {
                        lectureId: 'phy-l1',
                        lectureTitle: 'Introduction to Kinematics — Distance, Displacement, Speed',
                        lectureDescription: 'Fundamentals of motion: distance vs displacement, speed vs velocity, acceleration.',
                        youtubeVideoId: 'UGHxKbuh-Ek',
                        lectureDuration: 52,
                        isPreviewFree: true,
                        lecturOrder: 1,
                    },
                    {
                        lectureId: 'phy-l2',
                        lectureTitle: 'Equations of Motion & Graphs',
                        lectureDescription: 'Three equations of motion, v-t graphs, s-t graphs, and problem solving.',
                        youtubeVideoId: 'jC1iR0PLGWU',
                        lectureDuration: 45,
                        isPreviewFree: true,
                        lecturOrder: 2,
                    },
                    {
                        lectureId: 'phy-l3',
                        lectureTitle: 'Projectile Motion',
                        lectureDescription: 'Horizontal and oblique projectile, time of flight, range, max height.',
                        youtubeVideoId: 'XJf4KXOm6_U',
                        lectureDuration: 50,
                        isPreviewFree: false,
                        lecturOrder: 3,
                    },
                ],
            },
            {
                chapterId: 'phy-ch2',
                chapterOrder: 2,
                chapterTitle: "Newton's Laws of Motion",
                chapterContent: [
                    {
                        lectureId: 'phy-l4',
                        lectureTitle: "Newton's First & Second Law — Force, Inertia, Momentum",
                        lectureDescription: "Understanding Newton's first and second laws with real-world examples.",
                        youtubeVideoId: 'V6wVjJshcFY',
                        lectureDuration: 55,
                        isPreviewFree: true,
                        lecturOrder: 1,
                    },
                    {
                        lectureId: 'phy-l5',
                        lectureTitle: "Newton's Third Law & Free Body Diagrams",
                        lectureDescription: 'Action-reaction pairs, free body diagrams, pulley problems.',
                        youtubeVideoId: 'EvkMxe3MBds',
                        lectureDuration: 48,
                        isPreviewFree: false,
                        lecturOrder: 2,
                    },
                ],
            },
            {
                chapterId: 'phy-ch3',
                chapterOrder: 3,
                chapterTitle: 'Work, Energy & Power',
                chapterContent: [
                    {
                        lectureId: 'phy-l6',
                        lectureTitle: 'Work Done by a Force — Concepts & Problems',
                        lectureDescription: 'Work done by constant and variable forces, work-energy theorem.',
                        youtubeVideoId: 'jNVEakpoQGk',
                        lectureDuration: 46,
                        isPreviewFree: true,
                        lecturOrder: 1,
                    },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════
    // Course 3: Web Development — MERN Stack (Mixed channels)
    // ═══════════════════════════════════════════════════════════
    {
        courseTitle: 'Web Development — MERN Stack Bootcamp',
        courseDescription:
            'Learn full-stack web development with the MERN stack (MongoDB, Express, React, Node.js). This course covers HTML, CSS, JavaScript fundamentals, React components, Node.js APIs, and deploying a full-stack application.',
        courseThumbnail: 'https://img.youtube.com/vi/HVjjoMvutma/maxresdefault.jpg',
        coursePrice: 99,
        discount: 50,
        isPublished: true,
        courseContent: [
            {
                chapterId: 'web-ch1',
                chapterOrder: 1,
                chapterTitle: 'HTML & CSS Fundamentals',
                chapterContent: [
                    {
                        lectureId: 'web-l1',
                        lectureTitle: 'HTML Crash Course — Tags, Attributes, Forms',
                        lectureDescription: 'Complete HTML tutorial covering structure, tags, forms, tables, and semantic elements.',
                        youtubeVideoId: 'BsDoLVMnmZs',
                        lectureDuration: 60,
                        isPreviewFree: true,
                        lecturOrder: 1,
                    },
                    {
                        lectureId: 'web-l2',
                        lectureTitle: 'CSS Crash Course — Flexbox, Grid, Animations',
                        lectureDescription: 'CSS styling, box model, flexbox layout, grid, transitions, and animations.',
                        youtubeVideoId: 'ESnrn1kAD4E',
                        lectureDuration: 55,
                        isPreviewFree: true,
                        lecturOrder: 2,
                    },
                ],
            },
            {
                chapterId: 'web-ch2',
                chapterOrder: 2,
                chapterTitle: 'JavaScript — Core Concepts',
                chapterContent: [
                    {
                        lectureId: 'web-l3',
                        lectureTitle: 'JavaScript Full Course — Variables, Functions, DOM',
                        lectureDescription: 'JavaScript fundamentals: variables, data types, functions, loops, DOM manipulation.',
                        youtubeVideoId: 'ER9SspLe4Hg',
                        lectureDuration: 65,
                        isPreviewFree: true,
                        lecturOrder: 1,
                    },
                    {
                        lectureId: 'web-l4',
                        lectureTitle: 'Async JavaScript — Promises, Async/Await, Fetch API',
                        lectureDescription: 'Understanding asynchronous JavaScript: callbacks, promises, async/await, and fetch.',
                        youtubeVideoId: 'XQHz4mFm4ok',
                        lectureDuration: 40,
                        isPreviewFree: false,
                        lecturOrder: 2,
                    },
                ],
            },
            {
                chapterId: 'web-ch3',
                chapterOrder: 3,
                chapterTitle: 'React.js & Node.js',
                chapterContent: [
                    {
                        lectureId: 'web-l5',
                        lectureTitle: 'React.js Crash Course — Components, Hooks, State',
                        lectureDescription: 'React fundamentals: JSX, components, props, useState, useEffect, routing.',
                        youtubeVideoId: 'RGKi6LSPDLU',
                        lectureDuration: 70,
                        isPreviewFree: true,
                        lecturOrder: 1,
                    },
                    {
                        lectureId: 'web-l6',
                        lectureTitle: 'Node.js & Express — Building REST APIs',
                        lectureDescription: 'Server-side development with Node.js and Express: routes, middleware, MongoDB.',
                        youtubeVideoId: 'ohIAiuHMKMI',
                        lectureDuration: 58,
                        isPreviewFree: false,
                        lecturOrder: 2,
                    },
                ],
            },
        ],
    },
];

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────
async function seed() {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
        console.error('❌ MONGODB_URI / MONGO_URI not set in .env');
        process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    for (const courseData of COURSES) {
        // Find an educator to assign — use first user with role=educator, or first user
        const User = (await import('../models/User.js')).default;
        let educator = await User.findOne({ role: 'educator' });
        if (!educator) {
            educator = await User.findOne({});
        }
        if (!educator) {
            console.error('❌ No users found. Please create a user first.');
            process.exit(1);
        }

        // Upsert by courseTitle
        const existing = await Course.findOne({ courseTitle: courseData.courseTitle });
        if (existing) {
            existing.courseContent = courseData.courseContent;
            existing.courseDescription = courseData.courseDescription;
            existing.courseThumbnail = courseData.courseThumbnail;
            existing.coursePrice = courseData.coursePrice;
            existing.discount = courseData.discount;
            existing.isPublished = courseData.isPublished;
            await existing.save();
            console.log(`🔄 Updated: ${courseData.courseTitle}`);
        } else {
            await Course.create({
                ...courseData,
                educator: educator._id,
            });
            console.log(`✅ Created: ${courseData.courseTitle}`);
        }

        const totalLectures = courseData.courseContent.reduce(
            (sum, ch) => sum + ch.chapterContent.length,
            0
        );
        console.log(`   📚 ${courseData.courseContent.length} chapters, ${totalLectures} lectures`);
    }

    console.log('\n🎉 Seed complete!');
    await mongoose.disconnect();
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seed error:', err);
    process.exit(1);
});
