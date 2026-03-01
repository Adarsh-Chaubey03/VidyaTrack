import React, { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Mentor from './Mentor';
import ResumeReview from './ResumeReview';
import AICareerCopilotCard from './AICareerCopilotCard';

const ExtraFeaturesSection = () => {
  const scrollRef = useRef(null);
  const cardWidth = 500 + 32; // 500px card + 2rem (32px) gap

  const scrollLeft = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  }, [cardWidth]);
  const scrollRight = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  }, [cardWidth]);

  return (
    <div className="relative py-8 sm:py-12 md:py-16 overflow-hidden flex flex-col items-center w-full" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 40%, #ecfdf5 100%)' }}>
      {/* Horizontally scrollable cards */}
      <div className="relative w-full">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-md shadow-emerald-100 rounded-full p-1.5 sm:p-2.5 hover:bg-emerald-50 hover:shadow-lg transition-all duration-200 border border-emerald-100"
          aria-label="Scroll Left"
        >
          <svg width="20" height="20" fill="none" stroke="#065f46" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 16l-5-5 5-5"/></svg>
        </button>
        {/* Cards */}
        <div
          ref={scrollRef}
          className="w-full flex overflow-x-auto md:overflow-x-hidden gap-4 sm:gap-6 md:gap-8 px-8 sm:px-10 md:px-12 snap-x snap-mandatory"
          style={{ scrollBehavior: 'smooth' }}
        >
          <Link to="/mentor" className="snap-center shrink-0 w-[280px] h-[200px] sm:w-[420px] sm:h-[260px] md:w-[700px] md:h-[320px] flex items-center justify-center rounded-2xl md:rounded-3xl shadow-lg shadow-emerald-100/60 border border-emerald-100/80 bg-white/70 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-emerald-200/60 hover:-translate-y-1">
            <Mentor />
          </Link>
          <Link to="/resumereview" className="snap-center shrink-0 w-[280px] h-[200px] sm:w-[420px] sm:h-[260px] md:w-[700px] md:h-[320px] flex items-center justify-center rounded-2xl md:rounded-3xl shadow-lg shadow-teal-100/60 border border-teal-100/80 bg-white/70 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-teal-200/60 hover:-translate-y-1">
            <ResumeReview />
          </Link>
          <Link to="/ai-career-copilot" className="snap-center shrink-0 w-[280px] h-[200px] sm:w-[420px] sm:h-[260px] md:w-[700px] md:h-[320px] flex items-center justify-center rounded-2xl md:rounded-3xl shadow-lg shadow-emerald-100/60 border border-emerald-100/80 bg-white/70 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-emerald-200/60 hover:-translate-y-1">
            <AICareerCopilotCard />
          </Link>
        </div>
        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-md shadow-emerald-100 rounded-full p-1.5 sm:p-2.5 hover:bg-emerald-50 hover:shadow-lg transition-all duration-200 border border-emerald-100"
          aria-label="Scroll Right"
        >
          <svg width="20" height="20" fill="none" stroke="#065f46" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16l5-5-5-5"/></svg>
        </button>
      </div>
    </div>
  );
};

export default ExtraFeaturesSection; 