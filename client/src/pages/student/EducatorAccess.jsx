import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import {
  GraduationCap,
  LogIn,
  FileText,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Users,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { SkeletonEducatorAccess } from '../../components/skeleton/Skeleton';

const EducatorAccess = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isEducator, user } = useAuth();
  const [appStatus, setAppStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      if (isAuthenticated()) {
        try {
          const res = await apiService.educatorAccess.getStatus();
          if (res.success) setAppStatus(res);
        } catch {
          /* ignore */
        }
      }
      setLoading(false);
    };
    fetchStatus();
  }, []);

  // If already an approved educator, redirect straight to educator dashboard
  useEffect(() => {
    if (!loading && isEducator()) {
      navigate('/educator');
    }
  }, [loading, isEducator, navigate]);

  const benefits = [
    { icon: <BookOpen className="w-6 h-6" />, title: 'Create & Publish Courses', desc: 'Build structured, multimedia-rich courses with our powerful editor.' },
    { icon: <Users className="w-6 h-6" />, title: 'Reach Thousands of Learners', desc: 'Get your content in front of an engaged student community.' },
    { icon: <Award className="w-6 h-6" />, title: 'Earn Revenue', desc: 'Monetize your expertise through course sales and enrollments.' },
    { icon: <ShieldCheck className="w-6 h-6" />, title: 'Verified Badge', desc: 'Approved educators receive a verified credential badge.' },
  ];

  const renderStatusBanner = () => {
    if (!appStatus?.hasApplication) return null;
    const { status, reviewedAt } = appStatus.application;

    if (status === 'pending') {
      return (
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-5 flex items-start gap-4">
          <Clock className="w-6 h-6 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-semibold text-amber-800">Application Under Review</h4>
            <p className="text-sm text-amber-700 mt-1">Your educator application is being reviewed by our team. You'll be notified once a decision is made.</p>
          </div>
        </div>
      );
    }

    if (status === 'approved') {
      return (
        <div className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5 flex items-start gap-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-semibold text-emerald-800">Application Approved!</h4>
            <p className="text-sm text-emerald-700 mt-1">Congratulations! You can now log in as an Educator to access your dashboard.</p>
          </div>
        </div>
      );
    }

    if (status === 'rejected') {
      return (
        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-5 flex items-start gap-4">
          <XCircle className="w-6 h-6 text-red-500 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-semibold text-red-800">Application Not Approved</h4>
            <p className="text-sm text-red-700 mt-1">
              {appStatus.application.adminNotes || 'Unfortunately your application was not approved. You may re-apply with updated credentials.'}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <SkeletonEducatorAccess />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* ── Hero Section ─────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
          {/* Back to Home */}
          <div className="absolute top-6 left-6">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to VidyaTrack
            </button>
          </div>

          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6 text-sm font-medium">
            <GraduationCap className="w-4 h-4" />
            Educator Program
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            Share Your Knowledge<br />
            <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">Shape the Future</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Join VidyaTrack's community of verified educators. Create world-class courses, inspire learners, and build your academic legacy.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/educator-access/login')}
              className="group flex items-center gap-3 bg-white text-emerald-800 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <LogIn className="w-5 h-5" />
              Login as Educator
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => {
                if (!isAuthenticated()) {
                  navigate('/login', { state: { from: { pathname: '/educator-access/apply' } } });
                } else {
                  navigate('/educator-access/apply');
                }
              }}
              className="group flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 border border-emerald-400"
            >
              <FileText className="w-5 h-5" />
              Become an Educator
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Application Status Banner ───────────────────── */}
      <div className="max-w-4xl mx-auto px-6 mt-8">
        {renderStatusBanner()}
      </div>

      {/* ── How It Works ────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">How It Works</h2>
        <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">A streamlined three-step process to join our educator community.</p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Apply', desc: 'Fill out the application with your credentials, expertise, and verification documents.' },
            { step: '02', title: 'Get Verified', desc: 'Our team reviews your profile. Qualified applicants may be auto-approved instantly.' },
            { step: '03', title: 'Start Teaching', desc: 'Log in as Educator, access the dashboard, and publish your first course.' },
          ].map((item) => (
            <div key={item.step} className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <span className="text-5xl font-black text-emerald-100">{item.step}</span>
              <h3 className="text-xl font-bold text-gray-900 mt-2">{item.title}</h3>
              <p className="text-gray-500 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Benefits ────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Teach on VidyaTrack?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-4">{b.icon}</div>
                <h3 className="font-bold text-gray-900">{b.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Role Enforcement Notice ─────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-8 h-8 text-slate-600 shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">Single Active Role Policy</h3>
              <p className="text-gray-500 mt-2 leading-relaxed">
                VidyaTrack enforces one active role per session. When you log in as an Educator, your student session ends automatically — and vice versa. This ensures clear separation of access and data integrity across the platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ──────────────────────────────────── */}
      <section className="bg-gradient-to-r from-emerald-700 to-emerald-900 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Inspire?</h2>
          <p className="text-emerald-200 mb-8 text-lg">Start your educator journey today and empower thousands of learners.</p>
          <button
            onClick={() => {
              if (!isAuthenticated()) {
                navigate('/login', { state: { from: { pathname: '/educator-access/apply' } } });
              } else {
                navigate('/educator-access/apply');
              }
            }}
            className="bg-white text-emerald-800 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            Apply Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default EducatorAccess;
