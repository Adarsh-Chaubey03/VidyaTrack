import React from 'react';
import { assets } from '../../assets/assets';

const featureCards = [
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 7h8M8 11h6"/></svg>
    ),
    title: 'Read Blog',
    desc: 'Explore insights, tips, and stories on our learning blog.'
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20v-6M6 12l6-6 6 6"/></svg>
    ),
    title: 'Career Growth',
    desc: 'Gain real-world skills to boost your career.'
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 2v4M16 2v4"/></svg>
    ),
    title: 'Community Support',
    desc: 'Join a vibrant community of learners and mentors.'
  },
];

function CallToAction() {
    return (
        <section className="mb-10 w-full min-h-[60vh] bg-gradient-to-b from-rose-100 via-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 px-6 md:px-32 py-20 flex flex-col-reverse md:flex-row items-center justify-between gap-12">

            {/* LEFT - TEXT */}
            <div className="max-w-xl text-center md:text-left flex flex-col justify-center">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 dark:text-white">
                    Unlock Limitless <br className="hidden md:block" />
                    <span className="text-emerald-600">Learning</span> Opportunities
                </h1>
                <p className="mt-6 text-gray-600 dark:text-gray-300 text-base md:text-lg">
                    Learn from expert educators anytime, anywhere. Gain real-world skills to transform your career at your own pace.
                </p>

                {/* BUTTONS */}
                <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg">
                        Get Started
                    </button>
                </div>
            </div>
            {/* RIGHT - CARDS */}
            <div className="w-full md:w-[400px] flex flex-col items-center gap-6">
                {featureCards.map((card, idx) => {
                  const isCareer = card.title === 'Career Growth';
                  const handleClick = () => {
                    if (isCareer) {
                      const el = document.getElementById('our-services');
                      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  };
                  const handleKeyDown = (e) => {
                    if (!isCareer) return;
                    if (e.key === 'Enter' || e.key === ' ') handleClick();
                  };

                  return (
                    <div
                      key={idx}
                      onClick={handleClick}
                      onKeyDown={handleKeyDown}
                      role={isCareer ? 'button' : undefined}
                      tabIndex={isCareer ? 0 : undefined}
                      className={`w-full bg-white rounded-2xl shadow-md flex items-center gap-4 p-4 hover:shadow-lg transition-all ${isCareer ? 'cursor-pointer' : ''}`}
                    >
                      <div className="flex-shrink-0 bg-emerald-100 rounded-xl p-2 flex items-center justify-center">
                        {card.icon}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-lg text-emerald-700">{card.title}</div>
                        <div className="text-gray-500 text-sm mt-1">{card.desc}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
        </section>
    );
}

export default CallToAction;
