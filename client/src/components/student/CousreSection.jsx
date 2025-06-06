import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import CourseCard from './CousreCard';


const CourseSection = () => {
  const { allCourses } = useContext(AppContext);
  return (
    <div className="py-16 md:px-40 px-8 text-center bg-gray-50 dark:bg-gray-900">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
        Fuel Your Future with World-Class Learning
      </h2>
      <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">
        Join thousands of learners who are leveling up their careers with expert-led courses across technology, business, design, and more. Learn at your pace, anytime, anywhere.
      </p>
      <div
        className="
          grid gap-6 px-4 my-12
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          justify-center
        "
      >
        {allCourses.map((course, index) => (
          <div
            key={index}
            className="
              bg-white dark:bg-gray-800 
              rounded-xl shadow-lg 
              overflow-hidden 
              transform transition-all duration-300 
              hover:scale-105 hover:shadow-xl
              border border-gray-200 dark:border-gray-700
            "
          >
            <CourseCard course={course} />
          </div>
        ))}
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