'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { FiGrid, FiUsers, FiAlertTriangle, FiFileText, FiBarChart2, FiSettings, FiLogOut, FiMapPin, FiBell, FiSearch, FiX, FiChevronLeft, FiHome, FiShield } from 'react-icons/fi';

const navLinks: Record<string, { label: string; href: string; icon: React.ComponentType<{ size?: number }> }[]> = {
  admin: [
    { label: 'Dashboard', href: '/dashboard/admin', icon: FiGrid },
    { label: 'Drivers', href: '/drivers', icon: FiUsers },
    { label: 'Offences', href: '/offences', icon: FiAlertTriangle },
    { label: 'Appeals', href: '/appeals', icon: FiFileText },
    { label: 'Reports', href: '/reports', icon: FiBarChart2 },
    { label: 'Analytics', href: '/analytics', icon: FiMapPin },
    { label: 'Settings', href: '/settings', icon: FiSettings },
  ],
  police: [
    { label: 'Dashboard', href: '/dashboard/police', icon: FiGrid },
    { label: 'Issue Offence', href: '/offences/new', icon: FiAlertTriangle },
    { label: 'Driver Lookup', href: '/drivers', icon: FiSearch },
    { label: 'Notifications', href: '/notifications', icon: FiBell },
  ],
  driver: [
    { label: 'Dashboard', href: '/dashboard/driver', icon: FiGrid },
    { label: 'My Offences', href: '/offences', icon: FiAlertTriangle },
    { label: 'Appeals', href: '/appeals', icon: FiFileText },
    { label: 'Digital Licence', href: '/licence', icon: FiShield },
    { label: 'Notifications', href: '/notifications', icon: FiBell },
  ],
  authority: [
    { label: 'Dashboard', href: '/dashboard/authority', icon: FiGrid },
    { label: 'Reports', href: '/reports', icon: FiBarChart2 },
    { label: 'Analytics', href: '/analytics', icon: FiMapPin },
    { label: 'Regions', href: '/regions', icon: FiMapPin },
  ],
};

interface SidebarProps { open: boolean; onClose: () => void; }

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { role, logout, profile } = useAuth();
  const links = role ? navLinks[role] || [] : [];

  const handleNav = () => { if (window.innerWidth < 1024) onClose(); };

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside className={cn(
        'fixed left-0 top-0 z-50 flex h-screen flex-col bg-[var(--sidebar-bg)] transition-all duration-300 ease-in-out lg:z-40 lg:translate-x-0',
        'border-r border-[var(--sidebar-border)]',
        open ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
        'w-[var(--sidebar-width)]'
      )}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--sidebar-border)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--sidebar-bg)] shadow-sm overflow-hidden ring-1 ring-[var(--sidebar-border)]">
              <img src="/logo.png" alt="RoadSafe360" className="h-full w-full object-contain p-1" />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--text)]">RoadSafe360</p>
              <p className="text-xs text-[var(--sidebar-muted)] capitalize">{role || 'Portal'}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] transition-colors lg:hidden">
            <FiX size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link key={link.href} href={link.href} onClick={handleNav}
                className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-[var(--sidebar-active)] text-[var(--sidebar-active-fg)]'
                    : 'text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--text)]'
                )}>
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[var(--sidebar-border)] p-4">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="h-8 w-8 rounded-full bg-[var(--bg-muted)] flex items-center justify-center text-sm font-semibold text-[var(--text-muted)] shrink-0">
              {profile?.displayName?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate text-[var(--text)]">{profile?.displayName || 'User'}</p>
              <p className="text-xs text-[var(--sidebar-muted)] truncate">{profile?.email || ''}</p>
            </div>
          </div>
          <button onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--sidebar-muted)] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-all duration-200">
            <FiLogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
