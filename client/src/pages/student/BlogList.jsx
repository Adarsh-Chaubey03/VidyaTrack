import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Clock, Eye, ChevronLeft, ChevronRight, PenLine, BookOpen, TrendingUp } from 'lucide-react';
import { apiService } from '../../services/api';
import { SkeletonBlogList } from '../../components/skeleton/Skeleton';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/student/Footer';

export default function BlogList() {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [activeTag, setActiveTag] = useState(searchParams.get('tag') || 'All');

  const fetchPosts = useCallback(async () => {
    // Don't fetch if not authenticated — we show the login prompt instead
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (activeTag && activeTag !== 'All') params.tag = activeTag;

      const res = await apiService.blog.listPublished(params);
      let fetched = res.posts || [];

      setPosts(fetched);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [page, activeTag]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Sync params to URL
  useEffect(() => {
    const params = {};
    if (page > 1) params.page = page;
    if (activeTag !== 'All') params.tag = activeTag;
    if (search) params.q = search;
    setSearchParams(params, { replace: true });
  }, [page, activeTag, search, setSearchParams]);

  const filteredPosts = search.trim()
    ? posts.filter((post) => {
        const query = search.toLowerCase();
        return (
          post.title.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(query))
        );
      })
    : posts;

  if (loading) return <SkeletonBlogList />;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-10 md:py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm text-emerald-200 mb-4">
            <TrendingUp size={14} />
            Community Knowledge Hub
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
            VidyaTrack Blog
          </h1>
          <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Explore articles written by our community — learn, share, and grow together.
          </p>

          {/* Search — only shown to authenticated users */}
          {isAuthenticated() && (
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search articles by title, tag, or keyword…"
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/95 backdrop-blur text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-lg"
            />
          </div>
          )}

          {isAuthenticated() && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/blog/submit"
                className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-emerald-50 transition shadow"
              >
                <PenLine size={18} />
                Write an Article
              </Link>
              <Link
                to="/blog/my-posts"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-white/15 transition shadow backdrop-blur-sm"
              >
                <BookOpen size={18} />
                My Articles
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ─── Posts Grid ─── */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {!isAuthenticated() ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Login to view articles</h3>
            <p className="text-slate-500 mb-6">Sign in to read articles written by our community.</p>
            <a
              href="/login"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow"
            >
              Log In
            </a>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No articles found</h3>
            <p className="text-slate-500">
              {search || activeTag !== 'All'
                ? 'Try a different search or tag filter.'
                : 'Be the first to write an article!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {/* ─── Pagination ─── */}
        {isAuthenticated() && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-10">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

/* ── Individual Post Card ─────────────────────────────────────────────────── */
const PostCard = React.memo(function PostCard({ post }) {
  const authorName = post.authorId?.name || 'VidyaTrack Team';
  const authorInitial = authorName.charAt(0).toUpperCase();
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Hero image */}
      {post.heroImageUrl ? (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={post.heroImageUrl}
            alt={post.title}
            loading="lazy"
            width="640"
            height="360"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
          <span className="text-5xl opacity-40">📄</span>
        </div>
      )}

      <div className="p-5 space-y-3">
        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex gap-2 flex-nowrap overflow-hidden">
            {post.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="max-w-[40%] truncate whitespace-nowrap px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-800 line-clamp-2 group-hover:text-emerald-700 transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-slate-500 line-clamp-2">{post.excerpt}</p>

        {/* Footer */}
        <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
          <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {authorInitial}
          </div>
          <span className="font-medium text-slate-600">{authorName}</span>
          <span className="ml-auto flex items-center gap-1">
            <Clock size={12} /> {post.readingTime || 3} min
          </span>
          <span className="flex items-center gap-1">
            <Eye size={12} /> {post.views || 0}
          </span>
        </div>
      </div>
    </Link>
  );
});
