import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { mentors, assets } from '../../assets/assets';
import Footer from '../../components/student/Footer';
import {
  Search,
  Star,
  ChevronRight,
  Users,
  Award,
  ArrowRight,
  SlidersHorizontal,
  X,
  Sparkles,
} from 'lucide-react';

/* ── Filter chip ─────────────────────────────────────────────────────────── */
const Chip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${
      active
        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
        : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
    }`}
  >
    {label}
  </button>
);

/* ── Stat pill for hero ──────────────────────────────────────────────────── */
const HeroStat = ({ icon: Icon, value, label }) => (
  <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-sm border border-white/50">
    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
      <Icon className="w-4 h-4 text-emerald-600" />
    </div>
    <div>
      <p className="text-sm font-bold text-slate-900 leading-tight">{value}</p>
      <p className="text-[11px] text-slate-500">{label}</p>
    </div>
  </div>
);

/* ── Mentor card (grid version) ──────────────────────────────────────────── */
const MentorGridCard = ({ mentor }) => {
  const fullStars = Math.floor(mentor.rating);
  return (
    <Link
      to={`/mentor/${mentor.id}`}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:shadow-emerald-100/50 hover:border-emerald-200 transition-all duration-300"
    >
      {/* Top accent */}
      <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />

      <div className="p-5 sm:p-6">
        {/* Head */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <img
              src={mentor.image}
              alt={mentor.name}
              className="w-16 h-16 rounded-xl object-cover ring-2 ring-white shadow"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
              {mentor.name}
            </h3>
            <p className="text-sm text-slate-500 truncate">
              {mentor.title} <span className="text-slate-300">@</span> {mentor.company}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < fullStars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-700">{mentor.rating}</span>
              <span className="text-xs text-slate-400">({mentor.reviews})</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-4">
          {mentor.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {mentor.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="bg-slate-50 text-slate-600 px-2.5 py-0.5 rounded-md text-[11px] font-medium border border-slate-100"
            >
              {tag}
            </span>
          ))}
          {mentor.tags.length > 4 && (
            <span className="text-[11px] text-slate-400 px-1.5 py-0.5">
              +{mentor.tags.length - 4}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900">${mentor.price}</span>
            <span className="text-xs text-slate-400">/month</span>
          </div>
          <div className="flex items-center gap-2">
            {mentor.freeTrial && (
              <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-[11px] font-semibold">
                Free trial
              </span>
            )}
            {mentor.spotsLeft <= 3 && (
              <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-md text-[11px] font-semibold">
                {mentor.spotsLeft} left
              </span>
            )}
          </div>
        </div>

        {/* CTA */}
        <button className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 text-slate-600 text-sm font-semibold group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
          View Profile
          <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </Link>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                           MAIN PAGE                                        */
/* ═══════════════════════════════════════════════════════════════════════════ */

const ALL_CATEGORIES = ['All', 'Engineering', 'Startup', 'Leadership', 'Career'];

function Mentor() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [priceSort, setPriceSort] = useState(''); // '' | 'asc' | 'desc'
  const gridRef = useRef(null);

  const filtered = useMemo(() => {
    let result = [...mentors];

    // Category filter
    if (activeCategory !== 'All') {
      result = result.filter((m) =>
        m.tags.some((t) => t.toLowerCase().includes(activeCategory.toLowerCase()))
      );
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.title.toLowerCase().includes(q) ||
          m.company.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    if (priceSort === 'asc') result.sort((a, b) => a.price - b.price);
    if (priceSort === 'desc') result.sort((a, b) => b.price - a.price);

    return result;
  }, [search, activeCategory, priceSort]);

  const scrollToGrid = () => {
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ════════════════ HERO ════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-rose-50 to-white">
        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Left text */}
            <div className="flex-1 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2.5 mb-6">
                <span className="bg-emerald-100 text-emerald-700 font-bold px-3.5 py-1.5 rounded-full text-xs tracking-wide">
                  Top Rated
                </span>
                <span className="bg-white/80 text-slate-600 px-3.5 py-1.5 rounded-full text-xs font-medium border border-slate-200">
                  Trusted by 10,000+ learners
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6">
                Connect with World-Class Mentors for Your{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  Career Growth
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Accelerate your journey with personalized guidance from industry leaders.
                Get expert advice, accountability, and support to reach your professional
                goals — no matter where you are.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <button
                  onClick={scrollToGrid}
                  className="group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3.5 rounded-full text-base shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-200 transition-all hover:-translate-y-0.5"
                >
                  Find a mentor
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                </button>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <div className="flex -space-x-2">
                    {mentors.slice(0, 3).map((m, i) => (
                      <img
                        key={i}
                        src={m.image}
                        alt=""
                        className="w-8 h-8 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                  </div>
                  <span className="font-medium text-slate-700">{mentors.length}+ mentors</span>
                </div>
              </div>
            </div>

            {/* Right illustration */}
            <div className="flex-1 flex justify-center lg:justify-end max-w-lg">
              <div className="relative">
                <img
                  src={assets.mentor_bg}
                  alt="Mentorship illustration"
                  className="w-72 h-72 md:w-96 md:h-96 object-contain drop-shadow-xl"
                />
                {/* Floating stat cards */}
                <div className="absolute -left-4 top-8 hidden md:block">
                  <HeroStat icon={Award} value="4.7 avg" label="Mentor rating" />
                </div>
                <div className="absolute -right-2 bottom-12 hidden md:block">
                  <HeroStat icon={Users} value="500+" label="Sessions done" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ HOW IT WORKS ════════════════ */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">How Mentoring Works</h2>
            <p className="text-slate-500 mt-2 max-w-lg mx-auto">Three simple steps to accelerate your career with expert guidance.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Browse Mentors', desc: 'Explore profiles, specialisations, and reviews to find your ideal match.', color: 'from-emerald-500 to-teal-500' },
              { step: '02', title: 'Send a Request', desc: 'Introduce yourself and share your goals. Mentors typically respond within 24 hours.', color: 'from-blue-500 to-indigo-500' },
              { step: '03', title: 'Start Growing', desc: 'Get personalised sessions, actionable feedback, and accountability to reach your goals.', color: 'from-violet-500 to-purple-500' },
            ].map((item) => (
              <div key={item.step} className="relative bg-white rounded-2xl p-7 border border-slate-200 hover:shadow-md transition-shadow group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                  <span className="text-white font-bold text-sm">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ MENTOR GRID ════════════════ */}
      <section ref={gridRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={18} className="text-emerald-500" />
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Featured</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Meet Our Mentors</h2>
            <p className="text-slate-500 text-sm mt-1">{filtered.length} mentor{filtered.length !== 1 ? 's' : ''} available</p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, skill, company..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-1 no-scrollbar">
          {ALL_CATEGORIES.map((cat) => (
            <Chip key={cat} label={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)} />
          ))}
          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />
          <div className="relative">
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
              className="appearance-none pl-8 pr-4 py-2 rounded-full text-sm font-medium border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="">Price</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
            <SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((mentor) => (
              <MentorGridCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">No mentors found</h3>
            <p className="text-sm text-slate-500 mb-4">Try adjusting your search or filters.</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All'); setPriceSort(''); }}
              className="text-sm font-medium text-emerald-600 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {/* ════════════════ BOTTOM CTA ════════════════ */}
      <section className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Ready to Level Up?
          </h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">
            Join hundreds of professionals who accelerated their careers with personalised mentoring.
          </p>
          <button
            onClick={scrollToGrid}
            className="bg-white text-emerald-700 font-bold px-8 py-3.5 rounded-full text-base shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            Browse Mentors
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Mentor;
