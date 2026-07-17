'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { FirstTimeTutorial } from '@/components/FirstTimeTutorial';
import { AuthGuard } from '@/components/AuthGuard';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <AuthGuard>
      <FirstTimeTutorial />
      <div className="flex min-h-screen bg-[var(--bg)]">
        <Sidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <div className="flex flex-1 flex-col lg:ml-[var(--sidebar-width)]">
          <TopBar onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} mobileMenuOpen={mobileMenuOpen} />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-10 pt-24 w-full" style={{ maxWidth: '1400px', marginLeft: 'auto', marginRight: 'auto' }}>
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
