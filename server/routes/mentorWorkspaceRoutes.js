import express from 'express';
import { protect, protectStudent, protectEducator } from '../middlewares/authMiddleware.js';
import {
  getConversation, sendMessage, getMentorConversations, getStudentSlots, listMentorSlots,
  createMentorSlot, updateMentorSlot, bookSlot, getBookings,
  listNotes, createNote, updateNote, deleteNote,
} from '../controllers/mentorWorkspaceController.js';

const router = express.Router();
router.use(protect);
router.get('/conversation', getConversation);
router.post('/messages', sendMessage);
router.get('/student/slots/:mentorId', protectStudent, getStudentSlots);
router.post('/student/bookings', protectStudent, bookSlot);
router.get('/bookings', getBookings);
router.get('/notes', protectStudent, listNotes);
router.post('/notes', protectStudent, createNote);
router.patch('/notes/:noteId', protectStudent, updateNote);
router.delete('/notes/:noteId', protectStudent, deleteNote);
router.get('/mentor/conversations', protectEducator, getMentorConversations);
router.get('/mentor/slots', protectEducator, listMentorSlots);
router.post('/mentor/slots', protectEducator, createMentorSlot);
router.patch('/mentor/slots/:slotId', protectEducator, updateMentorSlot);

export default router;
