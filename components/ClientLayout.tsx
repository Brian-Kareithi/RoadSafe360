'use client';

import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { DashboardShell } from '@/components/DashboardShell';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
    }
  }, []);
  const pathname = usePathname();
  const isAuth = pathname === '/auth' || pathname === '/';

  return (
    <ThemeProvider>
      <AuthProvider>
        {isAuth ? children : <DashboardShell>{children}</DashboardShell>}
        <PWAInstallPrompt />
        <Toaster position="top-right" toastOptions={{
          duration: 4000,
          style: { borderRadius: '10px', background: '#18181b', color: '#f4f4f5', fontSize: '14px' },
        }} />
      </AuthProvider>
    </ThemeProvider>
  );
}
