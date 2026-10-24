import React from 'react';
import { Link } from 'react-router-dom';

/* ── Card definitions ── */
const features = [
  {
    key: 'courses',
    title: 'Courses',
    desc: 'Explore courses to boost your skills. Find the perfect fit for your goals!',
    linkLabel: 'Know More',
    to: '/course-list',
    iconColor: '#10b981',
    iconBg: '#ecfdf5',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
    blob: 'radial-gradient(circle at 85% 10%, #a7f3d055 0%, #6ee7b722 40%, transparent 70%)',
    linkColor: 'text-emerald-600 hover:text-emerald-700',
  },
  {
    key: 'mentor',
    title: 'Mentor',
    desc: 'Connect with experienced mentors to guide your learning journey and career decisions.',
    linkLabel: 'Know More',
    to: '/mentor',
    iconColor: '#f97316',
    iconBg: '#fff7ed',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    blob: 'radial-gradient(circle at 85% 10%, #fde68a55 0%, #fb923c22 40%, transparent 70%)',
    linkColor: 'text-orange-500 hover:text-orange-600',
  },
  {
    key: 'blog',
    title: 'Blog',
    desc: 'Read insightful articles, tips, and stories from experts and learners like you.',
    linkLabel: 'Know More',
    to: '/blog',
    iconColor: '#ec4899',
    iconBg: '#fdf2f8',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    blob: 'radial-gradient(circle at 85% 10%, #fbcfe855 0%, #f9a8d422 40%, transparent 70%)',
    linkColor: 'text-pink-500 hover:text-pink-600',
  },
  {
    key: 'ai-career-copilot',
    title: 'AI Career Copilot',
    desc: 'Get a personalized career roadmap powered by AI. Identify skill gaps and plan your placement journey.',
    linkLabel: 'Try AI Copilot',
    to: '/copilot',
    iconColor: '#0ea5e9',
    iconBg: '#f0f9ff',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4c0 1-.3 2-.8 2.8L20 14H4l4.8-5.2A4 4 0 0 1 8 6a4 4 0 0 1 4-4z"/>
        <path d="M12 14v4M8 18h8"/>
        <circle cx="12" cy="6" r="1" fill="#0ea5e9"/>
      </svg>
    ),
    blob: 'radial-gradient(circle at 85% 10%, #bae6fd55 0%, #7dd3fc22 40%, transparent 70%)',
    linkColor: 'text-sky-500 hover:text-sky-600',
  },
  {
    key: 'request-feature',
    title: 'Request a Feature',
    desc: 'Tell us what service or feature you want next. We review every request.',
    linkLabel: 'Request',
    to: '/request-feature',
    iconColor: '#8b5cf6',
    iconBg: '#f5f3ff',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="9" y1="18" x2="15" y2="18"/>
        <line x1="10" y1="22" x2="14" y2="22"/>
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
      </svg>
    ),
    blob: 'radial-gradient(circle at 85% 10%, #ddd6fe55 0%, #c4b5fd22 40%, transparent 70%)',
    linkColor: 'text-violet-600 hover:text-violet-700',
  },
];

/* ── Feature card ── */
function FeatureCard({ f, wide = false }) {
  return (
    <div
      className={`relative bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden ${wide ? 'col-span-1 sm:col-span-2 lg:col-span-1' : ''}`}
      style={{ minHeight: '200px' }}
    >
      {/* Decorative blob */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: f.blob }}
      />

      {/* Icon */}
      <div
        className="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
        style={{ background: f.iconBg }}
      >
        {f.icon}
      </div>

      {/* Text */}
      <div className="relative z-10 flex-1">
        <h3 className="text-base font-extrabold text-gray-900 mb-2">{f.title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-4">{f.desc}</p>
      </div>

      {/* Link */}
      <div className="relative z-10 mt-auto">
        <Link
          to={f.to}
          className={`inline-flex items-center gap-1 text-sm font-semibold ${f.linkColor} transition-colors`}
        >
          {f.linkLabel} <span className="text-base leading-none">↗</span>
        </Link>
      </div>
    </div>
  );
}

function Feature() {
  const top2   = features.slice(0, 2);   // 2-column row
  const bottom3 = features.slice(2, 5);  // 3-column row
  const last1  = features.slice(5);      // full-width last card

  return (
    <section
      id="our-services"
      className="w-full bg-[#f0f2f0] py-12 sm:py-16 px-5 sm:px-10 md:px-14 lg:px-20 scroll-mt-16"
    >
      {/* ── Section header ── */}
      <div className="mb-8 sm:mb-10 text-left">
        {/* Badge */}
        <div className="inline-flex items-center border border-gray-300 rounded-full px-3 py-1 mb-4">
          <span className="text-gray-500 text-xs font-semibold tracking-widest uppercase">Our Top Services</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight max-w-xl mb-3">
          Everything you need to go from{' '}
          <span className="text-emerald-500">learning</span> to placed
        </h2>
        <p className="text-gray-500 text-sm sm:text-base max-w-md leading-relaxed">
          Mentorship, courses, AI guidance and resume craft — every tool here points
          at one outcome: your next role.
        </p>
      </div>

      {/* ── Top 2 cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5">
        {top2.map(f => <FeatureCard key={f.key} f={f} />)}
      </div>

      {/* ── Middle 3 cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-4 sm:mb-5">
        {bottom3.map(f => <FeatureCard key={f.key} f={f} />)}
      </div>

      {/* ── Last full-width card ── */}
      <div className="grid grid-cols-1">
        {last1.map(f => (
          <div
            key={f.key}
            className="relative bg-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: f.blob }}
            />
            <div className="relative z-10 flex items-start gap-4 flex-1">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: f.iconBg }}
              >
                {f.icon}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-lg">{f.desc}</p>
              </div>
            </div>
            <div className="relative z-10 mt-4 sm:mt-0 sm:ml-6 flex-shrink-0">
              <Link
                to={f.to}
                className={`inline-flex items-center gap-1 text-sm font-semibold ${f.linkColor} transition-colors`}
              >
                {f.linkLabel} <span className="text-base leading-none">↗</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Feature;
