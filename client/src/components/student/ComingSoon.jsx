import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { Clock } from 'lucide-react';

function ComingSoon({ banner, subtext, icon }) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-white via-rose-50 to-emerald-50">
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <div className="flex flex-col items-center gap-6">
          <div className="bg-emerald-100 rounded-full p-6 mb-2 shadow-lg">
            {icon || <Clock className="w-16 h-16 text-emerald-500" />}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 text-center drop-shadow-lg">{banner}</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-xl text-center">{subtext}</p>
          <Link to="/" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-full text-lg shadow transition">Return Home</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ComingSoon; 