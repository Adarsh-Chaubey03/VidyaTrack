import React from 'react'
import { useParams } from 'react-router-dom'

function Player() {
    const { courseId } = useParams();
    
    return (
        <div className='md:px-36 px-2 sm:px-8 pt-10 relative bg-calm-lightBg dark:bg-gray-800 text-calm-lightText dark:text-calm-darkText min-h-screen'>
            <h1 className='text-2xl font-semibold mb-6'>Course Player</h1>
            <div className='bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6'>
                <h2 className='text-xl font-medium mb-4'>Course ID: {courseId}</h2>
                <p className='text-gray-600 dark:text-gray-300'>Video player and course content will be displayed here.</p>
            </div>
        </div>
    )
}

export default Player
