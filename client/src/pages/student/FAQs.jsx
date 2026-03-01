import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import Footer from '../../components/student/Footer';

const faqData = [
  {
    category: 'Account & Login',
    items: [
      {
        q: 'How do I create a VidyaTrack account?',
        a: 'Click the "Sign Up" button on the top-right corner of the homepage. Enter your full name, email address, and create a password. Once registered, you can log in and start exploring courses immediately.',
      },
      {
        q: 'I forgot my password. How can I reset it?',
        a: 'On the login page, click "Forgot Password?" and enter the email address associated with your account. You will receive a password-reset link via email. Follow the link to set a new password.',
      },
    ],
  },
  {
    category: 'Courses',
    items: [
      {
        q: 'How do I enroll in a course?',
        a: 'Browse the course catalog or use the search bar to find a course you like. Open the course details page and click "Enroll Now." If the course is free you will get instant access; paid courses require completing a secure payment first.',
      },
      {
        q: 'Can I access courses on mobile devices?',
        a: 'Yes. VidyaTrack is fully responsive and works on smartphones, tablets, and desktops. Simply open the site in your mobile browser and log in to continue where you left off.',
      },
      {
        q: 'How is my course progress tracked?',
        a: 'Your progress is updated automatically as you complete lectures. Visit your Dashboard to see a visual progress bar for every enrolled course, along with the percentage completed.',
      },
    ],
  },
  {
    category: 'Mentorship',
    items: [
      {
        q: 'How do I request a mentor session?',
        a: "Navigate to the Mentorship page, browse available mentors, and click \"Request Session\" on the mentor's profile. Fill in the preferred date, time, and topic. The mentor will confirm or suggest an alternative slot.",
      },
      {
        q: 'Is mentorship included with course enrollment?',
        a: 'Mentorship sessions are a separate feature. Some premium plans include a limited number of mentor sessions. You can also purchase individual sessions from the Mentorship page.',
      },
    ],
  },
  {
    category: 'Resume Review',
    items: [
      {
        q: 'How does the resume review process work?',
        a: 'Upload your resume on the Resume Review page. A qualified professional will review it and provide detailed, actionable feedback — typically within 48 hours. You will receive a notification once the review is ready.',
      },
    ],
  },
  {
    category: 'Payments & Refunds',
    items: [
      {
        q: 'What payment methods are supported?',
        a: 'We accept UPI, debit/credit cards, net banking, and popular wallets through our secure Razorpay integration. All transactions are encrypted end-to-end.',
      },
      {
        q: 'What is the refund policy?',
        a: 'Refund requests are evaluated on a case-by-case basis. If you are unsatisfied with a paid course, contact our support team within 7 days of purchase. Eligible refunds are processed back to the original payment method within 5–7 business days.',
      },
    ],
  },
  {
    category: 'General',
    items: [
      {
        q: 'How do I submit a blog post?',
        a: 'Log in and navigate to the Blog section. Click "Write a Post" to open the editor. Once you submit, your post enters an admin review queue. You will be notified when it is published.',
      },
      {
        q: 'How do notifications work on VidyaTrack?',
        a: 'You receive in-app notifications for important events such as mentor session confirmations, course updates, and blog post approvals. Click the bell icon in the top navigation bar to view your latest notifications.',
      },
    ],
  },
];

const AccordionItem = ({ question, answer, isOpen, onToggle }) => (
  <div className="border border-gray-100 rounded-xl overflow-hidden transition-shadow duration-300 hover:shadow-md">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 transition-colors"
      aria-expanded={isOpen}
    >
      <span className="text-sm md:text-[15px] font-medium text-gray-800 leading-snug">{question}</span>
      <ChevronDown
        size={18}
        className={`shrink-0 text-emerald-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
    <div
      className="grid transition-all duration-300 ease-in-out"
      style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
    >
      <div className="overflow-hidden">
        <div className="px-5 pb-4 pt-0 text-sm text-gray-500 leading-relaxed">{answer}</div>
      </div>
    </div>
  </div>
);

const FAQs = () => {
  // Track which single item is open: "categoryIndex-itemIndex" or null
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-white">
      {/* Hero header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #022c22 0%, #064e3b 40%, #065f46 70%, #0d9488 100%)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 50% 80% at 70% 20%, rgba(16,185,129,0.15) 0%, transparent 60%)',
          }}
        />
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 text-center relative z-10">
          <nav className="text-sm text-emerald-200/70 mb-8">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-white">FAQs</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-emerald-100/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Find quick answers to common questions about VidyaTrack.
          </p>
        </div>
      </div>

      {/* FAQ content */}
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
        <div className="space-y-12">
          {faqData.map((cat, ci) => (
            <section key={ci}>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 rounded-full bg-emerald-500 inline-block" />
                {cat.category}
              </h2>
              <div className="space-y-3">
                {cat.items.map((item, ii) => {
                  const id = `${ci}-${ii}`;
                  return (
                    <AccordionItem
                      key={id}
                      question={item.q}
                      answer={item.a}
                      isOpen={openId === id}
                      onToggle={() => toggle(id)}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Still have questions? */}
        <div className="mt-16 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Still have questions?</h3>
            <p className="text-sm text-gray-500">Our support team is ready to help.</p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors shrink-0"
          >
            Contact Us
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQs;
