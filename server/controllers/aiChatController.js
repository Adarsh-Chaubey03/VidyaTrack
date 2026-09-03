import mongoose from 'mongoose';
import ChatSession, { MAX_CONTEXT_MESSAGES } from '../models/ChatSession.js';
import { classifyTopic, OFF_TOPIC_REPLY } from '../services/topicFilter.service.js';
import {
    answerStudyQuestion,
    getSuggestionsForUser,
    MAX_MESSAGE_LENGTH,
} from '../services/studyAssistant.service.js';
import { isConfigured } from '../services/gemini.service.js';

/* ─────────────────────────────────────────────────────────────────────────────
   AI Study Assistant — HTTP layer.

   The student's identity always comes from req.user (set by `protect`).
   A client-supplied studentId is never read anywhere in this file.
   ──────────────────────────────────────────────────────────────────────────── */

// Provider failure codes → what the student is allowed to see.
// Provider names, stack traces and raw messages never reach the client.
const ERROR_RESPONSES = {
    not_configured: { status: 503, message: 'AI assistant is not available right now. Please try again later.' },
    timeout: { status: 504, message: 'The AI took too long to respond. Please try again.' },
    rate_limited: { status: 429, message: 'The AI assistant is busy right now. Please wait a moment and try again.' },
    blocked: { message: 'I could not answer that one. Try rephrasing it as a study question.' },
    invalid_response: { status: 502, message: 'AI service is temporarily unavailable. Please try again.' },
    upstream: { status: 502, message: 'AI service is temporarily unavailable. Please try again.' },
};

const FALLBACK_ERROR = { status: 502, message: 'AI service is temporarily unavailable. Please try again.' };

const titleFrom = (message) => {
    const t = message.replace(/\s+/g, ' ').trim();
    return t.length > 60 ? `${t.slice(0, 60)}…` : t;
};

/** Load the student's session, or null. Ownership is enforced in the query. */
const loadOwnedSession = async (conversationId, studentId) => {
    if (!conversationId || !mongoose.isValidObjectId(conversationId)) return null;
    // studentId in the filter means another student's id simply finds nothing.
    return ChatSession.findOne({ _id: conversationId, studentId });
};

/* ──────────────────────────────────────────────────────────────
   POST /api/ai/chat
   Body: { message: string, conversationId?: string }
   ────────────────────────────────────────────────────────────── */
export const chat = async (req, res) => {
    try {
        const { message, conversationId } = req.body || {};

        // ── Validation ────────────────────────────────────────
        if (typeof message !== 'string') {
            return res.status(400).json({ success: false, message: 'A message is required.' });
        }

        const trimmed = message.trim();
        if (!trimmed) {
            return res.status(400).json({ success: false, message: 'Please type a question first.' });
        }
        if (trimmed.length > MAX_MESSAGE_LENGTH) {
            return res.status(400).json({
                success: false,
                message: `Your message is too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`,
            });
        }
        if (conversationId !== undefined && conversationId !== null && conversationId !== '' &&
            !mongoose.isValidObjectId(conversationId)) {
            return res.status(400).json({ success: false, message: 'Invalid conversation.' });
        }

        // ── Session ───────────────────────────────────────────
        // Loaded before classification so follow-up messages are recognised as
        // part of an ongoing thread rather than judged in isolation.
        const session = await loadOwnedSession(conversationId, req.user._id);
        const history = session
            ? session.messages.slice(-MAX_CONTEXT_MESSAGES).map((m) => ({ role: m.role, content: m.content }))
            : [];

        // ── Off-topic short-circuit (no provider call, no cost) ─
        const verdict = classifyTopic(trimmed, history.length > 0);
        if (verdict === 'off_topic') {
            // Not persisted: storing refusals would pollute the conversation
            // context and push real turns out of the window.
            return res.json({
                success: true,
                message: OFF_TOPIC_REPLY,
                category: 'off_topic',
                intent: 'other',
                suggestions: [],
                conversationId: session ? String(session._id) : null,
            });
        }

        if (!isConfigured()) {
            const { status, message: msg } = ERROR_RESPONSES.not_configured;
            return res.status(status).json({ success: false, message: msg });
        }

        // ── Model call ────────────────────────────────────────
        let result;
        try {
            result = await answerStudyQuestion({ user: req.user, message: trimmed, history });
        } catch (err) {
            // Log the failure class only — never the student's message.
            console.error(`[ai] chat failed (code=${err?.code || 'unknown'})`);

            // A provider safety block is not a server error: answer it the same
            // way as an off-topic message so the UI stays in a normal state.
            if (err?.code === 'blocked') {
                return res.json({
                    success: true,
                    message: ERROR_RESPONSES.blocked.message,
                    category: 'off_topic',
                    intent: 'other',
                    suggestions: [],
                    conversationId: session ? String(session._id) : null,
                });
            }

            const mapped = ERROR_RESPONSES[err?.code] || FALLBACK_ERROR;
            return res.status(mapped.status).json({ success: false, message: mapped.message });
        }

        // ── Persist ───────────────────────────────────────────
        // A storage failure must not lose the answer the student already paid
        // for, so this is best-effort and never fails the request.
        let savedId = session ? String(session._id) : null;
        try {
            const turn = [
                { role: 'user', content: trimmed },
                { role: 'assistant', content: result.response },
            ];

            if (session) {
                session.messages.push(...turn);
                await session.save();
            } else {
                const created = await ChatSession.create({
                    studentId: req.user._id,
                    title: titleFrom(trimmed),
                    messages: turn,
                });
                savedId = String(created._id);
            }
        } catch {
            console.error('[ai] failed to persist chat session');
        }

        return res.json({
            success: true,
            message: result.response,
            category: result.category,
            intent: result.intent,
            suggestions: result.suggestions,
            conversationId: savedId,
        });
    } catch (error) {
        console.error('[ai] unexpected chat error:', error?.message);
        return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
    }
};

/* ──────────────────────────────────────────────────────────────
   GET /api/ai/session
   Bootstrap for the chat UI — the most recent conversation plus
   suggestion chips, in a single round trip.
   ────────────────────────────────────────────────────────────── */
export const getSession = async (req, res) => {
    try {
        const [session, suggestions] = await Promise.all([
            ChatSession.findOne({ studentId: req.user._id })
                .sort({ updatedAt: -1 })
                .select('messages')
                .lean(),
            getSuggestionsForUser(req.user),
        ]);

        return res.json({
            success: true,
            available: isConfigured(),
            conversationId: session ? String(session._id) : null,
            messages: session
                ? session.messages.map((m) => ({ role: m.role, content: m.content, at: m.at }))
                : [],
            suggestions,
        });
    } catch (error) {
        console.error('[ai] failed to load session:', error?.message);
        return res.status(500).json({ success: false, message: 'Could not load your chat.' });
    }
};

/* ──────────────────────────────────────────────────────────────
   DELETE /api/ai/session
   Clears every stored conversation for the signed-in student.
   ────────────────────────────────────────────────────────────── */
export const clearSessions = async (req, res) => {
    try {
        await ChatSession.deleteMany({ studentId: req.user._id });
        return res.json({ success: true, message: 'Chat history cleared.' });
    } catch (error) {
        console.error('[ai] failed to clear sessions:', error?.message);
        return res.status(500).json({ success: false, message: 'Could not clear your chat history.' });
    }
};
