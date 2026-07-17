'use client';

import { FiShield } from 'react-icons/fi';

export function SkeletonLoader() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--bg)]">
      <div className="w-full max-w-md mx-auto px-6">
        <div className="flex flex-col items-center mb-12">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-lg mb-4">
            <FiShield size={26} />
          </div>
          <h1 className="text-xl font-bold text-[var(--text)]">RoadSafe360</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Loading your experience...</p>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full bg-[var(--border-light)]" />
            <div className="h-3 flex-1 rounded-full animate-shimmer" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full bg-[var(--border-light)]" />
            <div className="h-3 flex-1 rounded-full animate-shimmer" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full bg-[var(--border-light)]" />
            <div className="h-3 w-4/6 rounded-full animate-shimmer" />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 space-y-3">
              <div className="h-16 w-full rounded-lg animate-shimmer" />
              <div className="h-3 w-3/4 mx-auto rounded-full bg-[var(--border-light)]" />
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 space-y-3">
          <div className="h-4 w-1/3 rounded-full animate-shimmer" />
          <div className="h-3 w-full rounded-full bg-[var(--border-light)]" />
          <div className="h-3 w-5/6 rounded-full bg-[var(--border-light)]" />
          <div className="h-20 w-full rounded-lg animate-shimmer mt-3" />
        </div>
      </div>
    </div>
  );
}
