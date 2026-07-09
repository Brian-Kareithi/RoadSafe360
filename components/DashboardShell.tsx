'use client';

import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-6 pt-0 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
        {children}
      </main>
    </div>
  );
}