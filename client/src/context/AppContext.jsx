import React, { createContext, useEffect, useState } from 'react';
import { dummyCourses, dummyStudentEnrolled } from '../assets/assets';
import humanizeDuration from 'humanize-duration';
import { useAuth } from './AuthContext.jsx';
import { apiService } from '../services/api.js';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [educatorCourses, setEducatorCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [educatorEnrolledStudents] = useState(dummyStudentEnrolled);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currency = import.meta.env.VITE_CURRENCY || '₹';

  const { user, isAuthenticated } = useAuth();

  const fetchAllCourses = async () => {
    try {
      setLoading(true);
      const result = await apiService.courses.getAll();

      if (result.success) {
        setAllCourses(result.courses);
      } else {
        setError(result.message);
        setAllCourses([]);
      }
    } catch (error) {
      setError(error.message);
      setAllCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCourses();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const result = await apiService.courses.getCategories();
      if (result.success) {
        setCategories(result.categories);
      }
    } catch (error) {
      // silently ignore category fetch errors
    }
  };

  const fetchUserEnrollmentCourses = async () => {
    try {
      if (!isAuthenticated()) {
        setEnrolledCourses([]);
        return;
      }

      const result = await apiService.user.getProfile();

      if (result.success && result.user.enrolledCourses?.length) {
        const ids = result.user.enrolledCourses;

        // Use the already-fetched allCourses list first (zero extra requests).
        // Fall back to individual fetches only for IDs not in the local cache.
        const fromCache = [];
        const missing = [];

        ids.forEach((id) => {
          const idStr = typeof id === 'object' ? id.toString() : id;
          const found = allCourses.find((c) => c._id === idStr || c._id === id);
          if (found) {
            fromCache.push(found);
          } else {
            missing.push(id);
          }
        });

        let extra = [];
        if (missing.length > 0) {
          const fetched = await Promise.all(
            missing.map(async (courseId) => {
              try {
                const r = await apiService.courses.getById(courseId);
                return r.success ? r.courseData : null;
              } catch {
                return null;
              }
            })
          );
          extra = fetched.filter(Boolean);
        }

        setEnrolledCourses([...fromCache, ...extra]);
      } else {
        setEnrolledCourses([]);
      }
    } catch {
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
    // Depend on stable identifiers only — user._id and role — so this effect
    // does NOT re-fire when the user object reference changes (e.g. after a
    // context re-render) but the actual identity/role hasn't changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, user?.role]);

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
    categories,
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