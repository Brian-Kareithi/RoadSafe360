'use client';

import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCollection } from '@/hooks/useFirestore';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/lib/format';
import { FiShield, FiDownload, FiPrinter, FiCheckCircle, FiAlertTriangle, FiCalendar, FiUser, FiHash, FiPhone, FiDroplet, FiTruck } from 'react-icons/fi';
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
      <div className="py-6 max-w-2xl mx-auto animate-fade-in">
        <Card><CardContent className="p-16 text-center text-[var(--text-muted)]">No driver or licence data found in the system.</CardContent></Card>
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
        body { font-family: 'Inter', Arial, sans-serif; display: flex; justify-content: center; padding: 40px; background: #f5f5f5; }
        .card { width: 380px; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.12); background: white; }
        .header { padding: 28px 24px; color: white; }
        .header.valid { background: #1e40af; }
        .header.suspended { background: #dc2626; }
        .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .brand { font-weight: 700; font-size: 14px; letter-spacing: 0.5px; }
        .status-badge { background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 600; }
        .driver-row { display: flex; align-items: center; gap: 16px; }
        .avatar { width: 64px; height: 64px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 700; }
        .driver-info .name { font-size: 20px; font-weight: 700; }
        .driver-info .id { font-size: 12px; opacity: 0.8; margin-top: 2px; }
        .body { padding: 24px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 13px; }
        .label { color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
        .value { font-weight: 600; color: #1e293b; margin-top: 2px; }
        .footer { text-align: center; padding: 16px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; }
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
    <div className="py-6 max-w-lg mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Digital Driver Licence</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Kenya Revenue Authority &amp; NTSA compliant</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={downloadPDF}><FiDownload size={14} /> PDF</Button>
          <Button variant="outline" size="sm" className="gap-1" onClick={printLicence}><FiPrinter size={14} /></Button>
        </div>
      </div>

      <div ref={cardRef}>
        <Card className={`overflow-hidden border-2 ${isSuspended ? 'border-red-500' : 'border-[var(--primary)]'} rounded-2xl`}>
          <div className={`p-7 ${isSuspended ? 'bg-red-600' : 'bg-[var(--primary)]'} text-white`}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <FiShield size={22} />
                <span className="font-bold text-sm tracking-wide">ROADSAFE360</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${isSuspended ? 'bg-red-500/50 text-red-50' : 'bg-white/20 text-white'}`}>
                {isSuspended ? (
                  <span className="flex items-center gap-1.5"><FiAlertTriangle size={12} /> SUSPENDED</span>
                ) : isValid ? (
                  <span className="flex items-center gap-1.5"><FiCheckCircle size={12} /> VALID</span>
                ) : licence?.status?.toUpperCase()}
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold shrink-0 ring-2 ring-white/30">
                {driver.fullName?.charAt(0) || 'D'}
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold truncate">{driver.fullName || 'N/A'}</p>
                <p className="text-sm opacity-80 mt-0.5">National ID: {driver.nationalID || 'N/A'}</p>
              </div>
            </div>
          </div>

          <CardContent className="p-7 space-y-5">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <span className="text-[var(--text-light)] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"><FiHash size={12} /> Licence No.</span>
                <div className="font-bold text-[var(--text)] mt-1 font-mono">{licence.licenceNumber || 'N/A'}</div>
              </div>
              <div>
                <span className="text-[var(--text-light)] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"><FiTruck size={12} /> Class</span>
                <div className="font-bold text-[var(--text)] mt-1">{licence.licenceClass || 'N/A'}</div>
              </div>
              <div>
                <span className="text-[var(--text-light)] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"><FiCalendar size={12} /> Issue Date</span>
                <div className="font-semibold text-[var(--text)] mt-1">{licence.issueDate ? formatDate(licence.issueDate) : 'N/A'}</div>
              </div>
              <div>
                <span className="text-[var(--text-light)] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"><FiCalendar size={12} /> Expiry Date</span>
                <div className="font-semibold text-[var(--text)] mt-1">{licence.expiryDate ? formatDate(licence.expiryDate) : 'N/A'}</div>
              </div>
              <div>
                <span className="text-[var(--text-light)] text-xs font-semibold uppercase tracking-wider">Demerit Points</span>
                <div className="font-bold text-[var(--text)] mt-1">{driver.pointsBalance}/20</div>
              </div>
              <div>
                <span className="text-[var(--text-light)] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"><FiDroplet size={12} /> Blood Group</span>
                <div className="font-semibold text-[var(--text)] mt-1">{driver.bloodGroup || 'N/A'}</div>
              </div>
              <div>
                <span className="text-[var(--text-light)] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"><FiPhone size={12} /> Phone</span>
                <div className="font-semibold text-[var(--text)] mt-1">{driver.phoneNumber || 'N/A'}</div>
              </div>
              <div>
                <span className="text-[var(--text-light)] text-xs font-semibold uppercase tracking-wider">Emergency Contact</span>
                <div className="font-semibold text-[var(--text)] mt-1">{driver.emergencyContact || 'N/A'}</div>
              </div>
              <div className="col-span-2">
                <span className="text-[var(--text-light)] text-xs font-semibold uppercase tracking-wider">Status</span>
                <div className="mt-1">
                  <Badge variant={isSuspended ? 'destructive' : 'success'}>
                    {isSuspended ? 'Suspended' : isValid ? 'Active' : licence?.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--border)] pt-5 flex flex-col items-center gap-3">
              <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider">Verification QR Code</p>
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <QRCode value={qrValue} size={140} />
              </div>
              <p className="text-xs text-[var(--text-light)] text-center">
                Scan to verify licence authenticity<br />
                <span className="text-[var(--text-muted)]">Licence: {licence.licenceNumber} | ID: {driver.nationalID}</span>
              </p>
            </div>

            {driverVehicles.length > 0 && (
              <div className="border-t border-[var(--border)] pt-5">
                <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider mb-3">Registered Vehicles</p>
                <div className="space-y-2">
                  {driverVehicles.map((v: any) => (
                    <div key={v.id} className="flex items-center justify-between text-sm rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3">
                      <div>
                        <span className="font-bold text-[var(--text)] font-mono">{v.registrationNumber}</span>
                        <span className="text-[var(--text-muted)] ml-2">{v.make} {v.model}</span>
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

      <div className="mt-5 flex justify-center gap-4 text-xs text-[var(--text-light)]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--success)]" />
          Valid Licence
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--danger)]" />
          Suspended Licence
        </div>
      </div>
    </div>
  );
}
