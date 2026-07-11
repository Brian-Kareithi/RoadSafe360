'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCollection } from '@/hooks/useFirestore';
import { formatDateTime } from '@/lib/format';
import { FiBell, FiCheck, FiMail, FiMessageSquare, FiSmartphone } from 'react-icons/fi';
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

  return (
    <div className="space-y-6 py-6 max-w-3xl animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-zinc-500 text-sm">{notifications.filter((n: any) => !n.isRead).length} unread</p>
        </div>
        <Button variant="outline" onClick={markAllRead} className="gap-2"><FiCheck size={16} /> Mark All Read</Button>
      </div>

      <div className="space-y-2">
        {sorted.map((n: any, i: number) => {
          const Icon = typeIcons[n.type] || FiBell;
          return (
            <Card key={n.id}
              className={`transition-all duration-200 animate-fade-in-up ${!n.isRead ? 'border-l-4 border-l-[#BB2020] dark:border-l-[#FF4444] shadow-sm' : ''}`}
              style={{ animationDelay: `${i * 30}ms` }}>
              <CardContent className="p-4 flex items-start gap-3">
                <div className={`mt-1 p-2 rounded-lg ${n.isRead ? 'bg-zinc-100 dark:bg-zinc-800' : 'bg-[#BB2020]/10 text-[#BB2020] dark:bg-[#FF4444]/20 dark:text-[#FF4444]'}`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm ${n.isRead ? 'text-zinc-600 dark:text-zinc-400' : 'font-semibold text-zinc-800 dark:text-zinc-200'}`}>
                        {n.title || 'Notification'}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">{n.message}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-zinc-400">{formatDateTime(n.timestamp)}</span>
                      <Badge variant={n.type === 'email' ? 'default' : n.type === 'sms' ? 'warning' : n.type === 'push' ? 'secondary' : 'outline'} className="text-[10px]">{n.type}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {sorted.length === 0 && (
          <Card><CardContent className="p-16 text-center text-zinc-400"><FiBell className="mx-auto mb-3" size={32} /><p>No notifications yet</p></CardContent></Card>
        )}
      </div>
    </div>
  );
}
