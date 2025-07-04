import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import ReactPlayer from 'react-player';
import Footer from '../../components/student/Footer';

// Mock data for similar courses
const similarCourses = [
  { id: 1, title: 'React Basics', img: assets.course_1 },
  { id: 2, title: 'Advanced JS', img: assets.course_2 },
  { id: 3, title: 'Node Mastery', img: assets.course_3 },
  { id: 4, title: 'UI/UX Design', img: assets.course_4 },
  { id: 5, title: 'Python Bootcamp', img: assets.course_1 },
  { id: 6, title: 'Data Structures', img: assets.course_2 },
];

function Player() {
  const { courseId } = useParams();
  const { enrolledCourses, calculateChapterTime } = useContext(AppContext);
  const [courseData, setCourseData] = useState(null);
  const [openChapters, setOpenChapters] = useState({});
  const [currentLecture, setCurrentLecture] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentLectureIndex, setCurrentLectureIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [expandedChapter, setExpandedChapter] = useState(null); // null or index

  useEffect(() => {
    getCourseData();
    // eslint-disable-next-line
  }, [courseId, enrolledCourses]);

  useEffect(() => {
    if (courseData && courseData.courseContent && courseData.courseContent.length > 0) {
      const firstChapter = courseData.courseContent[0];
      if (firstChapter.chapterContent && firstChapter.chapterContent.length > 0) {
        setCurrentLecture(firstChapter.chapterContent[0]);
        setCurrentChapter(0);
        setCurrentLectureIndex(0);
      }
    }
  }, [courseData]);

  const getCourseData = () => {
    setLoading(true);
    setError(null);
    if (!enrolledCourses || enrolledCourses.length === 0) {
      setError('No enrolled courses found');
      setLoading(false);
      return;
    }
    const course = enrolledCourses.find((course) => course._id === courseId);
    if (course) {
      setCourseData(course);
    } else {
      setError(`Course with ID ${courseId} not found`);
    }
    setLoading(false);
  };

  const toggleChapter = (index) => setOpenChapters((prev) => ({ ...prev, [index]: !prev[index] }));

  const handleLectureClick = (chapterIndex, lectureIndex, lecture) => {
    setCurrentLecture(lecture);
    setCurrentChapter(chapterIndex);
    setCurrentLectureIndex(lectureIndex);
  };

  // Use real similar courses (enrolledCourses except current)
  const similarCourses = (enrolledCourses || []).filter(c => c._id !== courseId);

  // Marquee should be in right column if a chapter is expanded or Read More is active
  const isMarqueeInRightColumn = showFullDescription || Object.values(openChapters).some(Boolean);

  // Marquee component
  const MarqueeRow = () => (
    <div className="w-full overflow-hidden bg-white shadow mt-4 rounded-xl">
      <div className="px-4 pt-3 pb-1">
        <h3 className="text-base font-semibold text-gray-700 mb-2">Similar Courses</h3>
      </div>
      <div className="flex items-center animate-marquee whitespace-nowrap py-2">
        {similarCourses.length === 0 ? (
          <span className="mx-4 text-gray-400 text-sm">No similar courses found.</span>
        ) : similarCourses.concat(similarCourses).map((course, idx) => (
          <Link
            key={idx}
            to={`/course/${course._id}`}
            className="flex flex-col items-center justify-center mx-8 mb-4 bg-white border border-gray-200 rounded-xl shadow-sm p-3 w-32 h-28 hover:shadow-md transition"
            style={{ textDecoration: 'none' }}
          >
            <img
              src={course.courseThumbnail || course.thumbnail || assets.course_1}
              alt={course.courseTitle + ' thumbnail'}
              className="w-20 h-20 rounded-lg object-cover mb-1"
              onError={e => { e.target.src = assets.course_1; }}
            />
            <span className="font-semibold text-gray-800 text-xs text-center w-full leading-tight line-clamp-2 break-words overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>{course.courseTitle}</span>
          </Link>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  if (!courseData) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row gap-6 md:gap-10 px-2 md:px-8 py-4 md:py-10 flex-1 items-stretch">
        {/* Left Column */}
        <aside className="w-full md:w-96 xl:w-[28rem] flex flex-col gap-6 bg-white rounded-2xl shadow-md p-4 md:p-6">
          {/* Course Info */}
          <div className="mb-2">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">{courseData.courseTitle}</h1>
            <div className="text-gray-600 text-sm mb-2" dangerouslySetInnerHTML={{ __html: showFullDescription ? courseData.courseDescription : courseData.courseDescription.slice(0, 120) + (courseData.courseDescription.length > 120 ? '...' : '') }} />
            {courseData.courseDescription.length > 120 && (
              <button
                className="text-emerald-600 text-xs underline mt-1"
                onClick={() => setShowFullDescription((prev) => !prev)}
              >
                {showFullDescription ? 'Show Less' : 'Read More'}
              </button>
            )}
          </div>
          {/* Achievements/Stats */}
          <div className="flex flex-wrap gap-4 mb-2">
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-emerald-600">{courseData.courseContent.length}</span>
              <span className="text-xs text-gray-500">Chapters</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-emerald-600">{courseData.courseContent.reduce((total, chapter) => total + chapter.chapterContent.length, 0)}</span>
              <span className="text-xs text-gray-500">Lectures</span>
            </div>
          </div>
          {/* Course Structure */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Course Structure</h2>
            <div className="space-y-3">
              {courseData.courseContent.map((chapter, chapterIndex) => (
                <div key={chapterIndex} className="border border-gray-200 bg-gray-50 rounded-lg">
                  <div
                    className="flex items-center justify-between px-3 py-2 cursor-pointer select-none"
                    onClick={() => toggleChapter(chapterIndex)}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={assets.down_arrow_icon}
                        alt="arrow"
                        className={`w-4 h-4 transform transition-transform duration-200 ${openChapters[chapterIndex] ? 'rotate-180' : ''}`}
                      />
                      <span className="font-medium text-gray-800 text-sm">{chapter.chapterTitle}</span>
                    </div>
                    <span className="text-xs text-gray-500">{chapter.chapterContent.length} lectures • {calculateChapterTime(chapter)}</span>
                  </div>
                  {openChapters[chapterIndex] && (
                    <ul className="mt-1 pb-2 space-y-1">
                      {chapter.chapterContent.map((lecture, lectureIndex) => (
                        <li
                          key={lectureIndex}
                          className={`flex items-center gap-2 px-6 py-1.5 rounded cursor-pointer transition-colors ${
                            currentChapter === chapterIndex && currentLectureIndex === lectureIndex
                              ? 'bg-emerald-100 border-l-4 border-emerald-500'
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => handleLectureClick(chapterIndex, lectureIndex, lecture)}
                        >
                          <img src={assets.play_icon} alt="play" className="w-4 h-4" />
                          <span className={`text-xs ${currentChapter === chapterIndex && currentLectureIndex === lectureIndex ? 'text-emerald-700 font-semibold' : 'text-gray-700'}`}>{lecture.lectureTitle}</span>
                          {lecture.isPreviewFree && (
                            <span className="ml-2 px-1.5 py-0.5 border border-emerald-500 text-emerald-500 rounded text-[10px]">Preview</span>
                          )}
                          <span className="ml-auto text-[10px] text-gray-400">{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['m'], round: true })}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Column */}
        <main className="flex-1 flex flex-col gap-6 relative">
          {/* Video Player */}
          <div className="bg-white rounded-2xl shadow-md p-0 md:p-4 flex flex-col md:flex-row gap-4 items-start">
            <div className="w-full aspect-video max-w-3xl rounded-xl overflow-hidden bg-black flex items-center justify-center">
              {currentLecture && currentLecture.lectureUrl ? (
                <ReactPlayer
                  url={currentLecture.lectureUrl}
                  controls
                  width="100%"
                  height="100%"
                  style={{ background: 'black' }}
                />
              ) : (
                <div className="text-white text-center w-full">Select a lecture to start learning</div>
              )}
            </div>
            {/* Lecture Info */}
            <div className="flex-1 flex flex-col gap-2 p-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{currentLecture?.lectureTitle || 'Lecture Title'}</h3>
              <div className="text-xs text-gray-500 mb-2">Duration: {currentLecture ? humanizeDuration(currentLecture.lectureDuration * 60 * 1000, { units: ['m'], round: true }) : '--'}</div>
              <div className="text-xs text-gray-500">Chapter: {courseData.courseContent[currentChapter]?.chapterTitle}</div>
              {/* Placeholder for chat/now watching */}
              <div className="mt-4">
                <div className="bg-gray-100 rounded-lg p-2 text-xs text-gray-400 text-center">Chat & Now Watching coming soon...</div>
              </div>
            </div>
          </div>
          {/* Marquee row inside right column if needed */}
          {isMarqueeInRightColumn && (
            <div className="w-full md:w-[calc(100%-1.5rem)] mx-auto mt-4">
              <MarqueeRow />
            </div>
          )}
        </main>

      </div>
      {/* Marquee row spanning both columns if not in right column */}
      {!isMarqueeInRightColumn && <MarqueeRow />}
      <Footer className="mt-10"/>
    </div>
  );
}

export default Player;
