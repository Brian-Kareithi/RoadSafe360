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
    <header className="fixed top-0 right-0 left-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--bg-card)]/80 px-4 backdrop-blur-md lg:left-[var(--sidebar-width)]">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle}
          className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--bg-muted)] transition-colors lg:hidden">
          {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
        <h2 className="text-base font-semibold text-[var(--text)] hidden sm:block">
          {pageName}
        </h2>
      </div>
      <div className="flex items-center gap-1">
        <button className="relative rounded-lg p-2.5 text-[var(--text-muted)] hover:bg-[var(--bg-muted)] transition-colors">
          <FiBell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--danger)] animate-pulse-dot ring-2 ring-[var(--bg-card)]" />
        </button>
        <button onClick={toggle}
          className="rounded-lg p-2.5 text-[var(--text-muted)] hover:bg-[var(--bg-muted)] transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
        <div className="ml-2 flex items-center gap-2.5 border-l border-[var(--border)] pl-3">
          <div className="h-8 w-8 rounded-full bg-[var(--bg-muted)] flex items-center justify-center text-xs font-semibold text-[var(--text-muted)] shrink-0">
            {profile?.displayName?.charAt(0) || 'U'}
          </div>
          <span className="text-sm font-medium text-[var(--text)] hidden sm:block">
            {profile?.displayName || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
}
