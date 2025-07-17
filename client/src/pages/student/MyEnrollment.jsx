import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import Footer from '../../components/Footer'

function MyEnrollment() {
    const { enrolledCourses, calculateCourseDuration } = useContext(AppContext)
    return (
        <div className='bg-gradient-to-b from-emerald-50 to-rose-50 min-h-screen flex flex-col'>
            <div className='md:px-36 px-2 sm:px-8 pt-10 flex-1'>
                <h1 className='text-3xl font-bold text-center mb-8'>My Enrolled Courses</h1>
                <div className='absolute top-0 right-0 mt-2 mr-2 p-2 rounded-full bg-gray-200 text-gray-800 shadow hover:bg-gray-300 transition'>
                    <span className='text-sm font-medium'>Total: {enrolledCourses.length}</span>
                </div>
                <div className="overflow-x-auto rounded-lg shadow mt-8">
                    <table className='min-w-full bg-white border border-gray-200 rounded-lg'>
                        <thead className='bg-gray-100'>
                                <tr>
                                    <th className='px-6 py-4 font-semibold text-left text-gray-700'>Course</th>
                                    <th className='px-6 py-4 font-semibold text-left text-gray-700'>Duration</th>
                                <th className='px-6 py-4 font-semibold text-left text-gray-700'>Chapters</th>
                                <th className='px-6 py-4 font-semibold text-left text-gray-700'>Progress</th>
                                    <th className='px-6 py-4 font-semibold text-left text-gray-700'>Status</th>
                                <th className='px-6 py-4 font-semibold text-left text-gray-700'>Action</th>
                                </tr>
                            </thead>
                            <tbody className='text-gray-700'>
                            {enrolledCourses.map((course, index) => {
                                const progress = course.progress || { completedLectures: 0, totalLectures: 0 };
                                const percent = progress.totalLectures > 0 ? (progress.completedLectures / progress.totalLectures) * 100 : 0;
                                const status = percent === 100 ? 'Completed' : 'On Going';
                                return (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100 transition'}>
                                        <td className='px-6 py-4 flex items-center gap-4'>
                                            <img src={course.courseThumbnail || assets.course_1} alt="" className='w-14 sm:w-20 rounded-md border border-gray-200 object-cover' />
                                            <div className='flex-1'>
                                                <p className='mb-1 text-base font-medium'>{course.courseTitle}</p>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>{calculateCourseDuration(course)}</td>
                                        <td className='px-6 py-4'>{course.courseContent?.length || 0}</td>
                                        <td className='px-6 py-4 min-w-[120px]'>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-emerald-500 h-2 rounded-full"
                                                    style={{ width: `${percent}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-gray-500 mt-1 inline-block">{progress.completedLectures}/{progress.totalLectures} Lectures</span>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{status}</span>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <Link
                                                to={`/player/${course._id}`}
                                                className='inline-block bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm hover:bg-emerald-600 transition'
                                            >
                                                Continue Learning
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default MyEnrollment
