import React, { useContext, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

/* ── Category label colour map ── */
const CATEGORY_COLORS = {
  'programming fundamentals': 'bg-emerald-600',
  'web development':          'bg-blue-600',
  'machine learning':         'bg-cyan-500',
  'data structures':          'bg-orange-600',
  'cybersecurity':            'bg-red-600',
  'default':                  'bg-gray-600',
};

function getCategoryColor(cat = '') {
  const key = cat.toLowerCase();
  for (const [k, v] of Object.entries(CATEGORY_COLORS)) {
    if (key.includes(k)) return v;
  }
  return CATEGORY_COLORS.default;
}

/* ── Compact course card matching the image ── */
function CourseTile({ course }) {
  const { currency } = useContext(AppContext);

  const coursePrice    = course.coursePrice ?? 0;
  const discount       = course.discount ?? 0;
  const discountedPrice = (coursePrice - (coursePrice * discount) / 100).toFixed(2);
  const isFree         = course.isFree || coursePrice === 0;

  const ratings   = course?.courseRatings || [];
  const rating    = ratings.length
    ? ratings.reduce((a, c) => a + c.rating, 0) / ratings.length
    : 0;
  const totalRatings = ratings.length;

  const thumbSrc   = course.courseThumbnail || assets.default_thumbnail;
  const categoryLabel = course.category || course.courseCategory || '';

  return (
    <Link
      to={`/course/${course._id}`}
      className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-gray-200 overflow-hidden">
        <img
          src={thumbSrc}
          alt={course.courseTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => { e.target.onerror = null; e.target.src = assets.default_thumbnail; }}
        />
        {/* Category label badge */}
        {categoryLabel && (
          <span className={`absolute top-2 left-2 ${getCategoryColor(categoryLabel)} text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide`}>
            {categoryLabel}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-2 group-hover:text-emerald-600 transition-colors">
          {course.courseTitle}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Self-paced
          </span>
          <span className="flex items-center gap-1 text-amber-500 font-semibold">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            {rating > 0 ? rating.toFixed(1) : '—'}
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Build unique tab list from courses ── */
function buildTabs(courses) {
  const seen = new Set();
  const tabs = [{ label: 'All', value: 'all' }];
  courses.forEach(c => {
    const cat = c.category || c.courseCategory || '';
    if (cat && !seen.has(cat.toLowerCase())) {
      seen.add(cat.toLowerCase());
      tabs.push({ label: cat, value: cat.toLowerCase() });
    }
  });
  // cap at 5 tabs total (All + 4 categories)
  return tabs.slice(0, 5);
}

function ExploreCategories() {
  const { allCourses } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('all');

  const tabs = useMemo(() => buildTabs(allCourses || []), [allCourses]);

  const filtered = useMemo(() => {
    if (!allCourses) return [];
    if (activeTab === 'all') return allCourses.slice(0, 8);
    return allCourses
      .filter(c => (c.category || c.courseCategory || '').toLowerCase() === activeTab)
      .slice(0, 8);
  }, [allCourses, activeTab]);

  return (
    <section className="w-full bg-[#f0f2f0] py-12 sm:py-16 px-5 sm:px-10 md:px-14 lg:px-20">

      {/* ── Header row ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          {/* Badge */}
          <div className="inline-flex items-center border border-gray-300 bg-white rounded-full px-3 py-1 mb-3">
            <span className="text-gray-500 text-xs font-semibold tracking-widest uppercase">Explore Categories</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight max-w-lg">
            Browse our wide range of tech courses by topic
          </h2>
          <p className="text-amber-600 text-sm mt-2 max-w-sm leading-relaxed">
            Handpicked tracks built with industry mentors — from fundamentals to production-grade skills.
          </p>
        </div>

        <Link
          to="/course-list"
          className="flex-shrink-0 flex items-center gap-2 bg-[#1a3528] hover:bg-[#253d2f] text-white text-sm font-semibold rounded-full px-5 py-2.5 transition-colors self-start sm:self-auto"
        >
          View All Courses <span>→</span>
        </Link>
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 border ${
              activeTab === tab.value
                ? 'bg-[#1a3528] text-white border-[#1a3528] shadow-sm'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Course grid ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(course => (
            <CourseTile key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400 text-sm">
          No courses found in this category.
        </div>
      )}
    </section>
  );
}

export default ExploreCategories;
