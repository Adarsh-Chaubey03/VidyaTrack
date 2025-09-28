import React, { createContext, useEffect, useState } from 'react';
import { dummyCourses, dummyStudentEnrolled } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import humanizeDuration from 'humanize-duration';
import { useAuth } from './AuthContext.jsx';
import { apiService } from '../services/api.js';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [educatorCourses, setEducatorCourses] = useState([]);
  const [educatorEnrolledStudents] = useState(dummyStudentEnrolled);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currency = import.meta.env.VITE_CURRENCY || 'USD';

  const { user, isAuthenticated } = useAuth();

  const fetchAllCourses = async () => {
    try {
      setLoading(true);
      const result = await apiService.courses.getAll();

      if (result.success) {
        console.log('Fetched courses from API:', result.courses);
        setAllCourses(result.courses);
      } else {
        console.error('API response unsuccessful:', result.message);
        setError(result.message);
        setAllCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error.message, error.stack);
      setError(error.message);
      setAllCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const fetchUserEnrollmentCourses = async () => {
    try {
      if (!isAuthenticated()) {
        setEnrolledCourses([]);
        return;
      }

      const result = await apiService.user.getProfile();

      if (result.success && result.user.enrolledCourses) {
        const enrolledCourseDetails = await Promise.all(
          result.user.enrolledCourses.map(async (courseId) => {
            try {
              const courseResult = await apiService.courses.getById(courseId);
              return courseResult.success ? courseResult.courseData : null;
            } catch (error) {
              console.error(`Error fetching course ${courseId}:`, error);
              return null;
            }
          })
        );

        setEnrolledCourses(enrolledCourseDetails.filter((course) => course !== null));
      } else {
        setEnrolledCourses([]);
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      setEnrolledCourses([]);
    }
  };

  const fetchEducatorCourses = async () => {
    try {
      const result = await apiService.educator.getCourses();

      if (result.success) {
        setEducatorCourses(result.courses);
      }
    } catch (error) {
      console.error('Error fetching educator courses:', error);
      setEducatorCourses(dummyCourses);
    }
  };

  const enrollInCourse = async (courseId) => {
    try {
      // Ensure user is authenticated
      if (!isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      // Find the course to check if it's free
      const course = allCourses.find((c) => c._id === courseId);
      if (!course) {
        throw new Error('Course not found');
      }

        const result = await apiService.user.purchaseCourse({ courseId });
        if (result.success) {
          await fetchUserEnrollmentCourses();
          return { success: true, message: 'Successfully enrolled in free course!' };
        } else {
          return { success: false, message: result.message || 'Failed to enroll in course' };
        }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      return { success: false, message: error.message || 'Failed to enroll in course' };
    }
  };

  const calculateChapterTime = (chapter) => {
    if (!chapter || !chapter.chapterContent) return '0 min';
    const totalSeconds = chapter.chapterContent.reduce(
      (total, lecture) => total + (lecture.lectureDuration || 0),
      0
    );
    return humanizeDuration(totalSeconds * 60 * 1000, { units: ['h', 'm'], round: true });
  };

  const calculateCourseDuration = (course) => {
    if (!course || !course.courseContent) return '0 min';
    const totalSeconds = course.courseContent.reduce((total, chapter) => {
      return (
        total +
        (chapter.chapterContent
          ? chapter.chapterContent.reduce(
              (chapterTotal, lecture) => chapterTotal + (lecture.lectureDuration || 0),
              0
            )
          : 0)
      );
    }, 0);
    return humanizeDuration(totalSeconds * 60 * 1000, { units: ['h', 'm'], round: true });
  };

  const calculateCourseProgress = (course) => {
    if (!course || !course.courseContent) return { completedLectures: 0, totalLectures: 0 };
    let totalLectures = 0;
    let completedLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (chapter.chapterContent) {
        chapter.chapterContent.forEach((lecture) => {
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
    return course.courseContent.reduce(
      (total, chapter) => total + (chapter.chapterContent ? chapter.chapterContent.length : 0),
      0
    );
  };

  useEffect(() => {
    if (isAuthenticated()) {
      fetchUserEnrollmentCourses();
      if (user?.role === 'educator') {
        fetchEducatorCourses();
      }
    } else {
      setEnrolledCourses([]);
      setEducatorCourses([]);
    }
  }, [user]);

  const refreshCourses = () => {
    fetchAllCourses();
  };

  const refreshEducatorCourses = () => {
    fetchEducatorCourses();
  };

  const contextValue = {
    enrolledCourses,
    setEnrolledCourses,
    allCourses,
    setAllCourses,
    loading,
    error,
    calculateChapterTime,
    calculateCourseDuration,
    calculateCourseProgress,
    calculateNoOfLectures,
    currency,
    educatorCourses,
    educatorEnrolledStudents,
    enrollInCourse,
    fetchUserEnrollmentCourses,
    fetchEducatorCourses,
    refreshCourses,
    refreshEducatorCourses,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};