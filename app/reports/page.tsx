'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { FiFileText, FiDownload, FiPrinter } from 'react-icons/fi';
import { useState } from 'react';
import toast from 'react-hot-toast';

const reportTypes = [
  { id: 'daily', label: 'Daily Report' },
  { id: 'weekly', label: 'Weekly Report' },
  { id: 'monthly', label: 'Monthly Report' },
  { id: 'annual', label: 'Annual Report' },
  { id: 'regional', label: 'Regional Report' },
  { id: 'driver-history', label: 'Driver History Report' },
  { id: 'officer-activity', label: 'Officer Activity Report' },
  { id: 'revenue', label: 'Revenue Report' },
  { id: 'suspension', label: 'Suspension Statistics' },
  { id: 'high-risk', label: 'High-Risk Drivers' },
  { id: 'repeat-offenders', label: 'Repeat Offenders' },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('monthly');

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-zinc-500 text-sm">Generate and export professional reports</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((r) => (
          <Card key={r.id} className={`cursor-pointer transition-all hover:shadow-md ${selectedReport === r.id ? 'ring-2 ring-zinc-900 dark:ring-zinc-50' : ''}`}
            onClick={() => setSelectedReport(r.id)}>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <FiFileText className="text-zinc-600 dark:text-zinc-400" size={20} />
              </div>
              <div>
                <p className="font-medium text-sm">{r.label}</p>
                <p className="text-xs text-zinc-400">PDF, Excel, CSV</p>
              </div>
            </CardContent>
          </Card>
        ))}
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
            <Button className="gap-2" onClick={() => toast.success('Report generated as PDF')}><FiDownload size={16} /> PDF</Button>
            <Button variant="outline" className="gap-2" onClick={() => toast.success('Report generated as Excel')}><FiDownload size={16} /> Excel</Button>
            <Button variant="outline" className="gap-2" onClick={() => toast.success('Report generated as CSV')}><FiDownload size={16} /> CSV</Button>
            <Button variant="ghost" className="gap-2" onClick={() => toast.success('Sending to printer')}><FiPrinter size={16} /></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}