import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClientLayout } from '@/components/ClientLayout';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'RoadSafe360 - Intelligent Driver Demerit & Road Safety Management System',
  description: 'Enterprise-grade road safety management platform for traffic authorities, police officers, and drivers.',
  icons: { icon: '/icon.jpg', apple: '/icon.jpg' },
  appleWebApp: { capable: true, title: 'RoadSafe360', statusBarStyle: 'default' },
  other: { 'mobile-web-app-capable': 'yes' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
