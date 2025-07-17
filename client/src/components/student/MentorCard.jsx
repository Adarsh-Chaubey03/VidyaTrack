import React from 'react';
import { Star } from 'lucide-react';

function MentorCard({ mentor }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border p-4 md:p-8 flex flex-col md:flex-row gap-4 md:gap-8 items-stretch w-full max-w-[900px] min-w-[220px] h-auto md:h-[380px] mx-auto">
      <div className="flex-shrink-0 flex items-center justify-center h-full">
        <img src={mentor.image} alt={mentor.name} className="w-24 h-24 md:w-40 md:h-40 rounded-xl object-cover" />
      </div>
      <div className="flex-1 w-full flex flex-col justify-between h-full">
        {/* Name and Title */}
        <div className="flex flex-col min-h-[50px] md:min-h-[70px]">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg md:text-2xl font-bold text-gray-900">{mentor.name}</h2>
            <span className="text-xs text-gray-500 font-bold">IN</span>
          </div>
          <div className="text-gray-700 font-medium mb-1 text-xs md:text-base">{mentor.title} @{mentor.company}</div>
        </div>
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2 min-h-[24px] md:min-h-[32px]">
          <span className="text-emerald-600 font-bold text-sm md:text-base">{mentor.rating.toFixed(1)}</span>
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`inline w-3 h-3 md:w-4 md:h-4 ${i < Math.round(mentor.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
          ))}
          <span className="text-gray-500 text-xs md:text-sm ml-1">({mentor.reviews} reviews)</span>
        </div>
        <div className="mb-2 md:mb-3" />
        {/* Description */}
        <div className="text-gray-600 mb-2 min-h-[40px] md:min-h-[60px] flex items-center text-xs md:text-base">{mentor.description}</div>
        <div className="mb-2 md:mb-3" />
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-2 min-h-[24px] md:min-h-[32px]">
          {mentor.tags.map(tag => (
            <span key={tag} className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-[10px] md:text-xs font-semibold">{tag}</span>
          ))}
        </div>
        <div className="mb-2 md:mb-3" />
        {/* Price and Badges */}
        <div className="flex items-center gap-2 md:gap-4 mt-2 min-h-[28px] md:min-h-[36px]">
          <span className="text-lg md:text-2xl font-extrabold text-gray-900">${mentor.price} <span className="text-xs md:text-base font-normal text-gray-500">/month</span></span>
          {mentor.freeTrial && <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded-full text-[10px] md:text-xs font-bold">7 Day Free Trial</span>}
          {mentor.spotsLeft <= 5 && <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded-full text-[10px] md:text-xs font-bold">Only {mentor.spotsLeft > 1 ? 's' : ''} Left</span>}
        </div>
        {/* View Profile Button */}
        <div className="flex w-full justify-center mt-3 md:mt-4">
          <a href={mentor.profileUrl} className="w-full max-w-xs text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 md:py-3 rounded-lg shadow transition text-sm md:text-base">
            View Profile
          </a>
        </div>
      </div>
    </div>
  );
}

export default MentorCard; 