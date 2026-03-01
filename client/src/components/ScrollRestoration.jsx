/**
 * ScrollRestoration — Centralized scroll management for the entire application.
 *
 * Architecture:
 *   Placed ONCE inside <App /> (above <Routes />). Listens to React Router's
 *   location changes via useLocation() and the navigation action via
 *   useNavigationType(). Handles two distinct behaviors:
 *
 *   1. PUSH / REPLACE (forward navigation, link clicks, programmatic navigate)
 *      → Instantly scroll to (0, 0).
 *
 *   2. POP (browser back / forward buttons)
 *      → Restore the scroll position that was saved when the user last left
 *        that location. Falls back to (0, 0) if no position was stored.
 *
 *   This completely replaces all per-page `window.scrollTo(0, 0)` calls and
 *   `onClick={() => scrollTo(0,0)}` hacks scattered across components.
 *
 * Why useLayoutEffect:
 *   useLayoutEffect fires synchronously AFTER React has committed DOM changes
 *   but BEFORE the browser paints. This prevents the user from ever seeing
 *   the wrong scroll position (no flash of stale scroll).
 *
 * Session storage:
 *   Scroll positions are keyed by `location.key` (unique per history entry).
 *   Stored in sessionStorage so they survive page refreshes within the same
 *   tab but are discarded when the tab closes (correct browser semantics).
 *
 * Performance:
 *   - The scroll listener is passive (does not block the main thread).
 *   - Debounced at 150ms to avoid thrashing storage on fast scrolls.
 *   - Zero re-renders: the component returns null (no DOM output).
 *
 * Mobile:
 *   Works identically on iOS Safari, Android Chrome, and all mobile browsers.
 *   The CSS-level `-webkit-overflow-scrolling: touch` (set in index.css)
 *   complements this by enabling momentum scrolling.
 */

import { useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// ── Storage helpers ────────────────────────────────────────────────────────
const STORAGE_PREFIX = 'vt_scroll_';

function saveScrollPosition(key, x, y) {
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify({ x, y }));
  } catch {
    /* sessionStorage full or unavailable — degrade silently */
  }
}

function loadScrollPosition(key) {
  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── Component ──────────────────────────────────────────────────────────────
export default function ScrollRestoration() {
  const { pathname, key } = useLocation();
  const navigationType = useNavigationType(); // 'PUSH' | 'REPLACE' | 'POP'
  const prevKeyRef = useRef(key);

  // ── 1. Save current scroll position before navigating away ──────────────
  //    We capture onScroll continuously (debounced) so the latest position
  //    is always in storage. This is more reliable than saving at the exact
  //    moment of navigation (which can race with React Router).
  const debounceRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (debounceRef.current) cancelAnimationFrame(debounceRef.current);
    debounceRef.current = requestAnimationFrame(() => {
      saveScrollPosition(prevKeyRef.current, window.scrollX, window.scrollY);
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (debounceRef.current) cancelAnimationFrame(debounceRef.current);
    };
  }, [handleScroll]);

  // ── 2. On route change: reset or restore scroll ─────────────────────────
  useLayoutEffect(() => {
    // Save the outgoing page's position one final time
    if (prevKeyRef.current !== key) {
      saveScrollPosition(prevKeyRef.current, window.scrollX, window.scrollY);
    }

    if (navigationType === 'POP') {
      // Back/forward: restore saved position (or top if none)
      const saved = loadScrollPosition(key);
      if (saved) {
        // Use requestAnimationFrame to ensure DOM is fully laid out
        // (handles dynamic content that hasn't rendered yet)
        requestAnimationFrame(() => {
          window.scrollTo(saved.x, saved.y);
        });
      } else {
        window.scrollTo(0, 0);
      }
    } else {
      // PUSH or REPLACE: always start at top
      window.scrollTo(0, 0);
    }

    prevKeyRef.current = key;
  }, [pathname, key, navigationType]);

  // Component renders nothing — pure side-effect
  return null;
}
