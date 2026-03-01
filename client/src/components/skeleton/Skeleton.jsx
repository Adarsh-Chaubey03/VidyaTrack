import React, { memo } from 'react';

/*  ═══════════════════════════════════════════════════════════════════════════
 *  Skeleton UI primitives — reusable building blocks for loading states.
 *
 *  Usage:
 *    import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard,
 *             SkeletonTableRow, SkeletonButton } from '../components/skeleton/Skeleton';
 *
 *  All components use CSS-based shimmer animation defined in index.css
 *  via the `skeleton-shimmer` class.
 *  ═══════════════════════════════════════════════════════════════════════════ */

/* ── Base block ───────────────────────────────────────────────────────────── */
export const Skeleton = memo(function Skeleton({
  className = '',
  width,
  height,
  rounded = 'rounded-md',
  style,
}) {
  return (
    <div
      className={`skeleton-shimmer ${rounded} ${className}`}
      style={{ width, height, ...style }}
    />
  );
});

/* ── Text lines ───────────────────────────────────────────────────────────── */
export const SkeletonText = memo(function SkeletonText({
  lines = 3,
  className = '',
  gap = 'gap-2.5',
  lastLineWidth = '60%',
}) {
  return (
    <div className={`flex flex-col ${gap} ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton-shimmer rounded h-3.5"
          style={{
            width: i === lines - 1 && lines > 1 ? lastLineWidth : '100%',
          }}
        />
      ))}
    </div>
  );
});

/* ── Avatar circle ────────────────────────────────────────────────────────── */
export const SkeletonAvatar = memo(function SkeletonAvatar({
  size = 40,
  className = '',
}) {
  return (
    <div
      className={`skeleton-shimmer rounded-full flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  );
});

/* ── Button shape ─────────────────────────────────────────────────────────── */
export const SkeletonButton = memo(function SkeletonButton({
  width = '100%',
  height = 44,
  className = '',
}) {
  return (
    <div
      className={`skeleton-shimmer rounded-xl ${className}`}
      style={{ width, height }}
    />
  );
});

/* ── Course card skeleton ─────────────────────────────────────────────────── */
export const SkeletonCard = memo(function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${className}`}>
      {/* Thumbnail */}
      <div className="skeleton-shimmer aspect-[16/9] w-full" />
      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="skeleton-shimmer rounded h-4 w-4/5" />
        <div className="skeleton-shimmer rounded h-3 w-3/5" />
        <div className="flex items-center gap-2">
          <div className="skeleton-shimmer rounded h-3 w-16" />
          <div className="skeleton-shimmer rounded h-3 w-12" />
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="skeleton-shimmer rounded h-5 w-16" />
          <div className="skeleton-shimmer rounded h-3 w-20" />
        </div>
      </div>
    </div>
  );
});

/* ── Dashboard stat card skeleton ─────────────────────────────────────────── */
export const SkeletonStatCard = memo(function SkeletonStatCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4">
      <div className="skeleton-shimmer rounded-lg w-10 h-10 flex-shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="skeleton-shimmer rounded h-6 w-16" />
        <div className="skeleton-shimmer rounded h-3 w-24" />
      </div>
    </div>
  );
});

/* ── Table row skeleton ───────────────────────────────────────────────────── */
export const SkeletonTableRow = memo(function SkeletonTableRow({
  cols = 4,
  className = '',
}) {
  return (
    <tr className={className}>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-3.5">
          {i === 1 ? (
            <div className="flex items-center gap-3">
              <SkeletonAvatar size={32} />
              <div className="skeleton-shimmer rounded h-3.5 w-28" />
            </div>
          ) : (
            <div
              className="skeleton-shimmer rounded h-3.5"
              style={{ width: i === 0 ? 24 : `${60 + Math.random() * 40}%` }}
            />
          )}
        </td>
      ))}
    </tr>
  );
});

/* ── Full-page course detail skeleton ─────────────────────────────────────── */
export const SkeletonCourseDetail = memo(function SkeletonCourseDetail() {
  return (
    <div className="min-h-screen bg-white skeleton-fade-in">
      {/* Hero banner */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="lg:max-w-[calc(100%-380px)] space-y-4">
            <div className="skeleton-shimmer-dark rounded h-4 w-32" />
            <div className="skeleton-shimmer-dark rounded h-8 w-4/5" />
            <div className="skeleton-shimmer-dark rounded h-8 w-3/5" />
            <div className="skeleton-shimmer-dark rounded h-4 w-full" />
            <div className="skeleton-shimmer-dark rounded h-4 w-2/3" />
            <div className="flex items-center gap-4 pt-2">
              <div className="skeleton-shimmer-dark rounded h-4 w-24" />
              <div className="skeleton-shimmer-dark rounded h-4 w-20" />
              <div className="skeleton-shimmer-dark rounded h-4 w-28" />
            </div>
          </div>
        </div>
      </div>
      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:flex lg:gap-8">
          <div className="flex-1 space-y-6">
            {/* Learning points */}
            <div className="border border-slate-200 rounded-xl p-6 space-y-3">
              <div className="skeleton-shimmer rounded h-5 w-48 mb-4" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="skeleton-shimmer rounded-full w-5 h-5 flex-shrink-0" />
                  <div className="skeleton-shimmer rounded h-4 flex-1" style={{ width: `${70 + i * 5}%` }} />
                </div>
              ))}
            </div>
            {/* Chapters */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div className="skeleton-shimmer rounded h-4 w-48" />
                  <div className="skeleton-shimmer rounded h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
          {/* Sidebar */}
          <div className="hidden lg:block w-[360px] flex-shrink-0">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="skeleton-shimmer aspect-video w-full" />
              <div className="p-5 space-y-4">
                <div className="skeleton-shimmer rounded h-7 w-24" />
                <SkeletonButton />
                <div className="space-y-3 pt-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="skeleton-shimmer rounded w-4 h-4" />
                      <div className="skeleton-shimmer rounded h-3.5 flex-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

/* ── Full-page player skeleton ────────────────────────────────────────────── */
export const SkeletonPlayer = memo(function SkeletonPlayer() {
  return (
    <div className="min-h-screen bg-gray-50 skeleton-fade-in">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-4 py-3 flex items-center gap-4">
          <div className="skeleton-shimmer rounded-lg w-9 h-9" />
          <div className="skeleton-shimmer rounded h-4 w-48" />
          <div className="flex-1" />
          <div className="skeleton-shimmer rounded h-3 w-24" />
        </div>
      </div>
      {/* Body */}
      <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row">
        {/* Video area */}
        <div className="flex-1 p-4 lg:p-6">
          <div className="skeleton-shimmer rounded-xl aspect-video w-full mb-6" />
          <div className="skeleton-shimmer rounded h-5 w-64 mb-3" />
          <div className="skeleton-shimmer rounded h-3.5 w-96 mb-2" />
          <div className="skeleton-shimmer rounded h-3.5 w-48" />
        </div>
        {/* Sidebar */}
        <div className="w-full lg:w-80 xl:w-96 border-l border-gray-200 bg-white p-4 hidden lg:block">
          <div className="skeleton-shimmer rounded h-5 w-40 mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <div className="skeleton-shimmer rounded-full w-5 h-5" />
                <div className="skeleton-shimmer rounded h-3.5 flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

/* ── Educator dashboard skeleton ──────────────────────────────────────────── */
export const SkeletonEducatorDashboard = memo(function SkeletonEducatorDashboard() {
  return (
    <div className="space-y-6 skeleton-fade-in">
      <div>
        <div className="skeleton-shimmer rounded h-7 w-40 mb-1" />
        <div className="skeleton-shimmer rounded h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="skeleton-shimmer rounded h-4 w-36" />
          <div className="skeleton-shimmer rounded h-3 w-16" />
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {['#', 'Student', 'Course'].map((h, i) => (
                <th key={i} className="text-left px-5 py-3">
                  <div className="skeleton-shimmer rounded h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonTableRow key={i} cols={3} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

/* ── Student enrolled table skeleton ──────────────────────────────────────── */
export const SkeletonStudentEnrolled = memo(function SkeletonStudentEnrolled() {
  return (
    <div className="space-y-6 skeleton-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="skeleton-shimmer rounded h-7 w-48 mb-1" />
          <div className="skeleton-shimmer rounded h-4 w-64" />
        </div>
        <div className="skeleton-shimmer rounded-lg h-8 w-20" />
      </div>
      <div className="bg-white rounded-xl border border-slate-200">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {['#', 'Student', 'Course', 'Enrolled On'].map((_, i) => (
                <th key={i} className="text-left px-5 py-3">
                  <div className="skeleton-shimmer rounded h-3" style={{ width: i === 0 ? 16 : 64 }} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonTableRow key={i} cols={4} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

/* ── Educator access page skeleton ────────────────────────────────────────── */
export const SkeletonEducatorAccess = memo(function SkeletonEducatorAccess() {
  return (
    <div className="min-h-screen skeleton-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center space-y-4">
          <div className="skeleton-shimmer-dark rounded-full h-8 w-40 mx-auto" />
          <div className="skeleton-shimmer-dark rounded h-10 w-3/4 mx-auto" />
          <div className="skeleton-shimmer-dark rounded h-5 w-2/3 mx-auto" />
          <div className="flex justify-center gap-4 pt-4">
            <div className="skeleton-shimmer-dark rounded-xl h-12 w-40" />
            <div className="skeleton-shimmer-dark rounded-xl h-12 w-40" />
          </div>
        </div>
      </div>
      {/* Cards */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
              <div className="skeleton-shimmer rounded-xl w-12 h-12" />
              <div className="skeleton-shimmer rounded h-5 w-3/4" />
              <div className="skeleton-shimmer rounded h-3 w-full" />
              <div className="skeleton-shimmer rounded h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

/* ── Admin applications skeleton ──────────────────────────────────────────── */
export const SkeletonAdminApplications = memo(function SkeletonAdminApplications() {
  return (
    <div className="space-y-4 skeleton-fade-in">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4">
          <SkeletonAvatar size={40} />
          <div className="flex-1 space-y-2">
            <div className="skeleton-shimmer rounded h-4 w-40" />
            <div className="skeleton-shimmer rounded h-3 w-56" />
          </div>
          <div className="skeleton-shimmer rounded-full h-6 w-20" />
        </div>
      ))}
    </div>
  );
});

/* ── Blog list skeleton ───────────────────────────────────────────────────── */
export const SkeletonBlogList = memo(function SkeletonBlogList() {
  return (
    <div className="min-h-screen bg-slate-50 skeleton-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center space-y-4">
          <div className="skeleton-shimmer-dark rounded h-10 w-64 mx-auto" />
          <div className="skeleton-shimmer-dark rounded h-5 w-96 mx-auto" />
          <div className="skeleton-shimmer-dark rounded-xl h-12 w-80 mx-auto mt-4" />
        </div>
      </div>
      {/* Tags */}
      <div className="max-w-6xl mx-auto px-6 py-6 flex gap-3 flex-wrap">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer rounded-full h-8 w-20" />
        ))}
      </div>
      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="skeleton-shimmer aspect-[16/9] w-full" />
            <div className="p-5 space-y-3">
              <div className="flex gap-2">
                <div className="skeleton-shimmer rounded-full h-5 w-14" />
                <div className="skeleton-shimmer rounded-full h-5 w-16" />
              </div>
              <div className="skeleton-shimmer rounded h-5 w-4/5" />
              <div className="skeleton-shimmer rounded h-3.5 w-full" />
              <div className="skeleton-shimmer rounded h-3.5 w-3/5" />
              <div className="flex items-center gap-3 pt-2">
                <SkeletonAvatar size={28} />
                <div className="skeleton-shimmer rounded h-3 w-24" />
                <div className="flex-1" />
                <div className="skeleton-shimmer rounded h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

/* ── Blog detail skeleton ─────────────────────────────────────────────────── */
export const SkeletonBlogDetail = memo(function SkeletonBlogDetail() {
  return (
    <div className="min-h-screen bg-white skeleton-fade-in">
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        {/* Tags */}
        <div className="flex gap-2">
          <div className="skeleton-shimmer rounded-full h-6 w-16" />
          <div className="skeleton-shimmer rounded-full h-6 w-20" />
        </div>
        {/* Title */}
        <div className="skeleton-shimmer rounded h-10 w-4/5" />
        <div className="skeleton-shimmer rounded h-10 w-2/3" />
        {/* Author & meta */}
        <div className="flex items-center gap-4 pt-2">
          <SkeletonAvatar size={44} />
          <div className="space-y-2">
            <div className="skeleton-shimmer rounded h-4 w-32" />
            <div className="skeleton-shimmer rounded h-3 w-48" />
          </div>
        </div>
        {/* Hero image */}
        <div className="skeleton-shimmer rounded-2xl aspect-[2/1] w-full" />
        {/* Content */}
        <div className="space-y-4 pt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-shimmer rounded h-4" style={{ width: `${70 + Math.random() * 30}%` }} />
          ))}
          <div className="pt-4" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-shimmer rounded h-4" style={{ width: `${60 + Math.random() * 40}%` }} />
          ))}
        </div>
        {/* Comments skeleton */}
        <div className="border-t border-slate-200 pt-8 mt-8 space-y-4">
          <div className="skeleton-shimmer rounded h-6 w-32" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 p-4 bg-slate-50 rounded-xl">
              <SkeletonAvatar size={36} />
              <div className="flex-1 space-y-2">
                <div className="skeleton-shimmer rounded h-3.5 w-28" />
                <div className="skeleton-shimmer rounded h-3 w-full" />
                <div className="skeleton-shimmer rounded h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

/* ── Login page skeleton ──────────────────────────────────────────────────── */
export const SkeletonLogin = memo(function SkeletonLogin() {
  return (
    <div
      className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden skeleton-fade-in"
      style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 20%, #fff1f2 50%, #fce7f3 75%, #ecfdf5 100%)' }}
    >
      {/* Decorative blurred orbs */}
      <div className="absolute top-[-120px] left-[-80px] w-[400px] h-[400px] rounded-full opacity-30 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #34d399, transparent 70%)' }} />
      <div className="absolute bottom-[-100px] right-[-60px] w-[350px] h-[350px] rounded-full opacity-25 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #fb7185, transparent 70%)' }} />

      <div className="relative max-w-md w-full bg-white/70 backdrop-blur-2xl rounded-3xl shadow-xl ring-1 ring-white/60 p-8 sm:p-10">
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <div className="skeleton-shimmer rounded h-9 w-32" />
        </div>
        {/* Title & subtitle */}
        <div className="text-center mb-6 space-y-2">
          <div className="skeleton-shimmer rounded h-7 w-48 mx-auto" />
          <div className="skeleton-shimmer rounded h-4 w-40 mx-auto" />
        </div>
        {/* Role selector pills */}
        <div className="flex rounded-xl bg-gray-100/80 p-1 mb-5">
          <div className="flex-1 py-2.5 flex justify-center">
            <div className="skeleton-shimmer rounded h-4 w-16" />
          </div>
          <div className="flex-1 py-2.5 flex justify-center">
            <div className="skeleton-shimmer rounded h-4 w-16" />
          </div>
        </div>
        {/* Email field */}
        <div className="space-y-5">
          <div className="space-y-4">
            <div>
              <div className="skeleton-shimmer rounded h-3.5 w-24 mb-1" />
              <div className="skeleton-shimmer rounded-xl h-10 w-full" />
            </div>
            {/* Password field */}
            <div>
              <div className="skeleton-shimmer rounded h-3.5 w-16 mb-1" />
              <div className="skeleton-shimmer rounded-xl h-10 w-full" />
            </div>
          </div>
          {/* Remember me & forgot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="skeleton-shimmer rounded w-4 h-4" />
              <div className="skeleton-shimmer rounded h-3.5 w-20" />
            </div>
            <div className="skeleton-shimmer rounded h-3.5 w-24" />
          </div>
          {/* Button */}
          <SkeletonButton height={42} />
          {/* Sign up link */}
          <div className="flex justify-center">
            <div className="skeleton-shimmer rounded h-3.5 w-44" />
          </div>
        </div>
      </div>
    </div>
  );
});

/* ── Signup page skeleton ─────────────────────────────────────────────────── */
export const SkeletonSignup = memo(function SkeletonSignup() {
  return (
    <div
      className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden skeleton-fade-in"
      style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 20%, #fff1f2 50%, #fce7f3 75%, #ecfdf5 100%)' }}
    >
      {/* Decorative blurred orbs */}
      <div className="absolute top-[-120px] left-[-80px] w-[400px] h-[400px] rounded-full opacity-30 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #34d399, transparent 70%)' }} />
      <div className="absolute bottom-[-100px] right-[-60px] w-[350px] h-[350px] rounded-full opacity-25 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #fb7185, transparent 70%)' }} />

      <div className="relative max-w-md w-full bg-white/70 backdrop-blur-2xl rounded-3xl shadow-xl ring-1 ring-white/60 p-8 sm:p-10">
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <div className="skeleton-shimmer rounded h-9 w-32" />
        </div>
        {/* Title & subtitle */}
        <div className="text-center mb-6 space-y-2">
          <div className="skeleton-shimmer rounded h-7 w-52 mx-auto" />
          <div className="skeleton-shimmer rounded h-4 w-64 mx-auto" />
        </div>
        {/* Form fields */}
        <div className="space-y-5">
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <div className="skeleton-shimmer rounded h-3.5 w-20 mb-1" />
              <div className="skeleton-shimmer rounded-xl h-10 w-full" />
            </div>
            {/* Email */}
            <div>
              <div className="skeleton-shimmer rounded h-3.5 w-24 mb-1" />
              <div className="skeleton-shimmer rounded-xl h-10 w-full" />
            </div>
            {/* Password */}
            <div>
              <div className="skeleton-shimmer rounded h-3.5 w-16 mb-1" />
              <div className="skeleton-shimmer rounded-xl h-10 w-full" />
            </div>
            {/* Confirm Password */}
            <div>
              <div className="skeleton-shimmer rounded h-3.5 w-28 mb-1" />
              <div className="skeleton-shimmer rounded-xl h-10 w-full" />
            </div>
          </div>
          {/* Terms checkbox */}
          <div className="flex items-start gap-2">
            <div className="skeleton-shimmer rounded w-4 h-4 mt-0.5" />
            <div className="skeleton-shimmer rounded h-3.5 w-56" />
          </div>
          {/* Button */}
          <SkeletonButton height={42} />
          {/* Sign in link */}
          <div className="flex justify-center">
            <div className="skeleton-shimmer rounded h-3.5 w-48" />
          </div>
        </div>
      </div>
    </div>
  );
});

export default Skeleton;
