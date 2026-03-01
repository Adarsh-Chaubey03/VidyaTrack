import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronDown,
  ExternalLink,
  FileText,
  Users,
  ArrowLeft,
} from 'lucide-react';
import { SkeletonAdminApplications } from '../../components/skeleton/Skeleton';

const statusColors = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

const statusIcons = {
  pending: <Clock className="w-4 h-4" />,
  approved: <CheckCircle2 className="w-4 h-4" />,
  rejected: <XCircle className="w-4 h-4" />,
};

const AdminApplications = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewingId, setReviewingId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      navigate('/');
      return;
    }
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appsRes, statsRes] = await Promise.all([
        apiService.educatorAccess.getApplications(filter || undefined),
        apiService.educatorAccess.getStats(),
      ]);
      if (appsRes.success) setApplications(appsRes.applications);
      if (statsRes.success) setStats(statsRes.stats);
    } catch (err) {
      toast.error('Failed to fetch applications');
    }
    setLoading(false);
  };

  const handleReview = async (applicationId, decision) => {
    setReviewingId(applicationId);
    try {
      const res = await apiService.educatorAccess.reviewApplication(applicationId, {
        decision,
        adminNotes: reviewNotes,
      });
      if (res.success) {
        toast.success(`Application ${decision}`);
        setReviewNotes('');
        setExpandedId(null);
        fetchData();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Review failed');
    }
    setReviewingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-700 mb-4 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Home
        </button>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-900">Educator Applications</h1>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total', val: stats.total, color: 'text-gray-900' },
              { label: 'Pending', val: stats.pending, color: 'text-amber-600' },
              { label: 'Approved', val: stats.approved, color: 'text-emerald-600' },
              { label: 'Rejected', val: stats.rejected, color: 'text-red-600' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5 text-center">
                <p className={`text-3xl font-bold ${s.color}`}>{s.val}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filter */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-gray-500">Filter:</span>
          {['', 'pending', 'approved', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                filter === f ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
              }`}
            >
              {f || 'All'}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <SkeletonAdminApplications />
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No applications found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                      {app.fullName?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{app.fullName}</p>
                      <p className="text-xs text-gray-500">{app.email} · {app.expertise}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[app.status]}`}>
                      {statusIcons[app.status]} {app.status}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedId === app._id ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {expandedId === app._id && (
                  <div className="border-t border-gray-100 p-5 bg-gray-50/50">
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div><span className="font-medium text-gray-500">Qualification:</span> <span className="text-gray-900">{app.qualification}</span></div>
                      <div><span className="font-medium text-gray-500">Experience:</span> <span className="text-gray-900">{app.yearsOfExperience} year(s)</span></div>
                      <div><span className="font-medium text-gray-500">Expertise:</span> <span className="text-gray-900">{app.expertise}</span></div>
                      <div><span className="font-medium text-gray-500">Applied:</span> <span className="text-gray-900">{new Date(app.createdAt).toLocaleDateString()}</span></div>
                      {app.bio && (
                        <div className="sm:col-span-2"><span className="font-medium text-gray-500">Bio:</span> <span className="text-gray-900">{app.bio}</span></div>
                      )}
                      {app.portfolio && (
                        <div>
                          <a href={app.portfolio} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline inline-flex items-center gap-1">
                            Portfolio <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                      {app.linkedIn && (
                        <div>
                          <a href={app.linkedIn} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline inline-flex items-center gap-1">
                            LinkedIn <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                      {app.documentUrl && (
                        <div className="sm:col-span-2">
                          <a href={app.documentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-emerald-600 hover:underline">
                            <FileText className="w-4 h-4" /> View Verification Document
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Review Controls — only for pending */}
                    {app.status === 'pending' && (
                      <div className="mt-6 border-t border-gray-200 pt-5">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Notes (optional)</label>
                        <textarea
                          rows={2}
                          placeholder="Add notes for the applicant..."
                          value={expandedId === app._id ? reviewNotes : ''}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none mb-4"
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleReview(app._id, 'approved')}
                            disabled={reviewingId === app._id}
                            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition disabled:opacity-60"
                          >
                            {reviewingId === app._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            Approve
                          </button>
                          <button
                            onClick={() => handleReview(app._id, 'rejected')}
                            disabled={reviewingId === app._id}
                            className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-red-700 transition disabled:opacity-60"
                          >
                            {reviewingId === app._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                            Reject
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Previous review info */}
                    {app.status !== 'pending' && app.adminNotes && (
                      <div className="mt-4 bg-white rounded-xl p-4 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Admin Notes</p>
                        <p className="text-sm text-gray-700">{app.adminNotes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApplications;
