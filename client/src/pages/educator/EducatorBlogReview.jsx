import React, { useEffect, useState, useCallback } from 'react';
import {
  FileSearch, CheckCircle, XCircle, Clock, Eye, Loader2,
  AlertCircle, RefreshCw, ChevronDown, ChevronUp,
} from 'lucide-react';
import { apiService } from '../../services/api';

export default function EducatorBlogReview() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ msg: '', type: 'success' });

  const fetchPending = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiService.blog.educatorListPending();
      setPosts(res.posts || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load pending articles.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPending(); }, [fetchPending]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3000);
  };

  const removePost = (id) => setPosts((prev) => prev.filter((p) => p._id !== id));

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <FileSearch size={20} className="text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Review Articles</h1>
            <p className="text-slate-500 text-sm">
              {loading ? 'Loading…' : `${posts.length} article${posts.length !== 1 ? 's' : ''} awaiting review`}
            </p>
          </div>
        </div>
        <button
          onClick={fetchPending}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 border border-slate-200 hover:border-emerald-300 px-3 py-2 rounded-lg transition disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Toast */}
      {toast.msg && (
        <div className={`mb-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm border ${
          toast.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle size={16} className="flex-shrink-0" />
            : <XCircle size={16} className="flex-shrink-0" />
          }
          {toast.msg}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={16} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <CheckCircle size={48} className="mx-auto text-emerald-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-1">All caught up!</h3>
          <p className="text-slate-500 text-sm">No articles are pending review right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <ArticleCard
              key={post._id}
              post={post}
              onRemove={removePost}
              onToast={showToast}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Individual article review card ─────────────────────────────────────── */
function ArticleCard({ post, onRemove, onToast }) {
  const [expanded, setExpanded] = useState(false);
  const [actionId, setActionId] = useState(null); // 'approve' | 'reject' | null

  // Reject inline state
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState('');

  const authorName = post.authorId?.name || 'Unknown Author';
  const authorInitial = authorName.charAt(0).toUpperCase();
  const date = new Date(post.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  const handleApprove = async () => {
    setActionId('approve');
    try {
      await apiService.blog.educatorApprove(post._id);
      onRemove(post._id);
      onToast('Article approved and published successfully.', 'success');
    } catch (err) {
      onToast(err.response?.data?.message || 'Approval failed. Please try again.', 'error');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async () => {
    setRejectError('');
    if (!rejectReason.trim()) {
      setRejectError('Please provide a reason for rejection.');
      return;
    }
    setActionId('reject');
    try {
      await apiService.blog.educatorReject(post._id, rejectReason.trim());
      onRemove(post._id);
      onToast('Article rejected. The student has been notified.', 'error');
    } catch (err) {
      onToast(err.response?.data?.message || 'Rejection failed. Please try again.', 'error');
    } finally {
      setActionId(null);
    }
  };

  const cancelReject = () => {
    setShowRejectForm(false);
    setRejectReason('');
    setRejectError('');
  };

  const isBusy = actionId !== null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-sm transition">
      {/* Hero image */}
      {post.heroImageUrl && (
        <img src={post.heroImageUrl} alt={post.title} className="w-full h-40 object-cover" />
      )}

      <div className="p-5">
        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-3">
            {post.tags.map((t) => (
              <span key={t} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="font-semibold text-slate-800 text-base mb-1 leading-snug">{post.title}</h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-slate-500 mb-3 line-clamp-2">{post.excerpt}</p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
          <span className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              {authorInitial}
            </div>
            <span className="font-medium text-slate-600">{authorName}</span>
          </span>
          <span className="flex items-center gap-1"><Clock size={11} /> {post.readingTime || 1} min read</span>
          <span>{date}</span>
          <span className="ml-auto flex items-center gap-1 text-amber-600 font-medium">
            <Clock size={11} /> Pending
          </span>
        </div>

        {/* Expanded content preview */}
        {expanded && post.content && (
          <div className="mb-4 bg-slate-50 rounded-xl p-4 border border-slate-200 max-h-64 overflow-y-auto">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Article Content</p>
            <div
              className="text-sm text-slate-700 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        )}

        {/* ── Reject inline form ── */}
        {showRejectForm && (
          <div className="mb-4 bg-red-50 rounded-xl p-4 border border-red-200">
            <p className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1.5">
              <XCircle size={14} /> Rejection Reason
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Provide clear feedback so the student can improve their article…"
              rows={3}
              maxLength={1000}
              className="w-full rounded-lg border border-red-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
            />
            {rejectError && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle size={12} /> {rejectError}
              </p>
            )}
            <div className="flex items-center justify-end gap-2 mt-3">
              <button
                onClick={cancelReject}
                disabled={isBusy}
                className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isBusy}
                className="flex items-center gap-1.5 bg-red-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
              >
                {actionId === 'reject'
                  ? <><Loader2 size={13} className="animate-spin" /> Rejecting…</>
                  : <><XCircle size={13} /> Confirm Reject</>
                }
              </button>
            </div>
          </div>
        )}

        {/* Action row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Approve */}
          <button
            onClick={handleApprove}
            disabled={isBusy || showRejectForm}
            className="flex items-center gap-2 bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            {actionId === 'approve'
              ? <><Loader2 size={14} className="animate-spin" /> Approving…</>
              : <><CheckCircle size={14} /> Approve & Publish</>
            }
          </button>

          {/* Reject — toggles the inline form */}
          {!showRejectForm ? (
            <button
              onClick={() => setShowRejectForm(true)}
              disabled={isBusy}
              className="flex items-center gap-2 border border-red-200 text-red-600 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-red-50 hover:border-red-300 disabled:opacity-50 transition"
            >
              <XCircle size={14} /> Reject
            </button>
          ) : null}

          {/* Preview content toggle */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-2 border border-slate-200 text-slate-600 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition ml-auto"
          >
            <Eye size={14} />
            {expanded ? 'Hide Content' : 'Preview Content'}
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>
    </div>
  );
}
