import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

function MyEnrollment() {
    const { enrolledCourses, calculateCourseDuration } = useContext(AppContext)
    return (
        <div className='md:px-36 px-2 sm:px-8 pt-10 relative bg-calm-lightBg text-calm-lightText min-h-screen'>
            <h1 className='text-3xl font-bold text-center mb-8'>My Enrolled Courses</h1>
            <div className='absolute top-0 right-0 mt-2 mr-2 p-2 rounded-full bg-gray-200 text-gray-800 shadow hover:bg-gray-300 transition'>
                <span className='text-sm font-medium'>Total: {enrolledCourses.length}</span>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {enrolledCourses.map((course) => (
                    <div key={course._id} className='bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
                        <img src={course.courseThumbnail || assets.course_1} alt={course.courseTitle} className='w-full h-48 object-cover' />
                        <div className='p-6'>
                            <h3 className='text-xl font-semibold mb-2 line-clamp-2'>{course.courseTitle}</h3>
                            <p className='text-gray-600 text-sm mb-4 line-clamp-3' dangerouslySetInnerHTML={{ __html: course.courseDescription }} />
                            <div className='flex items-center justify-between text-sm text-gray-500 mb-4'>
                                <span>Duration: {calculateCourseDuration(course)}</span>
                                <span>{course.courseContent?.length || 0} chapters</span>
                            </div>
                            <Link to={`/player/${course._id}`} className='block w-full bg-emerald-500 text-white text-center py-2 rounded-lg hover:bg-emerald-600 transition'>
                                Continue Learning
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyEnrollment
