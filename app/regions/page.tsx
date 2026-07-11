'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCollection } from '@/hooks/useFirestore';
import { FiMapPin, FiUsers, FiAlertTriangle, FiHome } from 'react-icons/fi';

const regionData = [
  { name: 'Nairobi', code: 'NRB', drivers: 1250, offences: 342, stations: 12 },
  { name: 'Mombasa', code: 'MSA', drivers: 680, offences: 198, stations: 8 },
  { name: 'Kisumu', code: 'KSM', drivers: 420, offences: 112, stations: 5 },
  { name: 'Nakuru', code: 'NKR', drivers: 380, offences: 95, stations: 4 },
  { name: 'Eldoret', code: 'ELD', drivers: 310, offences: 78, stations: 4 },
  { name: 'Thika', code: 'THK', drivers: 280, offences: 65, stations: 3 },
  { name: 'Machakos', code: 'MKS', drivers: 220, offences: 52, stations: 3 },
  { name: 'Nyeri', code: 'NYR', drivers: 180, offences: 41, stations: 3 },
];

export default function RegionsPage() {
  return (
    <div className="space-y-6 py-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Regions</h1>
        <p className="text-zinc-500 text-sm">Regional road safety statistics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {regionData.map((r, i) => (
          <Card key={r.code} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">{r.name}</p>
                  <Badge variant="outline" className="mt-1 font-mono">{r.code}</Badge>
                </div>
                <div className="h-9 w-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <FiMapPin className="text-zinc-500" size={18} />
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2 text-zinc-500"><FiUsers size={14} /> Drivers</div>
                  <span className="font-semibold">{r.drivers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2 text-zinc-500"><FiAlertTriangle size={14} /> Offences</div>
                  <span className="font-semibold">{r.offences}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2 text-zinc-500"><FiHome size={14} /> Stations</div>
                  <span className="font-semibold">{r.stations}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Regional Map View</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[400px] rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center text-zinc-400 border border-zinc-200 dark:border-zinc-700">
            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center mx-auto mb-3">
                <FiMapPin className="text-zinc-500" size={28} />
              </div>
              <p className="text-sm font-medium">Interactive Map</p>
              <p className="text-xs mt-1 text-zinc-400">Configure API key in .env to enable</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
