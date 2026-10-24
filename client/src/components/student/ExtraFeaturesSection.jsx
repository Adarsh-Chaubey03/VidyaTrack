import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── Spotlight slide data ── */
const slides = [
  {
    key: 'mentor',
    title: 'Mentor Guidance',
    description:
      'Connect with experienced mentors to guide your learning journey and career decisions. Get personalized advice and support to achieve your goals.',
    btnLabel: 'Get Started',
    btnTo: '/mentor',
    btnColor: 'bg-[#1a3528] hover:bg-[#253d2f]',
    /* Quote-mark icon bg */
    iconBg: '#e0f2fe',
    iconStroke: '#0ea5e9',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop&crop=center',
  },
  {
    key: 'resume',
    title: 'Resume Review',
    description:
      'Build and polish your resume with expert tips and easy-to-use tools. Get feedback to make your resume stand out to employers.',
    btnLabel: 'Get Started',
    btnTo: '/resume',
    btnColor: 'bg-blue-600 hover:bg-blue-700',
    iconBg: '#dbeafe',
    iconStroke: '#2563eb',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop&crop=center',
  },
  {
    key: 'copilot',
    title: 'AI Career Copilot',
    description:
      'Get a personalized career roadmap powered by AI. Identify skill gaps, discover learning paths, and plan your placement journey.',
    btnLabel: 'Try AI Copilot',
    btnTo: '/copilot',
    btnColor: 'bg-cyan-600 hover:bg-cyan-700',
    iconBg: '#cffafe',
    iconStroke: '#0891b2',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop&crop=center',
  },
];

/* ── Quote / feature icon ── */
function QuoteIcon({ bg, stroke }) {
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
      style={{ background: bg }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"
          stroke={stroke}
          strokeWidth="1.5"
          fill={bg}
        />
        <path
          d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"
          stroke={stroke}
          strokeWidth="1.5"
          fill={bg}
        />
      </svg>
    </div>
  );
}

function ExtraFeaturesSection() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const total = slides.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  const slide = slides[current];

  return (
    <section className="w-full bg-[#f0f2f0] py-12 sm:py-16 px-5 sm:px-10 md:px-14 lg:px-20">

      {/* ── Section header ── */}
      <div className="flex items-start justify-between mb-8 text-left">
        <div>
          {/* Badge */}
          <div className="inline-flex items-center border border-gray-300 bg-white rounded-full px-3 py-1 mb-3">
            <span className="text-gray-500 text-xs font-semibold tracking-widest uppercase">Spotlight</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
            Three tools learners swear by
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            The three services our learners credit most for their offers.
          </p>
        </div>

        {/* Prev / Next arrows */}
        <div className="flex items-center gap-2 mt-2 flex-shrink-0">
          <button
            onClick={prev}
            className="w-9 h-9 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition shadow-sm"
            aria-label="Previous"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button
            onClick={next}
            className="w-9 h-9 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition shadow-sm"
            aria-label="Next"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Spotlight card ── */}
      <div className="flex flex-col md:flex-row gap-5 items-stretch">

        {/* LEFT: feature photo */}
        <div className="relative flex-shrink-0 w-full md:w-[48%] rounded-2xl overflow-hidden shadow-md min-h-[220px] md:min-h-[280px]">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover absolute inset-0"
          />
          {/* FEATURED badge */}
          <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded">
            Featured
          </span>
        </div>

        {/* RIGHT: info card */}
        <div className="flex-1 bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
          <div>
            <QuoteIcon bg={slide.iconBg} stroke={slide.iconStroke} />
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-3">{slide.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{slide.description}</p>
          </div>

          {/* Button + dot indicators */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(slide.btnTo)}
              className={`flex items-center gap-2 ${slide.btnColor} text-white text-sm font-semibold rounded-full px-5 py-2 transition`}
            >
              {slide.btnLabel} <span className="text-base leading-none">↗</span>
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-200 ${
                    i === current
                      ? 'w-5 h-2 bg-gray-700'
                      : 'w-2 h-2 bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExtraFeaturesSection;
