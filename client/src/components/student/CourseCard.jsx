import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

function CourseCard({ course }) {
  const { currency, calculateRate } = useContext(AppContext);

  const discountedPrice = (
    course.coursePrice - (course.coursePrice * course.discount) / 100
  ).toFixed(2);

  const rating = calculateRate(course);
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const totalRatings = course?.courseRating?.length || 0;

  return (
    <Link
      to={`/course/${course._id}`}
      onClick={() => scrollTo(0, 0)}
      className="
        w-full max-w-[300px] dark:bg-gray-800 overflow-hidden 
        transition-all duration-300 
        mx-auto
        group
        bg-white rounded-xl shadow-lg
    "
    >
      <div className="relative">
        <img
          src={course.courseThumbnail}
          alt="Course Thumbnail"
          className="
            w-full h-48 object-cover 
            transition-transform duration-300 
            group-hover:scale-105
          "
        />
        <div className="
          absolute inset-0 
          bg-gradient-to-t from-black/40 to-transparent 
          opacity-0 group-hover:opacity-100 
          transition-opacity duration-300
        " />
      </div>
      <div className="p-5 ">
        <h3 className="
          text-lg font-semibold 
          text-gray-800 dark:text-white 
          truncate
          group-hover:text-emerald-600 
          transition-colors duration-300
        ">
          {course.courseTitle}
        </h3>
        <p className="
          text-sm text-gray-600 dark:text-gray-400 
          mt-1 truncate
        ">
          VidyaTrack
        </p>

        <div className="flex items-center gap-2 mt-3 text-sm text-gray-700 dark:text-gray-300">
          <span className="text-red-600 font-semibold">{rating.toFixed(1)}</span>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => {
              if (i < fullStars) {
                return <img key={i} src={assets.star} alt="star" className="w-4 h-4" />;
              } else if (i === fullStars && hasHalfStar) {
                return <img key={i} src={assets.star_half} alt="half star" className="w-4 h-4" />;
              } else {
                return <img key={i} src={assets.star_blank} alt="empty star" className="w-4 h-4" />;
              }
            })}
          </div>
          <span className="text-gray-600 dark:text-gray-400">({totalRatings})</span>
        </div>

        <p className="
          mt-4 text-emerald-700 dark:text-emerald-400 
          font-bold text-lg
        ">
          {currency}
          {discountedPrice}
        </p>
      </div>
    </Link>
  );
}

export default CourseCard;
