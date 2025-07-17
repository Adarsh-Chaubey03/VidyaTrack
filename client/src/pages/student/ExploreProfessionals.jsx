import React from 'react';
import ProfessionalCard from '../../components/student/ProfessionalCard';
import Footer from '../../components/student/Footer';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

const professionals = [
  {
    id: 1,
    profilePic: assets.b1,
    name: 'Amit Sharma',
    specialization: 'Software Engineer',
    industry: 'IT & Software',
    price: 499,
    rating: 5,
  },
  {
    id: 2,
    profilePic: assets.g1,
    name: 'Priya Singh',
    specialization: 'HR Manager',
    industry: 'Human Resources',
    price: 399,
    rating: 4,
  },
  {
    id: 3,
    profilePic: assets.b2,
    name: 'Rahul Verma',
    specialization: 'Data Scientist',
    industry: 'Analytics',
    price: 599,
    rating: 5,
  },
  {
    id: 4,
    profilePic: assets.g2,
    name: 'Sneha Patel',
    specialization: 'Marketing Lead',
    industry: 'Marketing',
    price: 449,
    rating: 4,
  },
];

export default function ExploreProfessionals() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-rose-50 to-emerald-50">
      <section className="flex flex-col items-center justify-center gap-6 px-4 py-12 bg-gradient-to-b from-emerald-50 to-rose-50 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          Choose a Professional to Review Your Resume
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          Select from top industry professionals to get personalized feedback and actionable tips on your resume.
        </p>
      </section>
      <section className="w-full max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {professionals.map((pro) => (
          <ProfessionalCard key={pro.id} {...pro} onClick={() => navigate(`/getreviewed/${pro.id}`, { state: pro })} buttonClassName="mt-4" />
        ))}
      </section>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
} 