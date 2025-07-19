import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import Footer from '../../components/student/Footer';
import { useAuth, SignInButton } from '@clerk/clerk-react';
import PaymentModal from '../../components/student/PaymentModal';
import AuthStatus from '../../components/student/AuthStatus';

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [courseData, setCourseData] = useState(null);
  const [openChapters, setOpenChapters] = useState({});
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentMessage, setEnrollmentMessage] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const {
    allCourses,
    enrolledCourses,
    loading,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    enrollInCourse,
    currency = '$'
  } = useContext(AppContext);

  useEffect(() => {
    const course = allCourses.find(c => c._id === id);
    setCourseData(course);
  }, [allCourses, id]);

  if (loading) return <Loading />;
  if (!courseData) return <Loading />;

  const rating = 4.2;
  const totalRatings = 189;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const toggleChapter = index => setOpenChapters(prev => ({ ...prev, [index]: !prev[index] }));

  const discountedPrice = (courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2);

  // Check if user is already enrolled
  const isEnrolled = enrolledCourses.some(course => course._id === id);

  const handleEnroll = async () => {
    if (!userId) {
      setEnrollmentMessage('Please sign in to enroll in this course');
      return;
    }

    if (isEnrolled) {
      navigate(`/player/${id}`);
      return;
    }

    // Show payment modal instead of direct enrollment
    setShowPaymentModal(true);
  };

  const handleSignIn = () => {
    // This will be handled by the SignInButton component
  };

  const handlePaymentSuccess = () => {
    setEnrollmentMessage('Successfully enrolled! Redirecting to course...');
    setTimeout(() => {
      navigate(`/player/${id}`);
    }, 1500);
  };

  return (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-6 md:pt-30 pt-20 text-left mb-15 bg-gradient-to-b from-emerald-100">
        <div className="absolute top-0 left-0 w-full h-[500px] -z-10 bg-gradient-to-b from-emerald-100/70" />

        {/* Main Content */}
        <div className="max-w-3xl z-10 text-gray-700 space-y-6 bg-white/50 rounded-xl p-6 shadow-md backdrop-blur-sm">
          <h1 className="text-4xl font-bold text-gray-800">{courseData.courseTitle}</h1>
          <p className="text-lg text-gray-700">
            {showFullDesc
              ? <span dangerouslySetInnerHTML={{ __html: courseData.courseDescription }} />
              : <span dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 270) }} />
            }
            {courseData.courseDescription.length > 270 && (
              <button onClick={() => setShowFullDesc(!showFullDesc)} className="text-emerald-600 underline ml-1">
                {showFullDesc ? 'View Less' : 'View More'}
              </button>
            )}
          </p>

          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <span className="text-red-600 font-semibold">{rating.toFixed(1)}</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={i < fullStars ? assets.star : i === fullStars && hasHalfStar ? assets.star_half : assets.star_blank}
                  alt=""
                  className="w-4 h-4"
                />
              ))}
            </div>
            <span className="text-emerald-500">({totalRatings})</span>
            <span>{courseData.enrolledStudents?.length || 0} {(courseData.enrolledStudents?.length || 0) > 1 ? 'students' : 'student'}</span>
          </div>

          <p className="text-sm text-gray-600">
            Course By <span className="text-emerald-600 underline font-medium">VidyaTrack</span>
          </p>

          {/* Course Structure */}
          <section className="pt-8">
            <h2 className="text-xl font-semibold mb-4">Course Structure</h2>
            <div className="space-y-4">
              {courseData.courseContent?.map((chapter, index) => (
                <div key={index} className="border border-gray-300 bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleChapter(index)}>
                    <div className="flex items-center gap-3">
                      <img
                        src={assets.down_arrow_icon}
                        alt="arrow"
                        className={`w-5 h-5 transform transition-transform duration-200 ${openChapters[index] ? 'rotate-180' : ''}`}
                      />
                      <h3 className="font-medium text-gray-800">{chapter.chapterTitle}</h3>
                    </div>
                    <span className="text-sm text-gray-500">{chapter.chapterContent.length} lectures • {calculateChapterTime(chapter)}</span>
                  </div>
                  {openChapters[index] && (
                    <ul className="mt-3 space-y-2">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                          <img src={assets.play_icon} alt="play" className="w-4 h-4" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">{lecture.lectureTitle}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              {lecture.isPreviewFree && (
                                <span className="px-1.5 py-0.5 border border-emerald-500 text-emerald-500 rounded">Preview</span>
                              )}
                              <span>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'], round: true })}</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="w-full md:w-[320px] bg-white/60 backdrop-blur-sm rounded-xl shadow-md p-6 z-10 space-y-4">
          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden relative">
            <img src={courseData.courseThumbnail} alt="Course Preview" className="object-cover w-full h-full" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/70 rounded px-3 py-1 text-sm font-semibold text-gray-700">
              <img src={assets.time_left_clock_icon} alt="" className="w-5 h-5" />
              <p><span>5 days</span> left at this price!</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">{calculateNoOfLectures(courseData)} lectures • {calculateCourseDuration(courseData)}</p>

          <p className="text-sm text-gray-500 line-through">{currency}{courseData.coursePrice.toFixed(2)}</p>
          <p className="text-sm text-emerald-600 font-semibold">{courseData.discount}% OFF</p>
          <p className="text-xl font-semibold text-emerald-700">Price: {currency}{discountedPrice}</p>

          {enrollmentMessage && (
            <div className={`p-3 rounded-lg text-sm ${
              enrollmentMessage.includes('Successfully') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {enrollmentMessage}
            </div>
          )}

          {!userId ? (
            <SignInButton mode="modal">
              <button className="w-full py-2 rounded-lg font-semibold transition bg-emerald-500 hover:bg-emerald-600 text-white">
                Sign In to Enroll
              </button>
            </SignInButton>
          ) : (
            <button 
              onClick={handleEnroll}
              disabled={enrolling}
              className={`w-full py-2 rounded-lg font-semibold transition ${
                isEnrolled 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              } ${enrolling ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isEnrolled ? 'Continue Learning' : 'Enroll Now'}
            </button>
          )}
        </aside>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        course={courseData}
        onSuccess={handlePaymentSuccess}
      />

      <Footer />
      <AuthStatus />
    </>
  );
}

export default CourseDetails;
