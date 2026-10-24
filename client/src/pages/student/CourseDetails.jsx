import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { SkeletonCourseDetail } from '../../components/skeleton/Skeleton';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import Footer from '../../components/student/Footer';
import { apiService } from '../../services/api';
import PaymentModal from '../../components/payment/PaymentModal';

/* ── Icons ── */
const ChevronDown = ({ open }) => (
  <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
const PlayCircle = () => (
  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/>
  </svg>
);
const CheckCircle = () => (
  <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);
const ClockIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const UsersIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const StarIcon = ({ filled }) => (
  <svg className={`w-3.5 h-3.5 ${filled ? 'text-amber-400' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
  </svg>
);
const CheckSmall = () => (
  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
  </svg>
);
const BookIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const CertIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);
const MobileIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [openChapters, setOpenChapters] = useState({ 0: true }); // first open by default
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
    // First try to find in already-loaded courses
    const cached = allCourses.find((c) => c._id === id);
    if (cached && cached.courseContent?.length > 0) {
      setCourseData(cached);
    } else {
      // Fetch full course detail from API (includes courseContent)
      apiService.courses.getById(id)
        .then(result => {
          if (result.success && result.course) {
            setCourseData(result.course);
          } else if (result.course) {
            setCourseData(result.course);
          } else if (cached) {
            setCourseData(cached);
          }
        })
        .catch(() => {
          if (cached) setCourseData(cached);
        });
    }
  }, [allCourses, id]);

  /* ── Computed ── */
  const ratings = courseData?.courseRatings || [];
  const rating = useMemo(() => {
    if (!ratings.length) return 0;
    return ratings.reduce((s, r) => s + r.rating, 0) / ratings.length;
  }, [ratings]);
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const studentCount = courseData?.enrolledStudent?.length ?? courseData?.enrolledStudents?.length ?? 0;
  const totalLectures = courseData ? calculateNoOfLectures(courseData) : 0;
  const totalDuration = courseData ? calculateCourseDuration(courseData) : '0 min';
  const totalChapters = courseData?.courseContent?.length ?? 0;
  const coursePrice = courseData?.coursePrice ?? 0;
  const discount = courseData?.discount ?? 0;
  const isFree = courseData?.isFree || coursePrice === 0;
  const discountedPrice = isFree ? 0 : (coursePrice - (discount * coursePrice) / 100).toFixed(2);
  const isEnrolled = enrolledCourses.some((c) => c._id === id);

  const toggleChapter = (i) => setOpenChapters((p) => ({ ...p, [i]: !p[i] }));
  const toggleAll = () => {
    if (allExpanded) { setOpenChapters({}); }
    else { const a = {}; courseData?.courseContent?.forEach((_, i) => { a[i] = true; }); setOpenChapters(a); }
    setAllExpanded(!allExpanded);
  };

  /* ── What you'll learn ── */
  const learningPoints = useMemo(() => {
    if (!courseData) return [];
    const pts = (courseData.courseContent || []).slice(0, 6).map(c => c.chapterTitle).filter(Boolean);
    if (pts.length >= 3) return pts;
    return [
      'Build portfolio-grade projects from scratch',
      'Crack interviews with structured practice',
      'Learn with mentor-reviewed assignments',
      'Earn a shareable completion certificate',
    ];
  }, [courseData]);

  /* ── Enroll ── */
  const handleEnroll = async (paid = false) => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    if (!courseData) return;
    if (isEnrolled) { navigate(`/player/${id}`); return; }
    if (!isFree && coursePrice > 0 && !paid) { setShowPaymentModal(true); return; }
    setEnrolling(true);
    try {
      const result = await apiService.user.purchaseCourse({ courseId: courseData._id });
      if (result.success) {
        setEnrollmentMessage('Successfully enrolled!');
        setEnrolledCourses(prev => prev.some(c => c._id === courseData._id) ? prev : [...prev, courseData]);
        setTimeout(() => setEnrollmentMessage(''), 4000);
      } else {
        setEnrollmentMessage(result.message || 'Failed to enroll');
      }
    } catch (err) {
      setEnrollmentMessage(err.response?.data?.message || err.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <SkeletonCourseDetail />;
  if (!courseData) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500">Course not found</p>
      <Link to="/course-list" className="text-emerald-600 hover:underline text-sm">← Browse all courses</Link>
    </div>
  );

  const thumbSrc = courseData.courseThumbnail || assets.default_thumbnail;

  /* ── Category badge color ── */
  const catColor =
    courseData.category?.toLowerCase().includes('web') ? 'bg-blue-500' :
    courseData.category?.toLowerCase().includes('machine') ? 'bg-cyan-500' :
    courseData.category?.toLowerCase().includes('python') || courseData.category?.toLowerCase().includes('program') ? 'bg-emerald-600' :
    'bg-gray-600';

  return (
    <>
      {/* ══════════════════════════════════════════
          ENTIRE PAGE WRAPPER — dark green bg
          ══════════════════════════════════════════ */}
      <div className="min-h-screen bg-[#f0f2f0]">

        {/* ── Back link ── */}
        <div className="max-w-7xl mx-auto px-5 sm:px-10 md:px-14 lg:px-20 pt-5">
          <Link
            to="/course-list"
            className="inline-flex items-center gap-1.5 text-gray-500 hover:text-emerald-600 text-sm transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            All Courses
          </Link>
        </div>

        {/* ── Two-column layout ── */}
        <div className="max-w-7xl mx-auto px-5 sm:px-10 md:px-14 lg:px-20 py-6 lg:flex lg:gap-8 lg:items-start">

          {/* ══════════ LEFT ══════════ */}
          <div className="flex-1 min-w-0">

            {/* Category + badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {courseData.category && (
                <span className={`${catColor} text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded`}>
                  {courseData.category}
                </span>
              )}
              {courseData.isNew && (
                <span className="bg-emerald-400 text-[#042d1e] text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded">New</span>
              )}
              {courseData.isLive && (
                <span className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded">Live</span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              {courseData.courseTitle}
            </h1>

            {/* Rating + meta row */}
            <div className="flex flex-wrap items-center gap-4 text-sm mb-2">
              {rating > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500 font-bold">{rating.toFixed(1)}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < fullStars || (i === fullStars && hasHalf)} />)}
                  </div>
                </div>
              )}
              {studentCount > 0 && (
                <span className="flex items-center gap-1.5 text-gray-500"><UsersIcon />{studentCount} enrolled</span>
              )}
              <span className="flex items-center gap-1.5 text-gray-500"><ClockIcon />Self-paced</span>
            </div>

            {/* Instructor */}
            <p className="text-gray-500 text-sm mb-6">
              by <span className="text-emerald-600 font-medium">{courseData.educator?.name || 'aditya'}</span>
            </p>

            {/* ── What you'll learn ── */}
            <div className="mb-7">
              <h2 className="text-gray-900 text-lg font-bold mb-4">What you'll learn</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {learningPoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3">
                    <CheckSmall />
                    <span className="text-gray-600 text-sm leading-relaxed">{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Curriculum ── */}
            <div className="mb-6">
              <h2 className="text-gray-900 text-lg font-bold mb-4">Curriculum</h2>
              <div className="space-y-2">
                {courseData.courseContent?.map((chapter, index) => {
                  const lectureCount = chapter.chapterContent?.length ?? 0;
                  const chapterTime  = calculateChapterTime(chapter);
                  const isOpen       = !!openChapters[index];

                  return (
                    <div
                      key={index}
                      className={`rounded-xl border ${isOpen ? 'border-emerald-300 bg-emerald-50/60' : 'border-gray-200 bg-white'} overflow-hidden`}
                    >
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-emerald-50/40 transition"
                        onClick={() => toggleChapter(index)}
                      >
                        <span className="text-emerald-600 text-xs font-bold w-6 shrink-0 text-center">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="flex-1 text-gray-800 text-sm font-semibold">{chapter.chapterTitle}</span>
                        <span className="text-gray-400 text-xs mr-2 shrink-0">{lectureCount} lessons · {chapterTime}</span>
                        <ChevronDown open={isOpen} />
                      </button>

                      {isOpen && (
                        <div className="border-t border-gray-100 px-4 py-2 space-y-1">
                          {chapter.chapterContent?.map((lec, i) => (
                            <div key={i} className="flex items-center gap-3 py-2">
                              <PlayCircle />
                              <span className="flex-1 text-gray-600 text-sm">{lec.lectureTitle}</span>
                              {lec.isPreviewFree && (
                                <span className="text-[10px] text-emerald-600 font-semibold border border-emerald-300 rounded px-2 py-0.5">Preview</span>
                              )}
                              {lec.lectureDuration > 0 && (
                                <span className="text-xs text-gray-400 shrink-0">
                                  {humanizeDuration(lec.lectureDuration * 60 * 1000, { units: ['h', 'm'], round: true })}
                                </span>
                              )}
                            </div>
                          ))}
                          <p className="text-gray-400 text-xs py-1 pb-2">
                            {lectureCount} lessons · {chapterTime} total
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {(!courseData.courseContent || courseData.courseContent.length === 0) && (
                <p className="text-gray-400 text-sm py-4">No curriculum available yet.</p>
              )}
              {totalChapters > 3 && (
                <button onClick={toggleAll} className="mt-3 text-emerald-600 text-sm font-semibold hover:text-emerald-700 transition">
                  {allExpanded ? '− Collapse all sections' : `+ Show all ${totalChapters} sections`}
                </button>
              )}
            </div>

            {/* ── Description ── */}
            <div className="mb-6">
              <h2 className="text-gray-900 text-lg font-bold mb-3">Description</h2>
              <div className={`relative ${!showFullDesc ? 'max-h-40 overflow-hidden' : ''}`}>
                <div
                  className="text-gray-600 text-sm leading-relaxed [&_h1]:text-gray-900 [&_h2]:text-gray-900 [&_h3]:text-gray-900 [&_strong]:text-gray-800 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_p]:mb-2"
                  dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
                />
                {!showFullDesc && courseData.courseDescription?.length > 300 && (
                  <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#f0f2f0] to-transparent" />
                )}
              </div>
              {courseData.courseDescription?.length > 300 && (
                <button onClick={() => setShowFullDesc(!showFullDesc)} className="mt-2 text-emerald-600 text-sm font-semibold hover:text-emerald-700 transition">
                  {showFullDesc ? 'Show less ↑' : 'Show more ↓'}
                </button>
              )}
            </div>
          </div>

          {/* ══════════ RIGHT SIDEBAR ══════════ */}
          <aside className="w-full lg:w-[300px] shrink-0 mt-8 lg:mt-0">
            <div className="sticky top-24">
              <div className="bg-[#0d3d28] border border-[#1a4030] rounded-2xl overflow-hidden shadow-2xl">

                {/* Thumbnail */}
                <div className="aspect-video overflow-hidden">
                  <img
                    src={thumbSrc}
                    alt={courseData.courseTitle}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = assets.default_thumbnail; }}
                  />
                </div>

                <div className="p-5 space-y-4">
                  {/* Price */}
                  {isFree ? (
                    <p className="text-2xl font-extrabold text-white">Free</p>
                  ) : (
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-extrabold text-white">{currency}{discountedPrice}</span>
                      {discount > 0 && (
                        <>
                          <span className="text-sm text-gray-500 line-through">{currency}{coursePrice.toFixed(2)}</span>
                          <span className="text-xs font-bold text-emerald-400">{discount}% off</span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Message */}
                  {enrollmentMessage && (
                    <div className={`p-3 rounded-lg text-xs font-medium ${enrollmentMessage.toLowerCase().includes('success') ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700' : 'bg-red-900/40 text-red-300 border border-red-700'}`}>
                      {enrollmentMessage}
                    </div>
                  )}

                  {/* Enroll button */}
                  <button
                    onClick={() => handleEnroll()}
                    disabled={enrolling}
                    className={`w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      isEnrolled
                        ? 'bg-white text-[#042d1e] hover:bg-gray-100'
                        : 'bg-emerald-400 hover:bg-emerald-300 text-[#042d1e]'
                    } ${enrolling ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {enrolling
                      ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Enrolling...</>
                      : isEnrolled ? '▶  Continue Learning'
                      : isFree ? <> Enroll Now  →</>
                      : 'Pay & Enroll'
                    }
                  </button>

                  {/* Includes list */}
                  <ul className="space-y-2.5 pt-1">
                    {[
                      { icon: <CheckSmall />, text: 'Full lifetime access' },
                      { icon: <CheckSmall />, text: 'Mentor-reviewed assignments' },
                      { icon: <CheckSmall />, text: 'Certificate of completion' },
                      { icon: <CheckSmall />, text: 'Access on mobile & desktop' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-gray-300 text-sm">
                        {item.icon}
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Mobile floating bar ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0d3d28] border-t border-[#1a4030] z-50 px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1">
            {isFree
              ? <span className="text-lg font-bold text-emerald-400">Free</span>
              : <span className="text-lg font-bold text-white">{currency}{discountedPrice}</span>}
          </div>
          <button
            onClick={() => handleEnroll()}
            disabled={enrolling}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${
              isEnrolled ? 'bg-white text-[#042d1e]' : 'bg-emerald-400 text-[#042d1e]'
            } ${enrolling ? 'opacity-50' : ''}`}
          >
            {isEnrolled ? '▶ Continue' : isFree ? 'Enroll Free' : 'Pay & Enroll'}
          </button>
        </div>
      </div>
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
          setEnrolledCourses(prev => prev.some(c => c._id === courseData._id) ? prev : [...prev, courseData]);
          setTimeout(() => setEnrollmentMessage(''), 4000);
        }}
      />

      <Footer />
    </>
  );
}

export default CourseDetails;
