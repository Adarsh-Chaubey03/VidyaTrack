import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Clock, Eye, PenLine, FileText,
  CheckCircle2, XCircle, Loader2, AlertCircle, Send,
} from 'lucide-react';
import { apiService } from '../../services/api';

const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-600', icon: FileText },
  pending: { label: 'Pending Review', color: 'bg-amber-50 text-amber-700', icon: Loader2 },
  published: { label: 'Published', color: 'bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'bg-red-50 text-red-700', icon: XCircle },
};

export default function MyPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const res = await apiService.blog.myPosts();
        setPosts(res.posts || []);
      } catch (err) {
        // fetch failed
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = filter === 'all' ? posts : posts.filter((p) => p.status === filter);

  const counts = {
    all: posts.length,
    draft: posts.filter((p) => p.status === 'draft').length,
    pending: posts.filter((p) => p.status === 'pending').length,
    published: posts.filter((p) => p.status === 'published').length,
    rejected: posts.filter((p) => p.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/blog')}
              className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition"
            >
              <ArrowLeft size={18} /> Back to Blog
            </button>
            <Link
              to="/blog/submit"
              className="flex items-center gap-2 bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition"
            >
              <PenLine size={16} /> New Article
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">My Articles</h1>
          <p className="text-slate-500 text-sm">Manage and track your blog submissions.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Status tabs */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {(['all', 'draft', 'pending', 'published', 'rejected']).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === s
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_CONFIG[s]?.label || s}{' '}
              <span className="ml-1 opacity-70">({counts[s]})</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <FileText size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              {filter === 'all' ? 'No articles yet' : `No ${filter} articles`}
            </h3>
            <p className="text-slate-500 text-sm mb-6">Write your first article and share your knowledge.</p>
            <Link
              to="/blog/submit"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition"
            >
              <PenLine size={16} /> Write an Article
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((post) => (
              <PostRow key={post._id} post={post} navigate={navigate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PostRow({ post, navigate }) {
  const config = STATUS_CONFIG[post.status] || STATUS_CONFIG.draft;
  const Icon = config.icon;
  const date = new Date(post.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Thumbnail */}
        {post.heroImageUrl ? (
          <img
            src={post.heroImageUrl}
            alt={post.title}
            className="w-full sm:w-28 h-20 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-full sm:w-28 h-20 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
            <FileText size={24} className="text-slate-400" />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
              <Icon size={12} />
              {config.label}
            </span>
            {post.tags?.slice(0, 2).map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-500">
                {t}
              </span>
            ))}
          </div>
          <h3 className="font-semibold text-slate-800 truncate">{post.title}</h3>
          <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
            <span>{date}</span>
            <span className="flex items-center gap-1"><Clock size={11} /> {post.readingTime} min</span>
            {post.status === 'published' && (
              <span className="flex items-center gap-1"><Eye size={11} /> {post.views || 0} views</span>
            )}
          </div>
          {/* Rejection reason */}
          {post.status === 'rejected' && post.rejectionReason && (
            <div className="mt-2 bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg flex items-start gap-2">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span><strong>Reason:</strong> {post.rejectionReason}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {post.status === 'published' && (
            <Link
              to={`/blog/${post.slug}`}
              className="text-sm text-emerald-600 font-medium hover:underline"
            >
              View
            </Link>
          )}
          {(post.status === 'draft' || post.status === 'rejected') && (
            <button
              onClick={() => navigate(`/blog/submit`, { state: { editPost: post } })}
              className="flex items-center gap-1 text-sm text-slate-600 hover:text-emerald-600 transition"
            >
              <PenLine size={14} /> Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
