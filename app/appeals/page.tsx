'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCollection } from '@/hooks/useFirestore';
import { formatDateTime } from '@/lib/format';
import { FiFileText, FiPlus } from 'react-icons/fi';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AppealsPage() {
  const { data: appeals } = useCollection('appeals');
  const { data: offences } = useCollection('offences');
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState('');
  const [offenceId, setOffenceId] = useState('');

  const sorted = [...appeals].sort((a: any, b: any) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());

  const handleSubmit = async () => {
    if (!offenceId || !reason) { toast.error('Please fill all fields'); return; }
    try {
      const { addDocument } = await import('@/hooks/useFirestore');
      await addDocument('appeals', { offenceRecordId: offenceId, reason, status: 'submitted', submissionDate: new Date().toISOString(), driverId: offences.find((o: any) => o.id === offenceId)?.driverId || '' });
      toast.success('Appeal submitted');
      setShowForm(false); setReason(''); setOffenceId('');
    } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Appeals</h1>
          <p className="text-zinc-500 text-sm">{appeals.length} total appeals</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2"><FiPlus size={16} /> New Appeal</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-base">Submit Appeal</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Select Offence</label>
              <select value={offenceId} onChange={e => setOffenceId(e.target.value)} className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm dark:border-zinc-800">
                <option value="">Choose offence...</option>
                {offences.map((o: any) => <option key={o.id} value={o.id}>{o.notes || 'Offence'} - {o.pointsDeducted}pts</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Reason</label>
              <textarea value={reason} onChange={e => setReason(e.target.value)} rows={4} className="flex w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-800" placeholder="Explain why you are appealing..." />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit}>Submit Appeal</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offence</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Resolution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((a: any) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.offenceRecordId?.slice(0, 8)}...</TableCell>
                  <TableCell className="text-sm text-zinc-500 max-w-xs truncate">{a.reason}</TableCell>
                  <TableCell>
                    <Badge variant={a.status === 'approved' ? 'success' : a.status === 'rejected' ? 'destructive' : a.status === 'under_review' ? 'warning' : 'default'}>{a.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">{formatDateTime(a.submissionDate)}</TableCell>
                  <TableCell className="text-sm text-zinc-500">{a.resolution || '-'}</TableCell>
                </TableRow>
              ))}
              {sorted.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-zinc-400 py-8">No appeals found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
