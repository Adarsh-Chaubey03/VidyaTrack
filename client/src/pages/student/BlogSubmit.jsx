import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Image as ImageIcon, Eye, EyeOff, Send, Save,
  Tag, X, Loader2,
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const TAG_SUGGESTIONS = [
  'Career', 'React', 'JavaScript', 'Web Dev', 'Learning', 'Productivity',
  'Tech', 'Beginners', 'Python', 'AI', 'CSS', 'Node.js', 'Data Science',
  'Performance', 'Study Tips', 'Education',
];

export default function BlogSubmit() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fileRef = useRef(null);

  const addTag = (tag) => {
    const t = tag.trim();
    if (t && tags.length < 5 && !tags.includes(t)) {
      setTags([...tags, t]);
    }
    setTagInput('');
  };

  const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));

  const handleTagKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await apiService.blog.uploadImage(formData);
      setHeroImageUrl(res.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = useCallback(
    async (asDraft = false) => {
      setError('');
      setSuccess('');

      if (!title.trim()) return setError('Title is required');
      if (!content.trim()) return setError('Content is required');
      if (title.length > 200) return setError('Title must be under 200 characters');
      if (content.length > 50000) return setError('Content must be under 50 000 characters');

      setSaving(true);
      try {
        const body = {
          title: title.trim(),
          excerpt: excerpt.trim() || undefined,
          content: content.trim(),
          tags,
          heroImageUrl: heroImageUrl || undefined,
          status: asDraft ? 'draft' : 'pending',
        };
        await apiService.blog.submit(body);
        setSuccess(asDraft ? 'Draft saved!' : 'Article submitted for review!');
        setTimeout(() => navigate('/blog/my-posts'), 1500);
      } catch (err) {
        setError(err.response?.data?.message || 'Submission failed');
      } finally {
        setSaving(false);
      }
    },
    [title, excerpt, content, tags, heroImageUrl, navigate]
  );

  // Simple HTML preview from plain text
  const previewHtml = content
    .split('\n\n')
    .map((p) => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 transition"
            >
              {preview ? <EyeOff size={16} /> : <Eye size={16} />}
              {preview ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={saving}
              className="flex items-center gap-1.5 text-sm border border-slate-300 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition"
            >
              <Save size={14} /> Save Draft
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={saving}
              className="flex items-center gap-1.5 text-sm bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition font-medium"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Submit for Review
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl px-4 py-3 text-sm">
            {success}
          </div>
        )}

        {preview ? (
          /* ── Preview Mode ── */
          <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12">
            {tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-4">
                {tags.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-3xl font-bold text-slate-900 mb-4">{title || 'Untitled'}</h1>
            {excerpt && <p className="text-lg text-slate-500 mb-6">{excerpt}</p>}
            {heroImageUrl && (
              <img src={heroImageUrl} alt="Hero" className="w-full rounded-xl mb-8 max-h-96 object-cover" />
            )}
            <div
              className="prose prose-lg prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>
        ) : (
          /* ── Edit Mode ── */
          <div className="space-y-6">
            {/* Hero image */}
            <div
              onClick={() => fileRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                heroImageUrl
                  ? 'border-emerald-300 bg-emerald-50'
                  : 'border-slate-300 bg-white hover:border-emerald-400'
              } overflow-hidden`}
            >
              {heroImageUrl ? (
                <div className="relative">
                  <img src={heroImageUrl} alt="Hero" className="w-full max-h-72 object-cover rounded-2xl" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setHeroImageUrl('');
                    }}
                    className="absolute top-3 right-3 bg-white/90 rounded-full p-1.5 hover:bg-red-50 transition"
                  >
                    <X size={16} className="text-red-500" />
                  </button>
                </div>
              ) : (
                <div className="py-12 text-center">
                  {uploading ? (
                    <Loader2 size={28} className="mx-auto animate-spin text-emerald-500" />
                  ) : (
                    <>
                      <ImageIcon size={32} className="mx-auto text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500">Click to upload hero image (max 5 MB)</p>
                    </>
                  )}
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title…"
              maxLength={200}
              className="w-full text-3xl md:text-4xl font-bold text-slate-900 bg-transparent border-none outline-none placeholder:text-slate-300"
            />

            {/* Excerpt */}
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A short excerpt or summary (optional, max 500 chars)"
              maxLength={500}
              rows={2}
              className="w-full text-lg text-slate-500 bg-transparent border-none outline-none resize-none placeholder:text-slate-300"
            />

            {/* Tags */}
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Tag size={16} className="text-slate-400" />
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700"
                  >
                    {t}
                    <button onClick={() => removeTag(t)} className="hover:text-red-500">
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {tags.length < 5 && (
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKey}
                    placeholder={tags.length === 0 ? 'Add tags (press Enter)' : 'Add more…'}
                    className="text-sm bg-transparent outline-none w-32 placeholder:text-slate-400"
                  />
                )}
              </div>
              {/* Suggestions */}
              {tags.length < 5 && (
                <div className="flex gap-2 flex-wrap">
                  {TAG_SUGGESTIONS.filter((s) => !tags.includes(s))
                    .slice(0, 8)
                    .map((s) => (
                      <button
                        key={s}
                        onClick={() => addTag(s)}
                        className="px-2.5 py-1 rounded-full text-xs border border-slate-200 text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition"
                      >
                        + {s}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content here…&#10;&#10;You can use HTML tags for formatting: <h2>, <p>, <ul>, <li>, <blockquote>, <pre><code>, etc."
                maxLength={50000}
                rows={20}
                className="w-full rounded-xl border border-slate-200 px-5 py-4 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-y font-mono leading-relaxed"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Supports HTML formatting</span>
                <span>{content.length.toLocaleString()} / 50,000</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
