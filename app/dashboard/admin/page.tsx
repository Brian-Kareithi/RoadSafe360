'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCollection } from '@/hooks/useFirestore';
import { formatCurrency, formatDateTime, getStatusColor, getRiskLabel, getRiskColor } from '@/lib/format';
import { FiUsers, FiShield, FiAlertTriangle, FiDollarSign, FiActivity, FiMapPin, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['var(--primary)', 'var(--secondary)', 'var(--danger)', 'var(--warning)', 'var(--success)'];

export default function AdminDashboard() {
  const { data: drivers } = useCollection('drivers');
  const { data: licences } = useCollection('licences');
  const { data: offences } = useCollection('offences');
  const { data: officers } = useCollection('policeOfficers');
  const { data: appeals } = useCollection('appeals');

  const suspended = drivers.filter((d: any) => d.status === 'suspended').length;
  const revoked = drivers.filter((d: any) => d.status === 'revoked').length;
  const todayOffences = offences.filter((o: any) => o.timestamp?.startsWith(new Date().toISOString().slice(0, 10))).length;
  const revenue = offences.reduce((sum: number, o: any) => sum + (o.fineAmount || 0), 0);
  const highRisk = drivers.filter((d: any) => (d.riskScore || 0) >= 0.6).length;

  const monthlyOffences = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, '0');
    const count = offences.filter((o: any) => o.timestamp?.slice(0, 7) === `2026-${month}`).length;
    return { name: new Date(2026, i).toLocaleString('en', { month: 'short' }), offences: count };
  });

  const severityData = [
    { name: 'Minor', value: offences.filter((o: any) => o.pointsDeducted <= 2).length },
    { name: 'Moderate', value: offences.filter((o: any) => o.pointsDeducted > 2 && o.pointsDeducted <= 5).length },
    { name: 'Serious', value: offences.filter((o: any) => o.pointsDeducted > 5).length },
  ];

  const recentActivity = [...offences].sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

  const stats = [
    { label: 'Total Drivers', value: drivers.length, icon: FiUsers, trend: '+12%', trendUp: true, color: 'bg-blue-500' },
    { label: 'Total Revenue', value: formatCurrency(revenue), icon: FiDollarSign, trend: '+8.3%', trendUp: true, color: 'bg-emerald-500' },
    { label: 'Active Licences', value: licences.filter((l: any) => l.status === 'active').length, icon: FiShield, trend: '+3.1%', trendUp: true, color: 'bg-cyan-500' },
    { label: 'High-Risk Drivers', value: highRisk, icon: FiAlertTriangle, trend: '-2.4%', trendUp: false, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Admin Dashboard</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">National Road Safety Overview</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Live
        </div>
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
                      {s.trend} vs last month
                    </div>
                  </div>
                  <div className={`h-12 w-12 rounded-xl ${s.color.replace('bg-', 'bg-').replace('500', '100')} dark:${s.color.replace('bg-', 'bg-').replace('500', '900/30')} flex items-center justify-center shrink-0`}>
                    <Icon className={`text-white`} size={22} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-fade-in-up stagger-1">
          <CardHeader>
            <CardTitle className="text-base">Monthly Offences</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyOffences}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" strokeOpacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)', fontSize: '13px', boxShadow: 'var(--shadow-card-hover)' }} />
                <Bar dataKey="offences" fill="var(--primary)" radius={[8, 8, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up stagger-2">
          <CardHeader>
            <CardTitle className="text-base">Offence Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={severityData} cx="50%" cy="50%" innerRadius={65} outerRadius={110} paddingAngle={5} dataKey="value">
                  {severityData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)', fontSize: '13px', boxShadow: 'var(--shadow-card-hover)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {severityData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-[var(--text-muted)]">{d.name} <span className="font-semibold text-[var(--text)]">({d.value})</span></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="animate-fade-in-up stagger-3">
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {recentActivity.map((o: any, i: number) => (
              <div key={o.id} className="flex items-center justify-between py-3.5 border-b border-[var(--border-light)] last:border-0 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center dark:bg-rose-900/20">
                    <FiAlertTriangle size={15} className="text-rose-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">Offence Issued</p>
                    <p className="text-xs text-[var(--text-muted)]">{o.notes || 'Traffic violation recorded'}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="text-xs text-[var(--text-light)]">{formatDateTime(o.timestamp)}</span>
                  <Badge variant={o.status === 'issued' ? 'warning' : o.status === 'paid' ? 'success' : 'default'}>{o.status}</Badge>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && <p className="text-sm text-[var(--text-muted)] py-6 text-center">No recent activity</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
