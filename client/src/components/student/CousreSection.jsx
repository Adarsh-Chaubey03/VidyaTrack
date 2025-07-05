import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import CourseCard from './CourseCard';


const CourseSection = () => {
  const { allCourses } = useContext(AppContext);
  const marqueeRef = useRef(null);
  const [marqueeWidth, setMarqueeWidth] = useState(0);

  useEffect(() => {
    if (marqueeRef.current) {
      setMarqueeWidth(marqueeRef.current.scrollWidth / 2); // since we duplicate
    }
  }, [allCourses]);

  // Animation duration: 100px = 1s, so 30s for 3000px, etc.
  const duration = marqueeWidth ? marqueeWidth / 100 : 30;

  return (
    <div className="py-16 px-2 md:px-8 lg:px-40 text-center bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
        Fuel Your Future with World-Class Learning
      </h2>
      <p className="hidden sm:block text-base md:text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">
        Join thousands of learners who are leveling up their careers with expert-led courses across technology, business, design, and more. Learn at your pace, anytime, anywhere.
      </p>
      <div className="relative w-full overflow-x-hidden my-12 px-[10px]">
        {/* Mobile: 2-row grid, no marquee */}
        <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:hidden">
          {allCourses.slice(0, 4).map((course, index) => (
            <div
              key={index}
              className="min-w-[140px] max-w-xs w-full bg-white dark:bg-gray-800 
                rounded-xl shadow-lg 
                overflow-hidden 
                transform transition-all duration-300 
                hover:scale-105 hover:shadow-xl
                border border-gray-200 dark:border-gray-700"
            >
              <CourseCard course={course} showPrice={false} />
            </div>
          ))}
        </div>
        {/* sm and up: marquee */}
        <div
          ref={marqueeRef}
          className="hidden sm:flex gap-4 sm:gap-6 animate-marquee"
          style={{
            minWidth: 'max-content',
            animation: marqueeWidth
              ? `marquee ${duration}s linear infinite`
              : 'none',
          }}
        >
          {[...allCourses, ...allCourses].map((course, index) => (
            <div
              key={index}
              className="min-w-[220px] sm:min-w-[320px] max-w-xs w-full bg-white dark:bg-gray-800 
                rounded-xl shadow-lg 
                overflow-hidden 
                transform transition-all duration-300 
                hover:scale-105 hover:shadow-xl
                border border-gray-200 dark:border-gray-700"
            >
              <CourseCard course={course} showPrice={false} />
            </div>
          ))}
        </div>
        <style>
          {`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}
        </style>
      </div>
      <Link
        to="/course-list"
        onClick={() => scrollTo(0, 0)}
        className="
          inline-block mt-8 px-8 py-3 
          text-base font-semibold 
          text-white bg-emerald-500
          hover:bg-emerald-600
          rounded-full shadow-lg 
          transition-all duration-300 ease-in-out
        "
      >
        Browse All Courses
      </Link>
    </div>
  );
};

export default CourseSection;