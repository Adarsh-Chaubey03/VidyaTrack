import { clerkClient } from '@clerk/express'
import { json } from 'express'
import Course from '../models/Course.js'
import {v2 as cloudinary} from 'cloudinary'

export const updateRoleToEducator = async (req,res) => {
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

export const addCourse = async (req,res)=> {
    try{
        const {courseData} = req.body
        const imageFile = req.file
        const educatorId = req.auth.userId

        if(!imageFile){
            return res.json({success:false, message: 'Thumbnail Not attached'})
        }

        const parsedCourseData = JSON.parse(courseData)
        parsedCourseData.educator = educatorId

        const newCourse = await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail  = imageUpload.secure_url
        await newCourse.save()

        res.json({success: true, message:'Course Added'})

    }catch(error){
        res.json({success: false, message:error.message})
    }
}