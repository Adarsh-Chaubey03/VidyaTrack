import React from 'react'
import { useParams } from 'react-router-dom'

function Player() {
    const { courseId } = useParams();
    
    return (
     <>
     <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>
        <div className='text-gray-700 dark:text-gray-300'>
            <h2>Course Structure</h2>
            
        </div>

        
     </div>
     
     <div>

     </div>
     </>
    )
}

export default Player
