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

interface SidebarProps { open: boolean; onClose: () => void; }

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { role, logout, profile } = useAuth();
  const links = role ? navLinks[role] || [] : [];

  const handleNav = () => { if (window.innerWidth < 1024) onClose(); };

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside className={cn(
        'fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-white transition-all duration-300 ease-in-out dark:bg-zinc-950 lg:z-40 lg:translate-x-0',
        'border-r border-zinc-200 dark:border-zinc-800',
        open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#BB2020] to-[#8B0000] text-white shadow-sm shadow-red-900/20">
              <FiShield size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">RoadSafe360</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">{role || 'Portal'}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors lg:hidden">
            <FiX size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link key={link.href} href={link.href} onClick={handleNav}
                className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-[#BB2020]/10 to-transparent text-[#BB2020] dark:from-[#BB2020]/20 dark:to-transparent dark:text-[#FF4444]'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50'
                )}>
                <Icon size={18} className={isActive ? 'text-[#BB2020] dark:text-[#FF4444]' : ''} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-400 dark:from-zinc-600 dark:to-zinc-700 flex items-center justify-center text-sm font-medium text-white shrink-0 shadow-sm">
              {profile?.displayName?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate text-zinc-800 dark:text-zinc-200">{profile?.displayName || 'User'}</p>
              <p className="text-xs text-zinc-500 truncate">{profile?.email || ''}</p>
            </div>
          </div>
          <button onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-all duration-200">
            <FiLogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
