import React, { useEffect, useState, useCallback } from 'react';
import {
  FileText, CheckCircle, XCircle, Eye, Clock, Loader2,
  MessageSquare, Trash2, AlertCircle, Shield,
} from 'lucide-react';
import { apiService } from '../../services/api';

const TAB_ITEMS = [
  { key: 'posts', label: 'Blog Posts', icon: FileText },
  { key: 'comments', label: 'Comments', icon: MessageSquare },
];

export default function AdminBlogQueue() {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Shield size={20} className="text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Blog Moderation</h1>
              <p className="text-slate-500 text-sm">Review and manage submitted articles and comments.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 flex gap-1">
          {TAB_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === key
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {activeTab === 'posts' ? <PostQueue /> : <CommentQueue />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  Post moderation queue
 * ═══════════════════════════════════════════════════════════════════════════ */
function PostQueue() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [actionId, setActionId] = useState(null);
  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiService.blog.adminList({ status: statusFilter });
      setPosts(res.posts || []);
    } catch (err) {
      // fetch failed
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      await apiService.blog.adminApprove(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Approve failed');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setActionId(rejectId);
    try {
      await apiService.blog.adminReject(rejectId, rejectReason.trim());
      setPosts((prev) => prev.filter((p) => p._id !== rejectId));
      setRejectId(null);
      setRejectReason('');
    } catch (err) {
      alert(err.response?.data?.message || 'Reject failed');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      {/* Status filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {['pending', 'published', 'rejected', 'draft'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              statusFilter === s
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <CheckCircle size={48} className="mx-auto text-emerald-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">Queue Empty</h3>
          <p className="text-slate-500 text-sm">No {statusFilter} posts at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const authorName = post.authorId?.name || 'Unknown';
            const date = new Date(post.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
            });
            const isActing = actionId === post._id;

            return (
              <div key={post._id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Thumbnail */}
                  {post.heroImageUrl ? (
                    <img src={post.heroImageUrl} alt="" className="w-full lg:w-32 h-20 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-full lg:w-32 h-20 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <FileText size={24} className="text-slate-400" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 truncate mb-1">{post.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-1 mb-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>By <strong className="text-slate-600">{authorName}</strong></span>
                      <span>{date}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {post.readingTime} min</span>
                      <span className="flex items-center gap-1"><Eye size={11} /> {post.views}</span>
                    </div>
                    {post.tags?.length > 0 && (
                      <div className="flex gap-1.5 mt-2">
                        {post.tags.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-500">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {statusFilter === 'pending' && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleApprove(post._id)}
                        disabled={isActing}
                        className="flex items-center gap-1.5 bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition"
                      >
                        {isActing ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectId(post._id)}
                        disabled={isActing}
                        className="flex items-center gap-1.5 border border-red-200 text-red-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-50 disabled:opacity-50 transition"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  )}
                </div>

                {/* Reject modal inline */}
                {rejectId === post._id && (
                  <div className="mt-4 bg-red-50 rounded-xl p-4 border border-red-200">
                    <div className="flex items-start gap-2 mb-3">
                      <AlertCircle size={16} className="text-red-500 mt-0.5" />
                      <p className="text-sm text-red-700 font-medium">Rejection Reason</p>
                    </div>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Provide feedback for the author…"
                      rows={3}
                      className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
                    />
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        onClick={() => { setRejectId(null); setRejectReason(''); }}
                        className="text-sm text-slate-500 px-3 py-1.5"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleReject}
                        disabled={!rejectReason.trim() || isActing}
                        className="bg-red-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                      >
                        Confirm Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  Comment moderation queue
 * ═══════════════════════════════════════════════════════════════════════════ */
function CommentQueue() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('flagged');
  const [actionId, setActionId] = useState(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiService.blog.adminListComments({ status: statusFilter });
      setComments(res.comments || []);
    } catch (err) {
      // comments fetch failed
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      await apiService.blog.adminApproveComment(id);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Approve failed');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this comment permanently?')) return;
    setActionId(id);
    try {
      await apiService.blog.adminDeleteComment(id);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      {/* Status filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {['flagged', 'pending', 'visible', 'removed'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              statusFilter === s
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <CheckCircle size={48} className="mx-auto text-emerald-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">No {statusFilter} comments</h3>
          <p className="text-slate-500 text-sm">The queue is clear.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => {
            const name = comment.authorId?.name || 'Anonymous';
            const initial = name.charAt(0).toUpperCase();
            const date = new Date(comment.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
            });
            const isActing = actionId === comment._id;

            return (
              <div key={comment._id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-sm text-slate-800">{name}</span>
                      <span className="text-xs text-slate-400">{date}</span>
                      {comment.flagCount > 0 && (
                        <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">
                          {comment.flagCount} flag{comment.flagCount > 1 ? 's' : ''}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        comment.status === 'flagged' ? 'bg-red-50 text-red-600'
                          : comment.status === 'pending' ? 'bg-amber-50 text-amber-700'
                          : comment.status === 'visible' ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {comment.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap break-words">{comment.content}</p>
                  </div>
                  {/* Actions */}
                  <div className="flex items-start gap-2 flex-shrink-0">
                    {(comment.status === 'flagged' || comment.status === 'pending') && (
                      <button
                        onClick={() => handleApprove(comment._id)}
                        disabled={isActing}
                        className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 disabled:opacity-50 transition"
                        title="Approve"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(comment._id)}
                      disabled={isActing}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 transition"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
