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

  return (
    <div className="space-y-6 py-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Driver Management</h1>
        <p className="text-zinc-500 text-sm">{drivers.length} registered drivers</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <Input placeholder="Search by name, National ID, or phone..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
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
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <FiUser size={14} className="text-zinc-500" />
                      </div>
                      <span className="text-zinc-800 dark:text-zinc-200">{d.fullName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500 font-mono">{d.nationalID}</TableCell>
                  <TableCell className="text-sm text-zinc-500">{d.phoneNumber}</TableCell>
                  <TableCell>
                    <Badge variant={d.pointsBalance >= 15 ? 'success' : d.pointsBalance >= 10 ? 'warning' : 'destructive'} className="font-mono">{d.pointsBalance}/20</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={d.status === 'active' ? 'success' : d.status === 'suspended' ? 'destructive' : 'secondary'}>{d.status}</Badge>
                  </TableCell>
                  <TableCell><span className={`text-sm font-semibold ${getRiskColor(d.riskScore)}`}>{getRiskLabel(d.riskScore)}</span></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-zinc-400 py-10">No drivers found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
