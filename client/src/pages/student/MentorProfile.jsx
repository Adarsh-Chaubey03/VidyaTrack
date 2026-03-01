import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mentors } from '../../assets/assets';
import Footer from '../../components/student/Footer';
import useMentorRequests from '../../hooks/useMentorRequests';
import { useAuth } from '../../context/AuthContext';
import {
  Clock,
  ThumbsUp,
  Megaphone,
  CheckCircle,
  ArrowLeft,
  Coffee,
  Briefcase,
  TrendingUp,
  Globe,
  FileText,
  Leaf,
  Star,
  X,
  Send,
  CalendarCheck,
  AlertCircle,
  Loader2,
  Users,
  Sparkles,
} from 'lucide-react';

/* ── Status badge ─────────────────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    none: null,
    pending: { label: 'Request Pending', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    accepted: { label: 'Mentoring Active', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    rejected: { label: 'Request Declined', cls: 'bg-red-50 text-red-600 border-red-200' },
  };
  const b = map[status];
  if (!b) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${b.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'pending' ? 'bg-amber-500' : status === 'accepted' ? 'bg-emerald-500' : 'bg-red-500'}`} />
      {b.label}
    </span>
  );
};

/* ── Slots indicator ──────────────────────────────────────────────────────── */
const SlotsIndicator = ({ spotsLeft }) => {
  if (spotsLeft > 5) return null;
  const urgent = spotsLeft <= 2;
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${urgent ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
      <Users size={14} />
      {spotsLeft === 0
        ? 'No slots available'
        : `Only ${spotsLeft} slot${spotsLeft > 1 ? 's' : ''} remaining`}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════ */

const MentorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const mentor = mentors.find((m) => m.id === parseInt(id));

  const { getStatus, sendRequest, cancelRequest } = useMentorRequests();

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  if (!mentor) {
    navigate('/mentor');
    return null;
  }

  const status = getStatus(mentor.id);

  /* Enriched data (will come from API later) */
  const mentorData = {
    ...mentor,
    availability: 'Available',
    nextAvailable: 'Tue, Mar 3',
    responseTime: '< 24 hours',
    expectations: {
      greeting:
        'Congratulations on taking the step to invest in your growth. I look forward to helping you reach your goals.',
      points: [
        'Be open to learn new tools and techniques.',
        'Complete all exercises shared between sessions.',
        'Consistently communicate and share your progress.',
      ],
      quotes: [
        'Just as our eyes need light in order to see, our minds need ideas in order to conceive.',
        "Don't wait. The time will never be just right.",
      ],
      closing: 'To your success — ' + mentor.name,
    },
    stats: { memberSince: 'almost 3 years', likes: 48, reviews: mentor.reviews, mentored: 35 },
    reviews: [
      { text: 'Incredibly insightful. Helped me transition into a PM role within 3 months.', author: 'Ravi K.', rating: 5 },
      { text: 'Very structured approach. The weekly assignments were a game-changer.', author: 'Sneha P.', rating: 4 },
    ],
    bio: `${mentor.name} is a seasoned ${mentor.title} at ${mentor.company} with extensive experience mentoring professionals globally. Their structured approach combines practical exercises, accountability check-ins, and personalised guidance.`,
  };

  /* ── CTA logic ────────────────────────────────────────────────────────── */
  const handleCTA = () => {
    if (!isAuthenticated()) { navigate('/login'); return; }
    if (status === 'none' || status === 'rejected') setShowRequestModal(true);
    else if (status === 'accepted') navigate('/my-dashboard');
  };

  const ctaMap = {
    none:     { label: 'Request to Get Mentored', icon: Sparkles, cls: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200', disabled: false },
    pending:  { label: 'Request Sent',            icon: Clock,    cls: 'bg-slate-100 text-slate-500 cursor-not-allowed',                               disabled: true  },
    accepted: { label: 'Start Mentoring',         icon: CalendarCheck, cls: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200',      disabled: false },
    rejected: { label: 'Re-request Mentoring',    icon: Send,     cls: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200',  disabled: false },
  };
  const cta = ctaMap[status];
  const CTAIcon = cta.icon;

  /* ── Submit request ───────────────────────────────────────────────────── */
  const handleSubmitRequest = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      sendRequest(mentor.id, message);
      setIsSubmitting(false);
      setShowRequestModal(false);
      setMessage('');
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 4000);
    }, 1200);
  };

  /* ════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Toast */}
      {successToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50" style={{ animation: 'slideDown .3s ease-out' }}>
          <div className="flex items-center gap-3 bg-white border border-emerald-200 shadow-xl rounded-xl px-5 py-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Request sent!</p>
              <p className="text-xs text-slate-500">You'll be notified when {mentor.name} responds.</p>
            </div>
          </div>
        </div>
      )}

      {/* Banner */}
      <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 h-52 md:h-60 overflow-visible">
        <div className="absolute inset-0 opacity-10 text-white">
          <Coffee size={28} className="absolute top-6 left-12" />
          <Briefcase size={24} className="absolute top-16 right-20" />
          <TrendingUp size={22} className="absolute bottom-8 left-1/3" />
          <Globe size={20} className="absolute top-10 left-1/2" />
          <FileText size={22} className="absolute bottom-12 right-1/4" />
          <Leaf size={18} className="absolute top-20 right-1/3" />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10">
          <div className="relative">
            <img src={mentor.image} alt={mentor.name} className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-white shadow-xl" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" title="Available" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <button onClick={() => navigate('/mentor')} className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors mb-8 text-sm">
          <ArrowLeft size={16} /> Back to Mentors
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left column ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{mentor.name}</h1>
                <StatusBadge status={status} />
              </div>
              <p className="text-base text-slate-600">{mentor.title} @ <span className="font-semibold">{mentor.company}</span></p>
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm font-semibold text-slate-800">{mentor.rating}</span>
                  <span className="text-xs text-slate-400">({mentorData.stats.reviews} reviews)</span>
                </div>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="text-xs text-slate-500">{mentorData.stats.mentored} mentored</span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="text-xs text-emerald-600 font-medium">Responds {mentorData.responseTime}</span>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">About</h2>
              <p className="text-slate-700 leading-relaxed">{mentorData.bio}</p>
            </div>

            {/* Expectations */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">What I Expect From A Mentee</h2>
              <p className="text-slate-700 leading-relaxed mb-4">{mentorData.expectations.greeting}</p>
              <ul className="space-y-2 mb-4">
                {mentorData.expectations.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">{pt}</span>
                  </li>
                ))}
              </ul>
              {mentorData.expectations.quotes.map((q, i) => (
                <blockquote key={i} className="italic text-slate-500 border-l-2 border-emerald-400 pl-4 text-sm mb-2">&ldquo;{q}&rdquo;</blockquote>
              ))}
              <p className="text-sm font-medium text-slate-600 mt-3">{mentorData.expectations.closing}</p>
            </div>

            {/* Stats */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Mentor Stats</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { Icon: Clock, label: 'Member since', value: mentorData.stats.memberSince },
                  { Icon: ThumbsUp, label: 'Likes', value: mentorData.stats.likes },
                  { Icon: Megaphone, label: 'Reviews', value: mentorData.stats.reviews },
                  { Icon: CheckCircle, label: 'Mentored', value: mentorData.stats.mentored },
                ].map((s, i) => (
                  <div key={i} className="text-center p-3 bg-slate-50 rounded-lg">
                    <s.Icon size={20} className="text-emerald-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-slate-900">{s.value}</p>
                    <p className="text-xs text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Reviews ({mentorData.stats.reviews})</h2>
              <div className="space-y-4">
                {mentorData.reviews.map((r, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {r.author.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-slate-800">{r.author}</span>
                        <div className="flex">{[...Array(5)].map((_, j) => <Star key={j} size={12} className={j < r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} />)}</div>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{r.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column / Sidebar ──────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-5">
              {/* CTA Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-slate-900">₹{mentor.price}<span className="text-sm font-normal text-slate-500">/month</span></p>
                  {mentor.freeTrial && <p className="text-xs text-emerald-600 font-semibold mt-1">7-day free trial included</p>}
                </div>
                <SlotsIndicator spotsLeft={mentor.spotsLeft} />
                <button
                  onClick={handleCTA}
                  disabled={cta.disabled}
                  className={`w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 mt-4 ${cta.cls}`}
                >
                  <CTAIcon size={18} />
                  {cta.label}
                </button>
                {status === 'pending' && (
                  <button onClick={() => cancelRequest(mentor.id)} className="w-full mt-2 text-xs text-slate-400 hover:text-red-500 transition-colors py-1">
                    Cancel request
                  </button>
                )}
              </div>

              {/* Availability */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Availability</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Status</span>
                    <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      {mentorData.availability}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Next slot</span>
                    <span className="text-sm font-medium text-slate-800">{mentorData.nextAvailable}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Response time</span>
                    <span className="text-sm font-medium text-slate-800">{mentorData.responseTime}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Specialisations</h3>
                <div className="flex flex-wrap gap-2">
                  {mentor.tags.map((t, i) => (
                    <span key={i} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Request Modal ──────────────────────────────────────────────── */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => { setShowRequestModal(false); setMessage(''); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden" style={{ animation: 'scaleIn .2s ease-out' }}>
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={mentor.image} alt="" className="w-10 h-10 rounded-lg object-cover border-2 border-white/30" />
                  <div>
                    <h3 className="font-semibold text-sm">Request Mentoring</h3>
                    <p className="text-xs text-emerald-100">{mentor.name} · {mentor.title}</p>
                  </div>
                </div>
                <button onClick={() => { setShowRequestModal(false); setMessage(''); }} className="text-white/70 hover:text-white transition">
                  <X size={20} />
                </button>
              </div>
            </div>
            {/* Body */}
            <form onSubmit={handleSubmitRequest} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Introduce yourself</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your background, goals, and what you hope to gain..."
                  className="w-full p-3.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none transition-all"
                  rows={5}
                  required
                />
                <p className="text-xs text-slate-400 mt-1.5">A thoughtful message increases your chances of acceptance.</p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <AlertCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Your request will be reviewed by {mentor.name}. Average response time is {mentorData.responseTime}.
                </p>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setShowRequestModal(false); setMessage(''); }} className="flex-1 px-4 py-2.5 text-sm font-medium border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting || !message.trim()} className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2">
                  {isSubmitting ? (<><Loader2 size={16} className="animate-spin" />Sending…</>) : (<><Send size={16} />Send Request</>)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MentorProfile;
