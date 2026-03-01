import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { BookOpen, Users, RefreshCw, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'

function MyCourses() {
    const { educatorCourses, refreshEducatorCourses } = useContext(AppContext);
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        await refreshEducatorCourses();
        setTimeout(() => setRefreshing(false), 500);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">My Courses</h1>
                    <p className="text-sm text-slate-500 mt-0.5">{educatorCourses.length} course{educatorCourses.length !== 1 ? 's' : ''} published</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <Link
                        to="/educator/add-courses"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        New Course
                    </Link>
                </div>
            </div>

            {/* Empty state */}
            {educatorCourses.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 px-6 py-16 text-center">
                    <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-sm font-semibold text-slate-700 mb-1">No courses yet</h3>
                    <p className="text-xs text-slate-400 mb-4">Create your first course to start teaching</p>
                    <Link
                        to="/educator/add-courses"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Create Course
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {educatorCourses.map(course => (
                        <div key={course._id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow group">
                            <div className="aspect-video w-full overflow-hidden bg-slate-100">
                                <img
                                    src={course.courseThumbnail || assets.default_thumbnail}
                                    alt={course.courseTitle}
                                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                                />
                            </div>
                            <div className="p-4">
                                <h2 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug mb-2">
                                    {course.courseTitle}
                                </h2>
                                <p
                                    className="text-xs text-slate-400 line-clamp-2 mb-3"
                                    dangerouslySetInnerHTML={{
                                        __html: course.courseDescription?.slice(0, 100) + (course.courseDescription?.length > 100 ? '...' : '')
                                    }}
                                />
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <Users className="w-3.5 h-3.5" />
                                        <span>{course.enrolledStudents?.length || 0} enrolled</span>
                                    </div>
                                    {course.coursePrice > 0 && (
                                        <span className="text-xs font-semibold text-emerald-600">
                                            ${course.coursePrice}
                                        </span>
                                    )}
                                    {course.coursePrice === 0 && (
                                        <span className="text-xs font-semibold text-blue-600">
                                            Free
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyCourses
