import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useMentorRequests from '../../hooks/useMentorRequests';
import MentorDetailPanel from './MentorDetailPanel';
import {
  Clock,
  CheckCircle,
  Star,
  Users,
  Search,
  ArrowRight,
  Inbox,
  UserCheck,
  RefreshCw,
  AlertCircle,
  Loader2,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════ */

const statusBadge = {
  pending:  { label: 'Pending',  dotCls: 'bg-amber-500',   cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  accepted: { label: 'Active',   dotCls: 'bg-emerald-500', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Declined', dotCls: 'bg-red-500',     cls: 'bg-red-50 text-red-600 border-red-200' },
};

/* ── Empty state ──────────────────────────────────────────────────────────── */
const EmptyState = ({ icon: Icon, title, subtitle, cta, to }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
      <Icon size={28} className="text-slate-400" />
    </div>
    <h3 className="text-base font-semibold text-slate-700 mb-1">{title}</h3>
    <p className="text-sm text-slate-500 mb-6 text-center max-w-xs">{subtitle}</p>
    {cta && (
      <Link
        to={to}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200"
      >
        {cta} <ArrowRight size={16} />
      </Link>
    )}
  </div>
);

/* ── Mentor row card ──────────────────────────────────────────────────────── */
const MentorRow = ({ request, onClick }) => {
  const badge   = statusBadge[request.status];
  const teacher = request.teacher;
  const name    = teacher?.name    || 'Unknown Teacher';
  const imgUrl  = teacher?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e2e8f0&color=475569&size=96`;

  return (
    <div
      onClick={onClick}
      className="group bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 hover:shadow-md hover:border-emerald-200 transition-all duration-200 cursor-pointer"
    >
      <img
        src={imgUrl}
        alt={name}
        className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-slate-100"
        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e2e8f0&color=475569&size=96`; }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className="text-sm font-semibold text-slate-900 truncate">{name}</h4>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dotCls}`} />
            {badge.label}
          </span>
        </div>
        {teacher?.email && (
          <p className="text-xs text-slate-500 truncate">{teacher.email}</p>
        )}
        {request.introduction && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic">
            &ldquo;{request.introduction}&rdquo;
          </p>
        )}
      </div>
      <div className="text-right flex-shrink-0 hidden sm:block">
        <p className="text-[10px] text-slate-400">
          {new Date(request.requestDate).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      </div>
      <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════ */

export default function MentorDashboard() {
  const {
    pendingRequests,
    acceptedRequests,
    cancelRequest,
    cancelMentoring,
    loading,
    error,
    refetch,
  } = useMentorRequests();

  const [activeTab, setActiveTab]           = useState('requested');
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);

  const tabs = [
    { key: 'requested', label: 'Requested', count: pendingRequests.length,  Icon: Clock     },
    { key: 'accepted',  label: 'Accepted',  count: acceptedRequests.length, Icon: UserCheck },
  ];

  const currentList = activeTab === 'requested' ? pendingRequests : acceptedRequests;

  // Detail panel — build a mentor-shaped object from the API teacher data
  const selectedRequest = selectedTeacherId
    ? [...pendingRequests, ...acceptedRequests].find((r) => r.teacherId === selectedTeacherId)
    : null;

  // Adapt API teacher data to the shape MentorDetailPanel expects
  const selectedMentor = selectedRequest?.teacher
    ? {
        id:      selectedRequest.teacher.id,
        name:    selectedRequest.teacher.name,
        image:   selectedRequest.teacher.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedRequest.teacher.name)}&background=d1fae5&color=065f46&size=200`,
        title:   '',
        company: '',
        rating:  0,
        tags:    [],
      }
    : null;

  if (selectedMentor && selectedRequest?.status === 'accepted') {
    return (
      <MentorDetailPanel
        mentor={selectedMentor}
        request={selectedRequest}
        onBack={() => setSelectedTeacherId(null)}
        onCancelMentoring={() => {
          cancelMentoring(selectedTeacherId);
          setSelectedTeacherId(null);
        }}
      />
    );
  }

  /* ── Loading state ────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 size={28} className="animate-spin text-emerald-500" />
        <p className="text-sm text-slate-500">Loading your mentors…</p>
      </div>
    );
  }

  /* ── Error state ──────────────────────────────────────────────────────── */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
          <AlertCircle size={24} className="text-red-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-700 mb-1">Couldn't load mentors</h3>
        <p className="text-sm text-slate-500 mb-5 text-center max-w-xs">{error}</p>
        <button
          onClick={refetch}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
        >
          <RefreshCw size={15} /> Retry
        </button>
      </div>
    );
  }

  /* ── Main render ──────────────────────────────────────────────────────── */
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Mentors</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage your mentoring relationships</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refetch}
            title="Refresh"
            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
          >
            <RefreshCw size={16} />
          </button>
          <Link
            to="/mentor"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Search size={16} /> Find Mentors
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setSelectedTeacherId(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.Icon size={16} />
            {tab.label}
            {tab.count > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === tab.key ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{pendingRequests.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Pending Requests</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{acceptedRequests.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Active Mentors</p>
        </div>
      </div>

      {/* List */}
      {currentList.length === 0 ? (
        activeTab === 'requested' ? (
          <EmptyState
            icon={Inbox}
            title="No pending requests"
            subtitle="Browse mentors and send your first mentoring request."
            cta="Explore Mentors"
            to="/mentor"
          />
        ) : (
          <EmptyState
            icon={Users}
            title="No active mentors yet"
            subtitle="Once a mentor accepts your request, they'll appear here."
          />
        )
      ) : (
        <div className="space-y-3">
          {currentList.map((req) => (
            <MentorRow
              key={req.requestId}
              request={req}
              onClick={() => {
                if (req.status === 'accepted') {
                  setSelectedTeacherId(req.teacherId);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
