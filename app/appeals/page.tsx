'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCollection } from '@/hooks/useFirestore';
import { formatDateTime } from '@/lib/format';
import { FiFileText, FiPlus, FiX } from 'react-icons/fi';
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
    <div className="space-y-6 py-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appeals</h1>
          <p className="text-zinc-500 text-sm">{appeals.length} total appeals</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2 shadow-sm">
          {showForm ? <><FiX size={16} /> Close</> : <><FiPlus size={16} /> New Appeal</>}
        </Button>
      </div>

      {showForm && (
        <Card className="animate-scale-in border-zinc-200/80 dark:border-zinc-700/80">
          <CardHeader><CardTitle className="text-base">Submit Appeal</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Select Offence</label>
              <select value={offenceId} onChange={e => setOffenceId(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 focus-visible:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
                <option value="">Choose offence...</option>
                {offences.map((o: any) => <option key={o.id} value={o.id}>{o.notes || 'Offence'} - {o.pointsDeducted}pts</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Reason</label>
              <textarea value={reason} onChange={e => setReason(e.target.value)} rows={4}
                className="flex w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 focus-visible:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                placeholder="Explain why you are appealing..." />
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
              {sorted.map((a: any, i: number) => (
                <TableRow key={a.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 30}ms` }}>
                  <TableCell className="font-medium font-mono text-zinc-800 dark:text-zinc-200">{a.offenceRecordId?.slice(0, 8)}...</TableCell>
                  <TableCell className="text-sm text-zinc-500 max-w-xs truncate">{a.reason}</TableCell>
                  <TableCell>
                    <Badge variant={a.status === 'approved' ? 'success' : a.status === 'rejected' ? 'destructive' : a.status === 'under_review' ? 'warning' : 'default'}>{a.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">{formatDateTime(a.submissionDate)}</TableCell>
                  <TableCell className="text-sm text-zinc-500">{a.resolution || '-'}</TableCell>
                </TableRow>
              ))}
              {sorted.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-zinc-400 py-10">No appeals found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
