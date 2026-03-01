import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mentors } from '../../assets/assets';
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
  X,
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
      <Link to={to} className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200">
        {cta} <ArrowRight size={16} />
      </Link>
    )}
  </div>
);

/* ── Mentor row card ──────────────────────────────────────────────────────── */
const MentorRow = ({ mentor, request, onClick }) => {
  const badge = statusBadge[request.status];
  return (
    <div
      onClick={onClick}
      className="group bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 hover:shadow-md hover:border-emerald-200 transition-all duration-200 cursor-pointer"
    >
      <img src={mentor.image} alt={mentor.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-slate-100" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className="text-sm font-semibold text-slate-900 truncate">{mentor.name}</h4>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dotCls}`} />
            {badge.label}
          </span>
        </div>
        <p className="text-xs text-slate-500 truncate">{mentor.title} @ {mentor.company}</p>
        <div className="flex items-center gap-3 mt-1.5">
          {mentor.tags.slice(0, 3).map((t, i) => (
            <span key={i} className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
      </div>
      <div className="text-right flex-shrink-0 hidden sm:block">
        <div className="flex items-center gap-1 mb-1">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-semibold text-slate-700">{mentor.rating}</span>
        </div>
        <p className="text-[10px] text-slate-400">
          {new Date(request.requestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>
      <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════ */

export default function MentorDashboard() {
  const { pendingRequests, acceptedRequests, cancelRequest, cancelMentoring } = useMentorRequests();
  const [activeTab, setActiveTab] = useState('requested');
  const [selectedMentorId, setSelectedMentorId] = useState(null);

  // Resolve mentor data from static list (will be API-resolved later)
  const resolveMentor = (id) => mentors.find((m) => m.id === id) || null;

  const tabs = [
    { key: 'requested', label: 'Requested', count: pendingRequests.length, Icon: Clock },
    { key: 'accepted',  label: 'Accepted',  count: acceptedRequests.length, Icon: UserCheck },
  ];

  const currentList = activeTab === 'requested' ? pendingRequests : acceptedRequests;

  // Detail panel for accepted mentor
  const selectedMentor = selectedMentorId ? resolveMentor(selectedMentorId) : null;
  const selectedRequest = selectedMentorId
    ? [...pendingRequests, ...acceptedRequests].find((r) => r.mentorId === selectedMentorId)
    : null;

  if (selectedMentor && selectedRequest?.status === 'accepted') {
    return (
      <MentorDetailPanel
        mentor={selectedMentor}
        request={selectedRequest}
        onBack={() => setSelectedMentorId(null)}
        onCancelMentoring={() => {
          cancelMentoring(selectedMentorId);
          setSelectedMentorId(null);
        }}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Mentors</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage your mentoring relationships</p>
        </div>
        <Link
          to="/mentor"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Search size={16} /> Find Mentors
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setSelectedMentorId(null); }}
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
          {currentList.map((req) => {
            const mentor = resolveMentor(req.mentorId);
            if (!mentor) return null;
            return (
              <MentorRow
                key={req.mentorId}
                mentor={mentor}
                request={req}
                onClick={() => {
                  if (req.status === 'accepted') {
                    setSelectedMentorId(req.mentorId);
                  }
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
