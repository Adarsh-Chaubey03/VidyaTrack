import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardList, 
  Users, 
  Code, 
  Database, 
  BarChart3, 
  Cpu, 
  Settings, 
  ArrowRight,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Footer from '../../components/student/Footer';

const InterviewPage = () => {
  const roleCategories = [
    {
      id: 'product-management',
      title: 'Product Management',
      icon: <ClipboardList size={24} className="text-emerald-600" />,
      description: 'Master product strategy and management'
    },
    {
      id: 'engineering-management',
      title: 'Engineering Management',
      icon: <Users size={24} className="text-emerald-600" />,
      description: 'Lead engineering teams effectively'
    },
    {
      id: 'software-engineering',
      title: 'Software Engineering',
      icon: <Code size={24} className="text-emerald-600" />,
      description: 'Build scalable software solutions'
    },
    {
      id: 'data-engineering',
      title: 'Data Engineering',
      icon: <Database size={24} className="text-emerald-600" />,
      description: 'Design robust data pipelines'
    },
    {
      id: 'data-science',
      title: 'Data Science',
      icon: <BarChart3 size={24} className="text-emerald-600" />,
      description: 'Extract insights from data'
    },
    {
      id: 'machine-learning',
      title: 'Machine Learning',
      icon: <Cpu size={24} className="text-emerald-600" />,
      description: 'Build intelligent systems'
    },
    {
      id: 'view-all',
      title: 'View all roles',
      icon: <ArrowRight size={24} className="text-emerald-600" />,
      description: 'Explore more opportunities',
      isViewAll: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-emerald-50">
      {/* Main Hero Section */}
      <div className="relative px-6 py-16 md:py-24 text-center">
        {/* Navigation arrows */}
        <button className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors hidden lg:block">
          <ChevronLeft size={24} />
        </button>
        <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors hidden lg:block">
          <ChevronRight size={24} />
        </button>

        {/* New Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
          <Zap size={16} className="text-emerald-600" />
          New: AI feedback on your interviews
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Everything you need to{' '}
          <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
            ace
          </span>{' '}
          your tech interviews
        </h1>

        {/* Sub-headline */}
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
          Level up your career and land your next role with courses, mock interviews, and community.
        </p>

        {/* CTA Button */}
        <button
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
        >
          Get started for free
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Role Categories Section */}
      <div className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {roleCategories.map((role, index) => (
              <div
                key={role.id}
                className={`
                  group flex flex-col items-center p-6 rounded-2xl transition-all duration-200 cursor-pointer
                  ${role.isViewAll 
                    ? 'bg-emerald-50 hover:bg-emerald-100 border-2 border-dashed border-emerald-300 hover:border-emerald-400' 
                    : 'bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 shadow-sm hover:shadow-md'
                  }
                  transform hover:scale-105
                `}
                onClick={() => {
                  if (!role.isViewAll) {
                    window.location.href = `/interview/${role.id}`;
                  }
                }}
              >
                {/* Icon */}
                <div className={`
                  w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-200
                  ${role.isViewAll 
                    ? 'bg-emerald-100 group-hover:bg-emerald-200' 
                    : 'bg-emerald-50 group-hover:bg-emerald-100'
                  }
                `}>
                  {role.icon}
                </div>

                {/* Title */}
                <h3 className={`
                  text-sm font-semibold text-center leading-tight transition-colors duration-200
                  ${role.isViewAll 
                    ? 'text-emerald-700 group-hover:text-emerald-800' 
                    : 'text-gray-800 group-hover:text-emerald-700'
                  }
                `}>
                  {role.title}
                </h3>

                {/* Description (hidden on mobile, shown on larger screens) */}
                <p className="hidden lg:block text-xs text-gray-500 text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="bg-gradient-to-b from-rose-100 to-emerald-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why choose VidyaTrack for interview prep?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join thousands of successful candidates who landed their dream jobs with our comprehensive interview preparation platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Questions</h3>
              <p className="text-gray-600">
                Practice with real interview questions from top tech companies like Google, Amazon, and Microsoft.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mock Interviews</h3>
              <p className="text-gray-600">
                Get real-time feedback from industry experts through our AI-powered mock interview sessions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Track your improvement with detailed analytics and personalized study recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories Section */}
      <div className="py-16 px-6 bg-gradient-to-b from-emerald-50 to-rose-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600">
              See how our students landed their dream jobs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Software Engineer at Google",
                quote: "VidyaTrack's interview prep helped me land my dream job at Google. The mock interviews were incredibly realistic!",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
              },
              {
                name: "Michael Rodriguez",
                role: "Product Manager at Amazon",
                quote: "The structured approach and expert feedback made all the difference in my interview preparation.",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
              },
              {
                name: "Priya Patel",
                role: "Data Scientist at Microsoft",
                quote: "From technical questions to behavioral interviews, VidyaTrack covered everything I needed to succeed.",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
              }
            ].map((story, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{story.name}</h4>
                    <p className="text-sm text-emerald-600">{story.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{story.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to ace your next interview?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of successful candidates and start your journey today.
          </p>
          <button
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer hover:bg-gray-50"
          >
            Start practicing now
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InterviewPage;