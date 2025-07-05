import React from 'react';

function TestSeries() {
  return (
    <section className="w-full h-full flex flex-row items-center justify-between bg-yellow-50 p-10">
      {/* Icon/Image Placeholder */}
      <div className="flex-1 text-left pr-8">
        <h3 className="text-3xl font-bold mb-2 text-yellow-600">Test Series</h3>
        <div className="h-1 w-16 bg-yellow-500 mb-4"></div>
        <p className="text-gray-700 mb-6 text-lg">Practice with real exam-like test series to assess and improve your preparation. Track your progress and get instant feedback.</p>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded">Get Started</button>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="w-40 h-40 bg-yellow-200 rounded-full flex items-center justify-center">
          {/* Replace with your icon/image */}
          <span className="text-6xl text-yellow-600">📝</span>
        </div>
      </div>
    </section>
  );
}

export default TestSeries; 