import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import Footer from '../../components/student/Footer';
import axios from 'axios';
import PaymentModal from '../../components/payment/PaymentModal';

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [openChapters, setOpenChapters] = useState({});
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentMessage, setEnrollmentMessage] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const {
    allCourses,
    enrolledCourses,
    setEnrolledCourses,
    loading,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    currency = '$',
  } = useContext(AppContext);

  useEffect(() => {
    if (!courseData) {
      const course = allCourses.find((c) => c._id === id);
      setCourseData(course);
    }
  }, [allCourses, id, courseData]);

  if (loading) return <Loading />;
  if (!courseData) return <div className="text-center py-10 text-red-600">Course not found</div>;

  const rating = 4.2;
  const totalRatings = 189;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const toggleChapter = (index) => setOpenChapters((prev) => ({ ...prev, [index]: !prev[index] }));

  const discountedPrice = (
    courseData.coursePrice -
    (courseData.discount * courseData.coursePrice) / 100
  ).toFixed(2);

  const isEnrolled = enrolledCourses.some((course) => course._id === id);

  // Enrollment function for both free and paid courses
  const handleEnroll = async (paid = false) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setEnrollmentMessage('Please sign in to enroll in this course');
      navigate('/login');
      return;
    }

    if (!courseData) {
      setEnrollmentMessage('Course not found');
      return;
    }

    if (isEnrolled) {
      navigate(`/player/${id}`);
      return;
    }

    if (!courseData.isFree && courseData.coursePrice > 0 && !paid) {
      setShowPaymentModal(true);
      return;
    }

    setEnrolling(true);
    setEnrollmentMessage(
      courseData.isFree || paid ? 'Enrolling you in the course...' : 'Processing payment...'
    );

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/user/purchase-course`,
        {
          courseId: courseData._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setEnrollmentMessage('Successfully enrolled! Redirecting...');
        setEnrolledCourses((prev) => [...prev, courseData]);
        setTimeout(() => navigate(`/player/${id}`), 1500);
      } else {
        setEnrollmentMessage(response.data.message || 'Failed to enroll');
      }
    } catch (error) {
      setEnrollmentMessage(
        error.response?.data?.message || error.message || 'Failed to enroll'
      );
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-6 md:pt-30 pt-20 text-left mb-15 bg-gradient-to-b from-emerald-100">
        <div className="absolute top-0 left-0 w-full h-[500px] -z-10 bg-gradient-to-b from-emerald-100/70" />
        <div className="max-w-3xl z-10 text-gray-700 space-y-6 bg-white/50 rounded-xl p-6 shadow-md backdrop-blur-sm">
          <h1 className="text-4xl font-bold text-gray-800">{courseData.courseTitle}</h1>
          <p className="text-lg text-gray-700">
            {showFullDesc ? (
              <span dangerouslySetInnerHTML={{ __html: courseData.courseDescription }} />
            ) : (
              <span dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 270) }} />
            )}
            {courseData.courseDescription.length > 270 && (
              <button
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="text-emerald-600 underline ml-1"
              >
                {showFullDesc ? 'View Less' : 'View More'}
              </button>
            )}
          </p>
          <section className="pt-8">
            <h2 className="text-xl font-semibold mb-4">Course Structure</h2>
            <div className="space-y-4">
              {courseData.courseContent?.map((chapter, index) => (
                <div key={index} className="border border-gray-300 bg-white rounded-lg p-4 shadow-sm">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleChapter(index)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={assets.down_arrow_icon}
                        alt="arrow"
                        className={`w-5 h-5 transform transition-transform duration-200 ${openChapters[index] ? 'rotate-180' : ''}`}
                      />
                      <h3 className="font-medium text-gray-800">{chapter.chapterTitle}</h3>
                    </div>
                    <span className="text-sm text-gray-500">
                      {chapter.chapterContent.length} lectures • {calculateChapterTime(chapter)}
                    </span>
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
                                <span className="px-1.5 py-0.5 border border-emerald-500 text-emerald-500 rounded">
                                  Preview
                                </span>
                              )}
                              <span>
                                {humanizeDuration(lecture.lectureDuration * 60 * 1000, {
                                  units: ['h', 'm'],
                                  round: true,
                                })}
                              </span>
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
        <aside className="w-full md:w-[320px] bg-white/60 backdrop-blur-sm rounded-xl shadow-md p-6 z-10 space-y-4">
          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden relative">
            <img src={courseData.courseThumbnail} alt="Course Preview" className="object-cover w-full h-full" />
          </div>
          <p className="text-sm text-gray-600">
            {calculateNoOfLectures(courseData)} lectures • {calculateCourseDuration(courseData)}
          </p>
          {courseData.isFree || courseData.coursePrice === 0 ? (
            <p className="text-xl font-semibold text-green-700">FREE</p>
          ) : (
            <>
              <p className="text-sm text-gray-500 line-through">
                {currency}
                {courseData.coursePrice.toFixed(2)}
              </p>
              <p className="text-sm text-emerald-600 font-semibold">{courseData.discount}% OFF</p>
              <p className="text-xl font-semibold text-emerald-700">
                Price: {currency}
                {discountedPrice}
              </p>
            </>
          )}
          {enrollmentMessage && (
            <div
              className={`p-3 rounded-lg text-sm ${
                enrollmentMessage.toLowerCase().includes('success')
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {enrollmentMessage}
            </div>
          )}
          <button
            onClick={() => handleEnroll()}
            disabled={enrolling}
            className={`w-full py-2 rounded-lg font-semibold transition ${
              isEnrolled
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : courseData.isFree || courseData.coursePrice === 0
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            } ${enrolling ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isEnrolled
              ? 'Continue Learning'
              : courseData.isFree || courseData.coursePrice === 0
              ? 'Enroll for Free'
              : 'Pay & Enroll'}
          </button>
        </aside>
      </div>
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
          setEnrollmentMessage('Payment successful! Redirecting...');
          setEnrolledCourses((prev) =>
            prev.some((c) => c._id === courseData._id) ? prev : [...prev, courseData]
          );
          setTimeout(() => navigate(`/player/${id}`), 1200);
        }}
      />
      <Footer />
    </>
  );
}

export default CourseDetails;