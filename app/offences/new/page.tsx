'use client';

import { useState, lazy, Suspense, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useCollection } from '@/hooks/useFirestore';
import { FiAlertTriangle, FiCamera, FiUpload, FiSend, FiArrowLeft, FiUser, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Link from 'next/link';

const MapPicker = lazy(() => import('@/components/MapPicker'));

export default function NewOffencePage() {
  const { data: categories } = useCollection('offenceCategories');
  const [driverId, setDriverId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [gpsLocation, setGpsLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [driverInfo, setDriverInfo] = useState<{ fullName: string; nationalID: string; pointsBalance: number; status: string } | null>(null);
  const [loadingDriver, setLoadingDriver] = useState(false);
  const [driverNotFound, setDriverNotFound] = useState(false);
  const lookupRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedCat = categories.find((c: any) => c.id === categoryId) as any;

  const lookupDriver = useCallback(async (id: string) => {
    if (!id || id.length < 3) { setDriverInfo(null); setDriverNotFound(false); return; }
    setLoadingDriver(true);
    setDriverNotFound(false);
    setDriverInfo(null);
    try {
      const { getDocument } = await import('@/hooks/useFirestore');
      const doc = await getDocument<any>('drivers', id);
      if (doc) {
        setDriverInfo({ fullName: doc.fullName, nationalID: doc.nationalID, pointsBalance: doc.pointsBalance, status: doc.status });
      } else {
        setDriverNotFound(true);
      }
    } catch {
      setDriverNotFound(true);
    } finally {
      setLoadingDriver(false);
    }
  }, []);

  const handleDriverChange = (value: string) => {
    setDriverId(value);
    if (lookupRef.current) clearTimeout(lookupRef.current);
    if (value.length < 3) { setDriverInfo(null); setDriverNotFound(false); return; }
    lookupRef.current = setTimeout(() => lookupDriver(value), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverId || !categoryId) { toast.error('Please fill all required fields'); return; }
    if (!driverInfo) { toast.error('Please wait for driver verification'); return; }
    setSubmitting(true);
    try {
      const { addDocument } = await import('@/hooks/useFirestore');
      await addDocument('offences', {
        driverId,
        offenceCategoryId: categoryId,
        pointsDeducted: selectedCat?.demeritPoints || 0,
        fineAmount: selectedCat?.fineAmount || 0,
        gpsLocation,
        notes,
        status: 'issued',
        timestamp: new Date().toISOString(),
      });
      toast.success(`Offence issued to ${driverInfo.fullName}`);
      setDriverId(''); setCategoryId(''); setGpsLocation(''); setNotes('');
      setDriverInfo(null); setDriverNotFound(false);
    } catch (err: any) { toast.error(err.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center gap-3">
        <Link href="/offences" className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <FiArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Issue Traffic Offence</h1>
          <p className="text-xs sm:text-sm text-zinc-500">Record a new traffic violation</p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Offence Details</CardTitle>
            <CardDescription>Fill in the details of the traffic offence</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Driver ID *</label>
                  <Input
                    value={driverId}
                    onChange={e => handleDriverChange(e.target.value)}
                    placeholder="Enter driver document ID"
                    className={driverInfo ? 'border-green-500 focus-visible:ring-green-500' : driverNotFound ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    required
                  />
                  {loadingDriver && (
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
                      Verifying driver...
                    </div>
                  )}
                  {driverInfo && (
                    <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-2.5 text-xs dark:border-green-800 dark:bg-green-950/30">
                      <FiCheck className="mt-0.5 shrink-0 text-green-600" size={14} />
                      <div className="text-green-800 dark:text-green-300">
                        <span className="font-semibold">{driverInfo.fullName}</span>
                        <span className="text-green-600 dark:text-green-400"> &middot; {driverInfo.nationalID}</span>
                        <div className="mt-0.5 text-green-600 dark:text-green-400">
                          {driverInfo.pointsBalance}/20 pts &middot; {driverInfo.status}
                        </div>
                      </div>
                    </div>
                  )}
                  {driverNotFound && (
                    <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                      <FiAlertTriangle size={12} />
                      Driver not found. Check the ID and try again.
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Offence Category *</label>
                  <Select value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
                    <option value="">Select offence...</option>
                    {categories.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.code} &mdash; {c.name} ({c.demeritPoints}pts)</option>
                    ))}
                  </Select>
                </div>
              </div>

              {selectedCat && (
                <div className="flex flex-col gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-800/50">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold">{selectedCat.name}</span>
                    <div className="flex shrink-0 gap-2 text-xs">
                      <span className="rounded bg-red-100 px-2 py-0.5 font-medium text-red-700 dark:bg-red-900/40 dark:text-red-400">
                        {selectedCat.demeritPoints} pts
                      </span>
                      <span className="rounded bg-emerald-100 px-2 py-0.5 font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                        KES {(selectedCat.fineAmount ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {selectedCat.description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{selectedCat.description}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Location (click map or use crosshair)</label>
                <Suspense fallback={<div className="h-52 w-full rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-shimmer" />}>
                  <MapPicker value={gpsLocation} onChange={setGpsLocation} />
                </Suspense>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Officer Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                  className="flex w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                  placeholder="Describe the offence..." />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" className="gap-2">
                  <FiCamera size={14} /> Photo
                </Button>
                <Button type="button" variant="outline" size="sm" className="gap-2">
                  <FiUpload size={14} /> Evidence
                </Button>
              </div>

              <Button type="submit" variant="kenyan" className="w-full gap-2" disabled={submitting || !driverInfo}>
                <FiSend size={16} />
                {submitting ? 'Issuing...' : driverInfo ? `Issue Offence to ${driverInfo.fullName.split(' ')[0]}` : 'Verify driver first'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
