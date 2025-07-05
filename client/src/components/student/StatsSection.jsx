import React, { useEffect, useRef, useState } from 'react';

const stats = [
  {
    icon: (
      <svg width="48" height="48" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
    ),
    label: 'Teachers',
    value: 320,
    suffix: '+',
    duration: 4000,
  },
  {
    icon: (
      <svg width="48" height="48" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21v-2c0-2.5 3.5-4 6.5-4s6.5 1.5 6.5 4v2"/></svg>
    ),
    label: 'Students',
    value: 15000,
    suffix: '',
    duration: 6000,
  },
  {
    icon: (
      <svg width="48" height="48" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 21h8"/></svg>
    ),
    label: 'Animations & Videos',
    value: 1500,
    suffix: '+',
    duration: 5000,
  },
  {
    icon: (
      <svg width="48" height="48" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 2v4M16 2v4"/></svg>
    ),
    label: 'Recorded Lectures*',
    value: 2700,
    suffix: '',
    duration: 5000,
  },
  {
    icon: (
      <svg width="48" height="48" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg>
    ),
    label: 'Questions',
    value: 17000,
    suffix: '',
    duration: 7000,
  },
];

function useCountUp(end, duration) {
  const [count, setCount] = useState(0);
  const start = useRef(0);
  useEffect(() => {
    let startTimestamp = null;
    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * (end - start.current) + start.current));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    }
    requestAnimationFrame(step);
    // eslint-disable-next-line
  }, [end, duration]);
  return count;
}

const formatNumber = (num) => {
  return num.toLocaleString('en-IN');
};

const StatsSection = () => {
  return (
    <section className="w-full py-16 bg-emerald-500 relative overflow-hidden ">
      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
      <div className="relative z-10 flex flex-col items-center justify-center">
        <h2 className="text-white text-4xl md:text-5xl font-bold text-center mb-4">Empowering Learning: <br />Let’s Spark Transformation </h2>
        <div className="flex flex-wrap justify-center gap-12 mt-10 w-full max-w-6xl">
          {stats.map((stat, idx) => {
            const count = useCountUp(stat.value, stat.duration);
            return (
              <div key={stat.label} className="flex flex-col items-center min-w-[180px]">
                <div className="mb-2">{stat.icon}</div>
                <div className="text-white text-3xl md:text-4xl font-bold">
                  {formatNumber(count)}{stat.suffix}
                </div>
                <div className="text-white text-lg mt-1 font-medium opacity-90 text-center">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection; 