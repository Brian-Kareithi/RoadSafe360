'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCollection } from '@/hooks/useFirestore';
import { FiMapPin, FiUsers, FiAlertTriangle, FiHome, FiTrendingUp } from 'react-icons/fi';

const regionData = [
  { name: 'Nairobi', code: 'NRB', drivers: 1250, offences: 342, stations: 12, trend: '+5.2%' },
  { name: 'Mombasa', code: 'MSA', drivers: 680, offences: 198, stations: 8, trend: '+3.8%' },
  { name: 'Kisumu', code: 'KSM', drivers: 420, offences: 112, stations: 5, trend: '+2.1%' },
  { name: 'Nakuru', code: 'NKR', drivers: 380, offences: 95, stations: 4, trend: '+4.5%' },
  { name: 'Eldoret', code: 'ELD', drivers: 310, offences: 78, stations: 4, trend: '+1.9%' },
  { name: 'Thika', code: 'THK', drivers: 280, offences: 65, stations: 3, trend: '+3.2%' },
  { name: 'Machakos', code: 'MKS', drivers: 220, offences: 52, stations: 3, trend: '+2.8%' },
  { name: 'Nyeri', code: 'NYR', drivers: 180, offences: 41, stations: 3, trend: '+1.5%' },
];

export default function RegionsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Regions</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">Regional road safety statistics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {regionData.map((r, i) => (
          <Card key={r.code} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-bold text-[var(--text)] text-lg">{r.name}</p>
                  <Badge variant="outline" className="mt-1.5 font-mono">{r.code}</Badge>
                </div>
                <div className="h-10 w-10 rounded-xl bg-[var(--bg-muted)] flex items-center justify-center">
                  <FiMapPin className="text-[var(--text-muted)]" size={20} />
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-[var(--border-light)]">
                  <div className="flex items-center gap-2 text-[var(--text-muted)]"><FiUsers size={14} /> Drivers</div>
                  <span className="font-bold text-[var(--text)]">{r.drivers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--border-light)]">
                  <div className="flex items-center gap-2 text-[var(--text-muted)]"><FiAlertTriangle size={14} /> Offences</div>
                  <span className="font-bold text-[var(--text)]">{r.offences}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--border-light)]">
                  <div className="flex items-center gap-2 text-[var(--text-muted)]"><FiHome size={14} /> Stations</div>
                  <span className="font-bold text-[var(--text)]">{r.stations}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-[var(--text-muted)]"><FiTrendingUp size={14} /> Trend</div>
                  <span className="font-bold text-emerald-600">{r.trend}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="animate-fade-in-up stagger-1">
        <CardHeader><CardTitle className="text-base">Regional Map View</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[400px] rounded-xl bg-[var(--bg-muted)] flex items-center justify-center text-[var(--text-muted)] border border-[var(--border)]">
            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center mx-auto mb-3 shadow-sm">
                <FiMapPin className="text-[var(--text-muted)]" size={28} />
              </div>
              <p className="text-sm font-semibold text-[var(--text)]">Interactive Map</p>
              <p className="text-xs mt-1 text-[var(--text-light)]">Configure API key in .env to enable</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
