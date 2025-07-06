import React, { createContext, useEffect, useState } from "react";
import { dummyCourses, dummyStudentEnrolled } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizedDuration from "humanize-duration";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [enrolledCourses, setEnrolledCourses] = useState(dummyCourses);
  const [educatorCourses] = useState(dummyCourses);
  const [educatorEnrolledStudents] = useState(dummyStudentEnrolled);

  const currency = import.meta.env.VITE_CURRENCY;

  const calculateChapterTime = (chapter) => {
    if (!chapter || !chapter.chapterContent) return "0 min";
    const totalSeconds = chapter.chapterContent.reduce((total, lecture) => total + (lecture.lectureDuration || 0), 0);
    return humanizedDuration(totalSeconds * 60 * 1000, { units: ['h', 'm'], round: true });
  };

  const calculateCourseDuration = (course) => {
    if (!course || !course.courseContent) return "0 min";
    const totalSeconds = course.courseContent.reduce((total, chapter) => {
      return total + (chapter.chapterContent ? chapter.chapterContent.reduce((chapterTotal, lecture) => chapterTotal + (lecture.lectureDuration || 0), 0) : 0);
    }, 0);
    return humanizedDuration(totalSeconds * 60 * 1000, { units: ['h', 'm'], round: true });
  };

  const calculateCourseProgress = (course) => {
    if (!course || !course.courseContent) return { completedLectures: 0, totalLectures: 0 };
    let totalLectures = 0;
    let completedLectures = 0;
    course.courseContent.forEach(chapter => {
      if (chapter.chapterContent) {
        chapter.chapterContent.forEach(lecture => {
          totalLectures++;
          if (lecture.isCompleted) {
            completedLectures++;
          }
        });
      }
    });
    return { completedLectures, totalLectures };
  };

  const calculateNoOfLectures = (course) => {
    if (!course || !course.courseContent) return 0;
    return course.courseContent.reduce((total, chapter) => {
      return total + (chapter.chapterContent ? chapter.chapterContent.length : 0);
    }, 0);
  };

  const contextValue = {
    enrolledCourses,
    setEnrolledCourses,
    calculateChapterTime,
    calculateCourseDuration,
    calculateCourseProgress,
    calculateNoOfLectures,
    currency,
    educatorCourses,
    educatorEnrolledStudents,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
