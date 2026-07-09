'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCollection } from '@/hooks/useFirestore';
import { formatCurrency, formatDateTime, getDemeritStatus } from '@/lib/format';
import { FiShield, FiAlertTriangle, FiFileText, FiBell, FiDownload, FiClock, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

export default function DriverDashboard() {
  const { data: offences } = useCollection('offences');
  const { data: appeals } = useCollection('appeals');
  const { data: notifications } = useCollection('notifications');
  const { data: drivers } = useCollection('drivers');

  const driver = drivers[0] as any;
  const balance = driver?.pointsBalance ?? 20;
  const status = getDemeritStatus(balance);
  const driverOffences = offences.filter((o: any) => o.driverId === driver?.id);
  const driverAppeals = appeals.filter((a: any) => a.driverId === driver?.id);
  const unreadNotifs = notifications.filter((n: any) => !n.isRead);

  const pointsUsed = 20 - balance;
  const pointsSafe = balance;

  const pieData = [
    { name: 'Remaining', value: pointsSafe },
    { name: 'Used', value: pointsUsed },
  ];

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Welcome back, {driver?.fullName || 'Driver'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-base">Demerit Points</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" startAngle={90} endAngle={-270}>
                    {pieData.map((_, i) => <Cell key={i} fill={i === 0 ? '#22c55e' : '#ef4444'} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold">{balance}</p>
                  <p className="text-xs text-zinc-500">of 20 points</p>
                </div>
              </div>
            </div>
            <div className={`mt-2 text-lg font-semibold ${status.color}`}>{status.label}</div>
            <div className="mt-4 w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span>Licence Status</span>
                <Badge variant={driver?.status === 'active' ? 'success' : 'destructive'}>{driver?.status || 'Unknown'}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Risk Score</span>
                <span className="font-medium">{driver?.riskScore != null ? `${(driver.riskScore * 100).toFixed(0)}%` : 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Offences</CardTitle>
            <Link href="/offences"><Button variant="ghost" size="sm">View All <FiArrowRight size={14} /></Button></Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {driverOffences.slice(0, 4).map((o: any) => (
                <div key={o.id} className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <FiAlertTriangle size={14} className="text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{o.notes || 'Traffic Offence'}</p>
                      <p className="text-xs text-zinc-500">{o.pointsDeducted} points deducted &middot; {formatCurrency(o.fineAmount)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-400">{formatDateTime(o.timestamp)}</p>
                    <Badge variant={o.status === 'paid' ? 'success' : 'warning'}>{o.status}</Badge>
                  </div>
                </div>
              ))}
              {driverOffences.length === 0 && <p className="text-sm text-zinc-400">No offences recorded</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FiFileText className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Active Appeals</p>
              <p className="text-xl font-bold">{driverAppeals.filter(a => a.status !== 'rejected' && a.status !== 'approved').length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <FiBell className="text-orange-600 dark:text-orange-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Notifications</p>
              <p className="text-xl font-bold">{unreadNotifs.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <FiDownload className="text-emerald-600 dark:text-emerald-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Digital Licence</p>
              <Link href="/licence" className="text-sm font-medium text-blue-600 hover:underline">Download</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}