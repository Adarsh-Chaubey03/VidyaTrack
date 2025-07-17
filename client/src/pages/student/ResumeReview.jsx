import React from 'react';
import ProfessionalCard from '../../components/student/ProfessionalCard';
import Footer from '../../components/student/Footer';
import { useNavigate } from 'react-router-dom';

const professionals = [
  {
    id: 1,
    profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'Amit Sharma',
    specialization: 'Software Engineer',
    industry: 'IT & Software',
    price: 499,
    rating: 5,
  },
  {
    id: 2,
    profilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
    name: 'Priya Singh',
    specialization: 'HR Manager',
    industry: 'Human Resources',
    price: 399,
    rating: 4,
  },
  {
    id: 3,
    profilePic: 'https://randomuser.me/api/portraits/men/65.jpg',
    name: 'Rahul Verma',
    specialization: 'Data Scientist',
    industry: 'Analytics',
    price: 599,
    rating: 5,
  },
  {
    id: 4,
    profilePic: 'https://randomuser.me/api/portraits/women/68.jpg',
    name: 'Sneha Patel',
    specialization: 'Marketing Lead',
    industry: 'Marketing',
    price: 449,
    rating: 4,
  },
];

export default function ResumeReview() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-rose-50 to-emerald-50">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-6 px-4 py-16 bg-gradient-to-b from-emerald-50 to-rose-50 text-center">
        <span className="bg-blue-100 text-blue-700 font-bold px-4 py-1 rounded-full text-sm mb-2 inline-flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          Resume Review by Experts
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          Get Your Resume Reviewed <span className="text-emerald-600">by Industry Professionals</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          Unlock your career potential! Connect with top professionals from various industries to get personalized feedback and actionable tips on your resume.
        </p>
        {/* Feature Buttons */}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl justify-center mt-8 items-end md:items-stretch">
          <div className="flex-1 bg-white rounded-2xl border border-blue-100 p-8 flex flex-col items-center text-center justify-between relative overflow-visible">
            {/* Embedded Icon */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-blue-100 rounded-full p-3 flex items-center justify-center border-4 border-white">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6" /></svg>
              </div>
            </div>
            <div className="pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate ATS-Friendly Resume</h2>
              <p className="text-gray-600 mb-6 text-base">
                Use our smart builder to create a professional, ATS-optimized resume in minutes. Choose from modern templates and export in PDF.
              </p>
            </div>
            <button onClick={() => navigate('/generateresume')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full text-lg transition w-full max-w-xs mt-4">Start Building</button>
          </div>
          <div className="flex-1 bg-white rounded-2xl border border-emerald-100 p-8 flex flex-col items-center text-center justify-between relative overflow-visible">
            {/* Embedded Icon */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-emerald-100 rounded-full p-3 flex items-center justify-center border-4 border-white">
                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4V7a4 4 0 00-8 0v3m12 0a4 4 0 01-8 0" /></svg>
              </div>
            </div>
            <div className="pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Reviewed by Industry Pros</h2>
              <p className="text-gray-600 mb-6 text-base">
                Upload your resume and receive personalized feedback and actionable tips from real professionals in your field.
              </p>
            </div>
            <button onClick={() => navigate('/getreviewed')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-full text-lg transition w-full max-w-xs mt-4">Get Reviewed</button>
          </div>
        </div>
      </section>
      {/* Professionals Grid */}
      {/*
      <section className="w-full max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {professionals.map((pro, idx) => (
          <ProfessionalCard key={pro.id} {...pro} onClick={() => navigate(`/getreviewed/${pro.id}`, { state: pro })} />
        ))}
      </section>
      */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
