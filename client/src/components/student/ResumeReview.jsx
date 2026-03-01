import React from 'react';

function ResumeReview() {
  return (
    <section className="w-full h-full flex flex-row items-center justify-between p-4 sm:p-6 md:p-10 rounded-2xl md:rounded-3xl" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 40%, #ccfbf1 100%)' }}>
      <div className="flex-1 text-left pr-3 sm:pr-6 md:pr-8">
        <h3 className="text-base sm:text-xl md:text-3xl font-extrabold mb-1 md:mb-2 text-teal-700 tracking-tight">Resume Review</h3>
        <div className="h-0.5 md:h-1 w-8 md:w-14 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full mb-2 md:mb-5"></div>
        <p className="text-gray-600 mb-3 md:mb-7 text-[10px] sm:text-xs md:text-base leading-relaxed line-clamp-3 md:line-clamp-none">Build and polish your resume with expert tips and easy-to-use tools. Get feedback to make your resume stand out to employers.</p>
        <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-3 py-1.5 sm:px-5 sm:py-2 md:px-7 md:py-2.5 rounded-lg md:rounded-xl font-semibold text-[10px] sm:text-xs md:text-sm shadow-md shadow-teal-200/50 transition-all duration-300 hover:shadow-lg hover:shadow-teal-300/50">Get Started</button>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="w-16 h-16 sm:w-28 sm:h-28 md:w-40 md:h-40 rounded-full flex items-center justify-center" style={{ background: 'radial-gradient(circle at 40% 40%, #ccfbf1, #99f6e4 60%, #5eead4)' }}>
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16">
            <rect x="16" y="8" width="32" height="44" rx="4" stroke="#115e59" strokeWidth="2" fill="#f0fdfa"/>
            <line x1="22" y1="20" x2="42" y2="20" stroke="#0d9488" strokeWidth="2" strokeLinecap="round"/>
            <line x1="22" y1="27" x2="38" y2="27" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
            <line x1="22" y1="33" x2="36" y2="33" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
            <line x1="22" y1="39" x2="34" y2="39" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
            <path d="M40 44l6 6 2-2-6-6" stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="46" cy="14" r="3" stroke="#14b8a6" strokeWidth="1.5" fill="none" opacity="0.5"/>
            <path d="M10 16l3 2m0-6l-2 3" stroke="#14b8a6" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
          </svg>
        </div>
      </div>
    </section>
  );
}

export default ResumeReview; 