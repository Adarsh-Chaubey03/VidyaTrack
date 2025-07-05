import React from 'react';

function InterviewPrep() {
  return (
    <section className="w-full flex flex-col md:flex-row items-center justify-between bg-purple-50 rounded-xl shadow p-8 my-8">
      {/* Icon/Image Placeholder */}
      <div className="flex-1 flex justify-center mb-6 md:mb-0">
        <div className="w-32 h-32 bg-purple-200 rounded-full flex items-center justify-center">
          {/* Replace with your icon/image */}
          <span className="text-5xl text-purple-600">🎤</span>
        </div>
      </div>
      {/* Text Content */}
      <div className="flex-1 text-left md:pl-12">
        <h3 className="text-2xl font-bold mb-2 text-purple-600">Interview Prep</h3>
        <p className="text-gray-700 mb-4">Prepare for interviews with curated questions, mock interviews, and expert advice. Boost your confidence and ace your next interview.</p>
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded">Get Started</button>
      </div>
    </section>
  );
}

export default InterviewPrep; 