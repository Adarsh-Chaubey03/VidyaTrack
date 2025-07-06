import React, { useState } from 'react';
import { mentors } from '../../assets/assets';
import Footer from '../../components/student/Footer';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';

const categories = [
  'Engineering Mentors',
  'Design Mentors',
  'Startup Mentors',
  'AI Mentors',
  'Product Managers',
  'Marketing Coaches',
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
      {/* Top Category Nav */}
      <div className="w-full bg-white border-b sticky top-0 z-20 overflow-x-auto">
        <div className="flex whitespace-nowrap justify-center gap-4 px-2 py-3 text-[15px] font-medium">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setCurrent(0); }}
              className={`px-3 py-1 rounded-full transition-all duration-200 ${selectedCategory === cat ? 'bg-emerald-100 text-emerald-700 font-bold' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 px-4 md:px-20 py-12 bg-gradient-to-b from-emerald-50 to-white">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center mb-4">
            <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-sm mr-2">Just in!</span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">New mentors this month</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Find online mentors and career coaches <br className="hidden md:block" /> based in India
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
            Stuck in making the next step in your career? Make the life-changing decision & get mentoring from a trained expert in India. Get that knowledge, accountability & support you need.
          </p>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-full text-lg shadow-lg transition">
            Find a mentor in India →
          </button>
        </div>
        <div className="flex-1 flex justify-center md:justify-end">
          <img src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=400&h=400&q=80" alt="Mentor Hero" className="rounded-2xl shadow-xl w-64 h-64 object-cover border-4 border-emerald-100" />
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
