'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { useCollection } from '@/hooks/useFirestore';
import { formatCurrency } from '@/lib/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { FiTrendingUp, FiDollarSign, FiUsers, FiActivity, FiDownload, FiFilter } from 'react-icons/fi';

const COLORS = ['var(--primary)', 'var(--secondary)', 'var(--danger)', 'var(--warning)', 'var(--success)', 'var(--accent)'];

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

  const stats = [
    { label: 'Total Offences', value: offences.length, icon: FiActivity, color: 'bg-[var(--primary)]' },
    { label: 'Avg Points Deducted', value: avgPoints, icon: FiTrendingUp, color: 'bg-[var(--secondary)]' },
    { label: 'Total Revenue', value: formatCurrency(offences.reduce((s: number, o: any) => s + (o.fineAmount || 0), 0)), icon: FiDollarSign, color: 'bg-[var(--success)]' },
    { label: 'Total Drivers', value: drivers.length, icon: FiUsers, color: 'bg-[var(--accent)]' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Analytics</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Data-driven insights and interactive charts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><FiFilter size={14} /> Filter</Button>
          <Button variant="outline" size="sm" className="gap-2"><FiDownload size={14} /> Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
                  <Icon className="text-white" size={22} />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-muted)]">{s.label}</p>
                  <p className="text-2xl font-bold text-[var(--text)] tracking-tight animate-count-up" style={{ animationDelay: `${i * 60 + 100}ms` }}>{s.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-fade-in-up stagger-1">
          <CardHeader><CardTitle className="text-base">Monthly Offence Trends</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" strokeOpacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)', fontSize: '13px', boxShadow: 'var(--shadow-card-hover)' }} />
                <Line type="monotone" dataKey="offences" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 5, fill: 'var(--primary)', strokeWidth: 2, stroke: 'var(--bg-card)' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up stagger-2">
          <CardHeader><CardTitle className="text-base">Revenue Trends</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" strokeOpacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)', fontSize: '13px', boxShadow: 'var(--shadow-card-hover)' }} formatter={(v: any) => formatCurrency(Number(v))} />
                <Bar dataKey="revenue" fill="var(--success)" radius={[8, 8, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up stagger-3">
          <CardHeader><CardTitle className="text-base">Licence Status Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)', fontSize: '13px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up stagger-3">
          <CardHeader><CardTitle className="text-base">Driver Risk Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={riskDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" strokeOpacity={0.5} />
                <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} width={120} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)', fontSize: '13px' }} />
                <Bar dataKey="value" fill="var(--danger)" radius={[0, 8, 8, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
