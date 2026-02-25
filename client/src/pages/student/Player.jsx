import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { AppContext } from '../../context/AppContext.jsx'
import { apiService } from '../../services/api.js'
import humanizeDuration from 'humanize-duration'
import ReactPlayer from 'react-player'

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────
const CheckCircleIcon = () => (
  <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
)

const PlayCircleIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
  </svg>
)

const CircleIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
  </svg>
)

const ChevronDown = ({ open }) => (
  <svg className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const XIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
)

// ─────────────────────────────────────────────────────────────
// Progress helper — localStorage + API sync
// ─────────────────────────────────────────────────────────────
function getLocalProgressKey(userId, courseId) {
  return `vt_progress_${userId}_${courseId}`
}

function loadLocalProgress(userId, courseId) {
  try {
    const raw = localStorage.getItem(getLocalProgressKey(userId, courseId))
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveLocalProgress(userId, courseId, data) {
  try {
    localStorage.setItem(getLocalProgressKey(userId, courseId), JSON.stringify(data))
  } catch { /* storage full or private browsing */ }
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
const Player = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { userId, user, isAuthenticated } = useAuth()
  const { calculateChapterTime, calculateCourseDuration, enrolledCourses } = React.useContext(AppContext)

  // ─── state ─────────────────────────────────────────────────
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Currently selected lecture
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0)
  const [currentLectureIdx, setCurrentLectureIdx] = useState(0)

  // Accordion open state (chapter indexes)
  const [openChapters, setOpenChapters] = useState({})

  // Progress data keyed by "chapterId:lectureId" -> boolean
  const [completedMap, setCompletedMap] = useState({})
  const [markingComplete, setMarkingComplete] = useState(false)

  // Mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const playerRef = useRef(null)

  // ─── derived ───────────────────────────────────────────────
  const allLectures = useMemo(() => {
    if (!course?.courseContent) return []
    const list = []
    course.courseContent.forEach((ch, ci) => {
      (ch.chapterContent || []).forEach((lec, li) => {
        list.push({ ...lec, chapterIdx: ci, lectureIdx: li, chapterId: ch.chapterId || ch._id, chapterTitle: ch.chapterTitle })
      })
    })
    return list
  }, [course])

  const totalLectures = allLectures.length
  const completedCount = Object.values(completedMap).filter(Boolean).length
  const progressPercent = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0
  const isComplete = progressPercent === 100

  const currentLecture = useMemo(() => {
    if (!course?.courseContent?.[currentChapterIdx]?.chapterContent?.[currentLectureIdx]) return null
    const ch = course.courseContent[currentChapterIdx]
    const lec = ch.chapterContent[currentLectureIdx]
    return { ...lec, chapterId: ch.chapterId || ch._id, chapterTitle: ch.chapterTitle }
  }, [course, currentChapterIdx, currentLectureIdx])

  const currentLectureKey = currentLecture ? `${currentLecture.chapterId}:${currentLecture.lectureId || currentLecture._id}` : null

  // ─── fetch course ──────────────────────────────────────────
  useEffect(() => {
    if (!courseId) return
    const fetchCourse = async () => {
      setLoading(true)
      setError(null)
      try {
        // Try enrolled endpoint first, fall back to public
        let result
        if (isAuthenticated()) {
          try {
            result = await apiService.courses.getEnrolledById(courseId)
          } catch {
            result = await apiService.courses.getById(courseId)
          }
        } else {
          result = await apiService.courses.getById(courseId)
        }

        if (result.success && result.courseData) {
          setCourse(result.courseData)
          // Open first chapter by default
          setOpenChapters({ 0: true })
        } else {
          setError(result.message || 'Failed to load course')
        }
      } catch (err) {
        setError(err.message || 'Failed to load course')
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [courseId])

  // ─── fetch progress ────────────────────────────────────────
  useEffect(() => {
    if (!userId || !courseId || !course) return

    const fetchProgress = async () => {
      // Load from localStorage first for instant UI
      const local = loadLocalProgress(userId, courseId)
      if (local) setCompletedMap(local)

      // Then sync with backend
      try {
        const result = await apiService.progress.get(userId, courseId)
        if (result.success && result.progress) {
          const map = {}
            ; (result.progress.chapterProgress || []).forEach(cp => {
              (cp.completedLectures || []).forEach(lec => {
                if (lec.isCompleted) {
                  map[`${cp.chapterId}:${lec.lectureId}`] = true
                }
              })
            })
          setCompletedMap(map)
          saveLocalProgress(userId, courseId, map)
        }
      } catch {
        // Keep using localStorage data
      }
    }
    fetchProgress()
  }, [userId, courseId, course])

  // ─── mark complete ─────────────────────────────────────────
  const handleMarkComplete = useCallback(async () => {
    if (!currentLecture || !userId || markingComplete) return
    const key = currentLectureKey
    if (completedMap[key]) return // already done

    setMarkingComplete(true)
    // Optimistic update
    setCompletedMap(prev => {
      const next = { ...prev, [key]: true }
      saveLocalProgress(userId, courseId, next)
      return next
    })

    try {
      await apiService.progress.updateLecture(
        userId, courseId,
        currentLecture.chapterId,
        currentLecture.lectureId || currentLecture._id,
        { isCompleted: true }
      )
    } catch {
      // Revert on failure
      setCompletedMap(prev => {
        const next = { ...prev }
        delete next[key]
        saveLocalProgress(userId, courseId, next)
        return next
      })
    } finally {
      setMarkingComplete(false)
    }
  }, [currentLecture, currentLectureKey, userId, courseId, completedMap, markingComplete])

  // ─── navigate lectures ─────────────────────────────────────
  const goToLecture = useCallback((chIdx, lecIdx) => {
    setCurrentChapterIdx(chIdx)
    setCurrentLectureIdx(lecIdx)
    setOpenChapters(prev => ({ ...prev, [chIdx]: true }))
    setSidebarOpen(false) // close mobile sidebar
  }, [])

  const goToNextLecture = useCallback(() => {
    if (!course?.courseContent) return
    const ch = course.courseContent[currentChapterIdx]
    if (currentLectureIdx < (ch?.chapterContent?.length || 0) - 1) {
      goToLecture(currentChapterIdx, currentLectureIdx + 1)
    } else if (currentChapterIdx < course.courseContent.length - 1) {
      goToLecture(currentChapterIdx + 1, 0)
    }
  }, [course, currentChapterIdx, currentLectureIdx, goToLecture])

  const goToPrevLecture = useCallback(() => {
    if (currentLectureIdx > 0) {
      goToLecture(currentChapterIdx, currentLectureIdx - 1)
    } else if (currentChapterIdx > 0) {
      const prevCh = course.courseContent[currentChapterIdx - 1]
      goToLecture(currentChapterIdx - 1, (prevCh?.chapterContent?.length || 1) - 1)
    }
  }, [course, currentChapterIdx, currentLectureIdx, goToLecture])

  // Toggle chapter accordion
  const toggleChapter = (idx) => {
    setOpenChapters(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  // Video end handler — auto-mark + auto-advance
  const handleVideoEnd = () => {
    if (currentLectureKey && !completedMap[currentLectureKey]) {
      handleMarkComplete()
    }
    // Auto-advance after a brief delay
    setTimeout(() => goToNextLecture(), 800)
  }

  // ─── render helpers ────────────────────────────────────────
  const formatDuration = (mins) => {
    if (!mins) return '0 min'
    return humanizeDuration(mins * 60 * 1000, { units: ['h', 'm'], round: true })
  }

  // ─── loading / error states ────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Loading course...</p>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Course Not Found</h2>
          <p className="text-gray-500 mb-6">{error || 'This course is not available.'}</p>
          <Link to="/course-list" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium">
            <ArrowLeftIcon /> Browse Courses
          </Link>
        </div>
      </div>
    )
  }

  // Chapter completion stats
  const getChapterStats = (chapter) => {
    const total = chapter.chapterContent?.length || 0
    const done = (chapter.chapterContent || []).filter(lec => {
      const key = `${chapter.chapterId || chapter._id}:${lec.lectureId || lec._id}`
      return completedMap[key]
    }).length
    return { total, done }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ═══════════════ HEADER ═══════════════ */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-4 py-3 flex items-center gap-4">
          {/* Back button */}
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Go back">
            <ArrowLeftIcon />
          </button>

          {/* Course title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-sm md:text-base font-bold text-gray-900 truncate">{course.courseTitle}</h1>
            <p className="text-xs text-gray-500 hidden md:block">{course.educator?.name || 'Instructor'}</p>
          </div>

          {/* Progress pill */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700">{progressPercent}%</span>
            </div>
            {isComplete && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                🎓 Completed
              </span>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>

      {/* ═══════════════ MAIN LAYOUT ═══════════════ */}
      <div className="max-w-[1800px] mx-auto flex">
        {/* ─── SIDEBAR ─── */}
        <aside className={`
          fixed lg:sticky top-[57px] left-0 z-20 w-80 lg:w-[340px] h-[calc(100vh-57px)]
          bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Sidebar header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 z-10">
            <h2 className="font-bold text-gray-800 text-sm">Course Content</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {completedCount}/{totalLectures} lectures completed
            </p>
            {/* Mobile progress */}
            <div className="sm:hidden mt-2">
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-1">{progressPercent}% complete</p>
            </div>
          </div>

          {/* Chapter list */}
          <div className="divide-y divide-gray-100">
            {(course.courseContent || []).map((chapter, chIdx) => {
              const stats = getChapterStats(chapter)
              const isOpen = !!openChapters[chIdx]
              return (
                <div key={chapter._id || chIdx}>
                  {/* Chapter header */}
                  <button
                    onClick={() => toggleChapter(chIdx)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <ChevronDown open={isOpen} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{chapter.chapterTitle}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {stats.done}/{stats.total} • {calculateChapterTime(chapter)}
                      </p>
                    </div>
                    {stats.done === stats.total && stats.total > 0 && (
                      <CheckCircleIcon />
                    )}
                  </button>

                  {/* Lecture list */}
                  {isOpen && (
                    <div className="bg-gray-50/50">
                      {(chapter.chapterContent || []).map((lecture, lecIdx) => {
                        const lecKey = `${chapter.chapterId || chapter._id}:${lecture.lectureId || lecture._id}`
                        const isActive = currentChapterIdx === chIdx && currentLectureIdx === lecIdx
                        const isDone = !!completedMap[lecKey]
                        return (
                          <button
                            key={lecture._id || lecIdx}
                            onClick={() => goToLecture(chIdx, lecIdx)}
                            className={`w-full text-left px-4 py-2.5 pl-12 flex items-center gap-3 transition-colors text-sm
                              ${isActive ? 'bg-emerald-50 border-l-3 border-emerald-500' : 'hover:bg-gray-100'}
                            `}
                          >
                            {isDone ? <CheckCircleIcon /> : isActive ? <PlayCircleIcon className="w-5 h-5 text-emerald-600" /> : <CircleIcon />}
                            <div className="flex-1 min-w-0">
                              <p className={`truncate ${isActive ? 'text-emerald-700 font-medium' : isDone ? 'text-gray-500' : 'text-gray-700'}`}>
                                {lecture.lectureTitle}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">{formatDuration(lecture.lectureDuration)}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </aside>

        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/30 z-10 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ─── MAIN CONTENT ─── */}
        <main className="flex-1 min-w-0">
          {/* Video Player */}
          <div className="bg-black aspect-video w-full max-h-[70vh]">
            {currentLecture?.lectureUrl ? (
              <ReactPlayer
                ref={playerRef}
                url={currentLecture.lectureUrl}
                width="100%"
                height="100%"
                controls
                playing
                onEnded={handleVideoEnd}
                config={{
                  youtube: { playerVars: { modestbranding: 1, rel: 0 } },
                  file: { attributes: { controlsList: 'nodownload' } }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <PlayCircleIcon className="w-16 h-16 mx-auto mb-3 opacity-50" />
                  <p className="text-lg">No video available for this lecture</p>
                  <p className="text-sm mt-1">This lecture may only contain text content</p>
                </div>
              </div>
            )}
          </div>

          {/* Lecture Info */}
          <div className="p-4 md:p-6 lg:p-8 max-w-4xl">
            {/* Title + actions */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{currentLecture?.lectureTitle || 'Select a lecture'}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {currentLecture?.chapterTitle} • {formatDuration(currentLecture?.lectureDuration)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {currentLectureKey && completedMap[currentLectureKey] ? (
                  <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-semibold">
                    <CheckCircleIcon /> Completed
                  </span>
                ) : (
                  <button
                    onClick={handleMarkComplete}
                    disabled={markingComplete || !currentLecture}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {markingComplete ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Marking...
                      </>
                    ) : (
                      <>✓ Mark as Complete</>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Navigation - prev/next */}
            <div className="flex items-center justify-between py-4 border-t border-gray-200">
              <button
                onClick={goToPrevLecture}
                disabled={currentChapterIdx === 0 && currentLectureIdx === 0}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <span className="text-xs text-gray-400">
                Lecture {allLectures.findIndex(l => l.chapterIdx === currentChapterIdx && l.lectureIdx === currentLectureIdx) + 1} of {totalLectures}
              </span>

              <button
                onClick={goToNextLecture}
                disabled={currentChapterIdx === (course.courseContent?.length || 1) - 1 &&
                  currentLectureIdx === (course.courseContent?.[currentChapterIdx]?.chapterContent?.length || 1) - 1}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Lecture description */}
            {currentLecture?.lectureDescription && (
              <div className="mt-6 prose prose-gray max-w-none">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">About this lecture</h3>
                <p className="text-gray-600 leading-relaxed">{currentLecture.lectureDescription}</p>
              </div>
            )}

            {/* Course info section */}
            <div className="mt-8 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-4 mb-4">
                {course.courseThumbnail && (
                  <img src={course.courseThumbnail} alt="" className="w-16 h-16 rounded-xl object-cover" />
                )}
                <div>
                  <h3 className="font-bold text-gray-900">{course.courseTitle}</h3>
                  <p className="text-sm text-gray-600">{course.educator?.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-emerald-700">{totalLectures}</p>
                  <p className="text-xs text-gray-500">Lectures</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-700">{course.courseContent?.length || 0}</p>
                  <p className="text-xs text-gray-500">Chapters</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-700">{progressPercent}%</p>
                  <p className="text-xs text-gray-500">Complete</p>
                </div>
              </div>
            </div>

            {/* Completion banner */}
            {isComplete && (
              <div className="mt-6 p-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-white text-center">
                <div className="text-4xl mb-2">🎓</div>
                <h3 className="text-xl font-bold mb-1">Congratulations!</h3>
                <p className="text-emerald-100">You've completed this course. Well done!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Player
