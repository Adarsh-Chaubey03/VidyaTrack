import React from 'react';
import { Link } from 'react-router-dom';

const CourseSection = () => {
  return (
    <div className="py-16 md:px-40 px-8 text-center">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
        Fuel Your Future with World-Class Learning
      </h2>
      <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">
        Join thousands of learners who are leveling up their careers with expert-led courses across technology, business, design, and more. Learn at your pace, anytime, anywhere.
      </p>
      <Link
        to="/course-list"
        onClick={() => scrollTo(0, 0)}
        className="inline-block mt-8 px-8 py-3 text-base font-semibold text-gray-500 bg-emerald-100 hover:bg-blue-100 rounded-full shadow-lg transition-all duration-300 ease-in-out"
      >
        Browse All Courses
      </Link>
    </div>
  );
};

export default CourseSection;
