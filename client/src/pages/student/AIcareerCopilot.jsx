import React, { useLayoutEffect, useRef, useState } from 'react';
import Footer from '../../components/student/Footer';
import StudyChat from '../../components/ai/StudyChat';

/* ─────────────────────────────────────────────────────────────────────────────
   AI Career Copilot — a full-height chat surface.

   The chat fills everything between the shared Navbar and the Footer. Rather
   than hard-coding a navbar height (two responsive bars whose height changes
   with the breakpoint), the wrapper measures its own distance from the top of
   the viewport once, in a layout effect — so the size is correct on the first
   paint and there is no visible jump.
   ──────────────────────────────────────────────────────────────────────────── */

export default function AIcareerCopilot() {
  const wrapperRef = useRef(null);
  // Fallback covers the window between mount and measurement (and any
  // environment where layout effects do not run).
  const [offsetTop, setOffsetTop] = useState(110);

  useLayoutEffect(() => {
    const measure = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const top = Math.round(el.getBoundingClientRect().top + window.scrollY);
      setOffsetTop((prev) => (prev === top ? prev : top));
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <div className="bg-slate-50">
      <div
        ref={wrapperRef}
        // dvh rather than vh: on mobile browsers vh includes the collapsing
        // address bar, which would push the composer off-screen.
        style={{ height: `calc(100dvh - ${offsetTop}px)`, minHeight: '420px' }}
      >
        <StudyChat variant="fill" />
      </div>

      <Footer />
    </div>
  );
}
