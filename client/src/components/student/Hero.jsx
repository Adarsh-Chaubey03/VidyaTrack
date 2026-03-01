import React from 'react'
import SearchBar from './SearchBar'

function Hero() {
  return (
    <div
      className='pt-8 pb-8 md:pt-14 md:pb-12 flex flex-col items-center justify-center w-full px-5 md:px-0 space-y-4 md:space-y-6 text-center relative overflow-hidden'
      style={{
        background: 'linear-gradient(160deg, #022c22 0%, #064e3b 30%, #065f46 55%, #0d9488 100%)',
      }}
    >
      {/* ── Subtle AI-themed SVG decorations ── */}

      {/* Top-left: circuit / brain node cluster */}
      <svg className="absolute top-6 left-6 w-40 h-40 opacity-[0.06] pointer-events-none" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="4" fill="white"/>
        <circle cx="70" cy="20" r="3" fill="white"/>
        <circle cx="110" cy="40" r="4" fill="white"/>
        <circle cx="50" cy="70" r="3.5" fill="white"/>
        <circle cx="90" cy="80" r="4" fill="white"/>
        <circle cx="130" cy="70" r="3" fill="white"/>
        <circle cx="30" cy="110" r="3" fill="white"/>
        <circle cx="70" cy="120" r="4" fill="white"/>
        <circle cx="110" cy="110" r="3.5" fill="white"/>
        <line x1="30" y1="30" x2="70" y2="20" stroke="white" strokeWidth="0.8"/>
        <line x1="70" y1="20" x2="110" y2="40" stroke="white" strokeWidth="0.8"/>
        <line x1="30" y1="30" x2="50" y2="70" stroke="white" strokeWidth="0.8"/>
        <line x1="70" y1="20" x2="90" y2="80" stroke="white" strokeWidth="0.8"/>
        <line x1="110" y1="40" x2="130" y2="70" stroke="white" strokeWidth="0.8"/>
        <line x1="50" y1="70" x2="90" y2="80" stroke="white" strokeWidth="0.8"/>
        <line x1="90" y1="80" x2="130" y2="70" stroke="white" strokeWidth="0.8"/>
        <line x1="30" y1="110" x2="70" y2="120" stroke="white" strokeWidth="0.8"/>
        <line x1="70" y1="120" x2="110" y2="110" stroke="white" strokeWidth="0.8"/>
        <line x1="50" y1="70" x2="30" y2="110" stroke="white" strokeWidth="0.8"/>
        <line x1="90" y1="80" x2="70" y2="120" stroke="white" strokeWidth="0.8"/>
        <line x1="130" y1="70" x2="110" y2="110" stroke="white" strokeWidth="0.8"/>
      </svg>

      {/* Top-right: small brain icon */}
      <svg className="absolute top-10 right-10 w-24 h-24 opacity-[0.05] pointer-events-none" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 8c-4 0-7 2-9 5-3-1-7 0-9 3s-2 7 0 10c-3 2-5 6-4 10s4 7 8 8c1 4 4 7 8 8h12c4-1 7-4 8-8 4-1 7-4 8-8s-1-8-4-10c2-3 2-7 0-10s-6-4-9-3c-2-3-5-5-9-5z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M32 8v48M22 18c3 4 3 10 0 14M42 18c-3 4-3 10 0 14" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      </svg>

      {/* Bottom-left: data / chip pattern */}
      <svg className="absolute bottom-8 left-8 w-32 h-32 opacity-[0.05] pointer-events-none" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="40" width="48" height="48" rx="6" stroke="white" strokeWidth="1.5"/>
        <rect x="52" y="52" width="24" height="24" rx="3" stroke="white" strokeWidth="1"/>
        {/* pins top */}
        <line x1="52" y1="40" x2="52" y2="28" stroke="white" strokeWidth="1"/><line x1="64" y1="40" x2="64" y2="28" stroke="white" strokeWidth="1"/><line x1="76" y1="40" x2="76" y2="28" stroke="white" strokeWidth="1"/>
        {/* pins bottom */}
        <line x1="52" y1="88" x2="52" y2="100" stroke="white" strokeWidth="1"/><line x1="64" y1="88" x2="64" y2="100" stroke="white" strokeWidth="1"/><line x1="76" y1="88" x2="76" y2="100" stroke="white" strokeWidth="1"/>
        {/* pins left */}
        <line x1="40" y1="52" x2="28" y2="52" stroke="white" strokeWidth="1"/><line x1="40" y1="64" x2="28" y2="64" stroke="white" strokeWidth="1"/><line x1="40" y1="76" x2="28" y2="76" stroke="white" strokeWidth="1"/>
        {/* pins right */}
        <line x1="88" y1="52" x2="100" y2="52" stroke="white" strokeWidth="1"/><line x1="88" y1="64" x2="100" y2="64" stroke="white" strokeWidth="1"/><line x1="88" y1="76" x2="100" y2="76" stroke="white" strokeWidth="1"/>
      </svg>

      {/* Bottom-right: network graph dots */}
      <svg className="absolute bottom-6 right-6 w-36 h-36 opacity-[0.06] pointer-events-none" viewBox="0 0 144 144" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="72" cy="72" r="5" fill="white"/>
        <circle cx="30" cy="40" r="3" fill="white"/>
        <circle cx="114" cy="40" r="3" fill="white"/>
        <circle cx="30" cy="104" r="3" fill="white"/>
        <circle cx="114" cy="104" r="3" fill="white"/>
        <circle cx="72" cy="20" r="2.5" fill="white"/>
        <circle cx="72" cy="124" r="2.5" fill="white"/>
        <circle cx="20" cy="72" r="2.5" fill="white"/>
        <circle cx="124" cy="72" r="2.5" fill="white"/>
        <line x1="72" y1="72" x2="30" y2="40" stroke="white" strokeWidth="0.7"/>
        <line x1="72" y1="72" x2="114" y2="40" stroke="white" strokeWidth="0.7"/>
        <line x1="72" y1="72" x2="30" y2="104" stroke="white" strokeWidth="0.7"/>
        <line x1="72" y1="72" x2="114" y2="104" stroke="white" strokeWidth="0.7"/>
        <line x1="72" y1="72" x2="72" y2="20" stroke="white" strokeWidth="0.7"/>
        <line x1="72" y1="72" x2="72" y2="124" stroke="white" strokeWidth="0.7"/>
        <line x1="72" y1="72" x2="20" y2="72" stroke="white" strokeWidth="0.7"/>
        <line x1="72" y1="72" x2="124" y2="72" stroke="white" strokeWidth="0.7"/>
        <line x1="30" y1="40" x2="72" y2="20" stroke="white" strokeWidth="0.5"/>
        <line x1="114" y1="40" x2="72" y2="20" stroke="white" strokeWidth="0.5"/>
        <line x1="30" y1="104" x2="72" y2="124" stroke="white" strokeWidth="0.5"/>
        <line x1="114" y1="104" x2="72" y2="124" stroke="white" strokeWidth="0.5"/>
        <line x1="30" y1="40" x2="20" y2="72" stroke="white" strokeWidth="0.5"/>
        <line x1="30" y1="104" x2="20" y2="72" stroke="white" strokeWidth="0.5"/>
        <line x1="114" y1="40" x2="124" y2="72" stroke="white" strokeWidth="0.5"/>
        <line x1="114" y1="104" x2="124" y2="72" stroke="white" strokeWidth="0.5"/>
      </svg>

      {/* Soft radial glow overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(16,185,129,0.12) 0%, transparent 70%)' }} />

      <h1 className='text-2xl sm:text-3xl md:text-5xl font-bold text-white max-w-3xl mx-auto relative z-10'>
        Empower Your Future: <span className='text-emerald-400'>Personalized Growth & Career Tools</span>
      </h1>
      <p className='text-gray-300 text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl mx-auto z-10 px-2'>
        Don't Journey Solo—Unlock Your Potential with 1:1 Mentorship and Career-Building Tools from Top Experts in Tech, Business, and Beyond!
      </p>
      <div className='z-10'>
        <SearchBar/>
      </div>
    </div>
  )
}

export default Hero
