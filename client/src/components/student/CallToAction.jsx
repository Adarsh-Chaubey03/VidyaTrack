import React from 'react';
import { useNavigate } from 'react-router-dom';

function CallToAction() {
  const navigate = useNavigate();

  return (
    <section
      className="w-full px-4 sm:px-6 md:px-12 py-14 sm:py-20 flex flex-col items-center text-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 50%, #166534 100%)',
      }}
    >
      {/* Subtle decorative chevron at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-6 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <svg viewBox="0 0 48 24" fill="none" className="w-12 h-6">
          <path d="M0 0 L24 20 L48 0" fill="#f7f7f5" />
        </svg>
      </div>

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-snug max-w-2xl mb-4">
        Empowering Learning:{' '}
        <span className="text-emerald-200">Let's Spark Transformation</span>
      </h2>

      <p className="text-emerald-100/90 text-sm sm:text-base max-w-xl mb-8 leading-relaxed">
        Join thousands of learners who are already building the future they want — with courses, mentors, and AI-powered tools all in one place.
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => navigate('/course-list')}
          className="bg-white text-emerald-700 font-bold px-6 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors duration-150 text-sm sm:text-base shadow-md"
        >
          Browse Courses
        </button>
        <button
          onClick={() => navigate('/signup')}
          className="bg-emerald-800/60 border border-white/30 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-emerald-800/80 transition-colors duration-150 text-sm sm:text-base"
        >
          Get Started Free
        </button>
      </div>
    </section>
  );
}

export default CallToAction;
