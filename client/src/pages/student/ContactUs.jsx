import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageSquare, HelpCircle, Users, ArrowRight } from 'lucide-react';
import Footer from '../../components/student/Footer';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero header */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #022c22 0%, #064e3b 40%, #065f46 70%, #0d9488 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 80% at 70% 20%, rgba(16,185,129,0.15) 0%, transparent 60%)' }} />
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 text-center relative z-10">
          <nav className="text-sm text-emerald-200/70 mb-8">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-white">Contact Us</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Get in Touch
          </h1>
          <p className="text-emerald-100/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Need help with your VidyaTrack service or product? We're here to assist you.
          </p>
        </div>
      </div>

      {/* Contact cards */}
      <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: Phone, title: 'Toll Free', info: '1800 102 5301', sub: 'Mon–Sat, 9 AM – 7 PM' },
            { icon: Mail, title: 'Email Support', info: 'support@vidyatrack.com', sub: 'We reply within 24 hours' },
            { icon: MapPin, title: 'Office Address', info: 'Plot No- 95B, Sector 136', sub: 'Noida, UP 201304' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/60 p-7 text-center hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <item.icon size={22} className="text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-emerald-700 font-medium text-sm break-all">{item.info}</p>
              <p className="text-gray-400 text-xs mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Other ways */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-3">Other Ways to Reach Us</h2>
        <p className="text-gray-500 text-center mb-12 text-sm">Choose the method that works best for you</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: MessageSquare, title: 'Live Chat', desc: 'Get instant help from our support team', cta: 'Start Chat' },
            { icon: HelpCircle, title: 'Help Center', desc: 'Find answers to common questions', cta: 'Browse FAQ' },
            { icon: Users, title: 'Community', desc: 'Connect with other learners', cta: 'Join Community' },
          ].map((item, i) => (
            <div key={i} className="group rounded-2xl border border-gray-100 p-7 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all duration-300">
              <div className="w-11 h-11 rounded-lg bg-emerald-100 flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                <item.icon size={20} className="text-emerald-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1.5">{item.title}</h3>
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">{item.desc}</p>
              <button className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                {item.cta} <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;
