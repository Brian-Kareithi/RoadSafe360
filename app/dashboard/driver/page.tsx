'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCollection } from '@/hooks/useFirestore';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, formatDateTime, getDemeritStatus } from '@/lib/format';
import { FiShield, FiAlertTriangle, FiFileText, FiBell, FiDownload, FiClock, FiArrowRight, FiUser, FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function DriverDashboard() {
  const { profile } = useAuth();
  const { data: offences } = useCollection('offences');
  const { data: appeals } = useCollection('appeals');
  const { data: notifications } = useCollection('notifications');
  const { data: drivers } = useCollection('drivers');

  const driver = drivers.find((d: any) => d.id === profile?.profileId) || drivers[0] as any;
  const balance = driver?.pointsBalance ?? 20;
  const status = getDemeritStatus(balance);
  const driverOffences = offences.filter((o: any) => o.driverId === driver?.id);
  const driverAppeals = appeals.filter((a: any) => a.driverId === driver?.id);
  const unreadNotifs = notifications.filter((n: any) => !n.isRead);

  const pointsUsed = 20 - balance;

  const pieData = [
    { name: 'Remaining', value: balance },
    { name: 'Used', value: pointsUsed },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">My Dashboard</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">Welcome back, {driver?.fullName || 'Driver'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="text-base">Demerit Points</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-44 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={78} dataKey="value" startAngle={90} endAngle={-270}>
                    <Cell fill={'var(--success)'} />
                    <Cell fill={'var(--danger)'} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[var(--text)]">{balance}</p>
                  <p className="text-xs text-[var(--text-muted)]">of 20 points</p>
                </div>
              </div>
            </div>
            <div className={`mt-3 text-base font-bold ${status.color}`}>{status.label}</div>
            <div className="mt-5 w-full space-y-3">
              <div className="flex justify-between items-center text-sm py-2 border-b border-[var(--border-light)]">
                <span className="text-[var(--text-muted)]">Licence Status</span>
                <Badge variant={driver?.status === 'active' ? 'success' : 'destructive'}>{driver?.status || 'Unknown'}</Badge>
              </div>
              <div className="flex justify-between items-center text-sm py-2">
                <span className="text-[var(--text-muted)]">Risk Score</span>
                <span className="font-semibold text-[var(--text)]">{driver?.riskScore != null ? `${(driver.riskScore * 100).toFixed(0)}%` : 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 animate-fade-in-up stagger-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Offences</CardTitle>
            <Link href="/offences"><Button variant="ghost" size="sm" className="gap-1">View All <FiArrowRight size={14} /></Button></Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {driverOffences.slice(0, 5).map((o: any, i: number) => (
                <div key={o.id} className="flex items-center justify-between py-3.5 border-b border-[var(--border-light)] last:border-0 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex items-center gap-3.5">
                    <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center dark:bg-rose-900/20">
                      <FiAlertTriangle size={15} className="text-rose-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text)]">{o.notes || 'Traffic Offence'}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{o.pointsDeducted} points deducted &middot; {formatCurrency(o.fineAmount)}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className="text-xs text-[var(--text-light)]">{formatDateTime(o.timestamp)}</span>
                    <Badge variant={o.status === 'paid' ? 'success' : 'warning'}>{o.status}</Badge>
                  </div>
                </div>
              ))}
              {driverOffences.length === 0 && <p className="text-sm text-[var(--text-muted)] py-6 text-center">No offences recorded</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="animate-fade-in-up stagger-1">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center dark:bg-blue-900/20">
              <FiFileText className="text-blue-500" size={22} />
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)]">Active Appeals</p>
              <p className="text-xl font-bold text-[var(--text)]">{driverAppeals.filter(a => a.status !== 'rejected' && a.status !== 'approved').length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up stagger-2">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center dark:bg-amber-900/20">
              <FiBell className="text-amber-500" size={22} />
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)]">Notifications</p>
              <p className="text-xl font-bold text-[var(--text)]">{unreadNotifs.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up stagger-3">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center dark:bg-emerald-900/20">
              <FiDownload className="text-emerald-500" size={22} />
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)]">Digital Licence</p>
              <Link href="/licence" className="text-sm font-semibold text-[var(--primary)] hover:underline">View & Download</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
