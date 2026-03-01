import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  StickyNote,
  History,
  XCircle,
  Star,
  Video,
  Clock,
  Plus,
  Send,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════ *
 *  MentorDetailPanel — shows when a student opens an accepted mentor.
 *  Contains: session scheduling, chat placeholder, notes, session history,
 *  and cancel mentoring option.
 * ═══════════════════════════════════════════════════════════════════════════ */

const subtabs = [
  { key: 'schedule',  label: 'Schedule',  Icon: Calendar },
  { key: 'chat',      label: 'Chat',      Icon: MessageSquare },
  { key: 'notes',     label: 'Notes',     Icon: StickyNote },
  { key: 'history',   label: 'History',   Icon: History },
];

/* ── Placeholder: Session Scheduling ──────────────────────────────────── */
const ScheduleTab = ({ mentor }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const slots = [
    { id: 1, date: 'Tue, Mar 3', time: '10:00 AM – 10:45 AM', available: true },
    { id: 2, date: 'Thu, Mar 5', time: '2:00 PM – 2:45 PM',   available: true },
    { id: 3, date: 'Sat, Mar 7', time: '11:00 AM – 11:45 AM', available: false },
    { id: 4, date: 'Mon, Mar 9', time: '4:00 PM – 4:45 PM',   available: true },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Upcoming Slots</h3>
        <span className="text-xs text-slate-400">Timezone: IST (UTC +5:30)</span>
      </div>
      <div className="space-y-2">
        {slots.map((slot) => (
          <button
            key={slot.id}
            disabled={!slot.available}
            onClick={() => setSelectedSlot(slot.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
              !slot.available
                ? 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed'
                : selectedSlot === slot.id
                  ? 'bg-emerald-50 border-emerald-300 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-emerald-200 hover:shadow-sm'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <Video size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">{slot.date}</p>
              <p className="text-xs text-slate-500">{slot.time}</p>
            </div>
            {!slot.available && <span className="text-[10px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Booked</span>}
            {slot.available && selectedSlot === slot.id && <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Selected</span>}
          </button>
        ))}
      </div>
      {selectedSlot && (
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-emerald-200">
          <Calendar size={16} /> Confirm Booking
        </button>
      )}
    </div>
  );
};

/* ── Placeholder: Chat ────────────────────────────────────────────────── */
const ChatTab = ({ mentor }) => {
  const [msg, setMsg] = useState('');
  const messages = [
    { from: 'mentor', text: `Hi! I've reviewed your profile. Let's start by setting your goals. What would you like to achieve in the next 3 months?`, time: '2:30 PM' },
    { from: 'you', text: 'Thank you! I want to transition to a product management role. I have 3 years in engineering.', time: '2:45 PM' },
    { from: 'mentor', text: 'Great goal. I\'ll share a roadmap and some exercises. We\'ll cover this in our first session.', time: '3:01 PM' },
  ];
  return (
    <div className="flex flex-col h-[400px]">
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'you' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
              m.from === 'you'
                ? 'bg-emerald-600 text-white rounded-br-md'
                : 'bg-slate-100 text-slate-700 rounded-bl-md'
            }`}>
              <p>{m.text}</p>
              <p className={`text-[10px] mt-1 ${m.from === 'you' ? 'text-emerald-200' : 'text-slate-400'}`}>{m.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 border-t border-slate-100 pt-3">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
        />
        <button className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition flex items-center gap-1.5 text-sm font-medium">
          <Send size={14} /> Send
        </button>
      </div>
      <p className="text-[10px] text-slate-400 text-center mt-2">This is a UI preview. Messaging will be available once backend is connected.</p>
    </div>
  );
};

/* ── Placeholder: Notes ───────────────────────────────────────────────── */
const NotesTab = () => {
  const [notes, setNotes] = useState([
    { id: 1, text: 'Discussed PM transition roadmap. Focus on user interviews this week.', date: 'Feb 28, 2026' },
    { id: 2, text: 'Completed mock product spec. Needs refinement on metrics section.', date: 'Feb 21, 2026' },
  ]);
  const [newNote, setNewNote] = useState('');

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes((prev) => [
      { id: Date.now(), text: newNote, date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
      ...prev,
    ]);
    setNewNote('');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addNote()}
          placeholder="Add a note..."
          className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
        />
        <button onClick={addNote} className="px-3 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition">
          <Plus size={16} />
        </button>
      </div>
      <div className="space-y-2">
        {notes.map((n) => (
          <div key={n.id} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <p className="text-sm text-slate-700">{n.text}</p>
            <p className="text-[10px] text-slate-400 mt-2">{n.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Placeholder: Session History ─────────────────────────────────────── */
const HistoryTab = () => {
  const sessions = [
    { id: 1, date: 'Feb 28, 2026', duration: '45 min', topic: 'PM Roadmap & Goal Setting', status: 'completed' },
    { id: 2, date: 'Feb 21, 2026', duration: '40 min', topic: 'Product Spec Review', status: 'completed' },
    { id: 3, date: 'Feb 14, 2026', duration: '30 min', topic: 'Intro & Background Discussion', status: 'completed' },
  ];
  return (
    <div className="space-y-2">
      {sessions.length === 0 ? (
        <div className="text-center py-12">
          <History size={28} className="mx-auto text-slate-300 mb-3" />
          <p className="text-sm text-slate-500">No sessions yet</p>
        </div>
      ) : (
        sessions.map((s) => (
          <div key={s.id} className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Video size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">{s.topic}</p>
              <p className="text-xs text-slate-500">{s.date} · {s.duration}</p>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Completed
            </span>
          </div>
        ))
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════ */

export default function MentorDetailPanel({ mentor, request, onBack, onCancelMentoring }) {
  const [activeSubtab, setActiveSubtab] = useState('schedule');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  return (
    <div>
      {/* Back + Header */}
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors text-sm mb-6">
        <ArrowLeft size={16} /> Back to My Mentors
      </button>

      {/* Mentor info bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <img src={mentor.image} alt={mentor.name} className="w-14 h-14 rounded-xl object-cover border border-slate-100" />
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-slate-900">{mentor.name}</h2>
          <p className="text-sm text-slate-500">{mentor.title} @ {mentor.company}</p>
          <div className="flex items-center gap-2 mt-1">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-slate-700">{mentor.rating}</span>
            <span className="text-xs text-slate-400">({mentor.reviews} reviews)</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-emerald-600">Active since {new Date(request.responseDate || request.requestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6 overflow-x-auto">
        {subtabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSubtab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeSubtab === tab.key
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.Icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        {activeSubtab === 'schedule' && <ScheduleTab mentor={mentor} />}
        {activeSubtab === 'chat'     && <ChatTab mentor={mentor} />}
        {activeSubtab === 'notes'    && <NotesTab />}
        {activeSubtab === 'history'  && <HistoryTab />}
      </div>

      {/* Cancel Mentoring */}
      <div className="mt-6 pt-6 border-t border-slate-100">
        {!showCancelConfirm ? (
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors"
          >
            <XCircle size={16} /> Cancel Mentoring
          </button>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-red-800">Cancel mentoring with {mentor.name}?</h4>
                <p className="text-xs text-red-600 mt-1">This will end the mentoring relationship. You can always send a new request later.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 px-4 py-2 text-sm font-medium border border-slate-200 text-slate-600 rounded-xl hover:bg-white transition-colors"
              >
                Keep Mentoring
              </button>
              <button
                onClick={onCancelMentoring}
                className="flex-1 px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
