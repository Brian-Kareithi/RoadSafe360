'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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

  const getStatusBadgeVariant = (status: string) => {
    const map: Record<string, 'success' | 'warning' | 'destructive' | 'default'> = {
      approved: 'success',
      rejected: 'destructive',
      under_review: 'warning',
    };
    return map[status] || 'default';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Appeals</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">{appeals.length} total appeals</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          {showForm ? <><FiX size={16} /> Close</> : <><FiPlus size={16} /> New Appeal</>}
        </Button>
      </div>

      {showForm && (
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle className="text-base">Submit Appeal</CardTitle>
            <CardDescription>Fill in the details to submit a new appeal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <label className="text-sm font-semibold mb-2 block text-[var(--text)]">Select Offence</label>
              <select value={offenceId} onChange={e => setOffenceId(e.target.value)}
                className="flex h-12 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-sm shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/20 focus-visible:border-[var(--primary)]/50 dark:bg-[var(--bg-card)] dark:text-[var(--text)]">
                <option value="">Choose offence...</option>
                {offences.map((o: any) => <option key={o.id} value={o.id}>{o.notes || 'Offence'} - {o.pointsDeducted}pts</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block text-[var(--text)]">Reason</label>
              <textarea value={reason} onChange={e => setReason(e.target.value)} rows={4}
                className="flex w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-sm shadow-sm transition-all duration-200 placeholder:text-[var(--text-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/20 focus-visible:border-[var(--primary)]/50"
                placeholder="Explain why you are appealing..." />
            </div>
            <div className="flex gap-3">
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
                  <TableCell className="font-semibold font-mono text-[var(--text)]">{a.offenceRecordId?.slice(0, 8)}...</TableCell>
                  <TableCell className="text-sm text-[var(--text-muted)] max-w-xs truncate">{a.reason}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(a.status)}>{a.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-[var(--text-muted)]">{formatDateTime(a.submissionDate)}</TableCell>
                  <TableCell className="text-sm text-[var(--text-muted)]">{a.resolution || '-'}</TableCell>
                </TableRow>
              ))}
              {sorted.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-[var(--text-muted)] py-12">No appeals found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
