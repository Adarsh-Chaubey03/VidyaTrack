import React from 'react';
import { Link } from 'react-router-dom';
// Placeholder icons, replace with your assets later
import { BookOpen, User, FileText, Edit, GraduationCap, ClipboardList } from 'lucide-react';

const features = [
  {
    key: 'mentor',
    title: 'Mentor',
    desc: 'Connect with experienced mentors to guide your learning journey and career decisions.',
    icon: <User size={32} className="text-orange-500" />, // Replace with your icon
    bg: 'bg-orange-50',
  },
  {
    key: 'resume',
    title: 'Resume',
    desc: 'Build and polish your resume with expert tips and easy-to-use tools.',
    icon: <FileText size={32} className="text-blue-500" />, // Replace with your icon
    bg: 'bg-blue-50',
  },
  {
    key: 'courses',
    title: 'Courses',
    desc: 'Explore courses to boost your skills.\nFind the perfect fit for your goals!',
    icon: <BookOpen size={32} className="text-emerald-600" />, // Replace with your icon
    bg: 'bg-emerald-50',
  },
  {
    key: 'blog',
    title: 'Blog',
    desc: 'Read insightful articles, tips, and stories from experts and learners like you.',
    icon: <Edit size={32} className="text-pink-500" />, // Replace with your icon
    bg: 'bg-pink-50',
  },
  {
    key: 'interview',
    title: 'Interview Prep',
    desc: 'Practice with curated questions.\nGet advice and boost confidence.',
    icon: <GraduationCap size={32} className="text-purple-500" />, // Replace with your icon
    bg: 'bg-purple-50',
  },
  {
    key: 'testseries',
    title: 'Test Series',
    desc: 'Practice with real exam-like test series to assess and improve your preparation.',
    icon: <ClipboardList size={32} className="text-yellow-500" />, // Replace with your icon
    bg: 'bg-yellow-50',
  },
];

function Feature() {
  return (
    <div id="our-services" className="w-full bg-gradient-to-b from-white to-rose-50 flex flex-col items-center mt-10 pb-10 scroll-mt-28 md:scroll-mt-32">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 mt-4 text-center">Our Top Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {features.map((feature, idx) => (
          <div key={feature.key} className={`rounded-xl p-6 flex flex-col justify-between shadow ${feature.bg}`}>
            <div className="flex items-center gap-3 mb-2">{feature.icon}<span className="text-xl font-semibold">{feature.title}</span></div>
            <p className="mb-4 text-left text-gray-700">{feature.desc}</p>
            {feature.key === 'courses' ? (
              <Link to="/course-list" onClick={() => window.scrollTo(0,0)} className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 w-fit text-center">Know More</Link>
            ) : feature.key === 'mentor' ? (
              <Link to="/mentor" onClick={() => window.scrollTo(0,0)} className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded w-fit text-white">Know More</Link>
            ) : feature.key === 'testseries' ? (
              <Link to="/testseries" onClick={() => window.scrollTo(0,0)} className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded w-fit text-white">Know More</Link>
            ) : feature.key === 'resume' ? (
              <Link to="/resumereview" onClick={() => window.scrollTo(0,0)} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded w-fit text-white">Know More</Link>
            ) : feature.key === 'interview' ? (
              <Link to="/interview" onClick={() => window.scrollTo(0,0)} className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded w-fit text-white">Know More</Link>
            ) : feature.key === 'blog' ? (
              <button className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded w-fit text-white">Know More</button>
            ) : (
              <button className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded w-fit text-white">Know More</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feature; 