import Course from "../models/Course.js";

// get all courses 

export const getAllCourses = async (req,res)=>{
    try {
        let courses = await Course.find({
            isPublished:true
        }).select(['-courseContent','-enrolledStudents']).populate({path:'educator'})

        // If no courses exist, create some demo courses
        if (courses.length === 0) {
            console.log('No courses found, creating demo courses...');
            await createDemoCourses();
            courses = await Course.find({
                isPublished:true
            }).select(['-courseContent','-enrolledStudents']).populate({path:'educator'})
        }

        res.json({success: true, courses})
    } catch (error) {
        console.error('Error in getAllCourses:', error);
        res.json({success: false, message: error.message})  
    }
}

// Function to create demo courses
const createDemoCourses = async () => {
    try {
        const demoCourses = [
            {
                courseTitle: "Master React JS",
                courseDescription: "Learn React from scratch to advanced concepts with hands-on projects",
                courseThumbnail: "https://via.placeholder.com/400x250/4ade80/ffffff?text=React+JS",
                coursePrice: 99.99,
                discount: 25,
                isPublished: true,
                educator: "demo-educator-1",
                enrolledStudents: [],
                courseContent: [
                    {
                        chapterTitle: "Introduction to React",
                        chapterContent: [
                            {
                                lectureTitle: "What is React?",
                                lectureDuration: 15,
                                isPreviewFree: true
                            },
                            {
                                lectureTitle: "Setting up your environment",
                                lectureDuration: 20,
                                isPreviewFree: false
                            }
                        ]
                    }
                ]
            },
            {
                courseTitle: "Complete Node.js Developer",
                courseDescription: "Build real-world applications with Node.js, Express, and MongoDB",
                courseThumbnail: "https://via.placeholder.com/400x250/3b82f6/ffffff?text=Node.js",
                coursePrice: 129.99,
                discount: 30,
                isPublished: true,
                educator: "demo-educator-2",
                enrolledStudents: [],
                courseContent: [
                    {
                        chapterTitle: "Node.js Fundamentals",
                        chapterContent: [
                            {
                                lectureTitle: "Introduction to Node.js",
                                lectureDuration: 18,
                                isPreviewFree: true
                            }
                        ]
                    }
                ]
            },
            {
                courseTitle: "Python for Data Science",
                courseDescription: "Master Python programming for data analysis and machine learning",
                courseThumbnail: "https://via.placeholder.com/400x250/f59e0b/ffffff?text=Python",
                coursePrice: 149.99,
                discount: 20,
                isPublished: true,
                educator: "demo-educator-3",
                enrolledStudents: [],
                courseContent: [
                    {
                        chapterTitle: "Python Basics",
                        chapterContent: [
                            {
                                lectureTitle: "Getting Started with Python",
                                lectureDuration: 25,
                                isPreviewFree: true
                            }
                        ]
                    }
                ]
            }
        ];

        for (const courseData of demoCourses) {
            const course = new Course(courseData);
            await course.save();
        }
        
        console.log('Demo courses created successfully');
    } catch (error) {
        console.error('Error creating demo courses:', error);
    }
};

// Get Course by Id 

export const getCourseId = async (req,res)=>{
    const {id} = req.params

    try {
        const courseData = await Course.findById(id).populate({path:'educator'})

        // remove lecture url if isPreviewFree is False
        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture =>{
                if(!lecture.isPreviewFree){
                    lecture.lectureUrl = ""
                }
            })
        })

        res.json({success: true, courseData})
        
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}