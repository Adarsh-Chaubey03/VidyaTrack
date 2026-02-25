/**
 * Removes all non-tech categories from the database.
 * Usage: node scripts/removeNonTechCategories.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import Category from '../models/Category.js';

const NON_TECH_SLUGS = [
    'government-exams', 'upsc', 'iit-jee', 'neet', 'school-boards',
    'trending-now', 'most-enrolled', 'new-releases', 'free-courses',
];

async function removeNonTech() {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) { console.error('MONGODB_URI not set'); process.exit(1); }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const result = await Category.deleteMany({ slug: { $in: NON_TECH_SLUGS } });
    console.log(`Deleted ${result.deletedCount} non-tech categories.`);

    const remaining = await Category.find({}).select('name slug');
    console.log(`Remaining categories (${remaining.length}):`);
    remaining.forEach(c => console.log(`  • ${c.name} (${c.slug})`));

    await mongoose.disconnect();
    process.exit(0);
}

removeNonTech();
