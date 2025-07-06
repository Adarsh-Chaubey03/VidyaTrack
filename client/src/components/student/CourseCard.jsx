import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

function CourseCard({ course }) {
  const { currency } = useContext(AppContext);

  const discountedPrice = (
    course.coursePrice - (course.coursePrice * course.discount) / 100
  ).toFixed(2);

  // Calculate rating directly here
  const rating = course?.courseRating?.length
    ? course.courseRating.reduce((acc, curr) => acc + curr.rating, 0) / course.courseRating.length
    : 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const totalRatings = course?.courseRating?.length || 0;

  return (
    <Link
      to={`/course/${course._id}`}
      onClick={() => window.scrollTo(0, 0)}
      className="
        w-full max-w-[300px] sm:max-w-[300px] max-w-[180px] min-w-[160px] sm:min-w-[220px] md:min-w-[320px] 
        bg-transparent border border-gray-300 dark:border-gray-700 
        shadow-emerald-200 hover:shadow-emerald-400
        overflow-hidden transition-all duration-300 mx-auto group
        rounded-xl
        hover:scale-105
    "
    >
      {/* Thumbnail at the top */}
      <img
        src={course.courseThumbnail}
        alt="Course Thumbnail"
        className="w-full h-32 sm:h-48 object-cover rounded-t-xl"
      />
      <div className="border-t border-gray-200 dark:border-gray-700 w-full" />
      <div className="p-3 sm:p-5 ">
        <h3 className="
          text-base sm:text-lg font-semibold 
          text-gray-800 dark:text-white 
          line-clamp-2
          group-hover:text-emerald-600 
          transition-colors duration-300
        ">
          {course.courseTitle}
        </h3>
        <p className="
          text-xs sm:text-sm text-gray-600 dark:text-gray-400 
          mt-1 truncate
        ">
          VidyaTrack
        </p>

        <div className="flex items-center gap-2 mt-2 sm:mt-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
          <span className="text-red-600 font-semibold">{rating.toFixed(1)}</span>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => {
              if (i < fullStars) {
                return <img key={i} src={assets.star} alt="star" className="w-3 h-3 sm:w-4 sm:h-4" />;
              } else if (i === fullStars && hasHalfStar) {
                return <img key={i} src={assets.star_half} alt="half star" className="w-3 h-3 sm:w-4 sm:h-4" />;
              } else {
                return <img key={i} src={assets.star_blank} alt="empty star" className="w-3 h-3 sm:w-4 sm:h-4" />;
              }
            })}
          </div>
          <span className="text-gray-600 dark:text-gray-400">({totalRatings})</span>
        </div>
      </div>
      <div className="border-b border-gray-200 dark:border-gray-700 w-full" />
    </Link>
  );
}

export default CourseCard;
