import { clerkClient } from '@clerk/express'
import { json } from 'express'
import Course from '../models/Course.js'
import { v2 as cloudinary } from 'cloudinary'
import { Purchase } from '../models/Purchase.js'

export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth.userId

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            }
        })
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
        const educatorId = req.auth.userId

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
        const userId = req.auth.userId

        const courses = await Course.find({ educator })
        return res.json({ success: true, courses })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// GET DATA FOR EDUCATOR DASHBOARD

export const educatorDashboardData = async (req, res) => {
    try {
        const educator = req.auth.userId
        const courses = await Course.find({ educator })
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        // calculate total earning from purchases
        const purchases = await Purchase.find({
            courseId: {
                $in: courseIds
            },
            status: 'completed'

        });

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        // const unique enrolled students IDs with their course titles
        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await User.find({
                _if: { $in: course.enrolledStudents }
            }, 'name imageUrl')

            students.forEach(element => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }

        res.json({
            success: true, dashboardData: ({
                totalEarnings, enrolledStudentsData, totalCourses
            })
        })

    } catch (error) {
        res.json({ succes: false, message: error.message })
    }
}

//get enrolled students data with purchase data
export const getEnrolledStudentData = async (req, res) => {
    try {
        const educator = req.auth.userId
        const courses = await Course.find({ educator })
        const courseIds = courses.map(course => course._id);

        const purchases = await Purchase.find({
            courseId: {in$: courseIds},
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId','courseTitle')

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }))

        res.json({success: true, enrolledStudents})

    } catch (error) {
res.json({success:true, message:error.message})
    }
}