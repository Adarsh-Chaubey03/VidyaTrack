import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import Footer from '../../components/student/Footer';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content:
      'By accessing or using VidyaTrack, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree, please discontinue use of the platform immediately.',
  },
  {
    title: '2. Description of Services',
    content:
      'VidyaTrack is an educational technology platform that enables learners to discover, enroll in, and complete online courses. Educators can create, publish, and manage course content. Additional features include AI career recommendations, mentorship requests, resume reviews, and community engagement tools.',
  },
  {
    title: '3. Account Registration',
    content: 'To access certain features, you must create an account. You agree to:',
    list: [
      'Provide accurate and complete registration information.',
      'Maintain the confidentiality of your password and account credentials.',
      'Accept responsibility for all activities under your account.',
      'Notify us immediately of any unauthorised use of your account.',
    ],
  },
  {
    title: '4. User Conduct',
    content: 'You agree not to:',
    list: [
      'Upload or share content that is illegal, harmful, defamatory, or infringes on third-party rights.',
      'Attempt to disrupt, hack, or gain unauthorised access to any part of the platform.',
      'Use automated tools (bots, scrapers) to extract data without prior written consent.',
      'Impersonate another person or entity, or misrepresent your affiliation.',
      'Use VidyaTrack for any purpose that violates applicable laws or regulations.',
    ],
  },
  {
    title: '5. Course Content & Intellectual Property',
    content:
      'All content available on VidyaTrack — including courses, videos, text, graphics, and logos — is the property of VidyaTrack or its respective content creators and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from any content without explicit permission.',
  },
  {
    title: '6. Payments & Refunds',
    content:
      'Certain courses or features may require payment. All payments are processed securely through Razorpay. Prices are displayed in INR unless otherwise stated. Refund eligibility is determined on a case-by-case basis in accordance with our refund policy. Course access is granted upon successful payment confirmation.',
  },
  {
    title: '7. Educator Responsibilities',
    content: 'If you register as an educator, you additionally agree to:',
    list: [
      'Ensure course content is accurate, original, and does not infringe third-party rights.',
      'Respond to student queries in a timely and professional manner.',
      'Comply with all applicable content guidelines and platform policies.',
    ],
  },
  {
    title: '8. Limitation of Liability',
    content:
      'VidyaTrack is provided on an "as is" and "as available" basis. We do not warrant that the platform will be uninterrupted, error-free, or secure at all times. To the maximum extent permitted by law, VidyaTrack shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.',
  },
  {
    title: '9. Termination',
    content:
      'We reserve the right to suspend or terminate your account at our discretion if you violate these Terms or engage in behaviour that is harmful to other users or the platform. Upon termination, your access to the platform and its content may be revoked without notice.',
  },
  {
    title: '10. Modifications',
    content:
      'We may revise these Terms at any time by posting an updated version on this page. Continued use of VidyaTrack after changes are posted constitutes your acceptance of the revised Terms. We encourage you to review this page periodically.',
  },
  {
    title: '11. Governing Law',
    content:
      'These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in Noida, Uttar Pradesh.',
  },
];

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero header */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #022c22 0%, #064e3b 40%, #065f46 70%, #0d9488 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 80% at 70% 20%, rgba(16,185,129,0.15) 0%, transparent 60%)' }} />
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 text-center relative z-10">
          <nav className="text-sm text-emerald-200/70 mb-8">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-white">Terms & Conditions</span>
          </nav>
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <FileText size={28} className="text-emerald-300" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-emerald-100/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Please read these terms carefully before using VidyaTrack.
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
            </section>
          ))}
        </div>

        {/* Contact bar */}
        <div className="mt-16 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Have questions about these terms?</h3>
            <p className="text-sm text-gray-500">We're here to clarify anything you need.</p>
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

export default TermsAndConditions;
