import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import ReactPlayer from 'react-player';
import Footer from '../../components/student/Footer';

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
        <aside className="lg:w-1/3 w-full flex flex-col gap-6 bg-white rounded-2xl shadow-md p-4 md:p-6">
          {/* Course Info */}
          <div className="mb-2">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">{courseData.courseTitle}</h1>
            <div className="text-gray-600 text-sm mb-2" dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 120) + (courseData.courseDescription.length > 120 ? '...' : '') }} />
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
        <main className="flex-1 flex flex-col gap-6">
          {/* Video Player */}
          <div className="bg-white rounded-2xl shadow-md p-0 md:p-4 flex flex-col md:flex-row gap-4 items-start min-h-[320px]">
            <div className="w-full aspect-video md:w-2/3 rounded-xl overflow-hidden bg-black flex items-center justify-center">
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
        </main>

      </div>
     <Footer />
     </div>
  );
}

export default Player;
