import React, { createContext, useEffect, useState } from "react";
import { dummyCourses, dummyStudentEnrolled } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizedDuration from "humanize-duration";
import { useAuth, useUser } from '@clerk/clerk-react'
import { apiService } from '../services/api.js';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [educatorCourses] = useState(dummyCourses);
  const [educatorEnrolledStudents] = useState(dummyStudentEnrolled);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currency = import.meta.env.VITE_CURRENCY || 'USD';

  const { getToken } = useAuth()
  const { user } = useUser()

  const fetchAllCourses = async () => {
    try {
      setLoading(true);
      const result = await apiService.courses.getAll();
      
      if (result.success) {
        setAllCourses(result.courses || []);
      } else {
        console.error('Failed to fetch courses:', result.message);
        setAllCourses(dummyCourses); // Fallback to dummy data
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setAllCourses(dummyCourses); // Fallback to dummy data
    } finally {
      setLoading(false);
    }
  };

  const fetchUserEnrollmentCourses = async () => {
    try {
      if (!user) {
        setEnrolledCourses([]);
        return;
      }

      const result = await apiService.user.getProfile();
      
      if (result.success && result.user.enrolledCourses) {
        // Fetch full course details for enrolled courses
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
        
        setEnrolledCourses(enrolledCourseDetails.filter(course => course !== null));
      } else {
        setEnrolledCourses([]);
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      setEnrolledCourses([]);
    }
  };

  const enrollInCourse = async (courseId) => {
    try {
      // Find the course to check if it's free
      const course = allCourses.find(c => c._id === courseId);
      const isFreeCourse = course && (course.isFree || course.coursePrice === 0);

      if (isFreeCourse) {
        // Use free course enrollment endpoint
        const result = await apiService.user.enrollFreeCourse({ courseId });
        
        if (result.success) {
          // For free courses, add to enrolled courses locally
          const courseData = allCourses.find(c => c._id === courseId);
          if (courseData) {
            setEnrolledCourses(prev => [...prev, courseData]);
          }
          return { success: true, message: 'Successfully enrolled in free course!' };
        } else {
          return { success: false, message: result.message };
        }
      } else {
        // For paid courses, require authentication
        if (!user) {
          throw new Error('User not authenticated');
        }

        const result = await apiService.user.purchaseCourse({ courseId });
        
        if (result.success) {
          // Refresh enrolled courses
          await fetchUserEnrollmentCourses();
          return { success: true, message: 'Successfully enrolled in course!' };
        } else {
          return { success: false, message: result.message };
        }
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      return { success: false, message: `Failed to enroll in course: ${error.message}` };
    }
  };

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

  useEffect(() => {
    fetchAllCourses();
    
    // Fallback: if loading takes too long, show dummy courses
    const timeout = setTimeout(() => {
      if (loading && allCourses.length === 0) {
        setAllCourses(dummyCourses);
        setLoading(false);
      }
    }, 5000); // 5 second timeout
    
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserEnrollmentCourses();
    } else {
      setEnrolledCourses([]);
    }
  }, [user]);

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
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
