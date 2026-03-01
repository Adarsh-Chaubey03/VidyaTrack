import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { apiService } from '../../services/api';
import CourseCard from '../../components/student/CourseCard';
import Footer from '../../components/student/Footer';
import { SkeletonCard } from '../../components/skeleton/Skeleton';

const LEVELS = ['beginner', 'intermediate', 'advanced'];
const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-asc', label: 'Price: Low → High' },
    { value: 'price-desc', label: 'Price: High → Low' },
];

function CourseList() {
    const { categories } = useContext(AppContext);
    const { input } = useParams(); // legacy search param
    const [searchParams, setSearchParams] = useSearchParams();

    // State from URL
    const categoryFromUrl = searchParams.get('category') || '';
    const levelFromUrl = searchParams.get('level') || '';
    const priceFromUrl = searchParams.get('price') || '';
    const sortFromUrl = searchParams.get('sort') || 'newest';
    const searchFromUrl = searchParams.get('search') || input || '';
    const pageFromUrl = parseInt(searchParams.get('page') || '1');

    // Courses state
    const [courses, setCourses] = useState([]);
    const [totalCourses, setTotalCourses] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(pageFromUrl);
    const [loading, setLoading] = useState(true);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Local filter state (syncs to URL on apply)
    const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
    const [selectedLevel, setSelectedLevel] = useState(levelFromUrl);
    const [selectedPrice, setSelectedPrice] = useState(priceFromUrl);
    const [selectedSort, setSelectedSort] = useState(sortFromUrl);
    const [searchQuery, setSearchQuery] = useState(searchFromUrl);

    // Find active category name
    const activeCategoryName = useMemo(() => {
        const cat = categories.find(c => c.slug === selectedCategory);
        return cat ? cat.name : '';
    }, [categories, selectedCategory]);

    // Fetch courses from API
    const fetchCourses = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (selectedCategory) params.category = selectedCategory;
            if (selectedLevel) params.level = selectedLevel;
            if (selectedPrice) params.price = selectedPrice;
            if (selectedSort) params.sort = selectedSort;
            if (searchQuery) params.search = searchQuery;
            params.page = currentPage;
            params.limit = 12;

            const result = await apiService.courses.getAll(params);
            if (result.success) {
                setCourses(result.courses);
                setTotalCourses(result.totalCourses);
                setTotalPages(result.totalPages);
            }
        } catch (error) {
            // fetch failed
        } finally {
            setLoading(false);
        }
    }, [selectedCategory, selectedLevel, selectedPrice, selectedSort, searchQuery, currentPage]);

    // Sync filters to URL
    const syncFiltersToUrl = useCallback(() => {
        const params = {};
        if (selectedCategory) params.category = selectedCategory;
        if (selectedLevel) params.level = selectedLevel;
        if (selectedPrice) params.price = selectedPrice;
        if (selectedSort && selectedSort !== 'newest') params.sort = selectedSort;
        if (searchQuery) params.search = searchQuery;
        if (currentPage > 1) params.page = currentPage.toString();
        setSearchParams(params, { replace: true });
    }, [selectedCategory, selectedLevel, selectedPrice, selectedSort, searchQuery, currentPage, setSearchParams]);

    // On filter or page change
    useEffect(() => {
        fetchCourses();
        syncFiltersToUrl();
    }, [fetchCourses, syncFiltersToUrl]);

    // Sync URL params into state on mount / back-navigate
    useEffect(() => {
        setSelectedCategory(searchParams.get('category') || '');
        setSelectedLevel(searchParams.get('level') || '');
        setSelectedPrice(searchParams.get('price') || '');
        setSelectedSort(searchParams.get('sort') || 'newest');
        setSearchQuery(searchParams.get('search') || input || '');
        setCurrentPage(parseInt(searchParams.get('page') || '1'));
    }, []);

    const clearAllFilters = () => {
        setSelectedCategory('');
        setSelectedLevel('');
        setSelectedPrice('');
        setSelectedSort('newest');
        setSearchQuery('');
        setCurrentPage(1);
    };

    const hasActiveFilters = selectedCategory || selectedLevel || selectedPrice || searchQuery;



    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Breadcrumb */}
                    <nav className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                        <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
                        <span>›</span>
                        <span className={activeCategoryName ? 'hover:text-emerald-600 cursor-pointer' : 'text-gray-800 font-medium'}>
                            {activeCategoryName ? (
                                <Link to="/course-list" onClick={() => { setSelectedCategory(''); setCurrentPage(1); }}>Courses</Link>
                            ) : 'Courses'}
                        </span>
                        {activeCategoryName && (
                            <>
                                <span>›</span>
                                <span className="text-gray-800 font-medium">{activeCategoryName}</span>
                            </>
                        )}
                    </nav>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                {activeCategoryName || (searchQuery ? `Results for "${searchQuery}"` : 'All Courses')}
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                {loading ? (
                                    <span className="skeleton-shimmer inline-block rounded h-4 w-32" />
                                ) : `${totalCourses} course${totalCourses !== 1 ? 's' : ''} found`}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Search box */}
                            <div className="relative flex-1 sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            {/* Sort */}
                            <select
                                value={selectedSort}
                                onChange={(e) => { setSelectedSort(e.target.value); setCurrentPage(1); }}
                                className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white hidden sm:block"
                            >
                                {SORT_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>

                            {/* Mobile filter toggle */}
                            <button
                                onClick={() => setMobileFiltersOpen(true)}
                                className="sm:hidden px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
                {/* Sidebar — Desktop */}
                <aside className="hidden sm:block w-64 shrink-0">
                    <div className="sticky top-24 space-y-6">
                        {/* Clear all */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                className="w-full text-sm text-red-500 hover:text-red-600 font-medium py-2 px-3 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                            >
                                ✕ Clear All Filters
                            </button>
                        )}

                        {/* Categories */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Categories</h3>
                            <div className="space-y-1">
                                {categories.map(cat => (
                                    <button
                                        key={cat.slug}
                                        onClick={() => { setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug); setCurrentPage(1); }}
                                        className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${selectedCategory === cat.slug
                                            ? 'bg-emerald-100 text-emerald-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {cat.icon} {cat.name}
                                        {cat.courseCount > 0 && <span className="text-xs text-gray-400 ml-1">({cat.courseCount})</span>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Level */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Level</h3>
                            <div className="space-y-1">
                                {LEVELS.map(level => (
                                    <button
                                        key={level}
                                        onClick={() => { setSelectedLevel(selectedLevel === level ? '' : level); setCurrentPage(1); }}
                                        className={`w-full text-left text-sm px-3 py-1.5 rounded-lg capitalize transition-colors ${selectedLevel === level
                                            ? 'bg-emerald-100 text-emerald-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Price</h3>
                            <div className="space-y-1">
                                {[{ value: 'free', label: '🆓 Free' }, { value: 'paid', label: '💰 Paid' }].map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => { setSelectedPrice(selectedPrice === opt.value ? '' : opt.value); setCurrentPage(1); }}
                                        className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${selectedPrice === opt.value
                                            ? 'bg-emerald-100 text-emerald-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Mobile Filters Drawer */}
                {mobileFiltersOpen && (
                    <div className="fixed inset-0 z-50 sm:hidden">
                        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
                        <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold">Filters</h2>
                                <button onClick={() => setMobileFiltersOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Sort (mobile) */}
                            <div className="mb-4">
                                <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase">Sort By</h3>
                                <select
                                    value={selectedSort}
                                    onChange={(e) => { setSelectedSort(e.target.value); setCurrentPage(1); }}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                                >
                                    {SORT_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Categories (mobile) */}
                            <div className="mb-4">
                                <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase">Categories</h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.slug}
                                            onClick={() => { setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug); setCurrentPage(1); }}
                                            className={`text-xs px-2.5 py-1 rounded-full transition-colors ${selectedCategory === cat.slug
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {cat.icon} {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Level (mobile) */}
                            <div className="mb-4">
                                <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase">Level</h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {LEVELS.map(level => (
                                        <button
                                            key={level}
                                            onClick={() => { setSelectedLevel(selectedLevel === level ? '' : level); setCurrentPage(1); }}
                                            className={`text-xs px-2.5 py-1 rounded-full capitalize transition-colors ${selectedLevel === level
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price (mobile) */}
                            <div className="mb-4">
                                <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase">Price</h3>
                                <div className="flex gap-1.5">
                                    {[{ value: 'free', label: 'Free' }, { value: 'paid', label: 'Paid' }].map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => { setSelectedPrice(selectedPrice === opt.value ? '' : opt.value); setCurrentPage(1); }}
                                            className={`text-xs px-3 py-1 rounded-full transition-colors ${selectedPrice === opt.value
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {hasActiveFilters && (
                                <button
                                    onClick={() => { clearAllFilters(); setMobileFiltersOpen(false); }}
                                    className="w-full mt-2 text-sm text-red-500 font-medium py-2 rounded-lg border border-red-200"
                                >
                                    Clear All
                                </button>
                            )}

                            <button
                                onClick={() => setMobileFiltersOpen(false)}
                                className="w-full mt-3 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                Show Results ({totalCourses})
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    {/* Active filters pills */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {selectedCategory && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                    {activeCategoryName}
                                    <button onClick={() => { setSelectedCategory(''); setCurrentPage(1); }} className="ml-0.5 hover:text-emerald-900">✕</button>
                                </span>
                            )}
                            {selectedLevel && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full capitalize">
                                    {selectedLevel}
                                    <button onClick={() => { setSelectedLevel(''); setCurrentPage(1); }} className="ml-0.5 hover:text-blue-900">✕</button>
                                </span>
                            )}
                            {selectedPrice && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full capitalize">
                                    {selectedPrice}
                                    <button onClick={() => { setSelectedPrice(''); setCurrentPage(1); }} className="ml-0.5 hover:text-yellow-900">✕</button>
                                </span>
                            )}
                            {searchQuery && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                    "{searchQuery}"
                                    <button onClick={() => { setSearchQuery(''); setCurrentPage(1); }} className="ml-0.5 hover:text-gray-900">✕</button>
                                </span>
                            )}
                        </div>
                    )}

                    {/* Loading skeleton */}
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : courses.length === 0 ? (
                        /* Empty state */
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">📭</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No courses found</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                Try adjusting your filters or search to find what you're looking for.
                            </p>
                            <button
                                onClick={clearAllFilters}
                                className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Course grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                                {courses.map(course => (
                                    <CourseCard key={course._id} course={course} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-8">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                                    >
                                        ← Prev
                                    </button>
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const page = i + 1;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'border hover:bg-gray-100'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                    {totalPages > 5 && <span className="text-gray-400">...</span>}
                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
}

export default CourseList;
