import React, { useContext, useEffect, useState, useMemo } from 'react'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'
import Footer from '../../components/student/Footer'
import DashboardCard from '../../components/student/DashboardCard'
import { useAuth } from '../../context/AuthContext.jsx'
import { apiService } from '../../services/api.js'
import humanizeDuration from 'humanize-duration'

const MyDashboard = () => {
    const { enrolledCourses, calculateCourseDuration } = useContext(AppContext)
    const [active, setActive] = useState('courses')
    const { userId } = useAuth()
    const [progressByCourse, setProgressByCourse] = useState({})

    // Fetch per-course progress
    useEffect(() => {
        const fetchProgress = async () => {
            if (!userId || !enrolledCourses?.length) {
                setProgressByCourse({})
                return
            }
            try {
                const entries = await Promise.all(
                    enrolledCourses.map(async (c) => {
                        const localKey = `vt_progress_${userId}_${c._id}`
                        let localMap = {}
                        try { localMap = JSON.parse(localStorage.getItem(localKey) || '{}') || {} } catch { localMap = {} }
                        const total = c.courseContent?.reduce((sum, ch) => sum + (ch.chapterContent?.length || 0), 0) || 0

                        try {
                            const res = await apiService.progress.get(userId, c._id)
                            if (res?.success && res.progress) {
                                const p = res.progress
                                let completed = 0
                                if (Array.isArray(p.chapterProgress)) {
                                    p.chapterProgress.forEach(cp => {
                                        (cp.completedLectures || []).forEach(lec => {
                                            if (lec.isCompleted) completed++
                                        })
                                    })
                                } else if (typeof p.completedLectures === 'number') {
                                    completed = p.completedLectures
                                }
                                // Merge with local progress keys
                                const localCompleted = Object.values(localMap).filter(Boolean).length
                                completed = Math.max(completed, localCompleted)
                                return [c._id, { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 }]
                            }
                        } catch { /* backend down */ }

                        // Fallback to localStorage
                        const localCompleted = Object.values(localMap).filter(Boolean).length
                        return [c._id, { completed: localCompleted, total, percent: total > 0 ? Math.round((localCompleted / total) * 100) : 0 }]
                    })
                )
                setProgressByCourse(Object.fromEntries(entries))
            } catch {
                setProgressByCourse({})
            }
        }
        fetchProgress()
    }, [userId, Array.isArray(enrolledCourses) ? enrolledCourses.map(c => c._id).join(',') : ''])

    // Sort enrolled courses: ongoing first, completed last
    const sortedCourses = useMemo(() => {
        if (!enrolledCourses?.length) return []
        return [...enrolledCourses].sort((a, b) => {
            const pa = progressByCourse[a._id]?.percent || 0
            const pb = progressByCourse[b._id]?.percent || 0
            if (pa === 100 && pb !== 100) return 1
            if (pb === 100 && pa !== 100) return -1
            return pb - pa // higher progress first
        })
    }, [enrolledCourses, progressByCourse])

    const totalCompleted = sortedCourses.filter(c => (progressByCourse[c._id]?.percent || 0) === 100).length
    const totalOngoing = sortedCourses.length - totalCompleted

    return (
        <div className='bg-gradient-to-br from-slate-50 via-white to-slate-100 min-h-screen flex flex-col'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 flex-1'>
                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>My Dashboard</h1>
                    <p className='text-gray-600 text-sm'>Track your learning progress and explore opportunities</p>
                </div>

                <div className='flex flex-col lg:flex-row gap-6'>
                    {/* Sidebar / Tabs */}
                    <aside className='w-full lg:w-64 shrink-0'>
                        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-2 sticky top-4'>
                            <nav className='flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible'>
                                <button
                                    onClick={() => setActive('courses')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${active === 'courses'
                                        ? 'bg-emerald-500 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className='text-lg'>📚</span>
                                    <span>Courses</span>
                                    {enrolledCourses?.length > 0 && (
                                        <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${active === 'courses' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                                            }`}>{enrolledCourses.length}</span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActive('mentors')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${active === 'mentors'
                                        ? 'bg-emerald-500 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className='text-lg'>👨‍🏫</span>
                                    <span>My Mentors</span>
                                </button>
                                <button
                                    onClick={() => setActive('others')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${active === 'others'
                                        ? 'bg-emerald-500 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className='text-lg'>⚡</span>
                                    <span>Others</span>
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <section className='flex-1 min-w-0'>
                        {active === 'courses' && (
                            <div>
                                {/* Stats bar */}
                                <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6'>
                                    <div className='bg-white rounded-xl border border-gray-200 p-4 text-center'>
                                        <p className='text-2xl font-bold text-gray-900'>{sortedCourses.length}</p>
                                        <p className='text-xs text-gray-500 mt-1'>Total Enrolled</p>
                                    </div>
                                    <div className='bg-white rounded-xl border border-gray-200 p-4 text-center'>
                                        <p className='text-2xl font-bold text-amber-600'>{totalOngoing}</p>
                                        <p className='text-xs text-gray-500 mt-1'>In Progress</p>
                                    </div>
                                    <div className='bg-white rounded-xl border border-gray-200 p-4 text-center hidden sm:block'>
                                        <p className='text-2xl font-bold text-emerald-600'>{totalCompleted}</p>
                                        <p className='text-xs text-gray-500 mt-1'>Completed</p>
                                    </div>
                                </div>

                                {/* Course cards grid */}
                                {sortedCourses.length === 0 ? (
                                    <div className='bg-white rounded-xl border border-gray-200 p-12 text-center'>
                                        <div className='text-6xl mb-4'>📚</div>
                                        <h3 className='text-xl font-bold text-gray-800 mb-2'>No courses yet</h3>
                                        <p className='text-gray-500 mb-6'>Start your learning journey by enrolling in a course.</p>
                                        <Link
                                            to='/course-list'
                                            className='inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium'
                                        >
                                            Browse Courses →
                                        </Link>
                                    </div>
                                ) : (
                                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
                                        {sortedCourses.map((course) => {
                                            const p = progressByCourse[course._id] || { completed: 0, total: 0, percent: 0 }
                                            const isCompleted = p.percent === 100
                                            return (
                                                <div key={course._id} className='bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group'>
                                                    {/* Thumbnail */}
                                                    <div className='relative aspect-video overflow-hidden bg-gray-100'>
                                                        <img
                                                            src={course.courseThumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop'}
                                                            alt={course.courseTitle}
                                                            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                                        />
                                                        {/* Progress overlay */}
                                                        <div className='absolute bottom-0 left-0 right-0 h-1 bg-gray-200/80'>
                                                            <div
                                                                className='h-full bg-emerald-500 transition-all duration-500'
                                                                style={{ width: `${p.percent}%` }}
                                                            />
                                                        </div>
                                                        {/* Status badge */}
                                                        <div className='absolute top-3 right-3'>
                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm ${isCompleted
                                                                ? 'bg-emerald-500/90 text-white'
                                                                : 'bg-white/90 text-gray-700'
                                                                }`}>
                                                                {isCompleted ? '🎓 Completed' : `${p.percent}%`}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Content */}
                                                    <div className='p-4'>
                                                        <h3 className='font-bold text-gray-900 text-sm line-clamp-2 mb-2 min-h-[2.5rem]'>
                                                            {course.courseTitle}
                                                        </h3>

                                                        <p className='text-xs text-gray-500 mb-3'>
                                                            {course.educator?.name || 'Instructor'} • {calculateCourseDuration(course)}
                                                        </p>

                                                        {/* Progress bar */}
                                                        <div className='mb-3'>
                                                            <div className='w-full h-2 bg-gray-100 rounded-full overflow-hidden'>
                                                                <div
                                                                    className={`h-full rounded-full transition-all duration-500 ${isCompleted
                                                                        ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                                                                        : 'bg-gradient-to-r from-blue-400 to-blue-600'
                                                                        }`}
                                                                    style={{ width: `${p.percent}%` }}
                                                                />
                                                            </div>
                                                            <div className='flex justify-between mt-1'>
                                                                <span className='text-xs text-gray-500'>{p.completed}/{p.total} lectures</span>
                                                                <span className={`text-xs font-semibold ${isCompleted ? 'text-emerald-600' : 'text-blue-600'}`}>
                                                                    {p.percent}%
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Certificate unlock */}
                                                        {isCompleted && (
                                                            <div className='flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg mb-3'>
                                                                <span className='text-sm'>📜</span>
                                                                <span className='text-xs font-semibold text-amber-700'>Certificate Unlocked</span>
                                                            </div>
                                                        )}

                                                        {/* Action button */}
                                                        <Link
                                                            to={`/player/${course._id}`}
                                                            className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${isCompleted
                                                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-md'
                                                                }`}
                                                        >
                                                            {isCompleted ? '📖 Review Course' : '▶ Continue Learning'}
                                                        </Link>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {active === 'mentors' && (
                            <div>
                                <div className='mb-6'>
                                    <h2 className='text-2xl font-bold text-gray-900'>My Mentors</h2>
                                    <p className='text-sm text-gray-600 mt-1'>Connect with experienced professionals</p>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                                    <DashboardCard title="No Mentor Yet" subtitle="Find mentors who match your goals" actionLabel="Explore Mentors" to="/mentor">
                                        Connect with experienced industry mentors for guidance.
                                    </DashboardCard>
                                </div>
                            </div>
                        )}

                        {active === 'others' && (
                            <div>
                                <div className='mb-6'>
                                    <h2 className='text-2xl font-bold text-gray-900'>Additional Resources</h2>
                                    <p className='text-sm text-gray-600 mt-1'>Enhance your skills with extra tools</p>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                                    <DashboardCard title="Resume Review" subtitle="Improve your CV" actionLabel="View" to="/resumereview">
                                        Submit your resume and get expert feedback to stand out.
                                    </DashboardCard>
                                    <DashboardCard title="Test Series" subtitle="Practice and improve" actionLabel="View Tests" to="/testseries">
                                        Take timed tests to sharpen your problem-solving skills.
                                    </DashboardCard>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
            <div className="h-12" />
            <Footer />
        </div>
    )
}

export default MyDashboard
