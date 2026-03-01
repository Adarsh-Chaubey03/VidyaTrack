import { Link } from 'react-router-dom';
import { FileText, Users, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import Footer from '../../../components/student/Footer';

const features = [
  'ATS-optimized format — no tables, no graphics, pure semantic text',
  'Instant PDF download — text-selectable and printer-friendly',
  'Real-time ATS score with actionable improvement tips',
  'Step-by-step guided builder with auto-save',
  'Professional review by industry experts',
];

const ResumeHub = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero */}
        <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-800 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm
              rounded-full px-4 py-1.5 text-sm font-medium mb-6 border border-white/20">
              <Sparkles size={14} />
              Resume Tools
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Build & Perfect Your{' '}
              <span className="text-emerald-300">Professional Resume</span>
            </h1>

            <p className="text-emerald-100 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Create an ATS-optimized resume that gets past screening systems, or get your
              existing resume reviewed by industry professionals.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-3xl mx-auto">
              {features.map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm
                    rounded-full px-3 py-1.5 text-xs sm:text-sm border border-white/10"
                >
                  <CheckCircle size={14} className="text-emerald-300 shrink-0" />
                  {f}
                </span>
              ))}
            </div>

            {/* CTA Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
              {/* Builder Card */}
              <Link
                to="/resume/builder"
                className="group bg-white rounded-2xl p-6 sm:p-8 text-left shadow-xl
                  hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
                  <FileText size={28} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Generate ATS-Friendly Resume
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">
                  Use our smart builder to create a professional, ATS-optimized resume in minutes.
                  Get a real-time ATS score and export as PDF.
                </p>
                <span className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm
                  group-hover:gap-3 transition-all">
                  Start Building <ArrowRight size={16} />
                </span>
              </Link>

              {/* Review Card */}
              <Link
                to="/resume/review"
                className="group bg-white rounded-2xl p-6 sm:p-8 text-left shadow-xl
                  hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center mb-5">
                  <Users size={28} className="text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Get Reviewed by Industry Pros
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">
                  Upload your resume and receive personalized feedback and actionable tips
                  from real professionals in your field.
                </p>
                <span className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm
                  group-hover:gap-3 transition-all">
                  Get Reviewed <ArrowRight size={16} />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">
            How It Works
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-lg mx-auto">
            Three simple steps to a recruiter-ready resume
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                title: 'Fill Your Details',
                desc: 'Enter your information through our guided step-by-step form. Auto-save keeps your progress safe.',
              },
              {
                step: '02',
                title: 'Review ATS Score',
                desc: 'Get instant feedback on ATS compatibility. Follow tips to optimize your resume for screening systems.',
              },
              {
                step: '03',
                title: 'Download & Apply',
                desc: 'Export your professionally formatted PDF resume and start applying to jobs with confidence.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full
                  flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ATS Info Section */}
        <div className="bg-emerald-50/50 border-y border-emerald-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
              Why ATS-Friendly Matters
            </h2>
            <p className="text-gray-500 text-center mb-10 max-w-lg mx-auto">
              Over 75% of resumes are rejected by ATS before a human ever sees them
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: 'No Complex Formatting',
                  desc: 'Our resumes use pure text with clean headings — no tables, graphics, or columns that confuse ATS parsers.',
                },
                {
                  title: 'Keyword Optimization',
                  desc: 'The skills section uses comma-separated keywords that ATS systems can easily parse and match to job descriptions.',
                },
                {
                  title: 'Standard Section Headings',
                  desc: 'We use industry-standard headings like "Experience", "Education", and "Skills" that every ATS recognizes.',
                },
                {
                  title: 'Clean Typography',
                  desc: 'Helvetica font, consistent spacing, and proper hierarchy ensure both ATS readability and human appeal.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
                >
                  <h3 className="font-semibold text-gray-800 mb-1.5">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            Ready to Build Your Resume?
          </h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            It takes less than 10 minutes to create a professional, ATS-optimized resume.
          </p>
          <Link
            to="/resume/builder"
            className="inline-flex items-center gap-2 px-7 py-3 bg-emerald-600 text-white
              rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Get Started <ArrowRight size={18} />
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResumeHub;
