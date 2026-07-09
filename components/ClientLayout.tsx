'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <Toaster position="top-right" toastOptions={{
          duration: 4000,
          style: { borderRadius: '10px', background: '#18181b', color: '#f4f4f5', fontSize: '14px' },
        }} />
      </AuthProvider>
    </ThemeProvider>
  );
}