'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { FiFileText, FiDownload, FiPrinter, FiCheck, FiBarChart2 } from 'react-icons/fi';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import { useCollection } from '@/hooks/useFirestore';
import { formatCurrency, formatDate } from '@/lib/format';

const reportTypes = [
  { id: 'daily', label: 'Daily Report', icon: FiFileText },
  { id: 'weekly', label: 'Weekly Report', icon: FiFileText },
  { id: 'monthly', label: 'Monthly Report', icon: FiFileText },
  { id: 'annual', label: 'Annual Report', icon: FiFileText },
  { id: 'regional', label: 'Regional Report', icon: FiBarChart2 },
  { id: 'driver-history', label: 'Driver History Report', icon: FiBarChart2 },
  { id: 'officer-activity', label: 'Officer Activity Report', icon: FiBarChart2 },
  { id: 'revenue', label: 'Revenue Report', icon: FiFileText },
  { id: 'suspension', label: 'Suspension Statistics', icon: FiBarChart2 },
  { id: 'high-risk', label: 'High-Risk Drivers', icon: FiBarChart2 },
  { id: 'repeat-offenders', label: 'Repeat Offenders', icon: FiBarChart2 },
];

function generatePDF(title: string, content: string[][], footer?: string) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();

  pdf.setFillColor(30, 64, 175);
  pdf.rect(0, 0, pageWidth, 30, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.text('ROADSAFE360', 14, 12);
  pdf.setFontSize(8);
  pdf.text('National Road Safety Management System', 14, 20);

  pdf.setTextColor(30, 30, 30);
  pdf.setFontSize(16);
  pdf.text(title, 14, 42);

  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text(`Generated: ${new Date().toLocaleString('en-KE')}`, 14, 50);

  let y = 60;
  pdf.setFontSize(9);
  pdf.setFillColor(241, 245, 249);
  pdf.setTextColor(30, 30, 30);

  for (const row of content) {
    if (y > 270) {
      pdf.addPage();
      y = 30;
    }
    row.forEach((cell, idx) => {
      pdf.text(cell, 14 + idx * 45, y);
    });
    y += 7;
  }

  if (footer) {
    pdf.setTextColor(150, 150, 150);
    pdf.setFontSize(7);
    pdf.text(footer, 14, 285);
  }

  pdf.save(`${title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('monthly');
  const { data: drivers } = useCollection('drivers');
  const { data: offences } = useCollection('offences');
  const { data: officers } = useCollection('policeOfficers');

  const getReportData = () => {
    const report = reportTypes.find(r => r.id === selectedReport);
    const title = report?.label || 'Report';
    switch (selectedReport) {
      case 'daily':
        return {
          title,
          data: offences
            .filter((o: any) => o.timestamp?.startsWith(new Date().toISOString().slice(0, 10)))
            .map((o: any) => [`#${o.id?.slice(0, 6)}`, `KES ${o.fineAmount || 0}`, o.status || 'issued', new Date(o.timestamp).toLocaleDateString()]),
          footer: `Total offences today: ${offences.filter((o: any) => o.timestamp?.startsWith(new Date().toISOString().slice(0, 10))).length}`,
        };
      case 'monthly': {
        const month = new Date().toISOString().slice(0, 7);
        const monthOffences = offences.filter((o: any) => o.timestamp?.startsWith(month));
        return {
          title,
          data: monthOffences.map((o: any) => [`#${o.id?.slice(0, 6)}`, `KES ${o.fineAmount || 0}`, o.status || 'issued', new Date(o.timestamp).toLocaleDateString()]),
          footer: `Total: ${monthOffences.length} offences | Revenue: ${formatCurrency(monthOffences.reduce((s: number, o: any) => s + (o.fineAmount || 0), 0))}`,
        };
      }
      case 'revenue': {
        const totalRevenue = offences.reduce((s: number, o: any) => s + (o.fineAmount || 0), 0);
        const paidRevenue = offences.filter((o: any) => o.status === 'paid').reduce((s: number, o: any) => s + (o.fineAmount || 0), 0);
        return {
          title,
          data: [
            ['Total Offences', String(offences.length)],
            ['Total Revenue', formatCurrency(totalRevenue)],
            ['Collected Revenue', formatCurrency(paidRevenue)],
            ['Outstanding', formatCurrency(totalRevenue - paidRevenue)],
            ['Collection Rate', `${offences.length ? ((paidRevenue / totalRevenue) * 100).toFixed(1) : 0}%`],
          ],
          footer: `Revenue report generated on ${formatDate(new Date())}`,
        };
      }
      case 'high-risk':
        return {
          title,
          data: drivers
            .filter((d: any) => (d.riskScore || 0) >= 0.6)
            .map((d: any) => [d.fullName || 'Unknown', d.nationalID || 'N/A', `${(d.riskScore * 100).toFixed(0)}%`, d.pointsBalance + '/20']),
          footer: `Total high-risk drivers: ${drivers.filter((d: any) => (d.riskScore || 0) >= 0.6).length}`,
        };
      case 'officer-activity':
        return {
          title,
          data: officers.map((o: any) => [o.name || 'Unknown', o.badgeNumber || 'N/A', o.region || 'N/A', o.assignedStation || 'N/A']),
          footer: `Total active officers: ${officers.length}`,
        };
      case 'suspension': {
        const suspended = drivers.filter((d: any) => d.status === 'suspended' || d.status === 'revoked');
        return {
          title,
          data: suspended.map((d: any) => [d.fullName || 'Unknown', d.nationalID || 'N/A', d.status || 'N/A', `${d.pointsBalance}/20`]),
          footer: `Total suspended/revoked: ${suspended.length}`,
        };
      }
      default:
        return {
          title,
          data: offences.slice(0, 20).map((o: any) => [`#${o.id?.slice(0, 6)}`, `KES ${o.fineAmount || 0}`, o.status || 'issued', new Date(o.timestamp).toLocaleDateString()]),
          footer: `Sample report — ${offences.length} total records in system`,
        };
    }
  };

  const handleExportPDF = () => {
    const { title, data, footer } = getReportData();
    generatePDF(title, data, footer);
    toast.success(`${title} exported as PDF`);
  };

  const handleExportCSV = () => {
    const { title, data } = getReportData();
    const csvContent = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${title} exported as CSV`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Reports</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">Generate and export professional reports</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {reportTypes.map((r, i) => {
          const Icon = r.icon;
          const isSelected = selectedReport === r.id;
          return (
            <Card key={r.id}
              className={`cursor-pointer transition-all duration-200 animate-fade-in-up ${isSelected ? 'ring-2 ring-[var(--primary)] border-[var(--primary)]/30' : 'hover:shadow-[var(--shadow-card-hover)]'}`}
              style={{ animationDelay: `${i * 30}ms` }}
              onClick={() => setSelectedReport(r.id)}>
              <CardContent className="p-5 flex items-center gap-3.5">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-200 ${isSelected ? 'bg-[var(--primary)] text-white' : 'bg-[var(--bg-muted)] text-[var(--text-muted)]'}`}>
                  {isSelected ? <FiCheck size={20} /> : <Icon size={20} />}
                </div>
                <div>
                  <p className="font-semibold text-sm text-[var(--text)]">{r.label}</p>
                  <p className="text-xs text-[var(--text-light)]">PDF, CSV</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Export Options</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <Select value={selectedReport} onChange={e => setSelectedReport(e.target.value)} className="w-full sm:w-64">
            {reportTypes.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
          </Select>
          <div className="flex gap-2">
            <Button className="gap-2" onClick={handleExportPDF}><FiDownload size={16} /> PDF</Button>
            <Button variant="outline" className="gap-2" onClick={handleExportCSV}><FiDownload size={16} /> CSV</Button>
            <Button variant="ghost" className="gap-2" onClick={() => window.print()}><FiPrinter size={16} /></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
