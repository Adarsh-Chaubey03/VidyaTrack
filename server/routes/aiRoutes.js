import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { aiChatLimiter } from '../middlewares/rateLimitMiddleware.js';
import { chat, getSession, clearSessions } from '../controllers/aiChatController.js';

/* ─────────────────────────────────────────────────────────────────────────────
   AI Study Assistant routes — mounted at /api/ai

   Every route is behind `protect`: the assistant is personalized, so there is
   no anonymous mode. The rate limiter runs after `protect` so it can key on the
   authenticated user rather than a shared IP.
   ──────────────────────────────────────────────────────────────────────────── */

const aiRouter = express.Router();

// Bootstrap the chat UI: latest conversation + suggestion chips, one round trip.
aiRouter.get('/session', protect, getSession);

// Wipe the student's stored conversations.
aiRouter.delete('/session', protect, clearSessions);

// Ask a question.
aiRouter.post('/chat', protect, aiChatLimiter, chat);

export default aiRouter;
