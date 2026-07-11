'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCollection } from '@/hooks/useFirestore';
import { formatDateTime } from '@/lib/format';
import { FiSearch, FiAlertTriangle, FiUser, FiMapPin, FiClock, FiArrowRight } from 'react-icons/fi';
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

  return (
    <div className="space-y-6 py-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Police Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Traffic Enforcement Portal</p>
        </div>
        <Link href="/offences/new">
          <Button className="gap-2 shadow-sm"><FiAlertTriangle size={16} /> Issue Offence</Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
        <Input placeholder="Search driver by name, licence, or ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 h-10" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Today&apos;s Cases</p>
                <p className="text-2xl font-bold mt-1 text-blue-600">{todayCases}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                <FiClock className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Issued Today</p>
                <p className="text-2xl font-bold mt-1 text-orange-600">{issuedToday}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center">
                <FiAlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Pending Appeals</p>
                <p className="text-2xl font-bold mt-1 text-purple-600">{pendingAppeals}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center">
                <FiUser className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Total Offences</p>
                <p className="text-2xl font-bold mt-1">{offences.length}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <FiMapPin className="h-5 w-5 text-zinc-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Offences</CardTitle>
          <Link href="/offences" className="text-sm text-blue-600 hover:underline flex items-center gap-1 font-medium">View All <FiArrowRight size={14} /></Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {recentOffences.map((o: any, i: number) => (
              <div key={o.id} className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div>
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Offence {o.id?.slice(0, 8)}...</p>
                  <p className="text-xs text-zinc-500">{o.notes || 'Traffic violation'} &middot; {o.pointsDeducted} pts</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="text-xs text-zinc-400">{formatDateTime(o.timestamp)}</span>
                  <Badge variant={o.status === 'issued' ? 'warning' : o.status === 'paid' ? 'success' : 'default'}>{o.status}</Badge>
                </div>
              </div>
            ))}
            {recentOffences.length === 0 && <p className="text-sm text-zinc-400 py-4 text-center">No offences recorded yet</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
