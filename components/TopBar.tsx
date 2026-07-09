'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { FiSun, FiMoon, FiMenu, FiX, FiBell } from 'react-icons/fi';
import { usePathname } from 'next/navigation';

interface TopBarProps {
  onMenuToggle: () => void;
  mobileMenuOpen: boolean;
}

export function TopBar({ onMenuToggle, mobileMenuOpen }: TopBarProps) {
  const { theme, toggle } = useTheme();
  const { profile } = useAuth();
  const pathname = usePathname();

  const pageName = pathname === '/' ? 'Home' 
    : pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Dashboard';

  return (
    <header className="fixed top-0 right-0 left-0 z-30 flex h-14 items-center justify-between border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80 lg:left-64">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 lg:hidden">
          {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
        <h2 className="text-sm font-semibold capitalize text-zinc-900 dark:text-zinc-50 hidden sm:block">
          {pageName}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
          <FiBell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 animate-pulse-dot" />
        </button>
        <button onClick={toggle} className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800" title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
        <div className="ml-2 flex items-center gap-2 border-l border-zinc-200 pl-3 dark:border-zinc-700">
          <div className="h-7 w-7 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-medium">
            {profile?.displayName?.charAt(0) || 'U'}
          </div>
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hidden sm:block">
            {profile?.displayName || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
}
