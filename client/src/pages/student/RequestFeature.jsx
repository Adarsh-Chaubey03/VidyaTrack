import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/student/Footer';

const SUPPORT_EMAIL = 'support@vidyatrack.com';

const RequestFeature = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('New feature');
  const [details, setDetails] = useState('');

  const mailtoHref = useMemo(() => {
    const subject = `[VidyaTrack] ${category} request`;
    const bodyLines = [
      'Hi VidyaTrack team,',
      '',
      `I would like to request: ${category}`,
      '',
      'Details:',
      details || '(please describe what you need)',
      '',
      `Name: ${name || '(not provided)'}`,
      `Email: ${email || '(not provided)'}`,
    ];

    return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
  }, [name, email, category, details]);

  const onSubmit = (e) => {
    e.preventDefault();
    window.location.href = mailtoHref;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col">
      <div className="px-6 md:px-16 lg:px-24 pt-12">
        <div className="max-w-5xl mx-auto">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-800">Request a Feature</span>
          </nav>

          <div className="text-center mt-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Request a Feature / Service</h1>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Tell us what you want VidyaTrack to build next. Submitting opens your email app with a pre-filled request.
            </p>
          </div>

          <div className="mt-12 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10">
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Your name (optional)</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="e.g., Amit"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Your email (optional)</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="e.g., you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Request type</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  <option>New feature</option>
                  <option>New service</option>
                  <option>Course suggestion</option>
                  <option>Mentor/Professional feature</option>
                  <option>Bug report</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700">Details</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 min-h-[160px] resize-y focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Describe what you want, why it helps, and any examples/screenshots/links."
                />
              </div>

              <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <a
                  href={mailtoHref}
                  className="inline-flex items-center justify-center rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 transition-colors"
                >
                  Submit Request
                </a>
                <Link
                  to="/contact"
                  className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Contact Us
                </Link>
              </div>
            </form>

            <p className="mt-6 text-xs text-gray-500">
              Note: This doesn’t send anything to our server yet—your email client sends it to {SUPPORT_EMAIL}.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16" />
      <Footer />
    </div>
  );
};

export default RequestFeature;
