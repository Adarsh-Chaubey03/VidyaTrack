import Course from '../models/Course.js'
import User from '../models/User.js'
import { v2 as cloudinary } from 'cloudinary'
import Purchase from '../models/Purchase.js'

export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.user._id

        await User.findByIdAndUpdate(userId, { role: 'educator' })
        res.json({ success: true, message: 'You are now a verified educator on VidyaTrack' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//add new Course

export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body
        const imageFile = req.file
        const educatorId = req.user._id

        if (!imageFile) {
            return res.json({ success: false, message: 'Thumbnail Not attached' })
        }

        const parsedCourseData = JSON.parse(courseData)
        parsedCourseData.educator = educatorId

        const newCourse = await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save()

        res.json({ success: true, message: 'Course Added' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// GET EDUCATOR COURSES

export const getEducatorCourses = async (req, res) => {
    try {
        const educatorId = req.user._id

        const courses = await Course.find({ educator: educatorId })
        return res.json({ success: true, courses })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// GET DATA FOR EDUCATOR DASHBOARD

export const educatorDashboardData = async (req, res) => {
    try {
        const educatorId = req.user._id
        const courses = await Course.find({ educator: educatorId })
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        // Calculate total earnings = sum of (coursePrice × number of enrolled students) for each course
        let totalEarnings = 0;

        // Collect unique enrolled students with their course titles
        const enrolledStudentsData = [];
        for (const course of courses) {
            const enrolledCount = (course.enrolledStudent || []).length;
            const effectivePrice = course.coursePrice - (course.coursePrice * (course.discount || 0) / 100);
            totalEarnings += effectivePrice * enrolledCount;

            const students = await User.find({
                _id: { $in: course.enrolledStudent || [] }
            }, 'name imageUrl')

            students.forEach(element => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student: element
                });
            });
        }

        res.json({
            success: true, 
            dashboardData: {
                totalEarnings, 
                enrolledStudentsData, 
                totalCourses
            }
        })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//get enrolled students data — uses User.enrolledCourses as source of truth
// (works for both free and paid enrollments)
export const getEnrolledStudentData = async (req, res) => {
    try {
        const educatorId = req.user._id
        const courses = await Course.find({ educator: educatorId })
        if (!courses.length) {
            return res.json({ success: true, enrolledStudents: [] })
        }

        const courseIds = courses.map(course => course._id)
        // Build a quick lookup: courseId → courseTitle
        const courseTitleMap = {}
        courses.forEach(c => { courseTitleMap[c._id.toString()] = c.courseTitle })

        // Find all users who have any of this educator's courses
        const users = await User.find(
            { enrolledCourses: { $in: courseIds } },
            'name imageUrl enrolledCourses'
        )

        // Build a purchaseDate lookup from Purchase records (if any exist)
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        })
        const purchaseDateMap = {} // key: "userId_courseId" → createdAt
        purchases.forEach(p => {
            if (p.userId && p.courseId) {
                purchaseDateMap[`${p.userId}_${p.courseId}`] = p.createdAt
            }
        })

        // Flatten: one row per (student, course) pair
        const enrolledStudents = []
        for (const user of users) {
            for (const cId of user.enrolledCourses) {
                const cStr = cId.toString()
                if (courseTitleMap[cStr]) {
                    enrolledStudents.push({
                        student: { _id: user._id, name: user.name, imageUrl: user.imageUrl },
                        courseTitle: courseTitleMap[cStr],
                        purchaseDate: purchaseDateMap[`${user._id}_${cStr}`] || user.createdAt
                    })
                }
            }
        }

        res.json({ success: true, enrolledStudents })
    } catch (error) {
        console.error('getEnrolledStudentData error:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}