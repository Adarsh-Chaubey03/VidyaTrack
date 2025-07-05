import React from 'react';

function Mentor() {
  return (
    <section className="w-full h-full flex flex-row items-center justify-between bg-orange-50 p-10">
      {/* Icon/Image Placeholder */}
      <div className="flex-1 text-left pr-8">
        <h3 className="text-3xl font-bold mb-2 text-orange-600">Mentor Guidance</h3>
        <div className="h-1 w-16 bg-orange-500 mb-4"></div>
        <p className="text-gray-700 mb-6 text-lg">Connect with experienced mentors to guide your learning journey and career decisions. Get personalized advice and support to achieve your goals.</p>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded">Get Started</button>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="w-40 h-40 bg-orange-200 rounded-full flex items-center justify-center">
          {/* Replace with your icon/image */}
          <span className="text-6xl text-orange-600">👨‍🏫</span>
        </div>
      </div>
    </section>
  );
}

export default Mentor; 