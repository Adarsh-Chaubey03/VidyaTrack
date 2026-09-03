import mongoose from 'mongoose';
import MentorshipRequest from '../models/MentorshipRequest.js';
import ChatMessage from '../models/ChatMessage.js';
import MentorSlot from '../models/MentorSlot.js';
import Booking from '../models/Booking.js';
import StudentNote from '../models/StudentNote.js';

const validId = (id) => mongoose.Types.ObjectId.isValid(id);
const idOf = (value) => value?.toString();

const acceptedRelationship = async (studentId, mentorId) =>
  MentorshipRequest.exists({ studentId, teacherId: mentorId, status: 'accepted' });

const canAccessConversation = async (user, studentId, mentorId) => {
  if (user.role === 'educator') {
    return idOf(user._id) === idOf(mentorId) && Boolean(await acceptedRelationship(studentId, mentorId));
  }
  return idOf(user._id) === idOf(studentId) && Boolean(await acceptedRelationship(studentId, mentorId));
};

const people = 'name email imageUrl';

export const getConversation = async (req, res) => {
  const { studentId, mentorId } = req.query;
  if (!validId(studentId) || !validId(mentorId) || !(await canAccessConversation(req.user, studentId, mentorId))) {
    return res.status(403).json({ success: false, message: 'You are not authorized to access this conversation.' });
  }
  const messages = await ChatMessage.find({ studentId, mentorId }).sort({ createdAt: 1 }).lean();
  return res.json({ success: true, messages });
};

export const sendMessage = async (req, res) => {
  const { studentId: requestedStudent, mentorId: requestedMentor, body } = req.body;
  const studentId = req.user.role === 'user' ? req.user._id : requestedStudent;
  const mentorId = req.user.role === 'educator' ? req.user._id : requestedMentor;
  if (!validId(studentId) || !validId(mentorId) || typeof body !== 'string' || !body.trim()) {
    return res.status(400).json({ success: false, message: 'studentId, mentorId, and a message are required.' });
  }
  if (!(await canAccessConversation(req.user, studentId, mentorId))) {
    return res.status(403).json({ success: false, message: 'You are not authorized to send messages here.' });
  }
  const message = await ChatMessage.create({ studentId, mentorId, senderId: req.user._id, body: body.trim() });
  return res.status(201).json({ success: true, message });
};

export const getMentorConversations = async (req, res) => {
  const messages = await ChatMessage.aggregate([
    { $match: { mentorId: req.user._id } },
    { $sort: { createdAt: -1 } },
    { $group: { _id: '$studentId', lastMessage: { $first: '$$ROOT' } } },
    { $sort: { 'lastMessage.createdAt': -1 } },
  ]);
  const ids = messages.map((entry) => entry._id);
  const students = await (await import('../models/User.js')).default.find({ _id: { $in: ids } }).select(people).lean();
  const byId = new Map(students.map((student) => [idOf(student._id), student]));
  return res.json({ success: true, conversations: messages.map((entry) => ({
    student: byId.get(idOf(entry._id)),
    lastMessage: entry.lastMessage,
  })) });
};

export const getStudentSlots = async (req, res) => {
  const { mentorId } = req.params;
  if (!validId(mentorId) || !(await acceptedRelationship(req.user._id, mentorId))) {
    return res.status(403).json({ success: false, message: 'You can only view slots for your assigned mentor.' });
  }
  const slots = await MentorSlot.find({ mentorId, startsAt: { $gte: new Date() } }).sort({ startsAt: 1 }).lean();
  const booked = await Booking.find({ mentorId, status: 'confirmed', slotId: { $in: slots.map((slot) => slot._id) } }).select('slotId studentId status').lean();
  const bookedBySlot = new Map(booked.map((booking) => [idOf(booking.slotId), booking]));
  return res.json({ success: true, slots: slots.map((slot) => ({ ...slot, booking: bookedBySlot.get(idOf(slot._id)) || null })) });
};

export const listMentorSlots = async (req, res) => {
  const slots = await MentorSlot.find({ mentorId: req.user._id, startsAt: { $gte: new Date() } }).sort({ startsAt: 1 }).lean();
  const bookings = await Booking.find({ mentorId: req.user._id, status: 'confirmed', slotId: { $in: slots.map((slot) => slot._id) } }).populate('studentId', people).lean();
  const bookingBySlot = new Map(bookings.map((booking) => [idOf(booking.slotId), booking]));
  return res.json({ success: true, slots: slots.map((slot) => ({ ...slot, booking: bookingBySlot.get(idOf(slot._id)) || null })) });
};

export const createMentorSlot = async (req, res) => {
  const { startsAt, endsAt } = req.body;
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  if (!startsAt || !endsAt || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start || start <= new Date()) {
    return res.status(400).json({ success: false, message: 'Provide a future slot with a valid start and end time.' });
  }
  try {
    const slot = await MentorSlot.create({ mentorId: req.user._id, startsAt: start, endsAt: end });
    return res.status(201).json({ success: true, slot });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, message: 'That slot already exists.' });
    throw error;
  }
};

export const updateMentorSlot = async (req, res) => {
  const { status } = req.body;
  if (!['available', 'unavailable'].includes(status)) return res.status(400).json({ success: false, message: 'Invalid slot status.' });
  if (status === 'unavailable' && await Booking.exists({ slotId: req.params.slotId, status: 'confirmed' })) {
    return res.status(409).json({ success: false, message: 'Booked slots cannot be made unavailable.' });
  }
  const slot = await MentorSlot.findOneAndUpdate({ _id: req.params.slotId, mentorId: req.user._id }, { status }, { new: true });
  if (!slot) return res.status(404).json({ success: false, message: 'Slot not found.' });
  return res.json({ success: true, slot });
};

export const bookSlot = async (req, res) => {
  const { slotId } = req.body;
  if (!validId(slotId)) return res.status(400).json({ success: false, message: 'A valid slotId is required.' });
  const slot = await MentorSlot.findOne({ _id: slotId, status: 'available', startsAt: { $gt: new Date() } });
  if (!slot || !(await acceptedRelationship(req.user._id, slot.mentorId))) {
    return res.status(409).json({ success: false, message: 'This slot is no longer available.' });
  }
  try {
    const booking = await Booking.create({ studentId: req.user._id, mentorId: slot.mentorId, slotId: slot._id });
    return res.status(201).json({ success: true, booking, message: 'Session booked successfully. Your Zoom meeting link will be provided 30 minutes before the session.' });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, message: 'This slot has already been booked.' });
    throw error;
  }
};

export const getBookings = async (req, res) => {
  const filter = req.user.role === 'educator' ? { mentorId: req.user._id } : { studentId: req.user._id };
  const bookings = await Booking.find(filter).populate('mentorId', people).populate('studentId', people).populate('slotId').sort({ createdAt: -1 }).lean();
  const exposed = bookings.map((booking) => {
    const startsAt = booking.slotId?.startsAt ? new Date(booking.slotId.startsAt) : null;
    const canShowLink = startsAt && Date.now() >= startsAt.getTime() - 30 * 60 * 1000;
    return { ...booking, meetingLink: canShowLink ? (booking.meetingLink || process.env.ZOOM_MEETING_URL || null) : null };
  });
  return res.json({ success: true, bookings: exposed });
};

export const listNotes = async (req, res) => res.json({ success: true, notes: await StudentNote.find({ studentId: req.user._id }).sort({ updatedAt: -1 }).lean() });
export const createNote = async (req, res) => {
  const { title, body } = req.body;
  if (typeof body !== 'string' || !body.trim()) return res.status(400).json({ success: false, message: 'Note content is required.' });
  const note = await StudentNote.create({ studentId: req.user._id, title: title || 'Untitled note', body: body.trim() });
  return res.status(201).json({ success: true, note });
};
export const updateNote = async (req, res) => {
  const updates = {};
  if (req.body.title !== undefined) updates.title = req.body.title;
  if (req.body.body !== undefined) updates.body = req.body.body;
  if (!Object.keys(updates).length) return res.status(400).json({ success: false, message: 'No note changes provided.' });
  const note = await StudentNote.findOneAndUpdate({ _id: req.params.noteId, studentId: req.user._id }, updates, { new: true, runValidators: true });
  if (!note) return res.status(404).json({ success: false, message: 'Note not found.' });
  return res.json({ success: true, note });
};
export const deleteNote = async (req, res) => {
  const note = await StudentNote.findOneAndDelete({ _id: req.params.noteId, studentId: req.user._id });
  if (!note) return res.status(404).json({ success: false, message: 'Note not found.' });
  return res.json({ success: true });
};
