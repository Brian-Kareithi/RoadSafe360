'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCollection } from '@/hooks/useFirestore';
import { formatDateTime } from '@/lib/format';
import { FiSearch, FiAlertTriangle, FiUser, FiMapPin, FiClock, FiArrowRight, FiPlus } from 'react-icons/fi';
import Link from 'next/link';
import { useState } from 'react';

export default function PoliceDashboard() {
  const { data: offences } = useCollection('offences');
  const { data: appeals } = useCollection('appeals');
  const [search, setSearch] = useState('');

  const today = new Date().toISOString().slice(0, 10);
  const todayCases = offences.filter((o: any) => o.timestamp?.startsWith(today)).length;
  const issuedToday = offences.filter((o: any) => o.timestamp?.startsWith(today) && o.status === 'issued').length;
  const pendingAppeals = appeals.filter((a: any) => a.status === 'submitted' || a.status === 'under_review').length;

  const recentOffences = [...offences].sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 6);

  const stats = [
    { label: "Today's Cases", value: todayCases, icon: FiClock, color: 'bg-blue-500' },
    { label: 'Issued Today', value: issuedToday, icon: FiAlertTriangle, color: 'bg-amber-500' },
    { label: 'Pending Appeals', value: pendingAppeals, icon: FiUser, color: 'bg-purple-500' },
    { label: 'Total Offences', value: offences.length, icon: FiMapPin, color: 'bg-slate-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Police Dashboard</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Traffic Enforcement Portal</p>
        </div>
        <Link href="/offences/new">
          <Button className="gap-2"><FiPlus size={16} /> Issue Offence</Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-light)]" size={16} />
        <Input placeholder="Search driver by name, licence, or ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-11" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className={`h-1 ${s.color}`} />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">{s.label}</p>
                    <p className="text-3xl font-bold mt-1.5 text-[var(--text)] animate-count-up" style={{ animationDelay: `${i * 60 + 100}ms` }}>{s.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-xl ${s.color} flex items-center justify-center`}>
                    <Icon className="text-white" size={22} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="animate-fade-in-up stagger-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Offences</CardTitle>
          <Link href="/offences" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1 font-semibold">View All <FiArrowRight size={14} /></Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {recentOffences.map((o: any, i: number) => (
              <div key={o.id} className="flex items-center justify-between py-3.5 border-b border-[var(--border-light)] last:border-0 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div>
                  <p className="text-sm font-semibold text-[var(--text)]">Offence {o.id?.slice(0, 8)}...</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{o.notes || 'Traffic violation'} &middot; {o.pointsDeducted} pts</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="text-xs text-[var(--text-light)]">{formatDateTime(o.timestamp)}</span>
                  <Badge variant={o.status === 'issued' ? 'warning' : o.status === 'paid' ? 'success' : 'default'}>{o.status}</Badge>
                </div>
              </div>
            ))}
            {recentOffences.length === 0 && <p className="text-sm text-[var(--text-muted)] py-6 text-center">No offences recorded yet</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
