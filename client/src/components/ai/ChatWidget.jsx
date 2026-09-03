import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Loader2 } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
   ChatWidget — the standard bottom-right launcher.

   The chat itself is code-split and only fetched when the bubble is first
   clicked, so pages that merely render the launcher pay for one small button
   and nothing else. The panel stays mounted after the first open so the
   conversation survives closing and reopening.
   ──────────────────────────────────────────────────────────────────────────── */

const StudyChat = lazy(() => import('./StudyChat'));

const PanelFallback = () => (
    <div className="flex items-center justify-center h-full gap-2 text-slate-400">
        <Loader2 size={16} className="animate-spin" />
        <span className="text-sm">Loading assistant…</span>
    </div>
);

const ChatWidget = () => {
    const [open, setOpen] = useState(false);
    // Once true it stays true — remounting would throw away the thread.
    const [everOpened, setEverOpened] = useState(false);
    const launcherRef = useRef(null);
    const panelRef = useRef(null);

    const close = useCallback(() => {
        setOpen(false);
        // Return focus to the launcher so keyboard users are not stranded.
        launcherRef.current?.focus();
    }, []);

    const toggle = useCallback(() => {
        setOpen((prev) => {
            if (!prev) setEverOpened(true);
            return !prev;
        });
    }, []);

    // Escape closes the panel.
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === 'Escape') close(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, close]);

    // On phones the panel fills the screen, so lock background scrolling while
    // it is open. Restores whatever the page had set before.
    useEffect(() => {
        if (!open) return;
        if (window.matchMedia('(min-width: 640px)').matches) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = previous; };
    }, [open]);

    return (
        <>
            {/* ── Panel ──────────────────────────────────────────────── */}
            {everOpened && (
                <div
                    ref={panelRef}
                    role="dialog"
                    aria-modal="false"
                    aria-label="AI Study Assistant"
                    className={`fixed z-40 bg-white border border-slate-200 shadow-2xl shadow-slate-400/25 overflow-hidden
                        inset-x-0 bottom-0 top-0 rounded-none
                        sm:inset-auto sm:bottom-24 sm:right-6 sm:top-auto sm:w-[380px] sm:h-[560px] sm:max-h-[calc(100vh-8rem)] sm:rounded-2xl
                        transition-opacity duration-150
                        ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    // Hidden from assistive tech and tab order while closed.
                    {...(open ? {} : { inert: '', 'aria-hidden': 'true' })}
                >
                    <Suspense fallback={<PanelFallback />}>
                        <StudyChat variant="widget" onClose={close} />
                    </Suspense>
                </div>
            )}

            {/* ── Launcher ───────────────────────────────────────────── */}
            <button
                ref={launcherRef}
                type="button"
                onClick={toggle}
                aria-expanded={open}
                aria-label={open ? 'Close study assistant' : 'Open study assistant'}
                className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-14 h-14 rounded-full
                    bg-gradient-to-br from-emerald-600 to-cyan-500 text-white
                    shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40
                    flex items-center justify-center transition-shadow
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2
                    ${open ? 'max-sm:hidden' : ''}`}
            >
                {open ? <X size={22} /> : <MessageCircle size={23} />}
            </button>
        </>
    );
};

export default ChatWidget;
