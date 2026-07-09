'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCollection } from '@/hooks/useFirestore';
import { FiMapPin } from 'react-icons/fi';

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
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold">Regions</h1>
        <p className="text-zinc-500 text-sm">Regional road safety statistics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {regionData.map((r) => (
          <Card key={r.code}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <Badge variant="outline" className="mt-1">{r.code}</Badge>
                </div>
                <FiMapPin className="text-zinc-400" size={20} />
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-zinc-500">Drivers</span><span className="font-medium">{r.drivers.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Offences</span><span className="font-medium">{r.offences}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Stations</span><span className="font-medium">{r.stations}</span></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Regional Map View</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[400px] rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
            <div className="text-center">
              <FiMapPin className="mx-auto mb-2" size={32} />
              <p className="text-sm">Interactive map integration (Leaflet/Google Maps)</p>
              <p className="text-xs mt-1">Configure API key in .env to enable</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}