import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/student/Footer';
import {
  GraduationCap,
  Users,
  Target,
  Lightbulb,
  BookOpen,
  Award,
  Heart,
  Globe,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: 'Innovation First',
      desc: 'We leverage cutting-edge technology — AI career copilots, smart resume tools, and personalized learning paths — to keep learners ahead of the curve.',
      color: 'from-amber-400 to-orange-500',
      bg: 'bg-amber-50',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community Driven',
      desc: 'From peer-to-peer mentorship to collaborative blogs, VidyaTrack thrives because of its vibrant community of learners and educators.',
      color: 'from-blue-400 to-indigo-500',
      bg: 'bg-blue-50',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Quality & Trust',
      desc: 'Every educator is verified. Every course is reviewed. We maintain the highest standards so you can learn with confidence.',
      color: 'from-emerald-400 to-teal-500',
      bg: 'bg-emerald-50',
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Accessible Education',
      desc: 'We believe quality education should be available to everyone, everywhere. Many of our courses are free, and paid content is affordably priced.',
      color: 'from-pink-400 to-rose-500',
      bg: 'bg-pink-50',
    },
  ];

  const stats = [
    { value: '15,000+', label: 'Active Learners' },
    { value: '320+', label: 'Expert Educators' },
    { value: '500+', label: 'Courses Available' },
    { value: '95%', label: 'Satisfaction Rate' },
  ];

  const teamPillars = [
    {
      icon: <BookOpen className="w-8 h-8 text-emerald-600" />,
      title: 'Curated Courses',
      desc: 'Handpicked content from verified educators covering tech, business, design, and more.',
    },
    {
      icon: <Zap className="w-8 h-8 text-emerald-600" />,
      title: 'AI-Powered Tools',
      desc: 'Smart career copilot, resume builder, and personalized learning recommendations.',
    },
    {
      icon: <Award className="w-8 h-8 text-emerald-600" />,
      title: '1:1 Mentorship',
      desc: 'Direct access to industry professionals for guidance, feedback, and career advice.',
    },
    {
      icon: <Globe className="w-8 h-8 text-emerald-600" />,
      title: 'Global Community',
      desc: 'A network of learners and educators from across the world, sharing knowledge daily.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #022c22 0%, #064e3b 35%, #065f46 60%, #0d9488 100%)',
          }}
        />
        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 50%, white 1.5px, transparent 1.5px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 50% 60% at 50% 40%, rgba(16,185,129,0.15) 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            About VidyaTrack
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            Empowering Learners,{' '}
            <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
              One Skill at a Time
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            VidyaTrack is more than an e-learning platform — it's a career
            launchpad. We connect curious minds with expert educators, AI-powered
            tools, and a supportive community to accelerate growth.
          </p>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="relative -mt-8 z-10 max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-extrabold text-emerald-700">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Our Story
            </h2>
            <div className="w-16 h-1 bg-emerald-500 rounded-full mt-4 mb-6" />
            <p className="text-gray-600 leading-relaxed mb-4">
              VidyaTrack was born from a simple observation: traditional
              education doesn't always prepare you for real-world challenges.
              We set out to bridge that gap by creating a platform where
              practical, industry-relevant learning meets cutting-edge
              technology.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Starting as a small project to help a few students, VidyaTrack
              has grown into a thriving ecosystem of 15,000+ learners and 320+
              verified educators — all united by a passion for continuous
              growth.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, we offer courses, 1:1 mentorship, AI career guidance,
              resume building tools, and a vibrant blog community — everything
              you need to transform your career, all in one place.
            </p>
          </div>

          {/* Visual element */}
          <div className="relative">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border border-emerald-100">
              <div className="grid grid-cols-2 gap-4">
                {teamPillars.map((pillar, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="mb-3">{pillar.icon}</div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* Floating accent */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-teal-500/10 rounded-full blur-xl" />
          </div>
        </div>
      </section>

      {/* ── Our Mission ── */}
      <section
        className="py-16 md:py-24"
        style={{
          background:
            'linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 50%, #ffffff 100%)',
        }}
      >
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-6 text-sm font-semibold">
            <Target className="w-4 h-4" />
            Our Mission
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Democratize Quality Education
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed mb-12">
            We're on a mission to make world-class education accessible to
            everyone, regardless of background or geography. By combining
            expert-led content with intelligent tools, we empower learners to
            take charge of their careers and unlock their full potential.
          </p>

          {/* Mission visual */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                emoji: '🎯',
                title: 'Learn',
                desc: 'Access curated courses, expert mentors, and interactive content designed for real-world impact.',
              },
              {
                emoji: '🚀',
                title: 'Build',
                desc: 'Create professional resumes, develop portfolios, and gain practical skills employers value.',
              },
              {
                emoji: '🌟',
                title: 'Grow',
                desc: 'Use AI-powered career tools, join the community, and land opportunities that match your goals.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What We Stand For
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            The principles that guide every feature we build and every decision
            we make.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {values.map((value, i) => (
            <div
              key={i}
              className={`${value.bg} rounded-2xl p-6 md:p-8 border border-gray-100 hover:shadow-lg transition-all`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.color} text-white flex items-center justify-center mb-4`}
              >
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {value.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-emerald-200 mb-8 text-lg max-w-2xl mx-auto">
            Join thousands of learners who are already transforming their
            careers with VidyaTrack. Your next chapter starts here.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/course-list"
              className="group flex items-center gap-3 bg-white text-emerald-800 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              Explore Courses
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/educator-access"
              className="group flex items-center gap-3 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/40 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 hover:bg-emerald-500/30"
            >
              <GraduationCap className="w-5 h-5" />
              Become an Educator
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
