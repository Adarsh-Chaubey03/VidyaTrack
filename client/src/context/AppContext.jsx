import React, { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizedDuration from "humanize-duration";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const loadDummyCourses = () => {
    setAllCourses(dummyCourses);
  };

  const calculateRate = (course) => {
    if (!course?.courseRating?.length) return 0;
    const total = course.courseRating.reduce((acc, curr) => acc + curr.rating, 0);
    return total / course.courseRating.length;
  };

  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.forEach((lecture) => {
      time += lecture.lectureDuration;
    });
    return humanizedDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        time += lecture.lectureDuration;
      });
    });
    return humanizedDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateNoOfLectures = (course) => {
    let totalLecture = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLecture += chapter.chapterContent.length;
      }
    });
    return totalLecture;
  };

  const fetchUserEnrolledCourses = async () => {
    setEnrolledCourses(dummyCourses);
  };

  useEffect(() => {
    loadDummyCourses();
    fetchUserEnrolledCourses();
  }, []);

  const value = {
    user,
    setUser,
    currency,
    allCourses,
    calculateRate,
    navigate,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    enrolledCourses,
    setEnrolledCourses,
    fetchUserEnrolledCourses,
    loadDummyCourses,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
