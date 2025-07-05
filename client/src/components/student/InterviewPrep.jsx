import React from 'react';

function InterviewPrep() {
  return (
    <section className="w-full h-full flex flex-row items-center justify-between bg-purple-50 p-10">
      {/* Icon/Image Placeholder */}
      <div className="flex-1 text-left pr-8">
        <h3 className="text-3xl font-bold mb-2 text-purple-600">Interview Prep</h3>
        <div className="h-1 w-16 bg-purple-500 mb-4"></div>
        <p className="text-gray-700 mb-6 text-lg">Prepare for interviews with curated questions, mock interviews, and expert advice. Boost your confidence and ace your next interview.</p>
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded">Get Started</button>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="w-40 h-40 bg-purple-200 rounded-full flex items-center justify-center">
          {/* Replace with your icon/image */}
          <span className="text-6xl text-purple-600">🎤</span>
        </div>
      </div>
    </section>
  );
}

export default InterviewPrep; 