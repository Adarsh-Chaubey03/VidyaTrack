import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Send, Sparkles, RotateCcw, AlertCircle, RefreshCw, User, Loader2, X,
} from 'lucide-react';
import MarkdownLite from './MarkdownLite';
import { useStudyChat, MAX_MESSAGE_LENGTH } from '../../hooks/useStudyChat';

/* ─────────────────────────────────────────────────────────────────────────────
   StudyChat — the single chat surface, used by both entry points:
     • the AI Career Copilot page  (variant="page")
     • the floating launcher panel (variant="widget")

   Only spacing and the header change between the two; message rendering,
   input handling, states and accessibility are shared.
   ──────────────────────────────────────────────────────────────────────────── */

const AiAvatar = ({ size = 'md' }) => (
    <div
        className={`${size === 'sm' ? 'w-7 h-7' : 'w-8 h-8'} shrink-0 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-sm`}
        aria-hidden="true"
    >
        <Sparkles size={size === 'sm' ? 13 : 15} className="text-white" />
    </div>
);

const TypingIndicator = () => (
    <div className="flex items-start gap-2.5">
        <AiAvatar />
        <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
            <span className="sr-only">The study assistant is writing a reply…</span>
            <span className="flex items-center gap-1" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s`, animationDuration: '1s' }}
                    />
                ))}
            </span>
        </div>
    </div>
);

const SuggestionChips = ({ items, onPick, disabled }) => (
    <div className="flex flex-col items-center gap-2">
        {items.map((text) => (
            <button
                key={text}
                type="button"
                onClick={() => onPick(text)}
                disabled={disabled}
                className="text-xs sm:text-sm text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full px-3 py-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1"
            >
                {text}
            </button>
        ))}
    </div>
);

const StudyChat = ({ variant = 'page', onClose }) => {
    const {
        messages, suggestions, sending, loadingHistory, error, canRetry,
        isAuthenticated, send, retry, reset, dismissError,
    } = useStudyChat();

    const [draft, setDraft] = useState('');
    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const isWidget = variant === 'widget';

    // 'fill' and 'widget' stretch to whatever the parent gives them; 'page' is
    // a self-sizing card for embedding alongside other content.
    const heightClass =
        variant === 'page' ? 'h-[70vh] min-h-[440px] max-h-[720px]' : 'h-full';

    // ── Auto-scroll to the newest message ──────────────────────────────────
    // Scrolls the message list only, never the page, so the widget cannot yank
    // the window while the student is reading something else.
    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages, sending]);

    // Focus the input when the surface appears, so typing works immediately.
    useEffect(() => {
        if (isAuthenticated) inputRef.current?.focus();
    }, [isAuthenticated]);

    const submit = useCallback((text) => {
        const value = String(text ?? draft);
        if (!value.trim() || sending) return;
        setDraft('');
        send(value);
        // Keep focus in the composer so the next question needs no extra click.
        inputRef.current?.focus();
    }, [draft, sending, send]);

    const handleKeyDown = (e) => {
        // Enter sends, Shift+Enter inserts a newline.
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
        }
    };

    // Grow the textarea with its content, up to a ceiling.
    const handleInput = (e) => {
        const el = e.target;
        setDraft(el.value);
        el.style.height = 'auto';
        el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    };

    const isEmpty = messages.length === 0;

    /* ── Signed out ────────────────────────────────────────────────────── */
    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center text-center px-6 py-12 gap-4">
                <AiAvatar />
                <div>
                    <h3 className="font-semibold text-slate-800">Sign in to start studying</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-xs">
                        Your study assistant uses your courses and progress to give you tailored answers.
                    </p>
                </div>
                <Link
                    to="/login"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                    Log in
                </Link>
            </div>
        );
    }

    return (
        <div className={`flex flex-col ${heightClass}`}>
            {/* ── Header ─────────────────────────────────────────────── */}
            {/* Corner rounding is left to the parent's overflow-hidden so the
                same markup works full-bleed and inside a rounded card. */}
            <header className={`flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-white shrink-0`}>
                <AiAvatar />
                <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-semibold text-slate-900 leading-tight truncate">
                        Study Assistant
                    </h2>
                    <p className="text-[11px] text-slate-400 leading-tight truncate">
                        DSA, CS fundamentals & placement prep
                    </p>
                </div>

                {!isEmpty && (
                    <button
                        type="button"
                        onClick={reset}
                        title="Start a new chat"
                        aria-label="Start a new chat"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                        <RotateCcw size={16} />
                    </button>
                )}

                {isWidget && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close chat"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                        <X size={16} />
                    </button>
                )}
            </header>

            {/* ── Messages ───────────────────────────────────────────── */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-4 bg-slate-50"
                role="log"
                aria-live="polite"
                aria-label="Conversation"
            >
                {loadingHistory && isEmpty ? (
                    <div className="flex items-center justify-center h-full text-slate-400 gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        <span className="text-sm">Loading your chat…</span>
                    </div>
                ) : isEmpty ? (
                    /* ── Empty state ── */
                    <div className="flex flex-col items-center justify-center h-full text-center gap-5 py-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-md shadow-emerald-200/60">
                            <Sparkles size={22} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">How can I help you study today?</h3>
                            <p className="text-sm text-slate-500 mt-1 max-w-sm">
                                Ask about DSA, DBMS, OS, the MERN stack, your projects, or placement prep.
                            </p>
                        </div>
                        <div className="w-full max-w-md">
                            <SuggestionChips items={suggestions} onPick={submit} disabled={sending} />
                        </div>
                    </div>
                ) : (
                    messages.map((m) =>
                        m.role === 'user' ? (
                            <div key={m.id} className="flex items-start gap-2.5 justify-end">
                                <div className="max-w-[85%] bg-emerald-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm">
                                    <p className="text-sm whitespace-pre-wrap break-words">{m.content}</p>
                                </div>
                                <div
                                    className="w-8 h-8 shrink-0 rounded-full bg-slate-200 flex items-center justify-center"
                                    aria-hidden="true"
                                >
                                    <User size={15} className="text-slate-500" />
                                </div>
                            </div>
                        ) : (
                            <div key={m.id} className="flex items-start gap-2.5">
                                <AiAvatar />
                                <div className="max-w-[85%] min-w-0 bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                                    <MarkdownLite text={m.content} />
                                </div>
                            </div>
                        )
                    )
                )}

                {sending && <TypingIndicator />}

                {/* ── Error state ── */}
                {error && (
                    <div
                        role="alert"
                        className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-3.5 py-3"
                    >
                        <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-red-700">{error}</p>
                            {canRetry && (
                                <button
                                    type="button"
                                    onClick={retry}
                                    className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:text-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
                                >
                                    <RefreshCw size={12} />
                                    Retry
                                </button>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={dismissError}
                            aria-label="Dismiss error"
                            className="p-0.5 text-red-400 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* ── Composer ───────────────────────────────────────────── */}
            <div className={`shrink-0 border-t border-slate-200 px-3 py-3 ${variant === 'fill' ? 'bg-slate-50' : 'bg-white'}`}>
                {/* Follow-up chips, once a conversation is under way */}
                {!isEmpty && !sending && suggestions.length > 0 && (
                    <div className="mb-2.5 -mx-0.5 overflow-x-auto">
                        <SuggestionChips items={suggestions.slice(0, 3)} onPick={submit} disabled={sending} />
                    </div>
                )}

                <form
                    onSubmit={(e) => { e.preventDefault(); submit(); }}
                    className={`flex items-end gap-2 ${variant === 'fill' ? 'w-full max-w-3xl mx-auto' : ''}`}
                >
                    <label htmlFor="study-chat-input" className="sr-only">
                        Ask a study question
                    </label>
                    <textarea
                        id="study-chat-input"
                        ref={inputRef}
                        rows={1}
                        value={draft}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        maxLength={MAX_MESSAGE_LENGTH}
                        placeholder="Ask a study question…"
                        disabled={sending}
                        className="flex-1 resize-none bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-colors disabled:opacity-60 max-h-[120px]"
                    />
                    <button
                        type="submit"
                        disabled={sending || !draft.trim()}
                        aria-label="Send message"
                        className="shrink-0 w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                    >
                        {sending
                            ? <Loader2 size={17} className="animate-spin" />
                            : <Send size={17} />}
                    </button>
                </form>

                <p className="mt-1.5 text-[10px] text-slate-400 text-center">
                    Study, technical &amp; placement questions only. Answers can be wrong — verify important details.
                </p>
            </div>
        </div>
    );
};

export default StudyChat;
