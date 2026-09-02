import React, { useEffect, useState, useCallback } from 'react';
import {
  ClipboardList, FileText, ExternalLink, Star, CheckCircle,
  Loader2, AlertCircle, RefreshCw, ChevronDown, ChevronUp, User,
} from 'lucide-react';
import { apiService } from '../../services/api';

export default function EducatorResumeReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const fetchPending = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiService.resumeReview.listPending();
      setReviews(res.reviews || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load pending resumes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPending(); }, [fetchPending]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleReviewed = (id) => {
    setReviews((prev) => prev.filter((r) => r._id !== id));
    showToast('Review submitted. Student has been notified.');
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <ClipboardList size={20} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Resume Reviews</h1>
            <p className="text-slate-500 text-sm">
              {loading ? 'Loading…' : `${reviews.length} resume${reviews.length !== 1 ? 's' : ''} pending review`}
            </p>
          </div>
        </div>
        <button
          onClick={fetchPending}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 border border-slate-200 hover:border-blue-300 px-3 py-2 rounded-lg transition disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="mb-4 flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl px-4 py-3 text-sm">
          <CheckCircle size={16} className="flex-shrink-0" />
          {toast}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={16} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <CheckCircle size={48} className="mx-auto text-emerald-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-1">No resumes pending review</h3>
          <p className="text-slate-500 text-sm">Check back later — new submissions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} onReviewed={handleReviewed} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Per-resume review card ──────────────────────────────────────────────── */
function ReviewCard({ review, onReviewed }) {
  const [expanded, setExpanded] = useState(false);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const student = review.studentId || {};
  const studentName = student.name || 'Unknown Student';
  const studentInitial = studentName.charAt(0).toUpperCase();
  const submittedDate = new Date(review.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const numScore = Number(score);
    if (score === '' || isNaN(numScore) || numScore < 0 || numScore > 10) {
      setFormError('Enter a score between 0 and 10.');
      return;
    }
    if (!feedback.trim()) {
      setFormError('Please provide feedback for the student.');
      return;
    }

    setSubmitting(true);
    try {
      await apiService.resumeReview.submitReview(review._id, {
        score: numScore,
        feedback: feedback.trim(),
      });
      onReviewed(review._id);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-sm transition">
      {/* Card header — always visible */}
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Student info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {student.imageUrl
                ? <img src={student.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                : studentInitial
              }
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 truncate">{studentName}</p>
              <p className="text-xs text-slate-400">{student.email || ''}</p>
            </div>
          </div>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">{review.industry}</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium capitalize">{review.experienceLevel}</span>
            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-medium">Pending</span>
          </div>
        </div>

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-700 font-medium truncate">🎯 {review.targetRole}</p>
            <p className="text-xs text-slate-400 mt-0.5">Submitted {submittedDate} · {review.fileName}</p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Open PDF */}
            <a
              href={review.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm border border-slate-200 text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition"
            >
              <FileText size={14} />
              View PDF
              <ExternalLink size={11} />
            </a>
            {/* Toggle review form */}
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Review
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {/* Additional notes */}
        {review.notes && (
          <div className="mt-3 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-600 border border-slate-100">
            <span className="font-medium text-slate-500 text-xs uppercase tracking-wide mr-2">Notes:</span>
            {review.notes}
          </div>
        )}
      </div>

      {/* Collapsible review form */}
      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Star size={14} className="text-amber-500" />
            Submit Your Review
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Score */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Score <span className="text-slate-400 font-normal normal-case">(0 – 10)</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="e.g. 7.5"
                  className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                />
                {/* Visual score bar */}
                {score !== '' && !isNaN(Number(score)) && Number(score) >= 0 && Number(score) <= 10 && (
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden max-w-xs">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(Number(score) / 10) * 100}%`,
                        background: Number(score) >= 7 ? '#10b981' : Number(score) >= 4 ? '#f59e0b' : '#ef4444',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Feedback */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Feedback
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide detailed feedback for the student — strengths, areas to improve, specific suggestions…"
                rows={5}
                maxLength={5000}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y bg-white"
              />
              <p className="text-xs text-slate-400 mt-1 text-right">{feedback.length}/5000</p>
            </div>

            {/* Form error */}
            {formError && (
              <p className="flex items-center gap-1.5 text-sm text-red-600">
                <AlertCircle size={14} /> {formError}
              </p>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => { setExpanded(false); setFormError(''); }}
                className="text-sm text-slate-500 hover:text-slate-700 px-3 py-2 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {submitting
                  ? <><Loader2 size={14} className="animate-spin" /> Submitting…</>
                  : <><CheckCircle size={14} /> Submit Review</>
                }
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
