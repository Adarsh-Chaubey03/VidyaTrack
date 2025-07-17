import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../components/student/Footer';
import { assets } from '../../assets/assets';

const getProfilePic = (pro) => {
  if (!pro) return '';
  if (pro.id === 1) return assets.b1;
  if (pro.id === 2) return assets.g1;
  if (pro.id === 3) return assets.b2;
  if (pro.id === 4) return assets.g2;
  return pro.profilePic;
};

export default function GetReviewed() {
  const { state: pro } = useLocation();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!pro) {
    // If no professional data, redirect back
    navigate('/resumereview');
    return null;
  }

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Placeholder: booking logic here
    setTimeout(() => {
      setLoading(false);
      alert('Resume submitted for review! (Booking/payment integration coming soon)');
      navigate('/resumereview');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-rose-50 to-emerald-50">
      <section className="max-w-xl mx-auto w-full p-6 md:p-12 bg-white rounded-3xl shadow-xl mt-10 mb-6 flex flex-col items-center">
        <img src={getProfilePic(pro)} alt={pro.name} className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100 shadow mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{pro.name}</h1>
        <div className="text-base text-gray-500 mb-1">{pro.specialization}</div>
        <div className="text-xs text-gray-400 mb-2">{pro.industry}</div>
        <div className="flex items-center justify-center mb-2">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < pro.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
          ))}
        </div>
        <div className="text-lg font-semibold text-emerald-600 mb-4">₹{pro.price}</div>
        <form className="w-full flex flex-col gap-4 items-center" onSubmit={handleSubmit}>
          <label className="w-full text-left font-semibold">Upload Your Resume (PDF or DOCX)</label>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} required className="w-full border rounded-lg px-4 py-2" />
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-full text-lg shadow transition w-full mt-4" disabled={loading}>{loading ? 'Submitting...' : 'Book Review'}</button>
        </form>
      </section>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
} 