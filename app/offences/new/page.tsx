'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useCollection } from '@/hooks/useFirestore';
import { FiAlertTriangle, FiMapPin, FiCamera, FiUpload, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function NewOffencePage() {
  const { data: categories } = useCollection('offenceCategories');
  const [driverId, setDriverId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [gpsLocation, setGpsLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedCat = categories.find((c: any) => c.id === categoryId) as any;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverId || !categoryId) { toast.error('Please fill required fields'); return; }
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
      toast.success('Offence issued successfully');
      setDriverId(''); setCategoryId(''); setGpsLocation(''); setNotes('');
    } catch (err: any) { toast.error(err.message); }
    finally { setSubmitting(false); }
  };

  const captureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setGpsLocation(`${pos.coords.latitude}, ${pos.coords.longitude}`);
        toast.success('Location captured');
      }, () => toast.error('Failed to get location'));
    }
  };

  return (
    <div className="space-y-6 py-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Issue Traffic Offence</h1>
        <p className="text-zinc-500 text-sm">Record a new traffic violation</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Offence Details</CardTitle>
          <CardDescription>Fill in the details of the traffic offence</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Driver ID *</label>
                <Input value={driverId} onChange={e => setDriverId(e.target.value)} placeholder="Driver document ID" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Offence Category *</label>
                <Select value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
                  <option value="">Select offence...</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.code} - {c.name} ({c.demeritPoints}pts, {c.severity})</option>
                  ))}
                </Select>
              </div>
            </div>

            {selectedCat && (
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-sm flex items-center justify-between">
                <span><strong>{selectedCat.name}</strong> &middot; {selectedCat.description}</span>
                <span className="font-semibold text-red-600">{selectedCat.demeritPoints} pts &middot; KES {selectedCat.fineAmount?.toLocaleString()}</span>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-1 block">GPS Location</label>
              <div className="flex gap-2">
                <Input value={gpsLocation} onChange={e => setGpsLocation(e.target.value)} placeholder="Click to capture location" className="flex-1" />
                <Button type="button" variant="outline" onClick={captureLocation}><FiMapPin size={16} /></Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Officer Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                className="flex w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:border-zinc-800"
                placeholder="Describe the offence..." />
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" className="gap-2"><FiCamera size={16} /> Add Photo</Button>
              <Button type="button" variant="outline" className="gap-2"><FiUpload size={16} /> Upload Evidence</Button>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={submitting}>
              <FiSend size={16} /> {submitting ? 'Issuing...' : 'Issue Offence'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}