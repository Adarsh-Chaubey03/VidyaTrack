import { useState, useCallback, useEffect, useMemo } from 'react';

/**
 * Mentor Request Status Enum
 * "none"     → No request sent
 * "pending"  → Request submitted, awaiting response
 * "accepted" → Mentor accepted the request
 * "rejected" → Mentor declined the request
 *
 * State Flow:
 *   none ──▶ pending ──▶ accepted
 *                   └──▶ rejected ──▶ none (re-request)
 */

const STORAGE_KEY = 'vt_mentor_requests';

// Read persisted state from localStorage
const readPersistedRequests = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

// Write state to localStorage
const persistRequests = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* quota exceeded — ignore */ }
};

/**
 * Shape of a single mentor request:
 * {
 *   mentorId:    number,
 *   status:      'none' | 'pending' | 'accepted' | 'rejected',
 *   message:     string,
 *   requestDate: string (ISO),
 *   responseDate: string | null,
 * }
 *
 * The hook stores a map: { [mentorId]: requestObject }
 */

export default function useMentorRequests() {
  const [requests, setRequests] = useState(() => readPersistedRequests());

  // Sync to localStorage whenever requests change
  useEffect(() => {
    persistRequests(requests);
  }, [requests]);

  // ---------------------------------------------------------------------------
  // Selectors
  // ---------------------------------------------------------------------------

  /** Get status for a specific mentor. Returns 'none' if no request exists. */
  const getStatus = useCallback(
    (mentorId) => requests[mentorId]?.status || 'none',
    [requests],
  );

  /** Get the full request object for a mentor. */
  const getRequest = useCallback(
    (mentorId) => requests[mentorId] || null,
    [requests],
  );

  /** All requests as an array, enriched with mentorId key */
  const allRequests = useMemo(() =>
    Object.entries(requests).map(([id, req]) => ({
      ...req,
      mentorId: Number(id),
    })),
    [requests]
  );

  /** Filter by status */
  const pendingRequests = useMemo(() => allRequests.filter((r) => r.status === 'pending'), [allRequests]);
  const acceptedRequests = useMemo(() => allRequests.filter((r) => r.status === 'accepted'), [allRequests]);
  const rejectedRequests = useMemo(() => allRequests.filter((r) => r.status === 'rejected'), [allRequests]);

  // ---------------------------------------------------------------------------
  // Actions  (these will later call backend APIs)
  // ---------------------------------------------------------------------------

  /** Submit a new mentor request. Prevents duplicates. */
  const sendRequest = useCallback((mentorId, message = '') => {
    setRequests((prev) => {
      // Block if already pending or accepted
      if (prev[mentorId]?.status === 'pending' || prev[mentorId]?.status === 'accepted') {
        return prev;
      }
      return {
        ...prev,
        [mentorId]: {
          mentorId,
          status: 'pending',
          message,
          requestDate: new Date().toISOString(),
          responseDate: null,
        },
      };
    });
  }, []);

  /** Cancel a pending request */
  const cancelRequest = useCallback((mentorId) => {
    setRequests((prev) => {
      if (prev[mentorId]?.status !== 'pending') return prev;
      const next = { ...prev };
      delete next[mentorId];
      return next;
    });
  }, []);

  /** Cancel an accepted mentoring (end relationship) */
  const cancelMentoring = useCallback((mentorId) => {
    setRequests((prev) => {
      if (!prev[mentorId]) return prev;
      const next = { ...prev };
      delete next[mentorId];
      return next;
    });
  }, []);

  // ---------------------------------------------------------------------------
  // Simulated mentor responses (for demo / frontend-only mode)
  // In production, webhook or polling replaces this.
  // ---------------------------------------------------------------------------

  /** Simulate accept (for dev/testing) */
  const simulateAccept = useCallback((mentorId) => {
    setRequests((prev) => {
      if (prev[mentorId]?.status !== 'pending') return prev;
      return {
        ...prev,
        [mentorId]: {
          ...prev[mentorId],
          status: 'accepted',
          responseDate: new Date().toISOString(),
        },
      };
    });
  }, []);

  /** Simulate reject (for dev/testing) */
  const simulateReject = useCallback((mentorId) => {
    setRequests((prev) => {
      if (prev[mentorId]?.status !== 'pending') return prev;
      return {
        ...prev,
        [mentorId]: {
          ...prev[mentorId],
          status: 'rejected',
          responseDate: new Date().toISOString(),
        },
      };
    });
  }, []);

  return {
    // State
    requests,
    allRequests,
    pendingRequests,
    acceptedRequests,
    rejectedRequests,

    // Selectors
    getStatus,
    getRequest,

    // Actions
    sendRequest,
    cancelRequest,
    cancelMentoring,

    // Dev helpers
    simulateAccept,
    simulateReject,
  };
}
