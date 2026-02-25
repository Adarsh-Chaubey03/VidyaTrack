import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const GROUP_TABS = ['Core Tech', 'Career / Exam', 'Trending'];

// Background accent colors per group for visual distinction
const GROUP_COLORS = {
    'Core Tech': { bg: 'from-blue-50 to-indigo-50', border: 'border-blue-100', accent: 'bg-blue-100 text-blue-700', iconBg: 'bg-gradient-to-br from-blue-100 to-indigo-100' },
    'Career / Exam': { bg: 'from-amber-50 to-yellow-50', border: 'border-amber-100', accent: 'bg-amber-100 text-amber-700', iconBg: 'bg-gradient-to-br from-amber-100 to-yellow-100' },
    'Trending': { bg: 'from-rose-50 to-pink-50', border: 'border-rose-100', accent: 'bg-rose-100 text-rose-700', iconBg: 'bg-gradient-to-br from-rose-100 to-pink-100' },
};

function CategoryGrid() {
    const { categories } = useContext(AppContext);
    const [activeGroup, setActiveGroup] = useState('Core Tech');

    // Group categories
    const grouped = {};
    GROUP_TABS.forEach(g => { grouped[g] = []; });
    categories.forEach(cat => {
        if (grouped[cat.group]) grouped[cat.group].push(cat);
    });

    const currentCats = grouped[activeGroup] || [];
    const colors = GROUP_COLORS[activeGroup];

    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Explore Categories
                </h2>
                <p className="mt-2 text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
                    Browse our wide range of courses organized by topic
                </p>
            </div>

            {/* Group Tabs */}
            <div className="flex justify-center gap-2 sm:gap-3 mb-8 flex-wrap">
                {GROUP_TABS.map(group => (
                    <button
                        key={group}
                        onClick={() => setActiveGroup(group)}
                        className={`
              px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${activeGroup === group
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-105'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }
            `}
                    >
                        {group}
                    </button>
                ))}
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {currentCats.map((cat, idx) => (
                    <Link
                        key={cat.slug}
                        to={`/course-list?category=${cat.slug}`}
                        className={`
              group relative overflow-hidden rounded-xl border ${colors.border}
              bg-gradient-to-br ${colors.bg}
              p-5 sm:p-6 flex flex-col justify-between
              hover:shadow-lg hover:shadow-emerald-100 hover:-translate-y-1
              transition-all duration-300 ease-out
              min-h-[180px]
            `}
                        style={{ animationDelay: `${idx * 60}ms` }}
                    >
                        {/* Top row: Title + Icon */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                                    {cat.name}
                                </h3>

                                {/* Sub-tag chips */}
                                {cat.subTags && cat.subTags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {cat.subTags.slice(0, 4).map(tag => (
                                            <span
                                                key={tag}
                                                className="px-2.5 py-1 text-xs font-medium rounded-full bg-white/80 text-gray-600 border border-gray-200 shadow-sm"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Icon circle */}
                            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${colors.iconBg} flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                {cat.icon}
                            </div>
                        </div>

                        {/* Bottom: Explore arrow */}
                        <div className="flex items-center gap-2 mt-4 text-sm font-medium text-gray-500 group-hover:text-emerald-600 transition-colors">
                            <span>Explore Category</span>
                            <svg
                                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>

                        {/* Course count badge */}
                        {cat.courseCount > 0 && (
                            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                                {cat.courseCount} {cat.courseCount === 1 ? 'course' : 'courses'}
                            </div>
                        )}
                    </Link>
                ))}
            </div>

            {/* View All link */}
            <div className="text-center mt-8">
                <Link
                    to="/course-list"
                    className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700 hover:underline transition-colors"
                >
                    View All Categories ({categories.length})
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>
        </section>
    );
}

export default CategoryGrid;
