'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { useCollection } from '@/hooks/useFirestore';
import { FiSave, FiSliders } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const { data: settings } = useCollection('settings');
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settings.length > 0) {
      const vals: Record<string, string> = {};
      settings.forEach((s: any) => { vals[s.key] = s.value; });
      setFormValues(vals);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      const { updateDocument } = await import('@/hooks/useFirestore');
      for (const s of settings as any[]) {
        if (formValues[s.key] !== s.value) {
          await updateDocument('settings', s.id, { value: formValues[s.key] });
        }
      }
      toast.success('Settings saved successfully');
    } catch (err: any) { toast.error(err.message); }
  };

  const demeritSettings = settings.filter((s: any) => s.key.startsWith('demerit_'));
  const generalSettings = settings.filter((s: any) => !s.key.startsWith('demerit_'));

  return (
    <div className="space-y-6 py-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">System Settings</h1>
          <p className="text-zinc-500 text-sm">Configure system thresholds and preferences</p>
        </div>
        <Button onClick={handleSave} className="gap-2"><FiSave size={16} /> Save Changes</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><FiSliders size={16} /> Demerit Point Thresholds</CardTitle>
          <CardDescription>Configure automatic actions based on demerit points</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {demeritSettings.map((s: any) => (
            <div key={s.id} className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium">{s.description || s.key}</label>
                <p className="text-xs text-zinc-400">{s.key}</p>
              </div>
              <Input value={formValues[s.key] || ''} onChange={e => setFormValues({ ...formValues, [s.key]: e.target.value })} className="w-32 text-right" />
            </div>
          ))}
          {demeritSettings.length === 0 && <p className="text-sm text-zinc-400">No threshold settings found in database</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {generalSettings.map((s: any) => (
            <div key={s.id} className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium">{s.description || s.key}</label>
                <p className="text-xs text-zinc-400">{s.key}</p>
              </div>
              <Input value={formValues[s.key] || ''} onChange={e => setFormValues({ ...formValues, [s.key]: e.target.value })} className="w-48" />
            </div>
          ))}
          {generalSettings.length === 0 && <p className="text-sm text-zinc-400">No general settings found in database</p>}
        </CardContent>
      </Card>
    </div>
  );
}
