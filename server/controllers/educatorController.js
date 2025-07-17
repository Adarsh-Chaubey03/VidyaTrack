import { clerkClient } from '@clerk/express'
import { json } from 'express'
import Course from '../models/Course'
import {v2 as cloudinary} from 'cloudinary'

export const updateRoleToEducator = async (req,res) => {
    try {
        const userId = req.auth.userId

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            }
        })
        res.JSON({ success: true, message: 'You are now a verfied educator on VidyaTrack' })
    } catch (error) {
        res.JSON({ success: false, message: error.message })
    }
}

//add new Course

export const addCourse = async (req,res)=> {
    try{
        const {courseData} = req.body
        const imageFile = req.file
        const educatorId = req.auth.userId

        if(!imageFile){
            return res.json({success:false, message: 'Thumbnail Not attached'})
        }

        const parseCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId

        const newCourse = await Course.create(parseCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail  = imageUpload.secure_url
        await newCourse.save

        res.json({success: true, message:'Course Added'})

    }catch(error){
        res.json({success: false, message:error.message})
    }
}