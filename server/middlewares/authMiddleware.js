import { clerkClient } from '@clerk/express'
import Course from '../models/Course.js'

// General authentication middleware
export const protect = async (req, res, next) => {
    try {
        console.log('🔍 Auth middleware - Headers:', {
            authorization: req.headers.authorization,
            cookie: req.headers.cookie ? 'Present' : 'Not present'
        });
        
        const userId = req.auth?.userId || req.auth?.()?.userId
        console.log('🔍 Auth middleware - User ID:', userId);
        
        if (!userId) {
            console.log('❌ Auth middleware - No user ID found');
            return res.status(401).json({ success: false, message: 'Not authorized, no token' })
        }

        const response = await clerkClient.users.getUser(userId)
        req.user = response
        console.log('✅ Auth middleware - User authenticated:', userId);
        next()
    } catch (error) {
        console.log('❌ Auth middleware - Error:', error.message);
        res.status(401).json({ success: false, message: 'Not authorized, token failed' })
    }
}

// Middleware (Protect Educator Routes)
export const protectEducator = async (req,res,next)=>{
    try{
        const userId = req.auth?.userId || req.auth?.()?.userId
        const response = await clerkClient.users.getUser(userId)

         if(response.publicMetadata.role !== 'educator'){
            return res.json({success: false, message: 'Unauthorized Access'})
         }

         next()

    } catch(error){

        res.json({succes:false , message: error.message})  

    }
}


