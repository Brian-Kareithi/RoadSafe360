'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { FirstTimeTutorial } from '@/components/FirstTimeTutorial';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <FirstTimeTutorial />
      <Sidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="flex flex-1 flex-col lg:ml-64 border-l border-zinc-200 dark:border-zinc-800">
        <TopBar onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} mobileMenuOpen={mobileMenuOpen} />
        <main className="flex-1 px-4 pb-8 pt-20 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
