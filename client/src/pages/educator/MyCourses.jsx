import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

function MyCourses() {
    const { educatorCourses, refreshEducatorCourses } = useContext(AppContext);
    return (
        <div className="w-full max-w-5xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Courses</h1>
                <button
                    onClick={refreshEducatorCourses}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {educatorCourses.map(course => (
                    <div key={course._id} className="bg-white rounded-xl shadow-md p-4 flex flex-col">
                        <img src={course.courseThumbnail || assets.course_1} alt={course.courseTitle} className="w-full h-40 object-cover rounded-lg mb-4" />
                        <h2 className="text-lg font-semibold mb-2 line-clamp-2">{course.courseTitle}</h2>
                        <p className="text-gray-500 text-sm mb-2 line-clamp-3" dangerouslySetInnerHTML={{__html: course.courseDescription.slice(0, 80) + (course.courseDescription.length > 80 ? '...' : '')}} />
                        <div className="flex items-center justify-between mt-auto pt-4">
                            <span className="text-emerald-600 font-semibold text-sm flex items-center gap-1">
                                <img src={assets.person_tick_icon} alt="enrolled" className="w-5 h-5" />
                                {course.enrolledStudents.length} Enrolled
                            </span>
                            <button className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold hover:bg-emerald-600 transition">View</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyCourses
