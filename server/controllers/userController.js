import User from "../models/User"

export const getUserData = async(req,res) => {
    try {
        const userId = req.auth.userId
        const user = await User.findById(userId)
        if(!user){
            return res.json({sucess:false, message: 'User not found'})
        }
    } catch (error) {
        
    }
}