import { useCallback, useEffect, useRef, useState } from 'react';
import { apiService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

/* ─────────────────────────────────────────────────────────────────────────────
   useStudyChat — all chat state for the AI Study Assistant.

   Plain useState/useRef: a chat thread is local, short-lived UI state, so a
   state library would be weight without benefit. The hook owns the transport
   so both the full-page view and the floating widget behave identically.
   ──────────────────────────────────────────────────────────────────────────── */

export const MAX_MESSAGE_LENGTH = 2000;

const DEFAULT_SUGGESTIONS = [
    'What should I learn next?',
    'Analyze my skills',
    'Give me DSA practice questions',
    'Create my study plan for this week',
];

export const useStudyChat = () => {
    const { isAuthenticated } = useAuth();
    const authed = isAuthenticated();

    const [messages, setMessages] = useState([]);
    const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);
    const [conversationId, setConversationId] = useState(null);
    const [sending, setSending] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [error, setError] = useState(null);

    // The message a failed send was carrying, so Retry can resend it.
    const [retryPayload, setRetryPayload] = useState(null);

    // Guards a double-submit (Enter held down, or a second click before the
    // first request resolves) without needing the state update to have flushed.
    const inFlight = useRef(false);
    const abortRef = useRef(null);
    const mounted = useRef(true);

    useEffect(() => () => {
        mounted.current = false;
        abortRef.current?.abort();
    }, []);

    // ── Load the last conversation once, on mount ──────────────────────────
    // Never called when signed out: /api/ai/session requires auth, and a 401
    // would trip the global interceptor and bounce the visitor to /login.
    useEffect(() => {
        if (!authed) {
            setMessages([]);
            setConversationId(null);
            return;
        }

        let cancelled = false;
        setLoadingHistory(true);

        apiService.ai
            .getSession()
            .then((res) => {
                if (cancelled || !res?.success) return;
                setMessages(
                    (res.messages || []).map((m, i) => ({
                        id: `h${i}`,
                        role: m.role,
                        content: m.content,
                    }))
                );
                setConversationId(res.conversationId || null);
                if (Array.isArray(res.suggestions) && res.suggestions.length) {
                    setSuggestions(res.suggestions);
                }
            })
            .catch(() => {
                // A failed history load is not worth an error state — the
                // student can still start a fresh conversation.
            })
            .finally(() => {
                if (!cancelled) setLoadingHistory(false);
            });

        return () => { cancelled = true; };
    }, [authed]);

    // ── Send ───────────────────────────────────────────────────────────────
    const send = useCallback(async (rawText) => {
        const text = String(rawText || '').trim();
        if (!text || inFlight.current) return;

        if (text.length > MAX_MESSAGE_LENGTH) {
            setError(`Please keep your message under ${MAX_MESSAGE_LENGTH} characters.`);
            return;
        }

        inFlight.current = true;
        setSending(true);
        setError(null);
        setRetryPayload(null);

        const userMessage = { id: `u${Date.now()}`, role: 'user', content: text };
        setMessages((prev) => [...prev, userMessage]);

        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const res = await apiService.ai.chat(
                { message: text, conversationId },
                { signal: controller.signal }
            );

            if (!mounted.current) return;

            if (res?.success) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: `a${Date.now()}`,
                        role: 'assistant',
                        content: res.message,
                        category: res.category,
                        intent: res.intent,
                    },
                ]);
                if (res.conversationId) setConversationId(res.conversationId);
                // Follow-ups from the model replace the generic starters, but
                // only when it actually returned some.
                if (Array.isArray(res.suggestions) && res.suggestions.length) {
                    setSuggestions(res.suggestions);
                }
            } else {
                throw new Error(res?.message || 'Something went wrong.');
            }
        } catch (err) {
            if (!mounted.current || err?.name === 'CanceledError' || err?.name === 'AbortError') return;

            // The server already reduces provider failures to a safe sentence;
            // this only has to pick the right fallback when there is no body.
            const message =
                err?.response?.data?.message ||
                (err?.code === 'ECONNABORTED'
                    ? 'That took too long. Please try again.'
                    : 'AI service is temporarily unavailable. Please try again.');

            setError(message);
            setRetryPayload(text);
            // Drop the optimistic user bubble — Retry re-adds it. Leaving it
            // would make the thread look like the question was received.
            setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
        } finally {
            inFlight.current = false;
            abortRef.current = null;
            if (mounted.current) setSending(false);
        }
    }, [conversationId]);

    const retry = useCallback(() => {
        if (retryPayload) send(retryPayload);
    }, [retryPayload, send]);

    const dismissError = useCallback(() => {
        setError(null);
        setRetryPayload(null);
    }, []);

    // ── Start a new conversation ───────────────────────────────────────────
    const reset = useCallback(async () => {
        abortRef.current?.abort();
        setMessages([]);
        setConversationId(null);
        setError(null);
        setRetryPayload(null);
        setSuggestions(DEFAULT_SUGGESTIONS);
        try {
            await apiService.ai.clearSession();
        } catch {
            // Clearing the server copy is best-effort; the view is already empty.
        }
    }, []);

    return {
        messages,
        suggestions,
        sending,
        loadingHistory,
        error,
        canRetry: Boolean(retryPayload),
        isAuthenticated: authed,
        send,
        retry,
        reset,
        dismissError,
    };
};

export default useStudyChat;
