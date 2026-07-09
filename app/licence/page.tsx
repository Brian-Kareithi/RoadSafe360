'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCollection } from '@/hooks/useFirestore';
import { formatDate } from '@/lib/format';
import { FiShield, FiDownload, FiPrinter, FiCamera } from 'react-icons/fi';
import QRCode from 'react-qr-code';
import toast from 'react-hot-toast';

export default function DigitalLicencePage() {
  const { data: drivers } = useCollection('drivers');
  const { data: licences } = useCollection('licences');
  const driver = drivers[0] as any;
  const licence = licences.find((l: any) => l.driverId === driver?.id) as any;

  if (!driver || !licence) {
    return (
      <div className="py-6 max-w-2xl mx-auto">
        <Card><CardContent className="p-12 text-center text-zinc-400">No driver or licence data found. Please seed the database.</CardContent></Card>
      </div>
    );
  }

  const qrValue = JSON.stringify({ licence: licence.licenceNumber, driver: driver.nationalID, status: licence.status });

  return (
    <div className="py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Digital Driver Licence</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={() => toast.success('Licence downloaded')}><FiDownload size={14} /> Save</Button>
          <Button variant="outline" size="sm" className="gap-1" onClick={() => toast.success('Sending to printer')}><FiPrinter size={14} /></Button>
        </div>
      </div>

      <Card className="overflow-hidden border-2">
        <div className="bg-zinc-900 text-white p-6 dark:bg-zinc-50 dark:text-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiShield size={20} />
              <span className="font-bold text-sm">ROADSAFE360</span>
            </div>
            <span className="text-xs opacity-70">Digital Licence</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-zinc-600 dark:bg-zinc-300 flex items-center justify-center text-2xl font-bold">
              {driver.fullName?.charAt(0) || 'D'}
            </div>
            <div>
              <p className="text-lg font-bold">{driver.fullName || 'N/A'}</p>
              <p className="text-sm opacity-80">ID: {driver.nationalID || 'N/A'}</p>
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-zinc-400">Licence No.</span><p className="font-semibold">{licence.licenceNumber || 'N/A'}</p></div>
            <div><span className="text-zinc-400">Class</span><p className="font-semibold">{licence.licenceClass || 'N/A'}</p></div>
            <div><span className="text-zinc-400">Issue Date</span><p className="font-semibold">{licence.issueDate ? formatDate(licence.issueDate) : 'N/A'}</p></div>
            <div><span className="text-zinc-400">Expiry Date</span><p className="font-semibold">{licence.expiryDate ? formatDate(licence.expiryDate) : 'N/A'}</p></div>
            <div><span className="text-zinc-400">Demerit Points</span><p className="font-semibold">{driver.pointsBalance}/20</p></div>
            <div><span className="text-zinc-400">Blood Group</span><p className="font-semibold">{driver.bloodGroup || 'N/A'}</p></div>
            <div><span className="text-zinc-400">Emergency Contact</span><p className="font-semibold">{driver.emergencyContact || 'N/A'}</p></div>
            <div><span className="text-zinc-400">Status</span><p><Badge variant={licence.status === 'active' ? 'success' : 'destructive'}>{licence.status}</Badge></p></div>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4 flex flex-col items-center gap-3">
            <p className="text-xs text-zinc-400 font-medium">Verification QR Code</p>
            <div className="bg-white p-3 rounded-lg">
              <QRCode value={qrValue} size={140} />
            </div>
            <p className="text-xs text-zinc-400">Scan to verify licence authenticity</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
