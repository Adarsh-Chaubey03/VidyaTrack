import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { SkeletonCourseDetail } from '../../components/skeleton/Skeleton';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import Footer from '../../components/student/Footer';
import axios from 'axios';
import PaymentModal from '../../components/payment/PaymentModal';

/* ── Inline SVG Icons ── */
const ChevronDown = ({ open }) => (
  <svg className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);
const PlayIcon = () => (
  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
  </svg>
);
const CheckIcon = () => (
  <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const UsersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);
const BookIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);
const GlobeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);
const SignalIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);
const CertificateIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
  </svg>
);
const StarIcon = ({ filled }) => (
  <svg className={`w-4 h-4 ${filled ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [openChapters, setOpenChapters] = useState({});
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentMessage, setEnrollmentMessage] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [allExpanded, setAllExpanded] = useState(false);

  const {
    allCourses,
    enrolledCourses,
    setEnrolledCourses,
    loading,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    currency = '₹',
  } = useContext(AppContext);

  useEffect(() => {
    if (!courseData) {
      const course = allCourses.find((c) => c._id === id);
      setCourseData(course);
    }
  }, [allCourses, id, courseData]);

  /* ── Computed values ── */
  const ratings = courseData?.courseRatings || [];
  const rating = useMemo(() => {
    if (!ratings.length) return 0;
    return ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
  }, [ratings]);
  const totalRatings = ratings.length;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const studentCount = courseData?.enrolledStudent?.length ?? 0;

  const totalLectures = courseData ? calculateNoOfLectures(courseData) : 0;
  const totalDuration = courseData ? calculateCourseDuration(courseData) : '0 min';
  const totalChapters = courseData?.courseContent?.length ?? 0;

  const coursePrice = courseData?.coursePrice ?? 0;
  const discount = courseData?.discount ?? 0;
  const isFree = courseData?.isFree || coursePrice === 0;
  const discountedPrice = isFree ? 0 : (coursePrice - (discount * coursePrice) / 100).toFixed(2);
  const isEnrolled = enrolledCourses.some((course) => course._id === id);

  const toggleChapter = (index) => setOpenChapters((prev) => ({ ...prev, [index]: !prev[index] }));
  const toggleAllChapters = () => {
    if (allExpanded) {
      setOpenChapters({});
    } else {
      const all = {};
      courseData?.courseContent?.forEach((_, i) => { all[i] = true; });
      setOpenChapters(all);
    }
    setAllExpanded(!allExpanded);
  };

  /* ── Generate "What you'll learn" from description or chapters ── */
  const learningPoints = useMemo(() => {
    if (!courseData) return [];
    // Try to extract meaningful points from chapter titles
    const points = (courseData.courseContent || [])
      .slice(0, 6)
      .map((ch) => ch.chapterTitle)
      .filter(Boolean);
    if (points.length < 3) {
      // Fallback generic points based on category
      return [
        `Master core concepts of ${courseData.courseTitle?.split(' ').slice(0, 4).join(' ')}`,
        'Build real-world projects with hands-on exercises',
        'Learn industry best practices and modern techniques',
        'Get practical skills that employers are looking for',
      ];
    }
    return points;
  }, [courseData]);

  /* ── Enrollment handler ── */
  const handleEnroll = async (paid = false) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setEnrollmentMessage('Please sign in to enroll in this course');
      navigate('/login');
      return;
    }
    if (!courseData) { setEnrollmentMessage('Course not found'); return; }
    if (isEnrolled) { navigate(`/player/${id}`); return; }
    if (!isFree && coursePrice > 0 && !paid) { setShowPaymentModal(true); return; }

    setEnrolling(true);
    setEnrollmentMessage(isFree || paid ? 'Enrolling you in the course...' : 'Processing payment...');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/user/purchase-course`,
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setEnrollmentMessage('Successfully enrolled! You can now start learning.');
        setEnrolledCourses((prev) =>
          prev.some((c) => c._id === courseData._id) ? prev : [...prev, courseData]
        );
        // Auto-clear success message after 4s
        setTimeout(() => setEnrollmentMessage(''), 4000);
      } else {
        setEnrollmentMessage(response.data.message || 'Failed to enroll');
      }
    } catch (error) {
      setEnrollmentMessage(error.response?.data?.message || error.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <SkeletonCourseDetail />;
  if (!courseData) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <p className="text-lg text-gray-500">Course not found</p>
      <Link to="/course-list" className="text-emerald-600 hover:underline text-sm">← Browse all courses</Link>
    </div>
  );

  const thumbnailSrc = courseData.courseThumbnail || assets.default_thumbnail;

  return (
    <>
      {/* ════════════════════════════════════════════════════════════
          HERO BANNER — dark theme like Udemy
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="lg:max-w-[calc(100%-380px)]">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4 flex-wrap">
              <Link to="/" className="hover:text-emerald-400 transition">Home</Link>
              <span>›</span>
              <Link to="/course-list" className="hover:text-emerald-400 transition">Courses</Link>
              {courseData.category && courseData.category !== 'uncategorized' && (
                <>
                  <span>›</span>
                  <Link to={`/course-list?category=${encodeURIComponent(courseData.category)}`} className="hover:text-emerald-400 transition capitalize">
                    {courseData.category}
                  </Link>
                </>
              )}
            </nav>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4">
              {courseData.courseTitle}
            </h1>

            {/* Short description */}
            <p className="text-base sm:text-lg text-gray-300 mb-5 leading-relaxed line-clamp-3"
              dangerouslySetInnerHTML={{ __html: courseData.courseDescription?.slice(0, 200) + (courseData.courseDescription?.length > 200 ? '...' : '') }}
            />

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {/* Rating */}
              {rating > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-amber-400">{rating.toFixed(1)}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} filled={i < fullStars || (i === fullStars && hasHalfStar)} />
                    ))}
                  </div>
                  <span className="text-gray-400">({totalRatings.toLocaleString()} {totalRatings === 1 ? 'rating' : 'ratings'})</span>
                </div>
              )}

              {/* Students */}
              <div className="flex items-center gap-1.5 text-gray-400">
                <UsersIcon />
                <span>{studentCount.toLocaleString()} student{studentCount !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Instructor & meta badges */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm text-gray-300">
              <span className="flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {(courseData.educator?.name || 'V')[0].toUpperCase()}
                </span>
                Created by <span className="text-emerald-400 font-medium">{courseData.educator?.name || 'VidyaTrack'}</span>
              </span>
              {courseData.language && (
                <span className="flex items-center gap-1.5"><GlobeIcon /> {courseData.language}</span>
              )}
              {courseData.level && (
                <span className="flex items-center gap-1.5 capitalize"><SignalIcon /> {courseData.level}</span>
              )}
              {courseData.updatedAt && (
                <span className="flex items-center gap-1.5">
                  <ClockIcon />
                  Last updated {new Date(courseData.updatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {courseData.isBestseller && (
                <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">⭐ Bestseller</span>
              )}
              {courseData.isTrending && (
                <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-orange-500/20 text-orange-300 border border-orange-500/30">🔥 Trending</span>
              )}
              {courseData.isNew && (
                <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">✨ New</span>
              )}
              {isFree && (
                <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">🎓 Free Course</span>
              )}
            </div>

            {/* Mobile-only thumbnail */}
            <div className="mt-6 lg:hidden">
              <img src={thumbnailSrc} alt={courseData.courseTitle} className="w-full rounded-xl shadow-lg" onError={(e) => { e.target.onerror = null; e.target.src = assets.default_thumbnail; }} />
            </div>

            {/* Mobile CTA */}
            <div className="mt-5 lg:hidden space-y-3">
              {!isFree && (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-white">{currency}{discountedPrice}</span>
                  {discount > 0 && (
                    <>
                      <span className="text-base text-gray-500 line-through">{currency}{coursePrice.toFixed(2)}</span>
                      <span className="text-sm font-semibold text-emerald-400">{discount}% off</span>
                    </>
                  )}
                </div>
              )}
              {isFree && <span className="text-3xl font-bold text-emerald-400">FREE</span>}
              <button
                onClick={() => handleEnroll()}
                disabled={enrolling}
                className={`w-full py-3.5 rounded-xl text-base font-bold transition-all duration-200 ${isEnrolled
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.98]'
                  } ${enrolling ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isEnrolled ? '▶ Continue Learning' : isFree ? 'Enroll for Free' : 'Pay & Enroll'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          MAIN CONTENT + SIDEBAR
          ════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="lg:flex lg:gap-8">
          {/* ── Left column ── */}
          <div className="flex-1 min-w-0">

            {/* ─── What you'll learn ─── */}
            <section className="border border-gray-200 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">What you'll learn</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {learningPoints.map((point, i) => (
                  <div key={i} className="flex gap-3">
                    <CheckIcon />
                    <span className="text-sm text-gray-700 leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ─── Course highlights bar ─── */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { icon: <BookIcon />, label: `${totalLectures} lectures` },
                { icon: <ClockIcon />, label: totalDuration || '0 min' },
                { icon: <SignalIcon />, label: (courseData.level || 'All levels'), capitalize: true },
                { icon: <CertificateIcon />, label: 'Certificate' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-emerald-600">{item.icon}</span>
                  <span className={`text-sm text-gray-700 font-medium ${item.capitalize ? 'capitalize' : ''}`}>{item.label}</span>
                </div>
              ))}
            </section>

            {/* ─── Course Content Accordion ─── */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Course Content</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {totalChapters} section{totalChapters !== 1 ? 's' : ''} • {totalLectures} lecture{totalLectures !== 1 ? 's' : ''} • {totalDuration} total length
                  </p>
                </div>
                <button
                  onClick={toggleAllChapters}
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition hidden sm:block"
                >
                  {allExpanded ? 'Collapse all' : 'Expand all'}
                </button>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200">
                {courseData.courseContent?.map((chapter, index) => {
                  const lectureCount = chapter.chapterContent?.length ?? 0;
                  const chapterTime = calculateChapterTime(chapter);
                  const isOpen = !!openChapters[index];

                  return (
                    <div key={index} className="bg-white">
                      <button
                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition text-left"
                        onClick={() => toggleChapter(index)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <ChevronDown open={isOpen} />
                          <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                            {chapter.chapterTitle}
                          </h3>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap ml-4 shrink-0">
                          {lectureCount} lecture{lectureCount !== 1 ? 's' : ''} • {chapterTime}
                        </span>
                      </button>

                      {isOpen && (
                        <ul className="bg-gray-50/50">
                          {chapter.chapterContent?.map((lecture, i) => (
                            <li key={i} className="flex items-center gap-3 px-5 pl-14 py-3 border-t border-gray-100 hover:bg-gray-50/80 transition">
                              <PlayIcon />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-700 truncate">{lecture.lectureTitle}</p>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                {lecture.isPreviewFree && (
                                  <span className="text-xs font-medium text-emerald-600 underline cursor-pointer hover:text-emerald-700">
                                    Preview
                                  </span>
                                )}
                                <span className="text-xs text-gray-400">
                                  {lecture.lectureDuration > 0
                                    ? humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'], round: true })
                                    : ''}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ─── Description ─── */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <div className={`relative ${!showFullDesc ? 'max-h-52 overflow-hidden' : ''}`}>
                <div
                  className="max-w-none text-sm text-gray-700 leading-relaxed [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_li]:mb-1 [&_a]:text-emerald-600 [&_a]:underline [&_strong]:font-semibold [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded [&_blockquote]:border-l-4 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4 [&_blockquote]:italic"
                  dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
                />
                {!showFullDesc && courseData.courseDescription?.length > 400 && (
                  <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent" />
                )}
              </div>
              {courseData.courseDescription?.length > 400 && (
                <button
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="mt-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition"
                >
                  {showFullDesc ? 'Show less' : 'Show more'}
                  <svg className={`w-4 h-4 transition-transform ${showFullDesc ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </section>

            {/* ─── Tags ─── */}
            {courseData.tags?.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Topics</h2>
                <div className="flex flex-wrap gap-2">
                  {courseData.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* ─── Instructor ─── */}
            <section className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Instructor</h2>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-2xl font-bold text-white shrink-0 ring-2 ring-emerald-200">
                  {(courseData.educator?.name || 'V')[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{courseData.educator?.name || 'VidyaTrack Instructor'}</h3>
                  <p className="text-sm text-gray-500 mt-1">Course Educator at VidyaTrack</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><StarIcon filled /> {rating > 0 ? rating.toFixed(1) + ' Rating' : 'New Instructor'}</span>
                    <span className="flex items-center gap-1"><UsersIcon /> {studentCount} Students</span>
                    <span className="flex items-center gap-1"><BookIcon /> 1 Course</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ── Right Sidebar (desktop only) ── */}
          <aside className="hidden lg:block w-[360px] shrink-0 -mt-[320px] relative z-20">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Thumbnail */}
                <div className="aspect-video bg-gray-100 overflow-hidden relative group">
                  <img
                    src={thumbnailSrc}
                    alt={courseData.courseTitle}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = assets.default_thumbnail; }}
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="p-6 space-y-4">
                  {isFree ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-emerald-600">FREE</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-extrabold text-gray-900">{currency}{discountedPrice}</span>
                        {discount > 0 && (
                          <>
                            <span className="text-base text-gray-400 line-through">{currency}{coursePrice.toFixed(2)}</span>
                            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{discount}% off</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Enrollment status message */}
                  {enrollmentMessage && (
                    <div className={`p-3 rounded-lg text-sm font-medium ${enrollmentMessage.toLowerCase().includes('success') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                      {enrollmentMessage}
                    </div>
                  )}

                  {/* CTA Button */}
                  <button
                    onClick={() => handleEnroll()}
                    disabled={enrolling}
                    className={`w-full py-3.5 rounded-xl text-base font-bold transition-all duration-200 shadow-sm ${isEnrolled
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-emerald-200 hover:shadow-md active:scale-[0.98]'
                      } ${enrolling ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {enrolling ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Enrolling...
                      </span>
                    ) : isEnrolled ? '▶ Continue Learning' : isFree ? 'Enroll for Free' : 'Pay & Enroll'}
                  </button>

                  <p className="text-center text-xs text-gray-400">30-Day Money-Back Guarantee</p>

                  {/* Course includes */}
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">This course includes:</h4>
                    <ul className="space-y-2.5">
                      {[
                        { icon: <ClockIcon />, text: `${totalDuration} of content` },
                        { icon: <BookIcon />, text: `${totalLectures} lectures across ${totalChapters} sections` },
                        { icon: <GlobeIcon />, text: courseData.language || 'English' },
                        { icon: <SignalIcon />, text: `${(courseData.level || 'All levels')} level`, capitalize: true },
                        { icon: <CertificateIcon />, text: 'Certificate of completion' },
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                          <span className="text-gray-400">{item.icon}</span>
                          <span className={item.capitalize ? 'capitalize' : ''}>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Mobile floating bottom bar ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50 px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1">
            {isFree ? (
              <span className="text-lg font-bold text-emerald-600">FREE</span>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-gray-900">{currency}{discountedPrice}</span>
                {discount > 0 && <span className="text-xs text-gray-400 line-through">{currency}{coursePrice.toFixed(2)}</span>}
              </div>
            )}
          </div>
          <button
            onClick={() => handleEnroll()}
            disabled={enrolling}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition ${isEnrolled
                ? 'bg-gray-900 text-white'
                : 'bg-emerald-500 text-white active:scale-[0.97]'
              } ${enrolling ? 'opacity-50' : ''}`}
          >
            {isEnrolled ? '▶ Continue' : isFree ? 'Enroll Free' : 'Pay & Enroll'}
          </button>
        </div>
      </div>

      {/* Add bottom padding on mobile for floating bar */}
      <div className="h-20 lg:h-0" />

      {/* ── Payment Modal ── */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={Number(discountedPrice)}
        referenceId={courseData._id}
        referenceType="course"
        title={courseData.courseTitle}
        description={`${courseData.courseTitle} - VidyaTrack`}
        currency="INR"
        onSuccess={() => {
          setShowPaymentModal(false);
          setEnrollmentMessage('Payment successful! You are now enrolled.');
          setEnrolledCourses((prev) =>
            prev.some((c) => c._id === courseData._id) ? prev : [...prev, courseData]
          );
          // Auto-clear success message after 4s
          setTimeout(() => setEnrollmentMessage(''), 4000);
        }}
      />

      <Footer />
    </>
  );
}

export default CourseDetails;