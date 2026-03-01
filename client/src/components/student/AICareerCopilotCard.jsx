import React from 'react';

function AICareerCopilotCard() {
  return (
    <section className="w-full h-full flex flex-row items-center justify-between p-4 sm:p-6 md:p-10 rounded-2xl md:rounded-3xl" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 40%, #d1fae5 100%)' }}>
      <div className="flex-1 text-left pr-3 sm:pr-6 md:pr-8">
        <h3 className="text-base sm:text-xl md:text-3xl font-extrabold mb-1 md:mb-2 text-emerald-700 tracking-tight">AI Career Copilot</h3>
        <div className="h-0.5 md:h-1 w-8 md:w-14 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full mb-2 md:mb-5"></div>
        <p className="text-gray-600 mb-3 md:mb-7 text-[10px] sm:text-xs md:text-base leading-relaxed line-clamp-3 md:line-clamp-none">
          Get a personalized career roadmap powered by AI. Identify skill gaps, discover learning paths, and plan your placement journey.
        </p>
        <button className="bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-700 hover:to-cyan-600 text-white px-3 py-1.5 sm:px-5 sm:py-2 md:px-7 md:py-2.5 rounded-lg md:rounded-xl font-semibold text-[10px] sm:text-xs md:text-sm shadow-md shadow-emerald-200/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-300/50">Try AI Copilot</button>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="w-16 h-16 sm:w-28 sm:h-28 md:w-40 md:h-40 rounded-full flex items-center justify-center" style={{ background: 'radial-gradient(circle at 40% 40%, #d1fae5, #a7f3d0 60%, #6ee7b7)' }}>
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16">
            <ellipse cx="32" cy="28" rx="14" ry="12" stroke="#065f46" strokeWidth="2" fill="#ecfdf5"/>
            <path d="M24 24c2-3 5-4 8-4s6 1 8 4" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M24 30c2 3 5 5 8 5s6-2 8-5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="32" y1="16" x2="32" y2="40" stroke="#065f46" strokeWidth="1" opacity="0.4"/>
            <line x1="18" y1="28" x2="46" y2="28" stroke="#065f46" strokeWidth="1" opacity="0.4"/>
            <circle cx="32" cy="28" r="3" fill="#10b981" opacity="0.5"/>
            <path d="M32 40v8M26 52h12" stroke="#065f46" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M14 18l-4-4m0 0l1 5m-1-5l5 1" stroke="#10b981" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
            <path d="M50 18l4-4m0 0l-1 5m1-5l-5 1" stroke="#10b981" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
            <circle cx="12" cy="36" r="2" stroke="#10b981" strokeWidth="1" fill="none" opacity="0.4"/>
            <circle cx="52" cy="36" r="2" stroke="#10b981" strokeWidth="1" fill="none" opacity="0.4"/>
          </svg>
        </div>
      </div>
    </section>
  );
}

export default AICareerCopilotCard;
