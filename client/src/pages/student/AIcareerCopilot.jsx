import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import Footer from '../../components/student/Footer';
import StudyChat from '../../components/ai/StudyChat';

/* ─────────────────────────────────────────────────────────────────────────────
   AI Career Copilot — a full-height chat surface.

   Two-state layout:
   • Not scrolled  – both navbar bars are in the document flow. The wrapper
     measures its own viewport-relative top and fills the remaining height.
   • Scrolled      – the white bottom nav becomes fixed (top:0 z-40). The page
     content rises by white-bar-height. We compensate with padding-top + a
     matching height reduction so the chat stays flush below the fixed bar.
   ──────────────────────────────────────────────────────────────────────────── */

const SCROLL_THRESHOLD = 60; // px — matches Navbar.jsx

export default function AIcareerCopilot() {
  const wrapperRef = useRef(null);

  // Distance from top of viewport to this wrapper on initial mount.
  // = green-bar height + white-bar height (both still in flow at mount).
  const [initialOffsetTop, setInitialOffsetTop] = useState(110);

  // Has the user scrolled past the green bar so the white bar is fixed?
  const [scrolled, setScrolled] = useState(false);

  // White-bar height in px — read from the actual DOM so we never hard-code it.
  const [whiteBarH, setWhiteBarH] = useState(52);

  // Measure both values once (and on resize).
  useLayoutEffect(() => {
    const measure = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      // White-bar height in px — read from the actual DOM so we never hard-code it.
      const whiteBar = document.querySelector('.border-b.bg-white');
      if (whiteBar) {
        setWhiteBarH(whiteBar.getBoundingClientRect().height || 52);
      }

      const top = Math.round(wrapper.getBoundingClientRect().top + window.scrollY);
      setInitialOffsetTop((prev) => (prev === top ? prev : top));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // handle case where page loads already scrolled
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const wrapperStyle = scrolled
    ? {
        paddingTop: `${whiteBarH}px`,
        height: `calc(100dvh - ${whiteBarH}px)`,
        minHeight: '420px',
      }
    : {
        height: `calc(100dvh - ${initialOffsetTop}px)`,
        minHeight: '420px',
      };

  return (
    <div className="bg-slate-50">
      <div ref={wrapperRef} style={wrapperStyle} className="flex flex-col overflow-hidden">
        <StudyChat variant="fill" />
      </div>
      <Footer />
    </div>
  );
}
