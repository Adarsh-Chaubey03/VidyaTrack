import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import CourseCard from './CourseCard';

const CourseSection = () => {
  const { allCourses } = useContext(AppContext);

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 text-center bg-gray-50 overflow-hidden">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
        Fuel Your Future with World-Class Learning
      </h2>
      <p className="hidden sm:block text-base md:text-lg text-gray-600 mt-2 max-w-3xl mx-auto">
        Join thousands of learners who are leveling up their careers with expert-led courses across technology, business, design, and more. Learn at your pace, anytime, anywhere.
      </p>

      {/* Marquee area */}
      <div className="relative w-full overflow-hidden my-10">
        {/* Mobile: proper grid */}
        <div className="grid grid-cols-2 gap-4 sm:hidden max-w-md mx-auto">
          {allCourses && allCourses.slice(0, 4).map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>

        {/* Desktop: horizontal marquee scroll */}
        <div className="hidden sm:block" style={{ height: '380px' }}>
          <div
            className="flex gap-5 animate-marquee"
            style={{
              width: allCourses ? `${allCourses.length * 2 * 310}px` : '100%',
              animation: 'marquee 35s linear infinite',
            }}
          >
            {allCourses && [...allCourses, ...allCourses].map((course, index) => (
              <div
                key={`${course._id}-${index}`}
                className="w-[290px] shrink-0"
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
          <style>
            {`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee:hover {
                animation-play-state: paused;
              }
            `}
          </style>
        </div>
      </div>

      <Link
        to="/course-list"
        onClick={() => scrollTo(0, 0)}
        className="
          inline-block mt-6 px-8 py-3
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