import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const CARD_STYLE = {
    bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    border: 'border-blue-200/60',
    iconBg: 'bg-blue-100',
};

function CategoryGrid() {
    const { categories } = useContext(AppContext);

    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            {/* Section Header */}
            <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Explore Categories
                </h2>
                <p className="mt-2 text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
                    Browse our wide range of tech courses organized by topic
                </p>
            </div>

            {/* Flat grid — no group headings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {categories.map(cat => (
                    <Link
                        key={cat.slug}
                        to={`/course-list?category=${cat.slug}`}
                        className={`
              group relative rounded-xl border ${CARD_STYLE.border} ${CARD_STYLE.bg}
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
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${CARD_STYLE.iconBg} flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300`}>
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

            {/* View All link */}
            <div className="text-center mt-6">
                <Link
                    to="/course-list"
                    className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700 hover:underline transition-colors text-sm"
                >
                    View All Courses
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>
        </section>
    );
}

export default CategoryGrid;
