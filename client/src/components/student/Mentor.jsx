import React from 'react';

function Mentor() {
  return (
    <section className="w-full flex flex-col md:flex-row items-center justify-between bg-orange-50 rounded-xl shadow p-8 my-8">
      {/* Icon/Image Placeholder */}
      <div className="flex-1 flex justify-center mb-6 md:mb-0">
        <div className="w-32 h-32 bg-orange-200 rounded-full flex items-center justify-center">
          {/* Replace with your icon/image */}
          <span className="text-5xl text-orange-600">👨‍🏫</span>
        </div>
      </div>
      {/* Text Content */}
      <div className="flex-1 text-left md:pl-12">
        <h3 className="text-2xl font-bold mb-2 text-orange-600">Mentor Guidance</h3>
        <p className="text-gray-700 mb-4">Connect with experienced mentors to guide your learning journey and career decisions. Get personalized advice and support to achieve your goals.</p>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded">Get Started</button>
      </div>
    </section>
  );
}

export default Mentor; 