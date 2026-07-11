'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection } from '@/hooks/useFirestore';
import { formatCurrency } from '@/lib/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { FiTrendingUp, FiDollarSign, FiUsers, FiActivity } from 'react-icons/fi';

const COLORS = ['#18181b', '#3b82f6', '#ef4444', '#f59e0b', '#22c55e', '#8b5cf6'];

export default function AnalyticsPage() {
  const { data: offences } = useCollection('offences');
  const { data: drivers } = useCollection('drivers');
  const { data: licences } = useCollection('licences');

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, '0');
    const count = offences.filter((o: any) => o.timestamp?.slice(0, 7) === `2026-${month}`).length;
    const rev = offences.filter((o: any) => o.timestamp?.slice(0, 7) === `2026-${month}`).reduce((s: number, o: any) => s + (o.fineAmount || 0), 0);
    return { name: new Date(2026, i).toLocaleString('en', { month: 'short' }), offences: count, revenue: rev };
  });

  const statusData = [
    { name: 'Active', value: licences.filter((l: any) => l.status === 'active').length },
    { name: 'Suspended', value: licences.filter((l: any) => l.status === 'suspended').length },
    { name: 'Revoked', value: licences.filter((l: any) => l.status === 'revoked').length },
    { name: 'Expired', value: licences.filter((l: any) => l.status === 'expired').length },
  ];

  const riskDistribution = [
    { name: 'Low (0-30%)', value: drivers.filter((d: any) => (d.riskScore || 0) < 0.3).length },
    { name: 'Medium (30-60%)', value: drivers.filter((d: any) => (d.riskScore || 0) >= 0.3 && (d.riskScore || 0) < 0.6).length },
    { name: 'High (60-100%)', value: drivers.filter((d: any) => (d.riskScore || 0) >= 0.6).length },
  ];

  const avgPoints = offences.length > 0 ? (offences.reduce((s: number, o: any) => s + (o.pointsDeducted || 0), 0) / offences.length).toFixed(1) : '0';

  return (
    <div className="space-y-6 py-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-zinc-500 text-sm">Data-driven insights and interactive charts</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-5 flex items-center gap-4"><div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"><FiActivity className="text-zinc-600 dark:text-zinc-400" size={20} /></div><div><p className="text-sm text-zinc-500">Total Offences</p><p className="text-2xl font-bold tracking-tight">{offences.length}</p></div></CardContent></Card>
        <Card><CardContent className="p-5 flex items-center gap-4"><div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"><FiTrendingUp className="text-zinc-600 dark:text-zinc-400" size={20} /></div><div><p className="text-sm text-zinc-500">Avg Points Deducted</p><p className="text-2xl font-bold tracking-tight">{avgPoints}</p></div></CardContent></Card>
        <Card><CardContent className="p-5 flex items-center gap-4"><div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center"><FiDollarSign className="text-emerald-600 dark:text-emerald-400" size={20} /></div><div><p className="text-sm text-zinc-500">Total Revenue</p><p className="text-2xl font-bold tracking-tight">{formatCurrency(offences.reduce((s: number, o: any) => s + (o.fineAmount || 0), 0))}</p></div></CardContent></Card>
        <Card><CardContent className="p-5 flex items-center gap-4"><div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center"><FiUsers className="text-blue-600 dark:text-blue-400" size={20} /></div><div><p className="text-sm text-zinc-500">Total Drivers</p><p className="text-2xl font-bold tracking-tight">{drivers.length}</p></div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Monthly Offence Trends</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" strokeOpacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#a1a1aa" axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} stroke="#a1a1aa" axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e4e4e7', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                <Line type="monotone" dataKey="offences" stroke="#18181b" strokeWidth={2} dot={{ r: 4, fill: '#18181b' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Revenue Trends</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" strokeOpacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#a1a1aa" axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} stroke="#a1a1aa" axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e4e4e7', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} formatter={(v: any) => formatCurrency(Number(v))} />
                <Bar dataKey="revenue" fill="#22c55e" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Licence Status Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e4e4e7' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Driver Risk Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={riskDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" strokeOpacity={0.5} />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#a1a1aa" axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} stroke="#a1a1aa" width={120} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e4e4e7' }} />
                <Bar dataKey="value" fill="#ef4444" radius={[0, 6, 6, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
