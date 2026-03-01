import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { AppContext } from '../../context/AppContext.jsx'
import { apiService } from '../../services/api.js'
import humanizeDuration from 'humanize-duration'
import { SkeletonPlayer } from '../../components/skeleton/Skeleton'

// ─────────────────────────────────────────────────────────────
// Icons (inline SVGs for zero-dep)
// ─────────────────────────────────────────────────────────────
const CheckCircleIcon = () => (
  <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
)
const PlayCircleIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
  </svg>
)
const CircleIcon = () => (
  <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
  </svg>
)
const LockIcon = () => (
  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
// YouTube IFrame Player API loader (singleton)
// ─────────────────────────────────────────────────────────────
let ytApiReady = false
let ytApiPromise = null

function loadYouTubeAPI() {
  if (ytApiReady) return Promise.resolve()
  if (ytApiPromise) return ytApiPromise

  ytApiPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      ytApiReady = true
      resolve()
      return
    }
    // Set callback before loading script
    const prevCallback = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      ytApiReady = true
      if (prevCallback) prevCallback()
      resolve()
    }
    // Load the IFrame API script
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }
  })
  return ytApiPromise
}

// ─────────────────────────────────────────────────────────────
// Utility: format helpers (pure, module-scoped)
// ─────────────────────────────────────────────────────────────
const formatDuration = (mins) => {
  if (!mins) return '0 min'
  return humanizeDuration(mins * 60 * 1000, { units: ['h', 'm'], round: true })
}

const formatTimestamp = (dateStr) => {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  } catch { return '' }
}

// ─────────────────────────────────────────────────────────────
// YouTube Player Component
// ─────────────────────────────────────────────────────────────
function YouTubePlayer({ videoId, onWatchProgress, onVideoEnd, onError }) {
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const pollRef = useRef(null)

  // Store callbacks in refs to avoid stale closures in YT Player events
  const onWatchProgressRef = useRef(onWatchProgress)
  const onVideoEndRef = useRef(onVideoEnd)
  const onErrorRef = useRef(onError)
  onWatchProgressRef.current = onWatchProgress
  onVideoEndRef.current = onVideoEnd
  onErrorRef.current = onError

  useEffect(() => {
    if (!videoId) return
    let cancelled = false

    async function init() {
      await loadYouTubeAPI()
      if (cancelled || !containerRef.current) return

      // Destroy previous player
      if (playerRef.current) {
        try { playerRef.current.destroy() } catch { }
        playerRef.current = null
      }
      // Clear poll
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 1,
          modestbranding: 1,
          rel: 0,
          fs: 1,
          cc_load_policy: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            // Start watch-time polling
            pollRef.current = setInterval(() => {
              if (!playerRef.current) return
              try {
                const current = playerRef.current.getCurrentTime()
                const total = playerRef.current.getDuration()
                if (total > 0 && onWatchProgressRef.current) {
                  onWatchProgressRef.current(current, total)
                }
              } catch { }
            }, 5000) // Every 5 seconds
          },
          onStateChange: (event) => {
            // YT.PlayerState.ENDED === 0
            if (event.data === 0 && onVideoEndRef.current) {
              onVideoEndRef.current()
            }
          },
          onError: (event) => {
            if (onErrorRef.current) onErrorRef.current(event.data)
          },
        },
      })
    }

    init()

    return () => {
      cancelled = true
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
      if (playerRef.current) {
        try { playerRef.current.destroy() } catch { }
        playerRef.current = null
      }
    }
  }, [videoId])

  return (
    <div className="w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// LocalStorage progress helpers
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
// Utility: get video source from lecture
// ─────────────────────────────────────────────────────────────
function getVideoSource(lecture) {
  if (lecture?.youtubeVideoId) return { type: 'youtube', id: lecture.youtubeVideoId }
  if (lecture?.lectureUrl) return { type: 'url', url: lecture.lectureUrl }
  return { type: 'none' }
}

// ─────────────────────────────────────────────────────────────
// Main Player Component
// ─────────────────────────────────────────────────────────────
const Player = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { userId, isAuthenticated } = useAuth()
  const { calculateChapterTime } = React.useContext(AppContext)

  // ─── state ─────────────────────────────────────────────────
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0)
  const [currentLectureIdx, setCurrentLectureIdx] = useState(0)
  const [openChapters, setOpenChapters] = useState({})
  const [completedMap, setCompletedMap] = useState({}) // "chapterId:lectureId" -> boolean
  const [completedTimestamps, setCompletedTimestamps] = useState({}) // "chapterId:lectureId" -> Date string
  const [markingComplete, setMarkingComplete] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [ytError, setYtError] = useState(false)
  const autoCompleteTriggeredRef = useRef(new Set()) // Track auto-completed lectures

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

  const currentLectureKey = currentLecture
    ? `${currentLecture.chapterId}:${currentLecture.lectureId || currentLecture._id}`
    : null

  const videoSource = useMemo(() => getVideoSource(currentLecture), [currentLecture])

  // ─── fetch course ──────────────────────────────────────────
  useEffect(() => {
    if (!courseId) return
    const fetchCourse = async () => {
      setLoading(true)
      setError(null)
      try {
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
      const local = loadLocalProgress(userId, courseId)
      if (local) setCompletedMap(local)
      try {
        const result = await apiService.progress.get(userId, courseId)
        if (result.success && result.progress) {
          const map = {}
          const timestamps = {}
            ; (result.progress.chapterProgress || []).forEach(cp => {
              (cp.completedLectures || []).forEach(lec => {
                if (lec.isCompleted) {
                  map[`${cp.chapterId}:${lec.lectureId}`] = true
                  if (lec.completedAt) timestamps[`${cp.chapterId}:${lec.lectureId}`] = lec.completedAt
                }
              })
            })
          setCompletedMap(map)
          setCompletedTimestamps(timestamps)
          saveLocalProgress(userId, courseId, map)
        }
      } catch { /* Keep using localStorage */ }
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
    setCompletedTimestamps(prev => ({ ...prev, [key]: new Date().toISOString() }))

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
      setCompletedTimestamps(prev => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    } finally {
      setMarkingComplete(false)
    }
  }, [currentLecture, currentLectureKey, userId, courseId, completedMap, markingComplete])

  // ─── YouTube 80% auto-completion ───────────────────────────
  const handleWatchProgress = useCallback((currentTime, totalDuration) => {
    if (!currentLectureKey || completedMap[currentLectureKey]) return
    if (autoCompleteTriggeredRef.current.has(currentLectureKey)) return

    const ratio = currentTime / totalDuration
    if (ratio >= 0.8) {
      autoCompleteTriggeredRef.current.add(currentLectureKey)
      handleMarkComplete()
    }
  }, [currentLectureKey, completedMap, handleMarkComplete])

  // ─── navigate lectures ─────────────────────────────────────
  const goToLecture = useCallback((chIdx, lecIdx) => {
    setCurrentChapterIdx(chIdx)
    setCurrentLectureIdx(lecIdx)
    setOpenChapters(prev => ({ ...prev, [chIdx]: true }))
    setSidebarOpen(false)
    setYtError(false)
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

  const toggleChapter = (idx) => setOpenChapters(prev => ({ ...prev, [idx]: !prev[idx] }))

  const handleVideoEnd = useCallback(() => {
    if (currentLectureKey && !completedMap[currentLectureKey]) {
      handleMarkComplete()
    }
    setTimeout(() => goToNextLecture(), 800)
  }, [currentLectureKey, completedMap, handleMarkComplete, goToNextLecture])

  // ─── loading / error ──────────────────────────────────────
  if (loading) {
    return <SkeletonPlayer />
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
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Go back">
            <ArrowLeftIcon />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm md:text-base font-bold text-gray-900 truncate">{course.courseTitle}</h1>
            <p className="text-xs text-gray-500 hidden md:block">{course.educator?.name || 'Instructor'}</p>
          </div>
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
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
          <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 z-10">
            <h2 className="font-bold text-gray-800 text-sm">Course Content</h2>
            <p className="text-xs text-gray-500 mt-0.5">{completedCount}/{totalLectures} lectures completed</p>
            <div className="sm:hidden mt-2">
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-1">{progressPercent}% complete</p>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {(course.courseContent || []).map((chapter, chIdx) => {
              const stats = getChapterStats(chapter)
              const isOpen = !!openChapters[chIdx]
              return (
                <div key={chapter.chapterId || chapter._id || chIdx}>
                  <button onClick={() => toggleChapter(chIdx)} className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3">
                    <ChevronDown open={isOpen} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{chapter.chapterTitle}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{stats.done}/{stats.total} • {calculateChapterTime(chapter)}</p>
                    </div>
                    {stats.done === stats.total && stats.total > 0 && <CheckCircleIcon />}
                  </button>

                  {isOpen && (
                    <div className="bg-gray-50/50">
                      {(chapter.chapterContent || []).map((lecture, lecIdx) => {
                        const lecKey = `${chapter.chapterId || chapter._id}:${lecture.lectureId || lecture._id}`
                        const isActive = currentChapterIdx === chIdx && currentLectureIdx === lecIdx
                        const isDone = !!completedMap[lecKey]
                        const timestamp = completedTimestamps[lecKey]
                        return (
                          <button
                            key={lecture.lectureId || lecture._id || lecIdx}
                            onClick={() => goToLecture(chIdx, lecIdx)}
                            className={`w-full text-left px-4 py-2.5 pl-12 flex items-center gap-3 transition-colors text-sm
                              ${isActive ? 'bg-emerald-50 border-l-[3px] border-emerald-500' : 'hover:bg-gray-100'}
                            `}
                          >
                            {isDone ? <CheckCircleIcon /> : isActive ? <PlayCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" /> : <CircleIcon />}
                            <div className="flex-1 min-w-0">
                              <p className={`truncate ${isActive ? 'text-emerald-700 font-medium' : isDone ? 'text-gray-500' : 'text-gray-700'}`}>
                                {lecture.lectureTitle}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-gray-400">{formatDuration(lecture.lectureDuration)}</span>
                                {isDone && timestamp && (
                                  <span className="text-[10px] text-emerald-500 font-medium">✓ {formatTimestamp(timestamp)}</span>
                                )}
                                {lecture.youtubeVideoId && (
                                  <span className="text-[10px] text-red-400 font-medium">▶ YT</span>
                                )}
                              </div>
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
          {/* Video Player Area */}
          <div className="bg-black aspect-video w-full max-h-[70vh] relative">
            {videoSource.type === 'youtube' ? (
              ytError ? (
                /* YouTube error fallback */
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center p-6">
                    <div className="text-5xl mb-4">⚠️</div>
                    <h3 className="text-lg font-bold mb-2">Video Unavailable</h3>
                    <p className="text-gray-300 text-sm mb-4">This YouTube video couldn't be loaded. It may be blocked or removed.</p>
                    <button
                      onClick={() => setYtError(false)}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : (
                <YouTubePlayer
                  videoId={videoSource.id}
                  onWatchProgress={handleWatchProgress}
                  onVideoEnd={handleVideoEnd}
                  onError={() => setYtError(true)}
                />
              )
            ) : videoSource.type === 'url' ? (
              <iframe
                src={videoSource.url}
                className="w-full h-full"
                title="Lecture Video"
                frameBorder="0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
                  {videoSource.type === 'youtube' && (
                    <span className="ml-2 text-xs text-red-500 font-medium">YouTube</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {currentLectureKey && completedMap[currentLectureKey] ? (
                  <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-semibold cursor-default">
                    <CheckCircleIcon /> Completed
                    {completedTimestamps[currentLectureKey] && (
                      <span className="text-xs text-emerald-500 ml-1">
                        {formatTimestamp(completedTimestamps[currentLectureKey])}
                      </span>
                    )}
                  </span>
                ) : (
                  <button
                    onClick={handleMarkComplete}
                    disabled={markingComplete || !currentLecture}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
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

            {/* Auto-completion hint */}
            {videoSource.type === 'youtube' && currentLectureKey && !completedMap[currentLectureKey] && (
              <div className="mb-4 px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700 flex items-center gap-2">
                <span>💡</span>
                <span>This lecture will be automatically marked as completed when you watch 80% of the video.</span>
              </div>
            )}

            {/* Prev / Next */}
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

            {/* Course info card */}
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

            {/* Completion banner + certificate unlock */}
            {isComplete && (
              <div className="mt-6 p-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-white text-center">
                <div className="text-4xl mb-2">🎓</div>
                <h3 className="text-xl font-bold mb-1">Congratulations!</h3>
                <p className="text-emerald-100 mb-3">You've completed this course. Well done!</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg text-sm font-medium">
                  <span>📜</span> Certificate Unlocked — Download Coming Soon
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Player
