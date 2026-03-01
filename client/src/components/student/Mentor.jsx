import React from 'react';

function Mentor() {
  return (
    <section className="w-full h-full flex flex-row items-center justify-between p-4 sm:p-6 md:p-10 rounded-2xl md:rounded-3xl" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 40%, #d1fae5 100%)' }}>
      <div className="flex-1 text-left pr-3 sm:pr-6 md:pr-8">
        <h3 className="text-base sm:text-xl md:text-3xl font-extrabold mb-1 md:mb-2 text-emerald-700 tracking-tight">Mentor Guidance</h3>
        <div className="h-0.5 md:h-1 w-8 md:w-14 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full mb-2 md:mb-5"></div>
        <p className="text-gray-600 mb-3 md:mb-7 text-[10px] sm:text-xs md:text-base leading-relaxed line-clamp-3 md:line-clamp-none">Connect with experienced mentors to guide your learning journey and career decisions. Get personalized advice and support to achieve your goals.</p>
        <button className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white px-3 py-1.5 sm:px-5 sm:py-2 md:px-7 md:py-2.5 rounded-lg md:rounded-xl font-semibold text-[10px] sm:text-xs md:text-sm shadow-md shadow-emerald-200/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-300/50">Get Started</button>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="w-16 h-16 sm:w-28 sm:h-28 md:w-40 md:h-40 rounded-full flex items-center justify-center" style={{ background: 'radial-gradient(circle at 40% 40%, #d1fae5, #a7f3d0 60%, #6ee7b7)' }}>
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16">
            <circle cx="32" cy="18" r="10" stroke="#065f46" strokeWidth="2" fill="#ecfdf5"/>
            <path d="M16 52c0-8.8 7.2-16 16-16s16 7.2 16 16" stroke="#065f46" strokeWidth="2" fill="none"/>
            <path d="M38 14l6-4m0 0l2 6m-2-6l-6 1" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="50" cy="28" r="3" stroke="#10b981" strokeWidth="1.5" fill="none"/>
            <circle cx="14" cy="30" r="2.5" stroke="#10b981" strokeWidth="1.5" fill="none"/>
            <path d="M12 42l4-2m4-8l-2 4" stroke="#10b981" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
          </svg>
        </div>
      </div>
    </section>
  );
}

export default Mentor; 