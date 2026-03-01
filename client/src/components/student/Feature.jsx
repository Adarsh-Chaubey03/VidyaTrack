import React from 'react';
import { Link } from 'react-router-dom';
// Placeholder icons, replace with your assets later
import { BookOpen, User, FileText, Edit, BrainCircuit, Lightbulb } from 'lucide-react';

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
    key: 'ai-career-copilot',
    title: 'AI Career Copilot',
    desc: 'Get a personalized career roadmap powered by AI. Identify skill gaps and plan your placement journey.',
    icon: <BrainCircuit size={32} className="text-cyan-600" />,
    bg: 'bg-cyan-50',
  },
  {
    key: 'request-feature',
    title: 'Request a Feature',
    desc: 'Tell us what service or feature you want next. We review every request.',
    icon: <Lightbulb size={32} className="text-purple-600" />,
    bg: 'bg-purple-50',
  },
];

function Feature() {
  return (
    <div id="our-services" className="w-full bg-gradient-to-b from-white to-rose-50 flex flex-col items-center mt-10 pb-10 scroll-mt-28 md:scroll-mt-32 px-4 md:px-0">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 mt-4 text-center">Our Top Services</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 w-full max-w-6xl">
        {features.map((feature, idx) => (
          <div key={feature.key} className={`rounded-xl p-3 sm:p-6 flex flex-col justify-between shadow ${feature.bg}`}>
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">{React.cloneElement(feature.icon, { size: undefined, className: `${feature.icon.props.className} w-5 h-5 sm:w-8 sm:h-8` })}<span className="text-sm sm:text-xl font-semibold">{feature.title}</span></div>
            <p className="mb-2 sm:mb-4 text-left text-gray-700 text-xs sm:text-base line-clamp-3 sm:line-clamp-none">{feature.desc}</p>
            {feature.key === 'courses' ? (
              <Link to="/course-list" className="bg-emerald-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-emerald-700 w-fit text-center text-xs sm:text-sm">Know More</Link>
            ) : feature.key === 'mentor' ? (
              <Link to="/mentor" className="bg-orange-500 hover:bg-orange-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded w-fit text-white text-xs sm:text-sm">Know More</Link>
            ) : feature.key === 'ai-career-copilot' ? (
              <Link to="/ai-career-copilot" className="bg-cyan-600 hover:bg-cyan-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded w-fit text-white text-xs sm:text-sm">Try AI Copilot</Link>
            ) : feature.key === 'resume' ? (
              <Link to="/resumereview" className="bg-blue-500 hover:bg-blue-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded w-fit text-white text-xs sm:text-sm">Know More</Link>
            ) : feature.key === 'request-feature' ? (
              <Link to="/request-feature" className="bg-purple-600 hover:bg-purple-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded w-fit text-white text-xs sm:text-sm">Request</Link>
            ) : feature.key === 'blog' ? (
              <Link to="/blog" className="bg-pink-500 hover:bg-pink-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded w-fit text-white text-xs sm:text-sm">Know More</Link>
            ) : (
              <button className="bg-gray-500 hover:bg-gray-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded w-fit text-white text-xs sm:text-sm">Know More</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feature; 