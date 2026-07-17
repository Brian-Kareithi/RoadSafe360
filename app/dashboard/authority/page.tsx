'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection } from '@/hooks/useFirestore';
import { formatCurrency } from '@/lib/format';
import { FiTrendingUp, FiUsers, FiShield, FiDollarSign, FiAlertTriangle, FiBarChart2, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

const COLORS = ['var(--primary)', 'var(--secondary)', 'var(--danger)', 'var(--warning)', 'var(--success)'];

export default function AuthorityDashboard() {
  const { data: drivers } = useCollection('drivers');
  const { data: licences } = useCollection('licences');
  const { data: offences } = useCollection('offences');
  const { data: appeals } = useCollection('appeals');

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, '0');
    const count = offences.filter((o: any) => o.timestamp?.slice(0, 7) === `2026-${month}`).length;
    const rev = offences.filter((o: any) => o.timestamp?.slice(0, 7) === `2026-${month}`).reduce((s: number, o: any) => s + (o.fineAmount || 0), 0);
    return { name: new Date(2026, i).toLocaleString('en', { month: 'short' }), offences: count, revenue: rev };
  });

  const suspensionRate = licences.length > 0 ? ((licences.filter((l: any) => l.status === 'suspended').length / licences.length) * 100).toFixed(1) : '0';
  const approvalRate = appeals.length > 0 ? ((appeals.filter((a: any) => a.status === 'approved').length / appeals.length) * 100).toFixed(1) : '0';

  const stats = [
    { label: 'Total Drivers', value: drivers.length, icon: FiUsers, color: 'bg-blue-500', trend: '+5.2%', trendUp: true },
    { label: 'Suspension Rate', value: `${suspensionRate}%`, icon: FiShield, color: 'bg-rose-500', trend: '-1.1%', trendUp: true },
    { label: 'Appeal Approval', value: `${approvalRate}%`, icon: FiTrendingUp, color: 'bg-emerald-500', trend: '+2.3%', trendUp: true },
    { label: 'Total Revenue', value: formatCurrency(offences.reduce((s: number, o: any) => s + (o.fineAmount || 0), 0)), icon: FiDollarSign, color: 'bg-cyan-500', trend: '+11.4%', trendUp: true },
  ];

  const kpis = [
    { label: 'Avg Points Per Offence', value: offences.length > 0 ? (offences.reduce((s: number, o: any) => s + (o.pointsDeducted || 0), 0) / offences.length).toFixed(1) : '0' },
    { label: 'Repeat Offenders', value: '12' },
    { label: 'High-Risk Drivers', value: drivers.filter((d: any) => (d.riskScore || 0) >= 0.6).length },
    { label: 'Active Suspensions', value: licences.filter((l: any) => l.status === 'suspended').length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Road Authority Dashboard</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">National Road Safety KPIs &amp; Analytics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="animate-fade-in-up overflow-hidden" style={{ animationDelay: `${i * 60}ms` }}>
              <div className={`h-1 ${s.color}`} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-[var(--text-muted)]">{s.label}</p>
                    <p className="text-3xl font-bold text-[var(--text)] tracking-tight animate-count-up" style={{ animationDelay: `${i * 60 + 100}ms` }}>{s.value}</p>
                    <div className={`flex items-center gap-1 text-xs font-medium ${s.trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
                      {s.trendUp ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
                      {s.trend}
                    </div>
                  </div>
                  <div className={`h-12 w-12 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
                    <Icon className="text-white" size={22} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-fade-in-up stagger-1">
          <CardHeader><CardTitle className="text-base">Offence Trends</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorOff" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" strokeOpacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)', fontSize: '13px', boxShadow: 'var(--shadow-card-hover)' }} />
                <Area type="monotone" dataKey="offences" stroke="var(--primary)" fill="url(#colorOff)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up stagger-2">
          <CardHeader><CardTitle className="text-base">Revenue Trends</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="animate-fade-in-up stagger-3">
          <CardHeader><CardTitle className="text-base">Road Safety KPIs</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="flex justify-between items-center py-2.5 border-b border-[var(--border-light)] last:border-0">
                <span className="text-sm text-[var(--text-muted)]">{kpi.label}</span>
                <span className="text-sm font-bold text-[var(--text)]">{kpi.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 animate-fade-in-up stagger-3">
          <CardHeader><CardTitle className="text-base">Risk Prediction Overview</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-1">
              {drivers.filter((d: any) => (d.riskScore || 0) >= 0.4).slice(0, 5).map((d: any, i: number) => (
                <div key={d.id} className="flex items-center justify-between py-3.5 border-b border-[var(--border-light)] last:border-0 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">{d.fullName}</p>
                    <p className="text-xs text-[var(--text-muted)]">{d.nationalID}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-28 h-2 rounded-full bg-[var(--border)] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.min((d.riskScore || 0) * 100, 100)}%`, background: (d.riskScore || 0) > 0.6 ? 'var(--danger)' : (d.riskScore || 0) > 0.3 ? 'var(--warning)' : 'var(--success)' }} />
                    </div>
                    <span className="text-sm font-bold text-[var(--text)] w-10 text-right">{((d.riskScore || 0) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
              {drivers.filter((d: any) => (d.riskScore || 0) >= 0.4).length === 0 && <p className="text-sm text-[var(--text-muted)] py-6 text-center">No high-risk drivers identified</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
