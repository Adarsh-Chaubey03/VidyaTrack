import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import CourseCard from './CourseCard';

const CourseSection = () => {
  const { educatorCourses } = useContext(AppContext);
  const allCourses = educatorCourses;

  return (
    <div className="py-16 px-0 md:px-0 lg:px-0 text-center bg-gray-50 overflow-x-hidden">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">
        Fuel Your Future with World-Class Learning
      </h2>
      <p className="hidden sm:block text-base md:text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
        Join thousands of learners who are leveling up their careers with expert-led courses across technology, business, design, and more. Learn at your pace, anytime, anywhere.
      </p>
      <div className="relative w-screen max-w-none overflow-x-hidden my-12 px-0">
        {/* Mobile: 2-row grid, no marquee */}
        <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:hidden">
          {allCourses && allCourses.slice(0, 4).map((course, index) => (
            <div
              key={index}
              className="min-w-[140px] max-w-xs w-full bg-white 
                rounded-xl shadow-lg 
                overflow-hidden 
                transform transition-all duration-300 
                hover:scale-105 hover:shadow-xl
                border border-gray-200"
            >
              <CourseCard course={course} showPrice={false} />
            </div>
          ))}
        </div>
        {/* sm and up: floating marquee, right-to-left */}
        <div
          className="hidden sm:block w-full"
          style={{ position: 'relative', height: '370px' }}
        >
          <div
            className="flex flex-row gap-4 sm:gap-6 animate-marquee"
            style={{
              width: allCourses ? `${allCourses.length * 2 * 320}px` : '100%',
              animation: 'marquee 30s linear infinite',
            }}
          >
            {allCourses && [...allCourses, ...allCourses].map((course, index) => (
              <div
                key={index}
                className="min-w-[280px] sm:min-w-[320px] max-w-xs w-full bg-white 
                  rounded-xl shadow-lg 
                  overflow-hidden 
                  transform transition-all duration-300 
                  hover:scale-105 hover:shadow-xl
                  border border-gray-200"
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