import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { assets } from '../../assets/assets';
import SearchBar from './SearchBar';

function Hero() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated()) {
      const el = document.getElementById('our-services');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/login');
    }
  };

  return (
    <div
      className="w-full relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg,#042d1e 0%,#053d28 30%,#064e3b 65%,#075c45 100%)',
      }}
    >
      {/* ── Decorative background SVGs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute top-10 left-8 w-36 h-36 opacity-[0.13]" viewBox="0 0 160 160" fill="none">
          <circle cx="30" cy="30" r="3.5" fill="white"/>
          <circle cx="70" cy="15" r="3" fill="white"/>
          <circle cx="115" cy="38" r="3.5" fill="white"/>
          <circle cx="48" cy="72" r="3" fill="white"/>
          <circle cx="92" cy="82" r="3.5" fill="white"/>
          <circle cx="132" cy="68" r="3" fill="white"/>
          <line x1="30" y1="30" x2="70" y2="15" stroke="white" strokeWidth="0.9"/>
          <line x1="70" y1="15" x2="115" y2="38" stroke="white" strokeWidth="0.9"/>
          <line x1="30" y1="30" x2="48" y2="72" stroke="white" strokeWidth="0.9"/>
          <line x1="70" y1="15" x2="92" y2="82" stroke="white" strokeWidth="0.9"/>
          <line x1="115" y1="38" x2="132" y2="68" stroke="white" strokeWidth="0.9"/>
          <line x1="48" y1="72" x2="92" y2="82" stroke="white" strokeWidth="0.9"/>
          <line x1="92" y1="82" x2="132" y2="68" stroke="white" strokeWidth="0.9"/>
        </svg>
        <svg className="absolute bottom-10 right-8 w-40 h-40 opacity-[0.11]" viewBox="0 0 128 128" fill="none">
          <circle cx="64" cy="64" r="4" fill="white"/>
          <circle cx="26" cy="38" r="3" fill="white"/>
          <circle cx="102" cy="38" r="3" fill="white"/>
          <circle cx="26" cy="90" r="3" fill="white"/>
          <circle cx="102" cy="90" r="3" fill="white"/>
          <circle cx="64" cy="14" r="2.5" fill="white"/>
          <circle cx="64" cy="114" r="2.5" fill="white"/>
          <line x1="64" y1="64" x2="26" y2="38" stroke="white" strokeWidth="0.8"/>
          <line x1="64" y1="64" x2="102" y2="38" stroke="white" strokeWidth="0.8"/>
          <line x1="64" y1="64" x2="26" y2="90" stroke="white" strokeWidth="0.8"/>
          <line x1="64" y1="64" x2="102" y2="90" stroke="white" strokeWidth="0.8"/>
          <line x1="64" y1="64" x2="64" y2="14" stroke="white" strokeWidth="0.8"/>
          <line x1="64" y1="64" x2="64" y2="114" stroke="white" strokeWidth="0.8"/>
          <line x1="26" y1="38" x2="64" y2="14" stroke="white" strokeWidth="0.6"/>
          <line x1="102" y1="38" x2="64" y2="14" stroke="white" strokeWidth="0.6"/>
          <line x1="26" y1="90" x2="64" y2="114" stroke="white" strokeWidth="0.6"/>
          <line x1="102" y1="90" x2="64" y2="114" stroke="white" strokeWidth="0.6"/>
          <line x1="26" y1="38" x2="26" y2="90" stroke="white" strokeWidth="0.6"/>
          <line x1="102" y1="38" x2="102" y2="90" stroke="white" strokeWidth="0.6"/>
        </svg>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 55% at 30% 60%,rgba(16,185,129,0.07) 0%,transparent 70%)' }} />
      </div>

      {/* ── Hero content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 md:px-14 lg:px-20 pt-10 pb-16 md:pt-12 md:pb-20 flex flex-col md:flex-row items-center gap-10 md:gap-8">

        {/* LEFT column */}
        <div className="flex-1 flex flex-col items-start text-left max-w-xl">
          {/* Trusted badge */}
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-6">
            <span className="text-emerald-400 text-sm">★</span>
            <span className="text-white/80 text-xs sm:text-sm font-medium tracking-wide uppercase">
              Trusted by 10,000+ Learners
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-white leading-tight mb-4">
            Empower Your Future:{' '}
            <span className="text-emerald-400">
              Personalized Growth &amp; Career Tools
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-md">
            Don't journey solo — unlock your potential with 1:1 mentorship and
            career-building tools from top experts in tech, business, and beyond.
          </p>

          {/* Search bar */}
          <div className="w-full max-w-md mb-7">
            <SearchBar />
          </div>

          {/* Get Started + social proof */}
          <div className="flex flex-wrap items-center gap-5">
            <button
              onClick={handleGetStarted}
              className="flex items-center gap-2 bg-white text-[#042d1e] font-bold text-sm sm:text-base rounded-full px-6 py-2.5 hover:bg-gray-100 transition shadow-md"
            >
              Get Started <span>→</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                <img src={assets.profile_img_1} alt="" className="w-8 h-8 rounded-full border-2 border-[#053d28] object-cover" />
                <img src={assets.profile_img_2} alt="" className="w-8 h-8 rounded-full border-2 border-[#053d28] object-cover" />
                <img src={assets.profile_img_3} alt="" className="w-8 h-8 rounded-full border-2 border-[#053d28] object-cover" />
              </div>
              <div className="text-left">
                <p className="text-white text-xs font-semibold leading-tight">4.7 average mentor rating</p>
                <p className="text-gray-400 text-xs leading-tight">500+ sessions completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT column: image card */}
        <div className="flex-shrink-0 w-full md:w-[44%] lg:w-[42%] relative mt-4 md:mt-0">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10">
            <img
              src={assets.mentor_bg}
              alt="Mentoring session"
              className="w-full h-64 sm:h-72 md:h-80 object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>

          {/* Badge top-left */}
          <div className="absolute top-4 left-4 bg-[#0d2b1e]/90 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg">
            <div className="w-7 h-7 rounded-full bg-emerald-700/60 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <p className="text-white text-xs font-bold leading-tight">50+ Mentors</p>
              <p className="text-gray-400 text-[10px] leading-tight">from top companies</p>
            </div>
          </div>

          {/* Badge bottom-right */}
          <div className="absolute bottom-4 right-4 bg-[#0d2b1e]/90 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg">
            <div className="w-7 h-7 rounded-full bg-orange-700/60 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="10 8 16 12 10 16 10 8" fill="#fb923c" stroke="none"/>
              </svg>
            </div>
            <div>
              <p className="text-white text-xs font-bold leading-tight">1,200+ Lectures</p>
              <p className="text-gray-400 text-[10px] leading-tight">recorded &amp; on-demand</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
