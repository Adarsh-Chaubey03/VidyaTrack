import React from 'react';
import { assets } from '../../assets/assets';

function CallToAction() {
  return (
    <section className="w-full h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 px-6 md:px-32 py-20 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
      
      {/* LEFT - TEXT */}
      <div className="max-w-xl text-center md:text-left">
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
          <button className="flex items-center gap-2 border border-emerald-600 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-gray-700 px-6 py-3 rounded-xl font-medium transition-all">
            Learn More
            <img src={assets.arrow_icon} alt="arrow" className="w-4 h-4" />
          </button>
        </div>
      </div>{/* RIGHT - IMAGE */}
<div className="w-full md:w-[600px] flex justify-center md:justify-end">
  <img
    src={assets.learning}
    alt="Learning Illustration"
    className="w-72 md:w-[500px] lg:w-[600px] object-contain"
  />
</div>

    </section>
  );
}

export default CallToAction;
