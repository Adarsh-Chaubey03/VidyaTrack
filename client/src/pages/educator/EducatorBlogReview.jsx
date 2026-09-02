import React, { useEffect, useState, useCallback } from 'react';
import {
  FileSearch, CheckCircle, Clock, Eye, Loader2,
  FileText, AlertCircle, RefreshCw, User,
} from 'lucide-react';
import { apiService } from '../../services/api';

export default function EducatorBlogReview() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState(null);
  const [toast, setToast] = useState('');

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

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      await apiService.blog.educatorApprove(id);
      // Remove from list immediately — no refresh needed
      setPosts((prev) => prev.filter((p) => p._id !== id));
      showToast('Article approved and published successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed. Please try again.');
    } finally {
      setActionId(null);
    }
  };

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
      {toast && (
        <div className="mb-4 flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl px-4 py-3 text-sm">
          <CheckCircle size={16} className="flex-shrink-0" />
          {toast}
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
        /* Empty state */
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
              isActing={actionId === post._id}
              onApprove={() => handleApprove(post._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Individual article review card ─────────────────────────────────────── */
function ArticleCard({ post, isActing, onApprove }) {
  const [expanded, setExpanded] = useState(false);

  const authorName = post.authorId?.name || 'Unknown Author';
  const authorInitial = authorName.charAt(0).toUpperCase();
  const date = new Date(post.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-sm transition">
      {/* Hero image */}
      {post.heroImageUrl && (
        <img
          src={post.heroImageUrl}
          alt={post.title}
          className="w-full h-40 object-cover"
        />
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

        {/* Action row */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onApprove}
            disabled={isActing}
            className="flex items-center gap-2 bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            {isActing
              ? <Loader2 size={14} className="animate-spin" />
              : <CheckCircle size={14} />
            }
            Approve & Publish
          </button>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-2 border border-slate-200 text-slate-600 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition"
          >
            <Eye size={14} />
            {expanded ? 'Hide Content' : 'Preview Content'}
          </button>
        </div>
      </div>
    </div>
  );
}
