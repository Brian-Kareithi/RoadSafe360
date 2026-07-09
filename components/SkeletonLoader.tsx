'use client';

import { FiShield } from 'react-icons/fi';

export function SkeletonLoader() {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white dark:bg-zinc-950">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900">
          <FiShield size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold">RoadSafe360</h1>
          <p className="text-xs text-zinc-400">Loading your dashboard...</p>
        </div>
      </div>

      <div className="w-72 space-y-3">
        <div className="h-3 w-full rounded-full animate-shimmer" />
        <div className="h-3 w-5/6 rounded-full animate-shimmer" />
        <div className="h-3 w-4/6 rounded-full animate-shimmer" />
      </div>

      <div className="mt-10 grid grid-cols-3 gap-4 w-80">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-20 w-full rounded-xl animate-shimmer" />
            <div className="h-3 w-3/4 mx-auto rounded-full animate-shimmer" />
          </div>
        ))}
      </div>

      <div className="mt-6 w-80 space-y-3">
        <div className="h-32 w-full rounded-xl animate-shimmer" />
      </div>
    </div>
  );
}
