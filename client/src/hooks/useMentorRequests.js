import { useState, useCallback, useEffect, useMemo } from 'react';
import { apiService } from '../services/api.js';

/**
 * useMentorRequests
 *
 * Manages the student's mentorship request state by syncing with the backend.
 *
 * Status values (unchanged from original hook):
 *   "none"     → No request sent / request was rejected and cleared
 *   "pending"  → Request submitted, awaiting teacher response
 *   "accepted" → Teacher accepted the request
 *   "rejected" → Teacher declined the request
 *
 * State shape stored in `requests`:
 *   {
 *     [teacherId: string]: {
 *       requestId:    string,       ← MongoDB _id
 *       teacherId:    string,       ← matches the key
 *       status:       string,
 *       introduction: string,
 *       requestDate:  string (ISO),
 *       teacher:      { id, name, email, imageUrl } | null
 *     }
 *   }
 *
 * The hook keeps a `teacherIdByStaticId` map so MentorProfile (which still
 * uses the static integer mentor.id) can look up the real MongoDB teacherId.
 */

export default function useMentorRequests() {
  // Map of teacherId (MongoDB string) → request object
  const [requests, setRequests] = useState({});
  // Map of staticMentorId (integer from assets.js) → MongoDB teacherId (string)
  const [teacherIdByStaticId, setTeacherIdByStaticId] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Track whether we've done the initial fetch this session
  const [initialFetched, setInitialFetched] = useState(false);

  // ── Fetch all student requests from the backend ──────────────────────────
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.mentor.getStudentMentors();
      if (!res.success) {
        setError(res.message || 'Failed to load mentor requests.');
        return;
      }

      // Flatten all status groups into a single map keyed by teacherId
      const map = {};
      const { pending = [], accepted = [], rejected = [] } = res.data || {};

      for (const entry of [...pending, ...accepted, ...rejected]) {
        const tid = entry.teacher?.id?.toString();
        if (!tid) continue;
        map[tid] = {
          requestId:    entry.requestId,
          teacherId:    tid,
          status:       entry.status,
          introduction: entry.introduction,
          requestDate:  entry.createdAt,
          teacher:      entry.teacher,
        };
      }

      setRequests(map);
      setInitialFetched(true);
    } catch (err) {
      // Non-critical: if fetch fails (e.g. logged out) just show empty state
      setError(err?.response?.data?.message || err.message || 'Failed to load mentor requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch approved teachers list to build staticId → teacherId map ───────
  const fetchTeacherMap = useCallback(async () => {
    try {
      const res = await apiService.mentor.getTeachers();
      if (!res.success) return;

      // Build name-based map. The static mentors array in assets.js uses
      // specific names ("Priya Sharma", "Amit Verma", …).  We match by
      // normalising both sides to lowercase.
      const nameMap = {};
      for (const t of res.teachers || []) {
        nameMap[t.name.toLowerCase().trim()] = t.id.toString();
      }
      setTeacherIdByStaticId(nameMap);
    } catch {
      // Silent — teacher map is best-effort for name matching
    }
  }, []);

  // Auto-fetch on mount (only when a student token is present)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetchRequests();
    fetchTeacherMap();
  }, [fetchRequests, fetchTeacherMap]);

  // ── Helpers ──────────────────────────────────────────────────────────────

  /**
   * Resolve a static integer mentor id (from assets.js) OR a MongoDB
   * teacherId string to the status string used by the UI.
   *
   * MentorProfile passes `mentor.id` (integer); we first try to map it to
   * the real teacherId via the name map stored in `teacherIdByStaticId`.
   * If no mapping exists yet we fall back to treating the value as a direct
   * teacherId key (future-proof for when mentor cards are fully API-driven).
   */
  const getStatus = useCallback(
    (mentorIdOrTeacherId) => {
      const key = String(mentorIdOrTeacherId);
      // Direct hit (already a MongoDB teacherId)
      if (requests[key]) return requests[key].status;
      // Reverse-lookup via the staticId name map isn't needed here because
      // teacherIdByStaticId maps name→teacherId, not staticId→teacherId.
      // Status defaults to 'none' when nothing found.
      return 'none';
    },
    [requests],
  );

  /**
   * Same resolution logic, returns the full request object or null.
   */
  const getRequest = useCallback(
    (mentorIdOrTeacherId) => {
      const key = String(mentorIdOrTeacherId);
      return requests[key] || null;
    },
    [requests],
  );

  /**
   * Resolve a static mentor name to its real MongoDB teacherId.
   * Used by MentorProfile to build the API call payload.
   */
  const resolveTeacherId = useCallback(
    (mentorName) => {
      if (!mentorName) return null;
      return teacherIdByStaticId[mentorName.toLowerCase().trim()] || null;
    },
    [teacherIdByStaticId],
  );

  // ── Derived arrays (same names as old hook) ──────────────────────────────
  const allRequests = useMemo(
    () => Object.values(requests),
    [requests],
  );

  const pendingRequests = useMemo(
    () => allRequests.filter((r) => r.status === 'pending'),
    [allRequests],
  );

  const acceptedRequests = useMemo(
    () => allRequests.filter((r) => r.status === 'accepted'),
    [allRequests],
  );

  const rejectedRequests = useMemo(
    () => allRequests.filter((r) => r.status === 'rejected'),
    [allRequests],
  );

  // ── Actions ──────────────────────────────────────────────────────────────

  /**
   * Send a new mentorship request to the backend.
   *
   * @param {string} teacherId   - Real MongoDB _id of the teacher
   * @param {string} introduction - The student's message
   * @returns {Promise<{ success: boolean, message?: string }>}
   */
  const sendRequest = useCallback(async (teacherId, introduction = '') => {
    const key = String(teacherId);
    // Optimistic guard: prevent double-submit if already pending/accepted
    if (requests[key]?.status === 'pending' || requests[key]?.status === 'accepted') {
      return { success: false, message: 'Request already exists.' };
    }

    try {
      const res = await apiService.mentor.sendRequest(teacherId, introduction);
      if (!res.success) {
        return { success: false, message: res.message || 'Failed to send request.' };
      }

      // Optimistically update local state so the UI reflects pending immediately
      setRequests((prev) => ({
        ...prev,
        [key]: {
          requestId:    res.data.requestId,
          teacherId:    key,
          status:       'pending',
          introduction,
          requestDate:  res.data.createdAt || new Date().toISOString(),
          teacher:      null, // will be populated on next fetchRequests
        },
      }));

      // Refresh to get the full teacher object populated
      fetchRequests();
      return { success: true };
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        'Failed to send mentorship request.';
      return { success: false, message: msg };
    }
  }, [requests, fetchRequests]);

  /**
   * Cancel a pending request (removes from local state; no backend cancel
   * endpoint required by the spec — kept for UI compatibility).
   */
  const cancelRequest = useCallback((teacherId) => {
    const key = String(teacherId);
    setRequests((prev) => {
      if (prev[key]?.status !== 'pending') return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  /**
   * End an accepted mentoring relationship (local UI only).
   */
  const cancelMentoring = useCallback((teacherId) => {
    const key = String(teacherId);
    setRequests((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  // ── Kept for dev/testing compatibility ───────────────────────────────────
  const simulateAccept = useCallback((teacherId) => {
    const key = String(teacherId);
    setRequests((prev) => {
      if (prev[key]?.status !== 'pending') return prev;
      return { ...prev, [key]: { ...prev[key], status: 'accepted', responseDate: new Date().toISOString() } };
    });
  }, []);

  const simulateReject = useCallback((teacherId) => {
    const key = String(teacherId);
    setRequests((prev) => {
      if (prev[key]?.status !== 'pending') return prev;
      return { ...prev, [key]: { ...prev[key], status: 'rejected', responseDate: new Date().toISOString() } };
    });
  }, []);

  return {
    // State
    requests,
    allRequests,
    pendingRequests,
    acceptedRequests,
    rejectedRequests,
    loading,
    error,
    initialFetched,

    // Selectors
    getStatus,
    getRequest,
    resolveTeacherId,

    // Actions
    sendRequest,
    cancelRequest,
    cancelMentoring,
    refetch: fetchRequests,

    // Dev helpers
    simulateAccept,
    simulateReject,
  };
}
