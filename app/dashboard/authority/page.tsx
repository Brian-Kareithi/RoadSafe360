'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection } from '@/hooks/useFirestore';
import { formatCurrency } from '@/lib/format';
import { FiTrendingUp, FiUsers, FiShield, FiDollarSign, FiAlertTriangle, FiBarChart2 } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

const COLORS = ['#18181b', '#3b82f6', '#ef4444', '#f59e0b', '#22c55e'];

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

  return (
    <div className="space-y-6 py-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Road Authority Dashboard</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">National Road Safety KPIs &amp; Analytics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Total Drivers</p>
                <p className="text-2xl font-bold mt-1">{drivers.length}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                <FiUsers className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Suspension Rate</p>
                <p className="text-2xl font-bold mt-1 text-red-600">{suspensionRate}%</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                <FiShield className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Appeal Approval Rate</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{approvalRate}%</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center">
                <FiTrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Total Revenue</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(offences.reduce((s: number, o: any) => s + (o.fineAmount || 0), 0))}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                <FiDollarSign className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Offence Trends</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorOff" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18181b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" strokeOpacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#a1a1aa" axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} stroke="#a1a1aa" axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e4e4e7', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                <Area type="monotone" dataKey="offences" stroke="#18181b" fill="url(#colorOff)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Revenue Trends</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Road Safety KPIs</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Avg Points Per Offence', value: offences.length > 0 ? (offences.reduce((s: number, o: any) => s + (o.pointsDeducted || 0), 0) / offences.length).toFixed(1) : '0' },
              { label: 'Repeat Offenders', value: '12' },
              { label: 'High-Risk Drivers', value: drivers.filter((d: any) => (d.riskScore || 0) >= 0.6).length },
              { label: 'Active Suspensions', value: licences.filter((l: any) => l.status === 'suspended').length },
            ].map((kpi) => (
              <div key={kpi.label} className="flex justify-between items-center py-1.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                <span className="text-sm text-zinc-500">{kpi.label}</span>
                <span className="text-sm font-semibold">{kpi.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Risk Prediction Overview</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-1">
              {drivers.filter((d: any) => (d.riskScore || 0) >= 0.4).slice(0, 5).map((d: any, i: number) => (
                <div key={d.id} className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <div>
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{d.fullName}</p>
                    <p className="text-xs text-zinc-500">{d.nationalID}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500" style={{ width: `${Math.min((d.riskScore || 0) * 100, 100)}%` }} />
                    </div>
                    <span className="text-sm font-semibold w-10 text-right">{((d.riskScore || 0) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
              {drivers.filter((d: any) => (d.riskScore || 0) >= 0.4).length === 0 && <p className="text-sm text-zinc-400 py-4 text-center">No high-risk drivers identified</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
