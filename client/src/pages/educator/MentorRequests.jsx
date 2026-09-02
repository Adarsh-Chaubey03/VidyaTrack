import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../services/api.js';
import {
  Users,
  Inbox,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertCircle,
  Loader2,
  Clock,
  UserCheck,
  ChevronDown,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────── */
/* Status badge                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    pending:  { label: 'Pending',  cls: 'bg-amber-50 text-amber-700 border-amber-200',     dot: 'bg-amber-500'   },
    accepted: { label: 'Accepted', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-600 border-red-200',           dot: 'bg-red-500'     },
  };
  const b = map[status];
  if (!b) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${b.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${b.dot}`} />
      {b.label}
    </span>
  );
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* Request card                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */
const RequestCard = ({ request, onAccept, onReject, actionLoading }) => {
  const [expanded, setExpanded] = useState(false);
  const student  = request.student;
  const name     = student?.name  || 'Unknown Student';
  const imgUrl   = student?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e2e8f0&color=475569&size=96`;
  const isLoading = actionLoading === request.requestId;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
      {/* Top row */}
      <div className="p-5 flex items-start gap-4">
        <img
          src={imgUrl}
          alt={name}
          className="w-11 h-11 rounded-xl object-cover flex-shrink-0 border border-slate-100"
          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e2e8f0&color=475569&size=96`; }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="text-sm font-semibold text-slate-900">{name}</h3>
            <StatusBadge status={request.status} />
          </div>
          {student?.email && (
            <p className="text-xs text-slate-500 mb-2">{student.email}</p>
          )}

          {/* Introduction preview */}
          <p className={`text-sm text-slate-600 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
            {request.introduction}
          </p>
          {request.introduction?.length > 120 && (
            <button
              onClick={() => setExpanded((p) => !p)}
              className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 mt-1 font-medium"
            >
              {expanded ? 'Show less' : 'Read more'}
              <ChevronDown size={13} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          )}

          <p className="text-[10px] text-slate-400 mt-2">
            Received {new Date(request.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Action buttons — only for pending */}
      {request.status === 'pending' && (
        <div className="px-5 pb-5 flex gap-2">
          <button
            onClick={() => onAccept(request.requestId)}
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {isLoading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <CheckCircle size={15} />
            )}
            Accept
          </button>
          <button
            onClick={() => onReject(request.requestId)}
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-red-50 disabled:opacity-50 text-red-600 border border-red-200 text-sm font-semibold rounded-lg transition-colors"
          >
            {isLoading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <XCircle size={15} />
            )}
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* Main page                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */
export default function MentorRequests() {
  const [requests, setRequests]       = useState([]);
  const [activeTab, setActiveTab]     = useState('pending');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // requestId being acted on
  const [toast, setToast]             = useState(null);     // { type: 'success'|'error', msg }

  /* ── Fetch requests ─────────────────────────────────────────────────── */
  const fetchRequests = useCallback(async (status = activeTab) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.mentor.getTeacherRequests(status);
      if (!res.success) {
        setError(res.message || 'Failed to load requests.');
        return;
      }
      setRequests(res.requests || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load requests.');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchRequests(activeTab);
  }, [activeTab]);   // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Show toast ─────────────────────────────────────────────────────── */
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── Accept / Reject ────────────────────────────────────────────────── */
  const handleRespond = async (requestId, status) => {
    setActionLoading(requestId);
    try {
      const res = await apiService.mentor.respondToRequest(requestId, status);
      if (!res.success) {
        showToast('error', res.message || `Failed to ${status} request.`);
        return;
      }
      showToast('success', `Request ${status} successfully.`);
      // Remove the acted-on request from the pending list immediately
      setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
    } catch (err) {
      showToast('error', err?.response?.data?.message || `Failed to ${status} request.`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAccept = (requestId) => handleRespond(requestId, 'accepted');
  const handleReject = (requestId) => handleRespond(requestId, 'rejected');

  /* ── Tab counts (live from current fetch; refetch for others) ───────── */
  const pendingCount  = activeTab === 'pending'  ? requests.length : '—';
  const acceptedCount = activeTab === 'accepted' ? requests.length : '—';

  const tabs = [
    { key: 'pending',  label: 'Requests',  Icon: Clock,      count: pendingCount  },
    { key: 'accepted', label: 'Accepted',  Icon: UserCheck,  count: acceptedCount },
    { key: 'rejected', label: 'Rejected',  Icon: XCircle,    count: activeTab === 'rejected' ? requests.length : '—' },
  ];

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="space-y-6 relative">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl border text-sm font-medium
            ${toast.type === 'success'
              ? 'bg-white border-emerald-200 text-emerald-800'
              : 'bg-white border-red-200 text-red-700'}`}
          style={{ animation: 'slideDown .25s ease-out' }}
        >
          {toast.type === 'success'
            ? <CheckCircle size={17} className="text-emerald-500 flex-shrink-0" />
            : <AlertCircle size={17} className="text-red-400 flex-shrink-0" />
          }
          {toast.msg}
        </div>
      )}

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Mentorship Requests</h1>
          <p className="text-sm text-slate-500 mt-0.5">Review and respond to student mentorship requests</p>
        </div>
        <button
          onClick={() => fetchRequests(activeTab)}
          title="Refresh"
          className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-emerald-600 transition-colors flex-shrink-0"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.Icon size={15} />
            {tab.label}
            {tab.count !== '—' && tab.count > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === tab.key ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={28} className="animate-spin text-emerald-500" />
          <p className="text-sm text-slate-500">Loading requests…</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
            <AlertCircle size={24} className="text-red-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">Couldn't load requests</h3>
          <p className="text-sm text-slate-500 mb-5 text-center max-w-xs">{error}</p>
          <button
            onClick={() => fetchRequests(activeTab)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <RefreshCw size={15} /> Retry
          </button>
        </div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
            {activeTab === 'pending' ? (
              <Inbox size={28} className="text-slate-400" />
            ) : activeTab === 'accepted' ? (
              <UserCheck size={28} className="text-slate-400" />
            ) : (
              <Users size={28} className="text-slate-400" />
            )}
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">
            {activeTab === 'pending'
              ? 'No pending requests'
              : activeTab === 'accepted'
              ? 'No accepted requests yet'
              : 'No rejected requests'}
          </h3>
          <p className="text-sm text-slate-500 text-center max-w-xs">
            {activeTab === 'pending'
              ? 'When students send you mentorship requests, they will appear here.'
              : activeTab === 'accepted'
              ? 'Requests you accept will appear here as active mentoring relationships.'
              : 'Requests you have declined will be listed here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {requests.map((req) => (
            <RequestCard
              key={req.requestId}
              request={req}
              onAccept={handleAccept}
              onReject={handleReject}
              actionLoading={actionLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
