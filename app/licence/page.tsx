'use client';

import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCollection } from '@/hooks/useFirestore';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/lib/format';
import { FiShield, FiDownload, FiPrinter, FiCamera, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import QRCode from 'react-qr-code';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function DigitalLicencePage() {
  const { profile } = useAuth();
  const { data: drivers } = useCollection('drivers');
  const { data: licences } = useCollection('licences');
  const { data: vehicles } = useCollection('vehicles');
  const cardRef = useRef<HTMLDivElement>(null);

  const driver = drivers.find((d: any) => d.id === profile?.profileId) || drivers[0] as any;
  const licence = licences.find((l: any) => l.driverId === driver?.id) as any;
  const driverVehicles = vehicles.filter((v: any) => v.driverId === driver?.id) as any[];

  const isSuspended = licence?.status === 'suspended' || licence?.status === 'revoked';
  const isValid = licence?.status === 'active';

  if (!driver || !licence) {
    return (
      <div className="py-6 max-w-2xl mx-auto">
        <Card><CardContent className="p-12 text-center text-zinc-400">No driver or licence data found in the system.</CardContent></Card>
      </div>
    );
  }

  const qrValue = JSON.stringify({
    type: 'licence',
    reference: licence.licenceNumber,
    ownerId: driver.nationalID,
    ownerName: driver.fullName,
    status: licence.status,
    issuedAt: licence.issueDate,
  });

  const downloadPDF = async () => {
    if (!cardRef.current) return;
    try {
      toast.loading('Generating PDF...');
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [100, 160],
      });
      const imgWidth = 90;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 5, 10, imgWidth, imgHeight);
      pdf.save(`licence-${licence.licenceNumber}.pdf`);
      toast.dismiss();
      toast.success('Licence PDF downloaded');
    } catch {
      toast.dismiss();
      toast.error('Failed to generate PDF');
    }
  };

  const printLicence = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) { toast.error('Please allow popups to print'); return; }
    const statusText = isSuspended ? 'SUSPENDED' : isValid ? 'VALID' : licence?.status?.toUpperCase() || 'UNKNOWN';
    printWindow.document.write(`
      <html><head><title>Driver Licence - ${licence.licenceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; display: flex; justify-content: center; padding: 40px; }
        .card { width: 380px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
        .header { padding: 24px; color: white; }
        .header.valid { background: linear-gradient(135deg, #15803d, #22c55e); }
        .header.suspended { background: linear-gradient(135deg, #991b1b, #ef4444); }
        .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .brand { font-weight: bold; font-size: 13px; }
        .status-badge { background: rgba(255,255,255,0.2); padding: 3px 10px; border-radius: 20px; font-size: 11px; }
        .driver-row { display: flex; align-items: center; gap: 16px; }
        .avatar { width: 64px; height: 64px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; }
        .driver-info .name { font-size: 18px; font-weight: bold; }
        .driver-info .id { font-size: 12px; opacity: 0.8; }
        .body { padding: 20px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px; }
        .label { color: #888; }
        .value { font-weight: 600; color: #111; }
        .footer { text-align: center; padding: 16px; border-top: 1px solid #eee; font-size: 10px; color: #aaa; }
      </style></head><body>
      <div class="card">
        <div class="header ${isSuspended ? 'suspended' : 'valid'}">
          <div class="header-top">
            <div class="brand">ROADSAFE360</div>
            <div class="status-badge">${statusText}</div>
          </div>
          <div class="driver-row">
            <div class="avatar">${driver.fullName?.charAt(0) || 'D'}</div>
            <div class="driver-info">
              <div class="name">${driver.fullName || 'N/A'}</div>
              <div class="id">ID: ${driver.nationalID || 'N/A'}</div>
            </div>
          </div>
        </div>
        <div class="body">
          <div class="grid">
            <div><div class="label">Licence No.</div><div class="value">${licence.licenceNumber || 'N/A'}</div></div>
            <div><div class="label">Class</div><div class="value">${licence.licenceClass || 'N/A'}</div></div>
            <div><div class="label">Issue Date</div><div class="value">${licence.issueDate ? formatDate(licence.issueDate) : 'N/A'}</div></div>
            <div><div class="label">Expiry Date</div><div class="value">${licence.expiryDate ? formatDate(licence.expiryDate) : 'N/A'}</div></div>
            <div><div class="label">Demerit Points</div><div class="value">${driver.pointsBalance}/20</div></div>
            <div><div class="label">Blood Group</div><div class="value">${driver.bloodGroup || 'N/A'}</div></div>
            <div><div class="label">Phone</div><div class="value">${driver.phoneNumber || 'N/A'}</div></div>
            <div><div class="label">Emergency</div><div class="value">${driver.emergencyContact || 'N/A'}</div></div>
          </div>
        </div>
        <div class="footer">Scan QR code on digital licence to verify authenticity</div>
      </div>
      <script>window.print();window.close();</script>
      </body></html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Digital Driver Licence</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={downloadPDF}><FiDownload size={14} /> PDF</Button>
          <Button variant="outline" size="sm" className="gap-1" onClick={printLicence}><FiPrinter size={14} /></Button>
        </div>
      </div>

      <div ref={cardRef}>
        <Card className={`overflow-hidden border-2 ${isSuspended ? 'border-red-500' : 'border-emerald-500'}`}>
          <div className={`p-6 ${isSuspended ? 'bg-gradient-to-r from-red-700 to-red-500' : 'bg-gradient-to-r from-emerald-700 to-emerald-500'} text-white`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FiShield size={20} />
                <span className="font-bold text-sm">ROADSAFE360</span>
              </div>
              <Badge className={`${isSuspended ? 'bg-red-900/50 text-red-100' : 'bg-emerald-900/50 text-emerald-100'} border-0`}>
                {isSuspended ? (
                  <span className="flex items-center gap-1"><FiAlertTriangle size={12} /> SUSPENDED</span>
                ) : isValid ? (
                  <span className="flex items-center gap-1"><FiCheckCircle size={12} /> VALID</span>
                ) : (
                  licence?.status?.toUpperCase()
                )}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold shrink-0">
                {driver.fullName?.charAt(0) || 'D'}
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold truncate">{driver.fullName || 'N/A'}</p>
                <p className="text-sm opacity-80">National ID: {driver.nationalID || 'N/A'}</p>
              </div>
            </div>
          </div>

          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-zinc-400">Licence No.</span><div className="font-semibold font-mono">{licence.licenceNumber || 'N/A'}</div></div>
              <div><span className="text-zinc-400">Class</span><div className="font-semibold">{licence.licenceClass || 'N/A'}</div></div>
              <div><span className="text-zinc-400">Issue Date</span><div className="font-semibold">{licence.issueDate ? formatDate(licence.issueDate) : 'N/A'}</div></div>
              <div><span className="text-zinc-400">Expiry Date</span><div className="font-semibold">{licence.expiryDate ? formatDate(licence.expiryDate) : 'N/A'}</div></div>
              <div><span className="text-zinc-400">Demerit Points</span><div className="font-semibold">{driver.pointsBalance}/20</div></div>
              <div><span className="text-zinc-400">Blood Group</span><div className="font-semibold">{driver.bloodGroup || 'N/A'}</div></div>
              <div><span className="text-zinc-400">Phone</span><div className="font-semibold">{driver.phoneNumber || 'N/A'}</div></div>
              <div><span className="text-zinc-400">Emergency Contact</span><div className="font-semibold">{driver.emergencyContact || 'N/A'}</div></div>
              <div><span className="text-zinc-400">Email</span><div className="font-semibold truncate">{driver.email || 'N/A'}</div></div>
              <div>
                <span className="text-zinc-400">Status</span>
                <div>
                  <Badge variant={isSuspended ? 'destructive' : 'success'}>
                    {isSuspended ? 'Suspended' : isValid ? 'Active' : licence?.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4 flex flex-col items-center gap-3">
              <p className="text-xs text-zinc-400 font-medium">Verification QR Code</p>
              <div className="bg-white p-3 rounded-lg">
                <QRCode value={qrValue} size={140} />
              </div>
              <p className="text-xs text-zinc-400 text-center">
                Scan to verify licence authenticity<br />
                <span className="text-zinc-500">Licence: {licence.licenceNumber} | ID: {driver.nationalID}</span>
              </p>
            </div>

            {driverVehicles.length > 0 && (
              <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
                <p className="text-xs text-zinc-400 font-medium mb-2">Registered Vehicles</p>
                <div className="space-y-2">
                  {driverVehicles.map((v: any) => (
                    <div key={v.id} className="flex items-center justify-between text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 p-2.5">
                      <div>
                        <span className="font-semibold font-mono">{v.registrationNumber}</span>
                        <span className="text-zinc-400 ml-2">{v.make} {v.model}</span>
                      </div>
                      <Badge variant={v.status === 'active' ? 'success' : 'destructive'}>{v.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 flex justify-center gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          Valid Licence
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          Suspended Licence
        </div>
      </div>
    </div>
  );
}
