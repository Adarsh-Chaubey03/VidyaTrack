import { useState, useEffect } from 'react';
import { Upload, FileText, Clock, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { TextField, TextArea, SelectField, SectionTitle } from '../../../components/resume/FormField';
import { INDUSTRIES, EXPERIENCE_LEVELS, REVIEW_STORAGE_KEY } from '../../../utils/resume/constants';
import Footer from '../../../components/student/Footer';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: Clock },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
};

const ReviewRequest = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    industry: '',
    experienceLevel: '',
    targetRole: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [reviews, setReviews] = useState([]);

  // Load past reviews
  useEffect(() => {
    try {
      const saved = localStorage.getItem(REVIEW_STORAGE_KEY);
      if (saved) setReviews(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const saveReviews = (updated) => {
    setReviews(updated);
    localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(updated));
  };

  /* ---------- File handling ---------- */
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && validateFile(dropped)) setFile(dropped);
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (selected && validateFile(selected)) setFile(selected);
  };

  const validateFile = (f) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) {
      setErrors((prev) => ({ ...prev, file: 'Only PDF files are accepted' }));
      return false;
    }
    if (f.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: 'File must be under 5 MB' }));
      return false;
    }
    setErrors((prev) => { const n = { ...prev }; delete n.file; return n; });
    return true;
  };

  /* ---------- Form submission ---------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!file) newErrors.file = 'Please upload your resume';
    if (!formData.industry) newErrors.industry = 'Select an industry';
    if (!formData.experienceLevel) newErrors.experienceLevel = 'Select your experience level';
    if (!formData.targetRole?.trim()) newErrors.targetRole = 'Enter your target role';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newReview = {
      id: Date.now(),
      fileName: file.name,
      industry: formData.industry,
      experienceLevel: formData.experienceLevel,
      targetRole: formData.targetRole,
      notes: formData.notes,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    saveReviews([newReview, ...reviews]);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteReview = (id) => {
    saveReviews(reviews.filter((r) => r.id !== id));
  };

  const resetForm = () => {
    setFile(null);
    setFormData({ industry: '', experienceLevel: '', targetRole: '', notes: '' });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Resume Review</h1>
            <p className="text-emerald-200 text-sm sm:text-base max-w-xl mx-auto">
              Upload your resume and get personalized feedback from industry professionals.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          {/* Success State */}
          {submitted && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 mb-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Review Requested!</h2>
              <p className="text-gray-600 text-sm mb-5 max-w-md mx-auto">
                Your resume has been submitted for review. You will be notified when
                a professional has reviewed it.
              </p>
              <button
                onClick={resetForm}
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium
                  hover:bg-emerald-700 transition-colors"
              >
                Submit Another
              </button>
            </div>
          )}

          {/* Upload Form */}
          {!submitted && (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8">
                <SectionTitle>Upload Your Resume</SectionTitle>

                {/* Drop zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors
                    ${dragActive ? 'border-emerald-400 bg-emerald-50' :
                      errors.file ? 'border-red-300 bg-red-50/30' :
                      file ? 'border-emerald-300 bg-emerald-50/30' :
                      'border-gray-300 bg-gray-50 hover:border-gray-400'}`}
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
                      <p className="text-xs text-gray-500 mt-1">
                        {(file.size / 1024).toFixed(0)} KB
                      </p>
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
                      <p className="text-sm font-medium text-gray-600">
                        Drag & drop your resume here
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        or click to browse — PDF only, max 5 MB
                      </p>
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
                className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-semibold
                  hover:bg-emerald-700 transition-colors shadow-sm text-sm"
              >
                Submit for Review
              </button>
            </form>
          )}

          {/* Past Reviews */}
          {reviews.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Your Review Requests</h2>
              <div className="space-y-3">
                {reviews.map((review) => {
                  const statusConf = STATUS_CONFIG[review.status] || STATUS_CONFIG.pending;
                  const StatusIcon = statusConf.icon;
                  return (
                    <div
                      key={review.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5
                        flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText size={16} className="text-gray-400 shrink-0" />
                          <span className="text-sm font-medium text-gray-800 truncate">
                            {review.fileName}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {review.targetRole} &middot; {review.industry}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Submitted {new Date(review.submittedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                          text-xs font-medium ${statusConf.color}`}>
                          <StatusIcon size={12} />
                          {statusConf.label}
                        </span>
                        <button
                          onClick={() => deleteReview(review.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReviewRequest;
