import React, { useEffect, useState } from 'react';
import {
  ArrowLeft, Calendar, MessageSquare, StickyNote, History, Video, Send,
  Plus, Pencil, Trash2, Loader2, AlertCircle, CheckCircle2,
} from 'lucide-react';
import { apiService } from '../../services/api';

const tabs = [
  ['schedule', 'Schedule', Calendar],
  ['chat', 'Chat', MessageSquare],
  ['notes', 'Notes', StickyNote],
  ['history', 'History', History],
];

const errorMessage = (error) => error?.response?.data?.message || error?.message || 'Something went wrong.';
const formatDate = (value) => new Date(value).toLocaleString('en-IN', {
  day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit',
});

function ScheduleTab({ mentorId }) {
  const [slots, setSlots] = useState([]);
  const [state, setState] = useState({ loading: true, error: '', booking: null });
  const load = async () => {
    setState((s) => ({ ...s, loading: true, error: '' }));
    try { const result = await apiService.mentor.workspace.getSlots(mentorId); setSlots(result.slots || []); }
    catch (error) { setState((s) => ({ ...s, error: errorMessage(error) })); }
    finally { setState((s) => ({ ...s, loading: false })); }
  };
  useEffect(() => { load(); }, [mentorId]);
  const book = async (slotId) => {
    setState((s) => ({ ...s, booking: slotId, error: '' }));
    try { const result = await apiService.mentor.workspace.bookSlot(slotId); window.alert(result.message); await load(); }
    catch (error) { setState((s) => ({ ...s, error: errorMessage(error) })); }
    finally { setState((s) => ({ ...s, booking: null })); }
  };
  if (state.loading) return <LoadingState label="Loading available slots..." />;
  return <section className="space-y-3">
    <div className="flex items-center justify-between"><h3 className="font-semibold text-slate-800">Upcoming slots</h3><span className="text-xs text-slate-400">IST</span></div>
    {state.error && <InlineError message={state.error} />}
    {!slots.length && <EmptyState icon={Calendar} label="No upcoming slots" />}
    {slots.map((slot) => {
      const booked = Boolean(slot.booking);
      return <div key={slot._id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
        <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600"><Video size={18} /></div>
        <div className="flex-1"><p className="font-medium text-slate-800">{formatDate(slot.startsAt)}</p><p className="text-xs text-slate-500">Until {new Date(slot.endsAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}</p></div>
        {slot.status !== 'available' ? <span className="text-xs text-slate-400">Unavailable</span> : booked ? <span className="text-xs font-semibold text-amber-600">Booked</span> : <button disabled={state.booking === slot._id} onClick={() => book(slot._id)} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">{state.booking === slot._id ? <Loader2 size={14} className="animate-spin" /> : 'Book'}</button>}
      </div>;
    })}
  </section>;
}

function ChatTab({ studentId, mentorId }) {
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const load = async () => { try { const result = await apiService.mentor.workspace.getConversation(studentId, mentorId); setMessages(result.messages || []); } catch (e) { setError(errorMessage(e)); } finally { setLoading(false); } };
  useEffect(() => { load(); }, [studentId, mentorId]);
  const send = async (event) => {
    event.preventDefault(); if (!body.trim() || sending) return;
    setSending(true); setError('');
    try { const result = await apiService.mentor.workspace.sendMessage({ studentId, mentorId, body }); setMessages((current) => [...current, result.message]); setBody(''); }
    catch (e) { setError(errorMessage(e)); } finally { setSending(false); }
  };
  if (loading) return <LoadingState label="Loading conversation..." />;
  return <div className="flex h-[430px] flex-col">
    {error && <InlineError message={error} />}
    <div className="flex-1 space-y-3 overflow-y-auto py-2">{!messages.length && <EmptyState icon={MessageSquare} label="No messages yet. Start the conversation." />}{messages.map((message) => <div key={message._id} className={`flex ${message.senderId === studentId ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${message.senderId === studentId ? 'rounded-br-md bg-emerald-600 text-white' : 'rounded-bl-md bg-slate-100 text-slate-700'}`}><p>{message.body}</p><p className="mt-1 text-[10px] opacity-60">{formatDate(message.createdAt)}</p></div></div>)}</div>
    <form onSubmit={send} className="flex gap-2 border-t border-slate-100 pt-3"><input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Type a message..." maxLength={4000} className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500" /><button disabled={sending || !body.trim()} className="rounded-xl bg-emerald-600 px-4 text-white disabled:opacity-50">{sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}</button></form>
  </div>;
}

function NotesTab() {
  const [notes, setNotes] = useState([]); const [draft, setDraft] = useState({ title: '', body: '' }); const [editing, setEditing] = useState(null); const [error, setError] = useState('');
  const load = async () => { try { const result = await apiService.mentor.workspace.getNotes(); setNotes(result.notes || []); } catch (e) { setError(errorMessage(e)); } };
  useEffect(() => { load(); }, []);
  const save = async (event) => { event.preventDefault(); if (!draft.body.trim()) return; try { if (editing) await apiService.mentor.workspace.updateNote(editing, draft); else await apiService.mentor.workspace.createNote(draft); setDraft({ title: '', body: '' }); setEditing(null); await load(); } catch (e) { setError(errorMessage(e)); } };
  const remove = async (id) => { try { await apiService.mentor.workspace.deleteNote(id); setNotes((current) => current.filter((note) => note._id !== id)); } catch (e) { setError(errorMessage(e)); } };
  return <section className="space-y-4">{error && <InlineError message={error} />}<form onSubmit={save} className="space-y-2 rounded-xl border border-slate-200 p-4"><input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Note title (optional)" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /><textarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} placeholder="Write a private note..." rows="3" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /><div className="flex justify-end gap-2"><button type="button" onClick={() => { setEditing(null); setDraft({ title: '', body: '' }); }} className="px-3 py-2 text-xs text-slate-500">Clear</button><button className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"><Plus size={14} /> {editing ? 'Save changes' : 'Add note'}</button></div></form>{!notes.length && <EmptyState icon={StickyNote} label="Your private notes will appear here." />}{notes.map((note) => <article key={note._id} className="rounded-xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div><h4 className="font-semibold text-slate-800">{note.title}</h4><p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{note.body}</p><p className="mt-2 text-[10px] text-slate-400">{formatDate(note.updatedAt)}</p></div><div className="flex gap-1"><button onClick={() => { setEditing(note._id); setDraft({ title: note.title, body: note.body }); }} className="p-2 text-slate-400 hover:text-emerald-600"><Pencil size={14} /></button><button onClick={() => remove(note._id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={14} /></button></div></div></article>)}</section>;
}

function HistoryTab() {
  const [bookings, setBookings] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { apiService.mentor.workspace.getBookings().then((result) => setBookings(result.bookings || [])).catch((e) => setError(errorMessage(e))).finally(() => setLoading(false)); }, []);
  if (loading) return <LoadingState label="Loading booking history..." />;
  return <section className="space-y-3">{error && <InlineError message={error} />}{!bookings.length && <EmptyState icon={History} label="No bookings yet." />}{bookings.map((booking) => <div key={booking._id} className="rounded-xl border border-slate-200 p-4"><div className="flex items-start justify-between"><div><p className="font-semibold text-slate-800">{booking.slotId ? formatDate(booking.slotId.startsAt) : 'Session'}</p><p className="text-xs text-slate-500">Mentor: {booking.mentorId?.name || 'Assigned mentor'}</p></div><span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold capitalize text-emerald-700">{booking.status}</span></div>{booking.meetingLink && <a className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600" href={booking.meetingLink} target="_blank" rel="noreferrer"><Video size={14} /> Join Zoom session</a>}</div>)}</section>;
}

const LoadingState = ({ label }) => <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500"><Loader2 size={18} className="animate-spin text-emerald-600" />{label}</div>;
const InlineError = ({ message }) => <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700"><AlertCircle size={14} />{message}</div>;
const EmptyState = ({ icon: Icon, label }) => <div className="flex flex-col items-center justify-center py-12 text-center text-sm text-slate-400"><Icon size={28} className="mb-2 text-slate-300" />{label}</div>;

export default function MentorDetailPanel({ mentor, request, studentId: studentIdProp, onBack }) {
  const [activeTab, setActiveTab] = useState('schedule');
  const studentId = studentIdProp || request?.studentId || request?.student?.id;
  const mentorId = mentor?.id || request?.teacherId || request?.teacher?.id;
  return <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="flex items-center gap-3 border-b border-slate-100 p-5"><button onClick={onBack} className="rounded-lg p-2 text-slate-400 hover:bg-slate-50"><ArrowLeft size={18} /></button><img src={mentor.image} alt="" className="h-10 w-10 rounded-xl object-cover" /><div><h2 className="font-semibold text-slate-900">{mentor.name}</h2><p className="text-xs text-slate-500">Your assigned mentor</p></div></div>
    <nav className="flex gap-1 overflow-x-auto border-b border-slate-100 px-4 pt-2">{tabs.map(([key, label, Icon]) => <button key={key} onClick={() => setActiveTab(key)} className={`inline-flex items-center gap-2 whitespace-nowrap rounded-t-lg px-4 py-3 text-sm font-medium ${activeTab === key ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-slate-500'}`}><Icon size={16} />{label}</button>)}</nav>
    <div className="p-5">{activeTab === 'schedule' && <ScheduleTab mentorId={mentorId} />}{activeTab === 'chat' && <ChatTab studentId={studentId} mentorId={mentorId} />}{activeTab === 'notes' && <NotesTab />}{activeTab === 'history' && <HistoryTab />}</div>
  </div>;
}
