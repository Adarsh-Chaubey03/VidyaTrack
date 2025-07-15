import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    lectureId: {type:String, required:true},
    lectureTitle: {type:String, required:true},
    lectureDescription: {type:Number, required:true},
    lectureUrl: {type:String, required:true},
})


const chapterSchema = new mongoose.Schema({
chapterId: {type:String, required:true},
chapterOrder: {type:Number, required:true},
chapterTitle: {type:String, required:true},
chapterContent: [lectureSchema]

}, {_id:false})

const courseSchema = new mongoose.Schema({
    courseTitle: { type: String, required: true },
    courseDescription: { type: String, required: true },
    courseThumbnail: { type: String },
    coursePrice: { type: Number, required: true },
    isPublished: { type: Boolean, default: true },
    discount: { type: Number, required: true, min: 0, max: 100 },
    courseContent: [],
    courseRatings: [
        { userID: { type: String }, rating: { type: Number, min: 1, max: 5 } }
    ],
    educator: { type: String, ref: 'User', required: true },
    enrolledStudent: [{ type: String, ref: 'User' }],

}, { timestamps: true, minimize: false })