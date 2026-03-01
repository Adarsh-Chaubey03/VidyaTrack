import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Footer from '../../components/student/Footer';
import api from '../../services/api';

const initialForm = { name: '', email: '', subject: '', message: '', rating: 0 };

const Feedback = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', msg }
  const [hoverRating, setHoverRating] = useState(0);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (status) setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const payload = { ...form, rating: form.rating || undefined };
      const { data } = await api.post('/feedback', payload);
      if (data.success) {
        setStatus({ type: 'success', msg: data.message });
        setForm(initialForm);
      } else {
        setStatus({ type: 'error', msg: data.message || 'Something went wrong. Please try again.' });
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Something went wrong. Please try again.';
      setStatus({ type: 'error', msg });
    } finally {
      setLoading(false);
    }
  };

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
            <span className="text-white">Feedback</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Share Your Feedback
          </h1>
          <p className="text-emerald-100/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            We value your thoughts. Help us make VidyaTrack better.
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="max-w-2xl mx-auto px-6 -mt-8 relative z-10 pb-20">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/60 p-7 md:p-10 space-y-6"
        >
          {/* Status banner */}
          {status && (
            <div
              className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm leading-relaxed ${
                status.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {status.type === 'success' ? <CheckCircle size={18} className="mt-0.5 shrink-0" /> : <AlertCircle size={18} className="mt-0.5 shrink-0" />}
              {status.msg}
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="fb-name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              id="fb-name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="fb-email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              id="fb-email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition"
            />
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="fb-subject" className="block text-sm font-medium text-gray-700 mb-1.5">
              Subject <span className="text-red-400">*</span>
            </label>
            <input
              id="fb-subject"
              name="subject"
              type="text"
              required
              value={form.subject}
              onChange={handleChange}
              placeholder="e.g. Course suggestion, Bug report"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="fb-message" className="block text-sm font-medium text-gray-700 mb-1.5">
              Message <span className="text-red-400">*</span>
            </label>
            <textarea
              id="fb-message"
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us what you think…"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, rating: prev.rating === n ? 0 : n }))}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-0.5 focus:outline-none transition-transform hover:scale-110"
                  aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
                >
                  <Star
                    size={26}
                    className={`transition-colors ${
                      (hoverRating || form.rating) >= n
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {form.rating > 0 && (
                <span className="ml-2 text-xs text-gray-400">{form.rating}/5</span>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 text-sm transition-colors"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Submitting…
              </>
            ) : (
              <>
                <Send size={16} />
                Submit Feedback
              </>
            )}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Feedback;
