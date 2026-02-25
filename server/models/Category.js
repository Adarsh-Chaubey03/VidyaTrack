import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '📚' },
    group: { type: String, enum: ['Core Tech', 'Career / Exam', 'Trending'], required: true },
    courseCount: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

export default Category;
