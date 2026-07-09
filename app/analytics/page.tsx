'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection } from '@/hooks/useFirestore';
import { formatCurrency } from '@/lib/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

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
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-zinc-500 text-sm">Data-driven insights and interactive charts</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-5"><p className="text-sm text-zinc-500">Total Offences</p><p className="text-2xl font-bold">{offences.length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-zinc-500">Avg Points Deducted</p><p className="text-2xl font-bold">{avgPoints}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-zinc-500">Total Revenue</p><p className="text-2xl font-bold">{formatCurrency(offences.reduce((s: number, o: any) => s + (o.fineAmount || 0), 0))}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-zinc-500">Total Drivers</p><p className="text-2xl font-bold">{drivers.length}</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Monthly Offence Trends</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#a1a1aa" />
                <YAxis tick={{ fontSize: 12 }} stroke="#a1a1aa" />
                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                <Line type="monotone" dataKey="offences" stroke="#18181b" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Revenue Trends</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#a1a1aa" />
                <YAxis tick={{ fontSize: 12 }} stroke="#a1a1aa" />
                <Tooltip contentStyle={{ borderRadius: '8px' }} formatter={(v: any) => formatCurrency(Number(v))} />
                <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Licence Status Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={90} paddingAngle={3} dataKey="value" label>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Driver Risk Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={riskDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#a1a1aa" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} stroke="#a1a1aa" width={120} />
                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}