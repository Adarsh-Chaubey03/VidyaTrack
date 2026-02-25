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
  const rating = course?.courseRatings?.length
    ? course.courseRatings.reduce((acc, curr) => acc + curr.rating, 0) / course.courseRatings.length
    : 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const totalRatings = course?.courseRatings?.length || 0;

  // Thumbnail fallback: use default if missing/broken
  const thumbnailSrc = course.courseThumbnail || assets.default_thumbnail;

  // Badge logic
  const badge = course.isTrending
    ? { label: '🔥 Trending', className: 'bg-orange-100 text-orange-700' }
    : course.isNew
      ? { label: '✨ New', className: 'bg-blue-100 text-blue-700' }
      : course.isBestseller
        ? { label: '⭐ Bestseller', className: 'bg-yellow-100 text-yellow-700' }
        : null;

  return (
    <Link
      to={`/course/${course._id}`}
      onClick={() => window.scrollTo(0, 0)}
      className="
        w-full max-w-[180px] sm:max-w-[300px] min-w-[160px] sm:min-w-[220px] md:min-w-[320px] 
        bg-transparent border border-gray-300 dark:border-gray-700 
        shadow-emerald-200 hover:shadow-emerald-400
        overflow-hidden transition-all duration-300 mx-auto group
        rounded-xl
        hover:scale-105
        relative
    "
    >
      {/* Badge ribbon */}
      {badge && (
        <div className={`absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-xs font-semibold ${badge.className}`}>
          {badge.label}
        </div>
      )}

      {/* Thumbnail — object-contain to avoid stretching, with fallback */}
      <div className="w-full h-32 sm:h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-t-xl overflow-hidden">
        <img
          src={thumbnailSrc}
          alt={course.courseTitle}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = assets.default_thumbnail;
          }}
        />
      </div>

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

        {/* Level tag */}
        {course.level && (
          <span className="inline-block mt-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 capitalize">
            {course.level}
          </span>
        )}

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

        {/* Pricing */}
        <div className="mt-2 sm:mt-3 flex items-center justify-between">
          {course.isFree || course.coursePrice === 0 ? (
            <span className="text-sm font-semibold text-green-600">FREE</span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 line-through">{currency}{course.coursePrice.toFixed(2)}</span>
              <span className="text-sm font-semibold text-emerald-600">{currency}{discountedPrice}</span>
            </div>
          )}
          <span className="text-xs text-gray-500">{course.enrolledStudent?.length || 0} students</span>
        </div>
      </div>
      <div className="border-b border-gray-200 dark:border-gray-700 w-full" />
    </Link>
  );
}

export default CourseCard;
