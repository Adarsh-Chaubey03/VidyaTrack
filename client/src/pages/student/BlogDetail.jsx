import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Clock, Eye, Calendar, MessageSquare, Flag,
  Share2, ChevronUp, Send,
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { SkeletonBlogDetail } from '../../components/skeleton/Skeleton';
import Footer from '../../components/student/Footer';

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [commentPage, setCommentPage] = useState(1);
  const [commentTotal, setCommentTotal] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const commentRef = useRef(null);

  // Fetch post
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiService.blog.getBySlug(slug);
        setPost(res.post);
      } catch (err) {
        // post fetch failed
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  // Fetch comments
  useEffect(() => {
    if (!post) return;
    (async () => {
      try {
        const res = await apiService.blog.getComments(post._id, { page: commentPage, limit: 20 });
        setComments((prev) => (commentPage === 1 ? res.comments : [...prev, ...res.comments]));
        setCommentTotal(res.total || 0);
      } catch (err) {
        // comments fetch failed
      }
    })();
  }, [post, commentPage]);

  // Scroll-to-top visibility
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddComment = async () => {
    if (!commentText.trim() || commenting) return;
    setCommenting(true);
    try {
      const res = await apiService.blog.addComment(post._id, { content: commentText.trim() });
      setComments((prev) => [res.comment, ...prev]);
      setCommentTotal((t) => t + 1);
      setCommentText('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setCommenting(false);
    }
  };

  const handleFlag = async (commentId) => {
    try {
      await apiService.blog.flagComment(commentId);
      alert('Comment has been flagged for review.');
    } catch (err) {
      alert(err.response?.data?.message || 'Could not flag comment');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: post.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) return <SkeletonBlogDetail />;
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-6">
        <div className="text-7xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Article Not Found</h2>
        <p className="text-slate-500 mb-6">This article may have been removed or is pending review.</p>
        <Link to="/blog" className="text-emerald-600 font-medium hover:underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  const authorName = post.authorId?.name || 'VidyaTrack Team';
  const authorInitial = authorName.charAt(0).toUpperCase();
  const publishDate = new Date(post.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Top bar ─── */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition text-sm"
          >
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>

      {/* ─── Article ─── */}
      <article className="max-w-4xl mx-auto px-6 pt-8 pb-12">
        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {post.tags.map((t) => (
              <Link
                key={t}
                to={`/blog?tag=${t}`}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
              >
                {t}
              </Link>
            ))}
          </div>
        )}

        <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-slate-900 leading-tight mb-6">
          {post.title}
        </h1>

        {/* Author + meta */}
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <div className="w-11 h-11 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {authorInitial}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{authorName}</p>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
              <span className="flex items-center gap-1"><Calendar size={12} /> {publishDate}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {post.readingTime} min read</span>
              <span className="flex items-center gap-1"><Eye size={12} /> {post.views} views</span>
            </div>
          </div>
        </div>

        {/* Hero image */}
        {post.heroImageUrl && (
          <div className="rounded-2xl overflow-hidden mb-10 shadow-sm">
            <img src={post.heroImageUrl} alt={post.title} className="w-full object-cover max-h-[480px]" />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg prose-slate max-w-none prose-headings:text-slate-900 prose-a:text-emerald-600 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* ─── Comments Section ─── */}
        <section ref={commentRef} className="border-t border-slate-200 mt-12 pt-10">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <MessageSquare size={22} />
            Comments ({commentTotal})
          </h2>

          {/* Comment input */}
          {isAuthenticated() ? (
            <div className="flex gap-3 mb-8">
              <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts…"
                  rows={3}
                  maxLength={2000}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-slate-400">{commentText.length}/2000</span>
                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim() || commenting}
                    className="flex items-center gap-1.5 bg-emerald-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Send size={14} />
                    {commenting ? 'Posting…' : 'Post Comment'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8 bg-slate-50 rounded-xl p-5 text-center">
              <p className="text-slate-600 text-sm">
                <Link to="/login" className="text-emerald-600 font-medium hover:underline">Log in</Link> to join the conversation.
              </p>
            </div>
          )}

          {/* Comment list */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">No comments yet. Be the first!</p>
            ) : (
              comments.map((c) => (
                <CommentCard key={c._id} comment={c} onFlag={handleFlag} currentUser={user} />
              ))
            )}
          </div>

          {/* Load more */}
          {comments.length < commentTotal && (
            <button
              onClick={() => setCommentPage((p) => p + 1)}
              className="mt-6 mx-auto block text-sm text-emerald-600 font-medium hover:underline"
            >
              Load more comments
            </button>
          )}
        </section>
      </article>

      {/* Scroll-to-top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-700 transition"
        >
          <ChevronUp size={20} />
        </button>
      )}

      <Footer />
    </div>
  );
}

/* ── Comment Card ─────────────────────────────────────────────────────────── */
function CommentCard({ comment, onFlag, currentUser }) {
  const name = comment.authorId?.name || 'Anonymous';
  const initial = name.charAt(0).toUpperCase();
  const date = new Date(comment.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const isOwn = currentUser?._id === comment.authorId?._id;

  return (
    <div className="flex gap-3 p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition">
      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm text-slate-800">{name}</span>
          <span className="text-xs text-slate-400">{date}</span>
        </div>
        <p className="text-sm text-slate-600 whitespace-pre-wrap break-words">{comment.content}</p>
        {!isOwn && currentUser && (
          <button
            onClick={() => onFlag(comment._id)}
            className="mt-2 flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition"
          >
            <Flag size={12} /> Flag
          </button>
        )}
      </div>
    </div>
  );
}
