'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCollection } from '@/hooks/useFirestore';
import { formatDateTime } from '@/lib/format';
import { FiBell, FiCheck, FiMail, FiMessageSquare, FiSmartphone, FiInbox } from 'react-icons/fi';
import toast from 'react-hot-toast';

const typeIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  email: FiMail, sms: FiMessageSquare, push: FiSmartphone, in_app: FiBell,
};

export default function NotificationsPage() {
  const { data: notifications } = useCollection('notifications');
  const sorted = [...notifications].sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const markAllRead = async () => {
    try {
      const { updateDocument } = await import('@/hooks/useFirestore');
      for (const n of notifications) { await updateDocument('notifications', n.id, { isRead: true }); }
      toast.success('All marked as read');
    } catch (err: any) { toast.error(err.message); }
  };

  const getTypeBadge = (type: string) => {
    const map: Record<string, 'default' | 'warning' | 'secondary' | 'outline'> = {
      email: 'default',
      sms: 'warning',
      push: 'secondary',
      in_app: 'outline',
    };
    return map[type] || 'outline';
  };

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Notifications</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">{notifications.filter((n: any) => !n.isRead).length} unread</p>
        </div>
        <Button variant="outline" onClick={markAllRead} className="gap-2"><FiCheck size={16} /> Mark All Read</Button>
      </div>

      <div className="space-y-2">
        {sorted.map((n: any, i: number) => {
          const Icon = typeIcons[n.type] || FiBell;
          return (
            <Card key={n.id}
              className={`transition-all duration-200 animate-fade-in-up ${!n.isRead ? 'border-l-4 border-l-[var(--primary)] shadow-md' : ''}`}
              style={{ animationDelay: `${i * 30}ms` }}>
              <CardContent className="p-5 flex items-start gap-4">
                <div className={`mt-0.5 p-2.5 rounded-xl ${n.isRead ? 'bg-[var(--bg-muted)]' : 'bg-[var(--primary)]/10'}`}>
                  <Icon size={16} className={n.isRead ? 'text-[var(--text-muted)]' : 'text-[var(--primary)]'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`text-sm ${n.isRead ? 'text-[var(--text-muted)]' : 'font-bold text-[var(--text)]'}`}>
                        {n.title || 'Notification'}
                      </p>
                      <p className="text-sm text-[var(--text-muted)] mt-0.5">{n.message}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-[var(--text-light)]">{formatDateTime(n.timestamp)}</span>
                      <Badge variant={getTypeBadge(n.type)} className="text-[10px]">{n.type}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {sorted.length === 0 && (
          <Card><CardContent className="p-16 text-center text-[var(--text-muted)]"><FiInbox className="mx-auto mb-3" size={36} /><p className="font-semibold">No notifications yet</p></CardContent></Card>
        )}
      </div>
    </div>
  );
}
