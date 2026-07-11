'use client';

import { FiShield } from 'react-icons/fi';

export function SkeletonLoader() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="w-full max-w-md mx-auto px-6">
        <div className="flex flex-col items-center mb-12">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#BB2020] to-[#8B0000] text-white shadow-lg shadow-red-900/20 mb-4">
            <FiShield size={26} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">RoadSafe360</h1>
          <p className="text-sm text-zinc-400 mt-1">Loading your experience...</p>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full animate-shimmer-subtle" />
            <div className="h-3 flex-1 rounded-full animate-shimmer" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full animate-shimmer-subtle" />
            <div className="h-3 flex-1 rounded-full animate-shimmer" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full animate-shimmer-subtle" />
            <div className="h-3 w-4/6 rounded-full animate-shimmer" />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-100 dark:border-zinc-800 p-4 space-y-3">
              <div className="h-16 w-full rounded-lg animate-shimmer" />
              <div className="h-3 w-3/4 mx-auto rounded-full animate-shimmer-subtle" />
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-zinc-100 dark:border-zinc-800 p-5 space-y-3">
          <div className="h-4 w-1/3 rounded-full animate-shimmer" />
          <div className="h-3 w-full rounded-full animate-shimmer-subtle" />
          <div className="h-3 w-5/6 rounded-full animate-shimmer-subtle" />
          <div className="h-20 w-full rounded-lg animate-shimmer mt-3" />
        </div>
      </div>
    </div>
  );
}
