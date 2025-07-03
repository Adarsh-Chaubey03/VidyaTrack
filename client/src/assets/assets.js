import React from 'react';
import { assets } from '../../assets/assets';
import SearchBar from './SearchBar';

function Hero() {
  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-[500px] px-7 md:px-0 pt-10 md:pt-20 space-y-7 text-center">
      
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-10"
      >
        <source src={assets.hero_bg} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-100/50 to-white/80 -z-10"></div>

      {/* Main Content */}
      <h1 className="text-3xl md:text-5xl font-bold text-gray-800 max-w-3xl mx-auto">
        Empower Your Future: <span className="text-green-600">Personalized Growth & Career Tools</span>
      </h1>

      <p className="hidden md:block text-gray-500 max-w-2xl mx-auto">
        Don't Journey Solo—Unlock Your Potential with 1:1 Mentorship and Career-Building Tools from Top Experts in Tech, Business, and Beyond!
      </p>

      <SearchBar />

      <div className="flex flex-wrap justify-center gap-3 mt-8">
        {['EXPLORE COURSES', 'RESUME REVIEW', 'BLOG SECTION', 'INTERVIEW PREP', 'Connect mentor'].map((item) => (
          <span
            key={item}
            className="px-5 py-2 bg-white border border-green-400 text-gray-500 rounded-full text-sm font-semibold uppercase cursor-pointer hover:bg-emerald-50 transition"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Hero;
