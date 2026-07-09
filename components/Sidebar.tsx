'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { FiShield, FiGrid, FiUsers, FiAlertTriangle, FiFileText, FiBarChart2, FiSettings, FiLogOut, FiMapPin, FiBell, FiSearch, FiX } from 'react-icons/fi';

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

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { role, logout, profile } = useAuth();
  const links = role ? navLinks[role] || [] : [];

  const handleNav = () => { if (window.innerWidth < 1024) onClose(); };

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}

      <aside className={cn(
        'fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-white transition-transform duration-300 ease-in-out dark:bg-zinc-950 lg:z-40 lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#BB2020] text-white shadow-sm">
              <FiShield size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold">RoadSafe360</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Portal'}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 lg:hidden">
            <FiX size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link key={link.href} href={link.href} onClick={handleNav}
                className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#BB2020]/10 text-[#BB2020] dark:bg-[#BB2020]/20 dark:text-[#FF4444]'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50'
                )}>
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-sm font-medium shrink-0">
              {profile?.displayName?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{profile?.displayName || 'User'}</p>
              <p className="text-xs text-zinc-500 truncate">{profile?.email || ''}</p>
            </div>
          </div>
          <button onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 transition-colors">
            <FiLogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
