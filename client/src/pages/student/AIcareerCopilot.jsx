import React from 'react';
import { BrainCircuit, Sparkles, Bell, Compass, Route, Target } from 'lucide-react';
import Footer from '../../components/student/Footer';

const FEATURES = [
  { icon: Compass, title: 'Skill Gap Analysis', desc: 'Identify exactly what skills you need to reach your target role.' },
  { icon: Route, title: 'Personalized Roadmaps', desc: 'Get a week-by-week learning plan tailored to your goals.' },
  { icon: Target, title: 'Placement Readiness', desc: 'Track your progress and know when you\'re interview-ready.' },
];

export default function AIcareerCopilot() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-emerald-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-teal-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm text-emerald-200 mb-5">
            <Sparkles size={14} />
            AI-Powered Career Planning
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            AI Career Copilot
          </h1>
          <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto">
            Your personalized AI-powered career roadmap is launching soon.
          </p>
        </div>
      </section>

      {/* ─── Coming Soon Card ─── */}
      <section className="max-w-3xl mx-auto px-6 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-12 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 font-bold text-lg md:text-xl px-6 py-3 rounded-full border border-emerald-200 mb-6">
            🚀 Launching Soon
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
            <BrainCircuit size={28} className="text-emerald-600" />
            Something Big is Coming
          </h2>
          <p className="text-slate-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-8">
            We are building an intelligent AI system to help you analyze skill gaps, generate personalized roadmaps, and accelerate your placement journey.
          </p>

          {/* Notify Me button (disabled placeholder) */}
          <button
            disabled
            className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-8 py-3 rounded-xl opacity-60 cursor-not-allowed"
          >
            <Bell size={18} />
            Notify Me
          </button>
          <p className="text-xs text-slate-400 mt-3">Get notified when AI Career Copilot launches.</p>
        </div>
      </section>

      {/* ─── Feature Previews ─── */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h3 className="text-center text-xl font-semibold text-slate-800 mb-8">What to Expect</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl border border-slate-200 p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <Icon size={24} className="text-emerald-600" />
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">{title}</h4>
              <p className="text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}