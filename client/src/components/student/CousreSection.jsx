import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import CourseCard from './CourseCard';

const CARD_WIDTH = 290;   // px per card
const CARD_GAP = 20;      // px gap between cards
const ITEM_WIDTH = CARD_WIDTH + CARD_GAP;

const CourseSection = () => {
  const { allCourses } = useContext(AppContext);

  // We need at least 1 course to render
  if (!allCourses || allCourses.length === 0) return null;

  // Duplicate 3× for a truly seamless loop — when the first copy scrolls
  // out of view the second copy is still visible, and the CSS resets
  // invisibly because the third copy covers the transition.
  const tripled = [...allCourses, ...allCourses, ...allCourses];
  const singleSetWidth = allCourses.length * ITEM_WIDTH;
  const totalWidth = tripled.length * ITEM_WIDTH;

  // Speed: roughly 40px/s → duration scales with content length
  const duration = Math.max(20, singleSetWidth / 40);

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 text-center bg-gray-50 overflow-hidden">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
        Fuel Your Future with World-Class Learning
      </h2>
      <p className="hidden sm:block text-base md:text-lg text-gray-600 mt-2 max-w-3xl mx-auto">
        Join thousands of learners who are leveling up their careers with expert-led courses across technology, business, design, and more.
      </p>

      {/* ── Card area ── */}
      <div className="relative w-full overflow-hidden my-10">
        {/* Mobile: 2-col static grid (no marquee on small screens) */}
        <div className="grid grid-cols-2 gap-4 sm:hidden max-w-md mx-auto">
          {allCourses.slice(0, 4).map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>

        {/* Desktop/Tablet: seamless infinite marquee */}
        <div className="hidden sm:block overflow-hidden">
          <div
            className="marquee-track flex"
            style={{
              width: `${totalWidth}px`,
              gap: `${CARD_GAP}px`,
              '--marquee-distance': `-${singleSetWidth}px`,
              animationDuration: `${duration}s`,
            }}
          >
            {tripled.map((course, i) => (
              <div
                key={`card-${i}`}
                className="shrink-0"
                style={{ width: `${CARD_WIDTH}px` }}
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inline styles for the marquee — scoped keyframes */}
      <style>{`
        .marquee-track {
          animation: seamless-scroll var(--duration, 30s) linear infinite;
          will-change: transform;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes seamless-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(var(--marquee-distance, -50%)); }
        }
      `}</style>

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