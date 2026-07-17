'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCollection } from '@/hooks/useFirestore';
import { getRiskLabel, getRiskColor } from '@/lib/format';
import { FiSearch, FiUser } from 'react-icons/fi';
import { useState } from 'react';

export default function DriversPage() {
  const { data: drivers } = useCollection('drivers');
  const [search, setSearch] = useState('');

  const filtered = drivers.filter((d: any) =>
    !search || d.fullName?.toLowerCase().includes(search.toLowerCase()) || d.nationalID?.includes(search) || d.phoneNumber?.includes(search)
  );

  const getPointsBadgeVariant = (points: number) => {
    if (points >= 15) return 'success' as const;
    if (points >= 10) return 'warning' as const;
    return 'destructive' as const;
  };

  const getStatusBadgeVariant = (status: string) => {
    if (status === 'active') return 'success' as const;
    if (status === 'suspended') return 'destructive' as const;
    return 'default' as const;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Driver Management</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">{drivers.length} registered drivers</p>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-light)]" size={16} />
            <Input placeholder="Search by name, National ID, or phone..." value={search} onChange={e => setSearch(e.target.value)} className="pl-11" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>National ID</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d: any, i: number) => (
                <TableRow key={d.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 30}ms` }}>
                  <TableCell className="font-semibold">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[var(--bg-muted)] flex items-center justify-center">
                        <FiUser size={14} className="text-[var(--text-muted)]" />
                      </div>
                      <span className="text-[var(--text)]">{d.fullName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-[var(--text-muted)] font-mono">{d.nationalID}</TableCell>
                  <TableCell className="text-sm text-[var(--text-muted)]">{d.phoneNumber}</TableCell>
                  <TableCell>
                    <Badge variant={getPointsBadgeVariant(d.pointsBalance)} className="font-mono">{d.pointsBalance}/20</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(d.status)}>{d.status}</Badge>
                  </TableCell>
                  <TableCell><span className={`text-sm font-semibold ${getRiskColor(d.riskScore)}`}>{getRiskLabel(d.riskScore)}</span></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-[var(--text-muted)] py-12">No drivers found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
