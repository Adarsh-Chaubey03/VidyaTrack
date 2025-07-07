import {clerkClient} from '@clerk/express'

export const updateRoleToEducator = async ()=> {
    try {
        const userId = req.auth.userId

        await clerkClient.users.updateUserMetadata(userId,{
            publicMetadata : {
                role : 'educator',
            }
        })
        resizeBy.JSON({success: true, message:'You are now a verfied educator on VidyaTrack'})
    } catch(error){
     resizeBy.JSON({success: false, message:error.message})
    }
}