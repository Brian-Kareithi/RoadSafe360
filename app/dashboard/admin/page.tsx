'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCollection } from '@/hooks/useFirestore';
import { formatCurrency, formatDateTime, getStatusColor, getRiskLabel, getRiskColor } from '@/lib/format';
import { FiUsers, FiShield, FiAlertTriangle, FiDollarSign, FiActivity, FiMapPin } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#18181b', '#3b82f6', '#ef4444', '#f59e0b', '#22c55e'];

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
    { label: 'Total Drivers', value: drivers.length, icon: FiUsers, color: 'text-blue-600' },
    { label: 'Active Licences', value: licences.filter((l: any) => l.status === 'active').length, icon: FiShield, color: 'text-green-600' },
    { label: 'Suspended', value: suspended, icon: FiAlertTriangle, color: 'text-red-600' },
    { label: 'Revoked', value: revoked, icon: FiAlertTriangle, color: 'text-zinc-600' },
    { label: 'Active Officers', value: officers.length, icon: FiUsers, color: 'text-purple-600' },
    { label: "Today's Offences", value: todayOffences, icon: FiActivity, color: 'text-orange-600' },
    { label: 'Monthly Revenue', value: formatCurrency(revenue), icon: FiDollarSign, color: 'text-emerald-600' },
    { label: 'High-Risk Drivers', value: highRisk, icon: FiMapPin, color: 'text-red-600' },
  ];

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">National Road Safety Overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{s.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${s.color} opacity-50`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Monthly Offences</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyOffences}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#a1a1aa" />
                <YAxis tick={{ fontSize: 12 }} stroke="#a1a1aa" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', fontSize: '13px' }} />
                <Bar dataKey="offences" fill="#18181b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Offence Severity Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={severityData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                  {severityData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', fontSize: '13px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-2">
              {severityData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span>{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((o: any) => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <FiAlertTriangle size={14} className="text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Offence Issued</p>
                    <p className="text-xs text-zinc-500">{o.notes || 'No details'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500">{formatDateTime(o.timestamp)}</p>
                  <Badge variant={o.status === 'issued' ? 'warning' : o.status === 'paid' ? 'success' : 'default'}>{o.status}</Badge>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && <p className="text-sm text-zinc-400">No recent activity</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
