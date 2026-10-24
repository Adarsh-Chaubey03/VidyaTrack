import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { mentors, assets } from '../../assets/assets';
import Footer from '../../components/student/Footer';
import { Search, Star, ChevronRight, SlidersHorizontal, X, Sparkles } from 'lucide-react';

/* ── Star row ── */
const Stars = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={12}
        className={i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-300'}
      />
    ))}
  </div>
);

/* ── Filter chip ── */
const Chip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${
      active
        ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
        : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-700'
    }`}
  >
    {label}
  </button>
);

/* ── Mentor card — exactly matching image ── */
const MentorCard = ({ mentor }) => {
  const shortenedTitle = mentor.title.split(' ').slice(0, 3).join(' ');
  return (
    <Link
      to={`/mentor/${mentor.id}`}
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:shadow-emerald-100/60 hover:border-emerald-200 transition-all duration-300 flex flex-col"
    >
      <div className="p-5 flex flex-col flex-1">
        {/* Head row: avatar + name + rating */}
        <div className="flex items-start gap-3 mb-3">
          <div className="relative shrink-0">
            <img
              src={mentor.image}
              alt={mentor.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-100"
            />
            {/* online dot */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
              {mentor.name}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {shortenedTitle} @ {mentor.company}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <Stars rating={mentor.rating} />
              <span className="text-xs font-semibold text-gray-700">{mentor.rating}</span>
              <span className="text-xs text-gray-400">({mentor.reviews})</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-3 flex-1">
          {mentor.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {mentor.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
          {mentor.tags.length > 3 && (
            <span className="text-[10px] text-gray-400 px-1 py-0.5">+{mentor.tags.length - 3}</span>
          )}
        </div>

        {/* Price row */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-bold text-gray-900">${mentor.price}</span>
          <span className="text-xs text-gray-400">/month</span>
          {mentor.freeTrial && (
            <span className="ml-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
              Free trial
            </span>
          )}
          {mentor.spotsLeft <= 3 && (
            <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded">
              {mentor.spotsLeft} left
            </span>
          )}
        </div>

        {/* CTA */}
        <button className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-200">
          View Profile <ChevronRight size={15} />
        </button>
      </div>
    </Link>
  );
};

/* ── How it works steps ── */
const STEPS = [
  {
    num: '01',
    title: 'Browse Mentors',
    desc: 'Explore profiles, specialisations, and reviews to find your ideal match.',
    iconPath: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0',
    color: 'text-emerald-600 bg-emerald-100',
  },
  {
    num: '02',
    title: 'Send a Request',
    desc: 'Introduce yourself and share your goals. Mentors typically respond within 24 hours.',
    iconPath: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
    color: 'text-blue-600 bg-blue-100',
  },
  {
    num: '03',
    title: 'Start Growing',
    desc: 'Get personalised sessions, actionable feedback, and accountability to reach your goals.',
    iconPath: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    color: 'text-purple-600 bg-purple-100',
  },
];

const ALL_CATEGORIES = ['All', 'Engineering', 'Startup', 'Leadership', 'Career'];

function Mentor() {
  const [search, setSearch]               = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [priceSort, setPriceSort]         = useState('');
  const gridRef = useRef(null);

  const filtered = useMemo(() => {
    let r = [...mentors];
    if (activeCategory !== 'All') {
      r = r.filter(m => m.tags.some(t => t.toLowerCase().includes(activeCategory.toLowerCase())));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.company.toLowerCase().includes(q) ||
        m.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (priceSort === 'asc')  r.sort((a, b) => a.price - b.price);
    if (priceSort === 'desc') r.sort((a, b) => b.price - a.price);
    return r;
  }, [search, activeCategory, priceSort]);

  const scrollToGrid = () => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ════════════ HERO ════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #e8f5ee 0%, #f0faf4 50%, #ffffff 100%)' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-10 md:px-14 lg:px-20 py-12 md:py-16 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

          {/* LEFT */}
          <div className="flex-1 max-w-xl">
            {/* Badges */}
            <div className="flex items-center gap-2.5 mb-5">
              <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                Top Rated
              </span>
              <span className="text-gray-500 text-xs font-medium">Trusted by 10,000+ learners</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.8rem] font-extrabold text-gray-900 leading-[1.1] mb-4">
              Connect with World-Class Mentors for Your{' '}
              <span className="text-emerald-500">Career Growth</span>
            </h1>

            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-7 max-w-md">
              Get personalized guidance from industry experts. Learn new skills,
              get career advice, and achieve your professional goals.
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap items-center gap-5">
              <button
                onClick={scrollToGrid}
                className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-3 rounded-full text-sm shadow-md transition"
              >
                Find a mentor
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>

              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-2">
                  {mentors.slice(0, 3).map((m, i) => (
                    <img key={i} src={m.image} alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                  ))}
                </div>
                <span className="text-gray-500 text-sm font-medium">{mentors.length}+ mentors online</span>
              </div>
            </div>
          </div>

          {/* RIGHT: hero image only, no card */}
          <div className="flex-shrink-0 w-full lg:w-[46%] flex justify-center lg:justify-end">
            <img
              src={assets.mentor_bg}
              alt="Mentoring"
              className="w-full max-w-sm lg:max-w-none h-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* ════════════ HOW IT WORKS ════════════ */}
      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-10 md:px-14 lg:px-20 py-14">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">How Mentoring Works</h2>
            <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">
              Three simple steps to accelerate your career with expert guidance.
            </p>
          </div>

          <div className="flex flex-row items-center gap-0 max-w-4xl mx-auto overflow-x-auto">
            {STEPS.map((step, i) => (
              <React.Fragment key={step.num}>
                <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-sm transition-shadow flex-1 min-w-[180px]">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${step.color}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={step.iconPath}/>
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-gray-400 mb-1">{step.num}</p>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex items-center justify-center px-3 shrink-0">
                    <svg width="28" height="16" viewBox="0 0 32 16" fill="none">
                      <path d="M0 8h28M22 2l6 6-6 6" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ MENTOR GRID ════════════ */}
      <section ref={gridRef} className="max-w-7xl mx-auto px-5 sm:px-10 md:px-14 lg:px-20 py-12 w-full">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles size={14} className="text-emerald-500" />
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">Featured</span>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Meet Our Mentors</h2>
            <p className="text-gray-400 text-sm mt-0.5">{filtered.length} mentor{filtered.length !== 1 ? 's' : ''} available</p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, skill, company..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
          {ALL_CATEGORIES.map(cat => (
            <Chip key={cat} label={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)} />
          ))}
          <div className="h-5 w-px bg-gray-200 mx-1" />
          <div className="relative">
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
              className="appearance-none pl-7 pr-3 py-1.5 rounded-full text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="">Price</option>
              <option value="asc">Low → High</option>
              <option value="desc">High → Low</option>
            </select>
            <SlidersHorizontal size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Cards */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(mentor => <MentorCard key={mentor.id} mentor={mentor} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search size={28} className="text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-700 mb-1">No mentors found</h3>
            <p className="text-sm text-gray-400 mb-4">Try adjusting your search or filters.</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All'); setPriceSort(''); }}
              className="text-sm font-medium text-emerald-600 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default Mentor;
