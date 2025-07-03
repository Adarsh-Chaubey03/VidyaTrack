import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'

const MyEnrollment = () => {
    const { enrolledCourses, calculateCourseDuration } = useContext(AppContext)
    return (
        <>
            <div className='md:px-36 px-2 sm:px-8 pt-10'>
                <h1 className='text-2xl font-semibold mb-6'>My Enrollments</h1>
                <div className="overflow-x-auto rounded-lg shadow">
                    <table className='min-w-full bg-white bg-opacity-90 border border-gray-200 rounded-lg'>
                        <thead className='bg-gray-100 bg-opacity-90'>
                            <tr>
                                <th className='px-6 py-4 font-semibold text-left text-gray-700'>Course</th>
                                <th className='px-6 py-4 font-semibold text-left text-gray-700'>Duration</th>
                                <th className='px-6 py-4 font-semibold text-left text-gray-700'>Completed</th>
                                <th className='px-6 py-4 font-semibold text-left text-gray-700'>Status</th>
                            </tr>
                        </thead>
                        <tbody className='text-gray-700'>
                            {enrolledCourses.map((course, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white bg-opacity-90' : 'bg-gray-50 bg-opacity-90 hover:bg-gray-100 transition'}>
                                    <td className='px-6 py-4 flex items-center gap-4'>
                                        <img src={course.thumbnail} alt="" className='w-14 sm:w-20 rounded-md border border-gray-200 object-cover' />
                                        <div className='flex-1'>
                                            <p className='mb-1 text-base font-medium'>{course.courseTitle}</p>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>{calculateCourseDuration(course)}</td>
                                    <td className='px-6 py-4'>4/10 <span className='text-xs text-gray-500'>Lectures</span></td>
                                    <td className='px-6 py-4'>
                                        <span className='inline-block bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm'>On Going</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default MyEnrollment
