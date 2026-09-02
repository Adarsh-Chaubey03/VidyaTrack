import { useState, useEffect, useCallback } from 'react';
import {
  Upload, FileText, Clock, CheckCircle2, AlertCircle,
  Star, Loader2, RefreshCw, ExternalLink,
} from 'lucide-react';
import { TextField, TextArea, SelectField, SectionTitle } from '../../../components/resume/FormField';
import { INDUSTRIES, EXPERIENCE_LEVELS } from '../../../utils/resume/constants';
import Footer from '../../../components/student/Footer';
import { apiService } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

/* ── helpers ──────────────────────────────────────────────── */
const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const ScoreBar = ({ score }) => {
  const pct = (score / 10) * 100;
  const color = score >= 7 ? '#10b981' : score >= 4 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-3 mt-1">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-xs">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-sm font-bold" style={{ color }}>{score}/10</span>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   Main component
   ══════════════════════════════════════════════════════════= */
const ReviewRequest = () => {
  const { isAuthenticated } = useAuth();

  /* ── existing review from backend ── */
  const [existingReview, setExistingReview] = useState(undefined); // undefined = loading
  const [loadingReview, setLoadingReview] = useState(true);

  /* ── form state ── */
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    industry: '', experienceLevel: '', targetRole: '', notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  /* ── fetch the student's latest review on mount ── */
  const fetchMyReview = useCallback(async () => {
    if (!isAuthenticated()) { setLoadingReview(false); return; }
    setLoadingReview(true);
    try {
      const res = await apiService.resumeReview.getMyReview();
      setExistingReview(res.review || null);
    } catch {
      setExistingReview(null);
    } finally {
      setLoadingReview(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { fetchMyReview(); }, [fetchMyReview]);

  /* ── file handling ── */
  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && validateFile(dropped)) setFile(dropped);
  };
  const handleFileSelect = (e) => {
    const sel = e.target.files?.[0];
    if (sel && validateFile(sel)) setFile(sel);
  };
  const validateFile = (f) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) {
      setErrors((p) => ({ ...p, file: 'Only PDF files are accepted' }));
      return false;
    }
    if (f.size > 5 * 1024 * 1024) {
      setErrors((p) => ({ ...p, file: 'File must be under 5 MB' }));
      return false;
    }
    setErrors((p) => { const n = { ...p }; delete n.file; return n; });
    return true;
  };

  /* ── form submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const newErrors = {};
    if (!file) newErrors.file = 'Please upload your resume';
    if (!formData.industry) newErrors.industry = 'Select an industry';
    if (!formData.experienceLevel) newErrors.experienceLevel = 'Select your experience level';
    if (!formData.targetRole?.trim()) newErrors.targetRole = 'Enter your target role';
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('resume', file);
      fd.append('industry', formData.industry);
      fd.append('experienceLevel', formData.experienceLevel);
      fd.append('targetRole', formData.targetRole.trim());
      fd.append('notes', formData.notes.trim());

      const res = await apiService.resumeReview.submit(fd);
      setExistingReview(res.review);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── submit another (only if already reviewed) ── */
  const resetForNew = () => {
    setFile(null);
    setFormData({ industry: '', experienceLevel: '', targetRole: '', notes: '' });
    setErrors({});
    setSubmitError('');
    setSubmitted(false);
    setExistingReview(null);
  };

  /* ════════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════════ */
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Resume Review</h1>
            <p className="text-emerald-200 text-sm sm:text-base max-w-xl mx-auto">
              Upload your resume and get personalised feedback from educators.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

          {/* ── Loading skeleton ── */}
          {loadingReview && (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-emerald-500" />
            </div>
          )}

          {/* ── Not logged in ── */}
          {!loadingReview && !isAuthenticated() && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
              <AlertCircle size={36} className="mx-auto text-amber-500 mb-3" />
              <h2 className="text-lg font-bold text-gray-900 mb-2">Login Required</h2>
              <p className="text-gray-600 text-sm mb-5">Please log in to submit your resume for review.</p>
              <a
                href="/login"
                className="inline-block px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
              >
                Log In
              </a>
            </div>
          )}

          {/* ── Authenticated view ── */}
          {!loadingReview && isAuthenticated() && (
            <>
              {/* ── CASE A: just successfully submitted ── */}
              {submitted && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 mb-8 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Review Requested!</h2>
                  <p className="text-gray-600 text-sm mb-1 max-w-md mx-auto">
                    Your resume has been submitted for review.
                  </p>
                  <p className="text-gray-500 text-xs mb-5">
                    Check your dashboard for updates once an educator has reviewed it.
                  </p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <button
                      onClick={fetchMyReview}
                      className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      <RefreshCw size={14} /> Check Status
                    </button>
                  </div>
                </div>
              )}

              {/* ── CASE B: has a pending review (and didn't just submit) ── */}
              {!submitted && existingReview?.status === 'pending' && (
                <PendingCard review={existingReview} onRefresh={fetchMyReview} />
              )}

              {/* ── CASE C: has a reviewed (completed) review ── */}
              {!submitted && existingReview?.status === 'reviewed' && (
                <ReviewedCard review={existingReview} onSubmitAnother={resetForNew} />
              )}

              {/* ── CASE D: no existing review OR user clicked "submit another" ── */}
              {!submitted && !existingReview && (
                <>
                  {/* submit error banner */}
                  {submitError && (
                    <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                      <AlertCircle size={16} className="flex-shrink-0" />
                      {submitError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* PDF upload */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8">
                      <SectionTitle>Upload Your Resume</SectionTitle>
                      <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors
                          ${dragActive ? 'border-emerald-400 bg-emerald-50'
                            : errors.file ? 'border-red-300 bg-red-50/30'
                            : file ? 'border-emerald-300 bg-emerald-50/30'
                            : 'border-gray-300 bg-gray-50 hover:border-gray-400'}`}
                      >
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileSelect}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {file ? (
                          <div className="flex flex-col items-center">
                            <FileText size={36} className="text-emerald-600 mb-2" />
                            <p className="text-sm font-medium text-gray-800">{file.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(0)} KB</p>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setFile(null); }}
                              className="mt-3 text-xs text-red-500 hover:text-red-600 underline"
                            >
                              Remove file
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload size={36} className="text-gray-400 mb-3" />
                            <p className="text-sm font-medium text-gray-600">Drag & drop your resume here</p>
                            <p className="text-xs text-gray-400 mt-1">or click to browse — PDF only, max 5 MB</p>
                          </div>
                        )}
                      </div>
                      {errors.file && <p className="mt-2 text-xs text-red-500">{errors.file}</p>}
                    </div>

                    {/* Review details */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 space-y-5">
                      <SectionTitle>Review Details</SectionTitle>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <SelectField
                          label="Industry"
                          value={formData.industry}
                          onChange={(v) => setFormData((p) => ({ ...p, industry: v }))}
                          options={INDUSTRIES}
                          error={errors.industry}
                          placeholder="Select industry..."
                          required
                        />
                        <SelectField
                          label="Experience Level"
                          value={formData.experienceLevel}
                          onChange={(v) => setFormData((p) => ({ ...p, experienceLevel: v }))}
                          options={EXPERIENCE_LEVELS}
                          error={errors.experienceLevel}
                          placeholder="Select level..."
                          required
                        />
                      </div>
                      <TextField
                        label="Target Role"
                        value={formData.targetRole}
                        onChange={(v) => setFormData((p) => ({ ...p, targetRole: v }))}
                        error={errors.targetRole}
                        placeholder="e.g. Senior Frontend Engineer at Google"
                        required
                      />
                      <TextArea
                        label="Additional Notes"
                        value={formData.notes}
                        onChange={(v) => setFormData((p) => ({ ...p, notes: v }))}
                        placeholder="Any specific areas you'd like feedback on? Career transition context? Target companies?"
                        rows={3}
                        helperText="Optional — helps reviewers provide more targeted feedback"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-semibold
                        hover:bg-emerald-700 disabled:opacity-60 transition-colors shadow-sm text-sm
                        flex items-center justify-center gap-2"
                    >
                      {submitting
                        ? <><Loader2 size={16} className="animate-spin" /> Uploading & Submitting…</>
                        : 'Submit for Review'
                      }
                    </button>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReviewRequest;

/* ── Pending state card ──────────────────────────────────── */
function PendingCard({ review, onRefresh }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8 mb-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Clock size={24} className="text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
            <h2 className="text-lg font-bold text-gray-900">Resume Under Review</h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
              <Clock size={11} /> Pending
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Your resume has been submitted and is waiting for an educator to review it.
            You'll see the score and feedback here once it's done.
          </p>

          {/* Submission summary */}
          <div className="bg-white rounded-xl border border-amber-100 p-4 space-y-2 text-sm mb-4">
            <div className="flex items-center gap-2 text-gray-700">
              <FileText size={15} className="text-gray-400 flex-shrink-0" />
              <span className="font-medium truncate">{review.fileName}</span>
              <a
                href={review.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1 text-xs text-emerald-600 hover:underline flex-shrink-0"
              >
                Open <ExternalLink size={11} />
              </a>
            </div>
            <p className="text-gray-500 text-xs">
              🎯 {review.targetRole} &nbsp;·&nbsp; {review.industry} &nbsp;·&nbsp; {review.experienceLevel}
            </p>
            <p className="text-gray-400 text-xs">Submitted {fmtDate(review.createdAt)}</p>
          </div>

          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 text-sm text-amber-700 hover:text-amber-800 font-medium transition-colors"
          >
            <RefreshCw size={13} /> Refresh status
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Reviewed state card ─────────────────────────────────── */
function ReviewedCard({ review, onSubmitAnother }) {
  return (
    <div className="space-y-5 mb-8">
      {/* Result header */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={24} className="text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
              <h2 className="text-lg font-bold text-gray-900">Resume Review Complete</h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                <CheckCircle2 size={11} /> Reviewed
              </span>
            </div>
            <p className="text-gray-500 text-xs mb-3">Reviewed on {fmtDate(review.reviewedAt)}</p>

            {/* Score */}
            <div className="bg-white rounded-xl border border-emerald-100 p-4 mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Star size={12} className="text-amber-400" /> Score
              </p>
              <ScoreBar score={review.score} />
            </div>

            {/* Feedback */}
            <div className="bg-white rounded-xl border border-emerald-100 p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Teacher Feedback
              </p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {review.feedback}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submission info */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 text-sm flex items-center gap-3 flex-wrap">
        <FileText size={15} className="text-gray-400 flex-shrink-0" />
        <span className="text-gray-700 font-medium truncate flex-1">{review.fileName}</span>
        <a
          href={review.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-emerald-600 hover:underline flex-shrink-0"
        >
          View PDF <ExternalLink size={11} />
        </a>
        <button
          onClick={onSubmitAnother}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-emerald-600 border border-gray-200 hover:border-emerald-300 px-3 py-1.5 rounded-lg transition flex-shrink-0"
        >
          Submit new resume
        </button>
      </div>
    </div>
  );
}
