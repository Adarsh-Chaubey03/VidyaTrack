import React from 'react';

function ResumeReview() {
  return (
    <section className="w-full h-full flex flex-row items-center justify-between bg-blue-50 p-10">
      {/* Icon/Image Placeholder */}
      <div className="flex-1 text-left pr-8">
        <h3 className="text-3xl font-bold mb-2 text-blue-600">Resume Review</h3>
        <div className="h-1 w-16 bg-blue-500 mb-4"></div>
        <p className="text-gray-700 mb-6 text-lg">Build and polish your resume with expert tips and easy-to-use tools. Get feedback to make your resume stand out to employers.</p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded">Get Started</button>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="w-40 h-40 bg-blue-200 rounded-full flex items-center justify-center">
          {/* Replace with your icon/image */}
          <span className="text-6xl text-blue-600">📄</span>
        </div>
      </div>
    </section>
  );
}

export default ResumeReview; 