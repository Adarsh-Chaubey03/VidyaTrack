import React from 'react';

function TestSeries() {
  return (
    <section className="w-full flex flex-col md:flex-row-reverse items-center justify-between bg-yellow-50 rounded-xl shadow p-8 my-8">
      {/* Icon/Image Placeholder */}
      <div className="flex-1 flex justify-center mb-6 md:mb-0">
        <div className="w-32 h-32 bg-yellow-200 rounded-full flex items-center justify-center">
          {/* Replace with your icon/image */}
          <span className="text-5xl text-yellow-600">📝</span>
        </div>
      </div>
      {/* Text Content */}
      <div className="flex-1 text-left md:pr-12">
        <h3 className="text-2xl font-bold mb-2 text-yellow-600">Test Series</h3>
        <p className="text-gray-700 mb-4">Practice with real exam-like test series to assess and improve your preparation. Track your progress and get instant feedback.</p>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded">Get Started</button>
      </div>
    </section>
  );
}

export default TestSeries; 