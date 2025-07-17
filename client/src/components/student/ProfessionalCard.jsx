import React from 'react';

export default function ProfessionalCard({ profilePic, name, specialization, industry, price, rating, onClick, buttonClassName }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition-transform w-full max-w-xs mx-auto">
      <img src={profilePic} alt={name || 'Professional'} className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-emerald-100 shadow" />
      <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
      <div className="text-sm text-gray-500 mb-1">{specialization}</div>
      <div className="text-xs text-gray-400 mb-2">{industry}</div>
      <div className="flex items-center justify-center mb-2">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
        ))}
      </div>
      <div className="text-lg font-semibold text-emerald-600 mb-3">₹{price}</div>
      <button onClick={onClick} className={`bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-full shadow transition w-full ${buttonClassName || ''}`}>Get Reviewed</button>
    </div>
  );
} 