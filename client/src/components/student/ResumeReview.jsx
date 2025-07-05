import React from 'react';

function ResumeReview() {
  return (
    <section className="w-full flex flex-col md:flex-row-reverse items-center justify-between bg-blue-50 rounded-xl shadow p-8 my-8">
      {/* Icon/Image Placeholder */}
      <div className="flex-1 flex justify-center mb-6 md:mb-0">
        <div className="w-32 h-32 bg-blue-200 rounded-full flex items-center justify-center">
          {/* Replace with your icon/image */}
          <span className="text-5xl text-blue-600">📄</span>
        </div>
      </div>
      {/* Text Content */}
      <div className="flex-1 text-left md:pr-12">
        <h3 className="text-2xl font-bold mb-2 text-blue-600">Resume Review</h3>
        <p className="text-gray-700 mb-4">Build and polish your resume with expert tips and easy-to-use tools. Get feedback to make your resume stand out to employers.</p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded">Get Started</button>
      </div>
    </section>
  );
}

export default ResumeReview; 