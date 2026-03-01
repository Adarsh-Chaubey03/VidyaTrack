import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { toast } from 'react-toastify';
import {
  GraduationCap,
  Upload,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  User,
  Mail,
  Award,
  Briefcase,
  Clock,
  Link as LinkIcon,
  FileText,
  AlignLeft,
} from 'lucide-react';

const EducatorApplicationForm = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    qualification: '',
    expertise: '',
    yearsOfExperience: '',
    portfolio: '',
    linkedIn: '',
    bio: '',
  });
  const [document, setDocument] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [autoApproved, setAutoApproved] = useState(false);

  // Pre-fill from user data
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: { pathname: '/educator-access/apply' } } });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      toast.error('File size must be under 10 MB');
      return;
    }
    setDocument(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      if (document) formData.append('document', document);

      const res = await apiService.educatorAccess.apply(formData);
      if (res.success) {
        setSubmitted(true);
        setAutoApproved(res.autoApproved || false);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Confirmation View ──────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-10 text-center border border-gray-100">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {autoApproved ? 'You\'re Approved!' : 'Application Submitted'}
          </h2>
          <p className="text-gray-500 mt-3 leading-relaxed">
            {autoApproved
              ? 'Your credentials met our criteria and you\'ve been auto-approved. Log in as an Educator to get started.'
              : 'Our team will review your application. You\'ll be notified once a decision is made.'}
          </p>
          <div className="mt-8 flex flex-col gap-3">
            {autoApproved && (
              <button
                onClick={() => navigate('/educator-access/login')}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition"
              >
                Login as Educator
              </button>
            )}
            <button
              onClick={() => navigate('/educator-access')}
              className="w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Back to Educator Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Field Config ───────────────────────────────────────
  const fields = [
    { name: 'fullName', label: 'Full Name', icon: <User className="w-4 h-4" />, type: 'text', required: true, placeholder: 'Dr. Jane Smith' },
    { name: 'email', label: 'Email Address', icon: <Mail className="w-4 h-4" />, type: 'email', required: true, placeholder: 'jane@university.edu' },
    { name: 'qualification', label: 'Highest Qualification', icon: <Award className="w-4 h-4" />, type: 'text', required: true, placeholder: 'Ph.D. in Computer Science' },
    { name: 'expertise', label: 'Expertise / Domain', icon: <Briefcase className="w-4 h-4" />, type: 'text', required: true, placeholder: 'Machine Learning, Data Science' },
    { name: 'yearsOfExperience', label: 'Years of Experience', icon: <Clock className="w-4 h-4" />, type: 'number', required: true, placeholder: '5', min: 0 },
    { name: 'portfolio', label: 'Portfolio URL (optional)', icon: <LinkIcon className="w-4 h-4" />, type: 'url', required: false, placeholder: 'https://portfolio.example.com' },
    { name: 'linkedIn', label: 'LinkedIn Profile (optional)', icon: <LinkIcon className="w-4 h-4" />, type: 'url', required: false, placeholder: 'https://linkedin.com/in/janesmith' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/educator-access')}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-700 mb-6 text-sm font-medium transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Educator Access
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Banner */}
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 px-8 py-8">
            <div className="flex items-center gap-3 text-white">
              <GraduationCap className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Become an Educator</h1>
                <p className="text-emerald-200 text-sm mt-1">Complete the form below to apply for educator privileges.</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                  {f.icon} {f.label}
                </label>
                <input
                  name={f.name}
                  type={f.type}
                  required={f.required}
                  min={f.min}
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                />
              </div>
            ))}

            {/* Bio */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                <AlignLeft className="w-4 h-4" /> Short Bio (optional)
              </label>
              <textarea
                name="bio"
                rows={3}
                maxLength={500}
                placeholder="Tell us a bit about your teaching philosophy..."
                value={form.bio}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{form.bio.length}/500</p>
            </div>

            {/* Document Upload */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                <FileText className="w-4 h-4" /> Verification Document
              </label>
              <p className="text-xs text-gray-400 mb-2">Upload your degree certificate, teaching license, or any relevant credential (PDF, JPG, PNG — max 10 MB).</p>
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-6 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition">
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-500">{document ? document.name : 'Click to upload'}</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold text-base transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EducatorApplicationForm;
