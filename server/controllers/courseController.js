import Course from "../models/Course.js";

// get all courses 

export const getAllCourses = async (req,res)=>{
    try {
        const courses = await Course.find({
            isPublished:true
        }).select(['-courseContent','-enrolledStudents']).populate({path:'educator'})
    } catch (error) {
        
    }
}