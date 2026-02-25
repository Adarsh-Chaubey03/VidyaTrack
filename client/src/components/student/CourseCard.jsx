import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

function CourseCard({ course }) {
  const { currency } = useContext(AppContext);

  // Safe price calculation
  const coursePrice = course.coursePrice ?? 0;
  const discount = course.discount ?? 0;
  const discountedPrice = (coursePrice - (coursePrice * discount) / 100).toFixed(2);
  const isFree = course.isFree || coursePrice === 0;

  // Rating
  const ratings = course?.courseRatings || [];
  const rating = ratings.length
    ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
    : 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const totalRatings = ratings.length;

  // Thumbnail fallback
  const thumbnailSrc = course.courseThumbnail || assets.default_thumbnail;

  // Badge
  const badge = course.isTrending
    ? { label: '🔥 Trending', cls: 'bg-orange-100 text-orange-700' }
    : course.isNew
      ? { label: '✨ New', cls: 'bg-blue-100 text-blue-700' }
      : course.isBestseller
        ? { label: '⭐ Bestseller', cls: 'bg-yellow-100 text-yellow-700' }
        : null;

  const studentCount = course.enrolledStudent?.length ?? 0;

  return (
    <Link
      to={`/course/${course._id}`}
      onClick={() => window.scrollTo(0, 0)}
      className="
        group flex flex-col bg-white border border-gray-200
        rounded-xl overflow-hidden
        shadow-sm hover:shadow-md hover:shadow-emerald-100/60
        transition-shadow duration-300
        h-full
      "
    >
      {/* ── Thumbnail ── */}
      <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
        <img
          src={thumbnailSrc}
          alt={course.courseTitle}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = assets.default_thumbnail;
          }}
        />
        {/* Badge */}
        {badge && (
          <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[11px] font-semibold ${badge.cls}`}>
            {badge.label}
          </span>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title */}
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-snug">
          {course.courseTitle}
        </h3>

        {/* Instructor */}
        <p className="text-xs text-gray-500 mt-1">
          {course.educator?.name || 'VidyaTrack'}
        </p>

        {/* Level badge */}
        {course.level && (
          <span className="inline-block self-start mt-1.5 px-2 py-0.5 text-[11px] font-medium rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 capitalize">
            {course.level}
          </span>
        )}

        {/* Rating row */}
        <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-600">
          <span className="font-semibold text-amber-600">{rating.toFixed(1)}</span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => {
              if (i < fullStars) {
                return <img key={i} src={assets.star} alt="" className="w-3.5 h-3.5" />;
              } else if (i === fullStars && hasHalfStar) {
                return <img key={i} src={assets.star_blank} alt="" className="w-3.5 h-3.5 opacity-60" />;
              }
              return <img key={i} src={assets.star_blank} alt="" className="w-3.5 h-3.5" />;
            })}
          </div>
          <span className="text-gray-400">({totalRatings})</span>
        </div>

        {/* Spacer to push footer down */}
        <div className="flex-1" />

        {/* ── Footer: Price + students ── */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          {isFree ? (
            <span className="text-sm font-bold text-emerald-600">FREE</span>
          ) : (
            <div className="flex items-baseline gap-1.5">
              {discount > 0 && (
                <span className="text-xs text-gray-400 line-through">{currency}{coursePrice.toFixed(2)}</span>
              )}
              <span className="text-sm font-bold text-gray-900">{currency}{discountedPrice}</span>
            </div>
          )}
          <span className="text-[11px] text-gray-400">{studentCount} students</span>
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;
