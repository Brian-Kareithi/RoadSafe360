'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useCollection } from '@/hooks/useFirestore';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { FiAlertTriangle, FiSearch, FiFilter, FiPlus } from 'react-icons/fi';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function OffencesPage() {
  const { data: offences } = useCollection('offences');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = offences.filter((o: any) => {
    const matchSearch = !search || (o.notes || '').toLowerCase().includes(search.toLowerCase()) || (o.id || '').includes(search);
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getBadgeVariant = (status: string) => {
    const map: Record<string, 'success' | 'warning' | 'default' | 'destructive' | 'info'> = {
      paid: 'success',
      issued: 'warning',
      contested: 'destructive',
      resolved: 'info',
    };
    return map[status] || 'default';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Traffic Offences</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">{offences.length} total offences</p>
        </div>
        <Link href="/offences/new"><Button className="gap-2"><FiPlus size={16} /> Issue Offence</Button></Link>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-light)]" size={16} />
              <Input placeholder="Search offences..." value={search} onChange={e => setSearch(e.target.value)} className="pl-11" />
            </div>
            <div className="relative w-full sm:w-44">
              <FiFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-light)] z-10" size={16} />
              <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="pl-11">
                <option value="all">All Status</option>
                <option value="issued">Issued</option>
                <option value="paid">Paid</option>
                <option value="contested">Contested</option>
                <option value="resolved">Resolved</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offence</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Fine</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((o: any, i: number) => (
                <TableRow key={o.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 30}ms` }}>
                  <TableCell className="font-semibold text-[var(--text)]">{o.notes || 'Traffic Offence'}</TableCell>
                  <TableCell className="text-sm text-[var(--text-muted)] font-mono">{o.driverId?.slice(0, 8)}...</TableCell>
                  <TableCell><Badge variant="destructive" className="font-mono">{o.pointsDeducted} pts</Badge></TableCell>
                  <TableCell className="font-semibold text-[var(--text)]">{formatCurrency(o.fineAmount)}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(o.status)}>{o.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-[var(--text-muted)]">{formatDateTime(o.timestamp)}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-[var(--text-muted)] py-12">No offences found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
