import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import Footer from '../../components/student/Footer'
import DashboardCard from '../../components/student/DashboardCard'
import { useAuth } from '../../context/AuthContext.jsx'
import { apiService } from '../../services/api.js'

const MyDashboard = () => {
    const { enrolledCourses, calculateCourseDuration } = useContext(AppContext)
  const [active, setActive] = useState('courses')
    const { userId } = useAuth()
    const [progressByCourse, setProgressByCourse] = useState({})

    // Fetch per-course progress so status/percent reflect backend updates
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
                        let local = {}
                        try { local = JSON.parse(localStorage.getItem(localKey) || '{}') || {} } catch(e) { local = {} }
                        const localCompleted = local.completed || {}
                        const localPending = local.pending || {}

                        try {
                            const res = await apiService.progress.get(userId, c._id)
                            if (res?.success && res.progress) {
                                const p = res.progress
                                // normalize backend progress to an array of keys like 'chapterId_lectureId' when possible
                                let ids = []
                                if (Array.isArray(p.completedLectureIds)) ids = p.completedLectureIds
                                else if (p.completedByChapter) ids = Object.entries(p.completedByChapter).flatMap(([ch, arr]) => (Array.isArray(arr) ? arr.map(l => `${ch}_${l}`) : []))
                                // merge local completed/pending keys so UI reflects user's local actions
                                const merged = Array.from(new Set([...(ids || []), ...Object.keys(localCompleted || {}), ...Object.keys(localPending || {})]))
                                const total = c.courseContent?.reduce((sum, ch) => sum + (ch.chapterContent?.length || 0), 0) || 0
                                const progressObj = {
                                    completedLectureIds: merged,
                                    completedLectures: merged.length,
                                    totalLectures: total,
                                    progressPercentage: total > 0 ? (merged.length / total) * 100 : 0,
                                }
                                return [c._id, progressObj]
                            }
                        } catch (e) {
                            // ignore per-course errors
                        }

                        // fallback: use local storage if backend not available
                        const mergedLocal = Array.from(new Set([...(Object.keys(local.completed || {})), ...(Object.keys(local.pending || {}))]))
                        const totalLocal = c.courseContent?.reduce((sum, ch) => sum + (ch.chapterContent?.length || 0), 0) || 0
                        const fallbackProgress = {
                            completedLectureIds: mergedLocal,
                            completedLectures: mergedLocal.length,
                            totalLectures: totalLocal,
                            progressPercentage: totalLocal > 0 ? (mergedLocal.length / totalLocal) * 100 : 0,
                        }
                        return [c._id, fallbackProgress]
                    })
                )
                const map = Object.fromEntries(entries)
                setProgressByCourse(map)
            } catch (e) {
                setProgressByCourse({})
            }
        }
        fetchProgress()
    }, [userId, Array.isArray(enrolledCourses) ? enrolledCourses.map(c => c._id).join(',') : ''])

    // Listen for progress updates from Player (optimistic updates) and refresh that course's progress
    useEffect(() => {
        const handler = async (e) => {
            const updatedCourseId = e?.detail?.courseId
            if (!updatedCourseId || !userId) return
            try {
                const res = await apiService.progress.get(userId, updatedCourseId)
                if (res?.success) {
                    setProgressByCourse(prev => ({ ...prev, [updatedCourseId]: res.progress }))
                }
            } catch (err) {
                // ignore
            }
        }
        window.addEventListener('vt_progressUpdated', handler)
        return () => window.removeEventListener('vt_progressUpdated', handler)
    }, [userId])

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
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                    active === 'courses' 
                                        ? 'bg-emerald-500 text-white shadow-md' 
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <span className='text-lg'>📚</span>
                                <span>Courses</span>
                            </button>
                            <button
                                onClick={() => setActive('mentors')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                    active === 'mentors' 
                                        ? 'bg-emerald-500 text-white shadow-md' 
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <span className='text-lg'>👨‍🏫</span>
                                <span>My Mentors</span>
                            </button>
                            <button
                                onClick={() => setActive('others')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                    active === 'others' 
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
                        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                            <div className='px-6 py-4 border-b border-gray-200'>
                                <h2 className='text-xl font-semibold text-gray-900'>Enrolled Courses</h2>
                                <p className='text-sm text-gray-500 mt-1'>{enrolledCourses.length} course{enrolledCourses.length !== 1 ? 's' : ''} in progress</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className='min-w-full table-auto'>
                                    <thead className='bg-gray-50 border-b border-gray-200'>
                                        <tr>
                                            <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Course</th>
                                            <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Duration</th>
                                            <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Chapters</th>
                                            <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Progress</th>
                                            <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Status</th>
                                            <th className='px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-gray-200'>
                                        {(!enrolledCourses || enrolledCourses.length === 0) ? (
                                            <tr>
                                                <td className='px-4 py-8 text-center text-gray-500' colSpan={6}>
                                                        No courses added
                                                </td>
                                            </tr>
                                        ) : (
                                            enrolledCourses.map((course, index) => {
                                            const p = progressByCourse[course._id]
                                            // compute total from course content reliably
                                            const total = course.courseContent?.reduce((sum, ch) => sum + (ch.chapterContent?.length || 0), 0) || 0
                                            let completed = 0
                                            if (p) {
                                                if (Array.isArray(p.completedLectureIds)) completed = p.completedLectureIds.length
                                                else if (typeof p.completedLectures === 'number') completed = p.completedLectures
                                                else if (p.completedByChapter) completed = Object.values(p.completedByChapter).reduce((a, b) => a + (Array.isArray(b) ? b.length : 0), 0)
                                            }
                                            const percent = total > 0 ? (completed / total) * 100 : 0
                                            const status = Math.round(percent) === 100 ? 'Completed' : 'On Going'
                                            return (
                                                <tr key={index} className='hover:bg-gray-50 transition-colors'>
                                                    <td className='px-4 py-4'>
                                                        <div className='flex items-center gap-4'>
                                                            <img 
                                                                src={course.courseThumbnail || assets.course_1} 
                                                                alt={course.courseTitle}
                                                                className='w-16 h-16 rounded-lg object-cover border border-gray-200 shadow-sm' 
                                                            />
                                                            <div className='min-w-0 flex-1'>
                                                                <p className='text-sm font-semibold text-gray-900 truncate'>{course.courseTitle}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className='px-4 py-4 text-sm text-gray-700 whitespace-nowrap'>{calculateCourseDuration(course)}</td>
                                                    <td className='px-4 py-4 text-sm text-gray-700 whitespace-nowrap'>{course.courseContent?.length || 0}</td>
                                                    <td className='px-4 py-4 min-w-[180px]'>
                                                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                                            <div
                                                                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2.5 rounded-full transition-all duration-300"
                                                                style={{ width: `${percent}%` }}
                                                            ></div>
                                                        </div>
                                                        <div className='flex items-center justify-between'>
                                                            <span className="text-xs text-gray-600 font-medium">{completed}/{total} Lectures</span>
                                                            <span className="text-xs text-emerald-600 font-semibold">{Math.round(percent)}%</span>
                                                        </div>
                                                    </td>
                                                    <td className='px-2 py-4 whitespace-nowrap'>
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                                            status === 'Completed' 
                                                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                                                : 'bg-amber-100 text-amber-700 border border-amber-200'
                                                        }`}>
                                                            {status === 'Completed' ? '✓' : '⏳'} {status}
                                                        </span>
                                                    </td>
                                                    <td className='px-2 py-4 text-center whitespace-nowrap'>
                                                        <Link
                                                            to={`/player/${course._id}`}
                                                            className='inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-emerald-600 hover:shadow-md transition-all duration-200'
                                                        >
                                                            Continue →
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        )}
                                    </tbody>
                                </table>
                            </div>
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
