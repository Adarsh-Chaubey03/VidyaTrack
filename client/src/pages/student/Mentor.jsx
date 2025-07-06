import React, { useState } from 'react';
import { mentors, assets } from '../../assets/assets';
import Footer from '../../components/student/Footer';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';

const categories = [
  'Engineering Mentors',
  'Startup Mentors',
  'Leadership Mentors',
  'Career Coaches',
];

function Mentor() {
  const [current, setCurrent] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const filteredMentors = mentors.filter(m => m.tags.some(tag => selectedCategory.toLowerCase().includes(tag.toLowerCase().split(' ')[0])) || selectedCategory === categories[0]);

  const handlePrev = () => setCurrent((prev) => (prev === 0 ? filteredMentors.length - 1 : prev - 1));
  const handleNext = () => setCurrent((prev) => (prev === filteredMentors.length - 1 ? 0 : prev + 1));

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 px-4 md:px-20 py-12 bg-gradient-to-b from-emerald-50 to-white mt-0">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center mb-4">
            <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-sm mr-2">Top Rated</span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Trusted by 10,000+ learners</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Connect with World-Class Mentors for Your Career Growth
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
            Accelerate your journey with personalized guidance from industry leaders. Get expert advice, accountability, and support to reach your professional goals—no matter where you are.
          </p>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-full text-lg shadow-lg transition">
            Find a mentor
          </button>
        </div>
        <div className="flex-1 flex justify-center md:justify-end">
          <img src={assets.mentor_bg} alt="Mentor Hero" className="rounded-2xl w-80 h-80 object-contain md:mr-12" />
        </div>
      </section>

      {/* Mentor Card Carousel */}
      <section className="w-full flex flex-col items-center py-10 px-2 md:px-0">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={handlePrev} className="p-2 rounded-full bg-white border shadow hover:bg-emerald-50 transition"><ArrowLeft className="w-6 h-6 text-emerald-600" /></button>
          <div className="w-full max-w-2xl">
            {filteredMentors.length > 0 ? (
              <MentorCard mentor={filteredMentors[current]} />
            ) : (
              <div className="text-center text-gray-500 py-12">No mentors found for this category.</div>
            )}
          </div>
          <button onClick={handleNext} className="p-2 rounded-full bg-white border shadow hover:bg-emerald-50 transition"><ArrowRight className="w-6 h-6 text-emerald-600" /></button>
        </div>
        <div className="flex gap-2 mt-2">
          {filteredMentors.map((_, idx) => (
            <span key={idx} className={`w-2 h-2 rounded-full ${idx === current ? 'bg-emerald-600' : 'bg-gray-300'}`}></span>
          ))}
        </div>
      </section>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

function MentorCard({ mentor }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border p-6 flex flex-col md:flex-row gap-6 items-center max-w-2xl mx-auto min-w-[320px]">
      <div className="flex-shrink-0">
        <img src={mentor.image} alt={mentor.name} className="w-32 h-32 rounded-xl object-cover border-2 border-emerald-100" />
      </div>
      <div className="flex-1 w-full">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-2xl font-bold text-gray-900">{mentor.name}</h2>
          <span className="text-xs text-gray-500 font-bold">IN</span>
        </div>
        <div className="text-gray-700 font-medium mb-1">{mentor.title} @{mentor.company}</div>
        <div className="flex items-center gap-1 mb-2">
          <span className="text-emerald-600 font-bold">{mentor.rating.toFixed(1)}</span>
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`inline w-4 h-4 ${i < Math.round(mentor.rating) ? 'fill-emerald-500 text-emerald-500' : 'text-gray-300'}`} />
          ))}
          <span className="text-gray-500 text-sm ml-1">({mentor.reviews} reviews)</span>
        </div>
        <div className="text-gray-600 mb-2 line-clamp-3">{mentor.description}</div>
        <div className="flex flex-wrap gap-2 mb-2">
          {mentor.tags.map(tag => (
            <span key={tag} className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-xs font-semibold">{tag}</span>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-2xl font-extrabold text-gray-900">${mentor.price} <span className="text-base font-normal text-gray-500">/month</span></span>
          {mentor.freeTrial && <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-bold">7 Day Free Trial</span>}
          {mentor.spotsLeft <= 5 && <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-xs font-bold">Only {mentor.spotsLeft} Spot{mentor.spotsLeft > 1 ? 's' : ''} Left</span>}
        </div>
        <a href={mentor.profileUrl} className="inline-block mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-full shadow transition">View Profile</a>
      </div>
    </div>
  );
}

export default Mentor;
