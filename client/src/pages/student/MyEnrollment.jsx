import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import Footer from '../../components/student/Footer'
import { useNavigate } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'

const MyEnrollment = () => {
    const { enrolledCourses, calculateCourseDuration, darkMode, setDarkMode } = useContext(AppContext)
    const navigate = useNavigate();
    return (
        <>
            <div className='md:px-36 px-2 sm:px-8 pt-10 relative bg-calm-lightBg dark:bg-gray-800 text-calm-lightText dark:text-calm-darkText min-h-screen'>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className='absolute top-0 right-0 mt-2 mr-2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-yellow-300 shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition'
                    aria-label='Toggle dark mode'
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
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
                                        <img src={course.thumbnail || course.courseThumbnail} alt="" className='w-14 sm:w-20 rounded-md border border-gray-200 object-cover' />
                                        <div className='flex-1'>
                                            <p className='mb-1 text-base font-medium'>{course.courseTitle}</p>
                                            {/* Progress Bar */}
                                            {course.progress && (
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full"
                                                        style={{ width: `${(course.progress.completedLectures / course.progress.totalLectures) * 100}%` }}
                                                    ></div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>{calculateCourseDuration(course)}</td>
                                    <td className='px-6 py-4'>
                                        {course.progress ? `${course.progress.completedLectures}/${course.progress.totalLectures}` : '0/0'} <span className='text-xs text-gray-500'>Lectures</span>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <button
                                            className='inline-block bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm hover:bg-blue-600 transition'
                                            onClick={() => navigate(`/player/${course.id || course.courseId}`)}
                                        >
                                            On Going
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='mt-10'>
                <Footer />
            </div>
        </>
    )
}

export default MyEnrollment
