import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

// Subtle gradient backgrounds per group
const GROUP_STYLES = {
    'Core Tech': { bg: 'bg-gradient-to-br from-blue-50 to-indigo-50', border: 'border-blue-200/60', iconBg: 'bg-blue-100' },
    'Career / Exam': { bg: 'bg-gradient-to-br from-amber-50 to-yellow-50', border: 'border-amber-200/60', iconBg: 'bg-amber-100' },
    'Trending': { bg: 'bg-gradient-to-br from-rose-50 to-pink-50', border: 'border-rose-200/60', iconBg: 'bg-rose-100' },
};

function CategoryGrid() {
    const { categories } = useContext(AppContext);

    // Group categories by their group field
    const groups = {};
    categories.forEach(cat => {
        if (!groups[cat.group]) groups[cat.group] = [];
        groups[cat.group].push(cat);
    });

    // Define display order
    const groupOrder = ['Core Tech', 'Career / Exam', 'Trending'];

    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            {/* Section Header */}
            <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Explore Categories
                </h2>
                <p className="mt-2 text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
                    Browse our wide range of courses organized by topic
                </p>
            </div>

            {/* Render each group with its own heading */}
            {groupOrder.map(groupName => {
                const cats = groups[groupName];
                if (!cats || cats.length === 0) return null;
                const style = GROUP_STYLES[groupName] || GROUP_STYLES['Core Tech'];

                return (
                    <div key={groupName} className="mb-10 last:mb-0">
                        {/* Group label */}
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4 pl-1">
                            {groupName}
                        </h3>

                        {/* Cards grid — 1 col mobile, 2 tablet, 3-4 desktop */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                            {cats.map(cat => (
                                <Link
                                    key={cat.slug}
                                    to={`/course-list?category=${cat.slug}`}
                                    className={`
                    group relative rounded-xl border ${style.border} ${style.bg}
                    p-5 flex flex-col justify-between
                    hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-0.5
                    transition-all duration-300 ease-out
                    min-h-[160px]
                  `}
                                >
                                    {/* Top: name + icon */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors truncate">
                                                {cat.name}
                                            </h4>

                                            {/* Sub-tag chips */}
                                            {cat.subTags && cat.subTags.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mt-2.5">
                                                    {cat.subTags.slice(0, 4).map(tag => (
                                                        <span
                                                            key={tag}
                                                            className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-white/90 text-gray-600 border border-gray-200"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Emoji icon */}
                                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${style.iconBg} flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                            {cat.icon}
                                        </div>
                                    </div>

                                    {/* Bottom: CTA + course count */}
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-sm font-medium text-gray-500 group-hover:text-emerald-600 transition-colors flex items-center gap-1.5">
                                            Explore Category
                                            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </span>
                                        {cat.courseCount > 0 && (
                                            <span className="text-xs text-gray-400 font-medium">
                                                {cat.courseCount} {cat.courseCount === 1 ? 'course' : 'courses'}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                );
            })}

            {/* View All link */}
            <div className="text-center mt-6">
                <Link
                    to="/course-list"
                    className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700 hover:underline transition-colors text-sm"
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
