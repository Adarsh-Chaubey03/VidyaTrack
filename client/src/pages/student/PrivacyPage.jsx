import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import Footer from '../../components/student/Footer';

const sections = [
  {
    title: '1. Information We Collect',
    content: `When you create a VidyaTrack account or use our services, we may collect:`,
    list: [
      'Account details — name, email address, phone number, and password.',
      'Profile data — role (student / educator), avatar, and preferences.',
      'Usage data — pages visited, courses enrolled, progress, and interactions.',
      'Device & technical data — IP address, browser type, OS, and access timestamps.',
      'Payment data — processed securely through Razorpay; we do not store card details.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    content: 'We use collected information to:',
    list: [
      'Provide, maintain, and improve our learning platform.',
      'Personalise your experience, recommend courses, and track progress.',
      'Process payments and send transaction confirmations.',
      'Communicate updates, promotional offers, and support responses.',
      'Ensure platform security and prevent fraud or misuse.',
    ],
  },
  {
    title: '3. Data Sharing & Third Parties',
    content:
      'We do not sell your personal data. We may share limited information with trusted third-party service providers who assist in operating VidyaTrack (e.g., payment processors, cloud hosting, analytics). All third parties are contractually obligated to keep your data secure and use it solely for the services they provide to us.',
  },
  {
    title: '4. Data Storage & Security',
    content:
      'Your data is stored on secure servers with industry-standard encryption. We implement technical and organisational measures to protect against unauthorised access, alteration, or destruction. However, no method of electronic transmission or storage is 100 % secure, and we cannot guarantee absolute security.',
  },
  {
    title: '5. Cookies & Tracking',
    content:
      'We use cookies and similar technologies to enhance your experience, remember your preferences, and analyse site traffic. You can manage cookie preferences through your browser settings, though disabling some cookies may affect platform functionality.',
  },
  {
    title: '6. Your Rights',
    content: 'Depending on your jurisdiction, you may have the right to:',
    list: [
      'Access, correct, or delete your personal data.',
      'Object to or restrict certain data processing.',
      'Withdraw consent where processing is based on consent.',
      'Request data portability.',
    ],
    extra:
      'To exercise any of these rights, please contact us at support@vidyatrack.com.',
  },
  {
    title: '7. Children\'s Privacy',
    content:
      'VidyaTrack is not intended for children under the age of 13. We do not knowingly collect personal data from children under 13 without verifiable parental consent.',
  },
  {
    title: '8. Changes to This Policy',
    content:
      'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. Continued use of VidyaTrack after changes constitutes acceptance of the revised policy.',
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero header */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #022c22 0%, #064e3b 40%, #065f46 70%, #0d9488 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 80% at 70% 20%, rgba(16,185,129,0.15) 0%, transparent 60%)' }} />
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 text-center relative z-10">
          <nav className="text-sm text-emerald-200/70 mb-8">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-white">Privacy Policy</span>
          </nav>
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Shield size={28} className="text-emerald-300" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-emerald-100/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Your privacy matters. Here's how we handle your data.
          </p>
          <p className="text-emerald-200/50 text-xs mt-6">Last updated: June 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
        <div className="space-y-10">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">{s.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{s.content}</p>
              {s.list && (
                <ul className="mt-3 space-y-2">
                  {s.list.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {s.extra && <p className="mt-3 text-gray-600 text-sm leading-relaxed">{s.extra}</p>}
            </section>
          ))}
        </div>

        {/* Contact bar */}
        <div className="mt-16 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Questions about your privacy?</h3>
            <p className="text-sm text-gray-500">Reach out and we'll be happy to help.</p>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors shrink-0">
            Contact Us
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
