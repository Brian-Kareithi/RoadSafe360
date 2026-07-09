'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FiX, FiArrowRight, FiCheck } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface Step {
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  selector?: string;
}

const roleTutorials: Record<string, Step[]> = {
  admin: [
    { title: 'Dashboard Overview', description: 'View national road safety stats, offences, revenue and recent activity at a glance.', position: 'bottom' },
    { title: 'Sidebar Navigation', description: 'Use the sidebar to navigate between Drivers, Offences, Appeals, Reports, Analytics and Settings.', position: 'right' },
    { title: 'Quick Actions', description: 'Issue offences, search drivers, and manage appeals from the top bar actions.', position: 'bottom' },
  ],
  police: [
    { title: 'Issue Offences', description: 'Click "Issue Offence" in the sidebar to record traffic violations with GPS and evidence.', position: 'left', selector: 'a[href="/offences/new"]' },
    { title: 'Driver Lookup', description: 'Search for drivers by name, ID or licence number from the Driver Lookup page.', position: 'right' },
    { title: 'Your Dashboard', description: 'Track your issued offences, pending appeals, and recent activity here.', position: 'bottom' },
  ],
  driver: [
    { title: 'Your Points', description: 'Keep an eye on your demerit points. You start with 20 points — offences deduct from this balance.', position: 'bottom' },
    { title: 'Digital Licence', description: 'Access your QR-coded digital driver licence anytime from the sidebar.', position: 'left', selector: 'a[href="/licence"]' },
    { title: 'Appeals', description: 'Disagree with an offence? Submit an appeal with evidence from the Appeals page.', position: 'right' },
  ],
  authority: [
    { title: 'National KPIs', description: 'View country-wide road safety KPIs, suspension rates, and revenue analytics.', position: 'bottom' },
    { title: 'Reports & Analytics', description: 'Generate professional reports and explore data-driven insights.', position: 'right' },
    { title: 'Regional Data', description: 'Monitor road safety performance across different regions.', position: 'left' },
  ],
};

export function FirstTimeTutorial() {
  const { role } = useAuth();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!role) return;
    const seen = localStorage.getItem(`rs-tutorial-${role}`);
    if (!seen) {
      setTimeout(() => setVisible(true), 600);
    }
  }, [role]);

  if (!role || !visible) return null;

  const steps = roleTutorials[role];
  if (!steps || step >= steps.length) return null;

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const dismiss = () => {
    localStorage.setItem(`rs-tutorial-${role}`, 'true');
    setVisible(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" onClick={dismiss} />

      <div className={cn(
        'relative z-10 mx-4 w-full max-w-sm animate-fade-in rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900',
        'mb-20 sm:mb-0'
      )}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-zinc-400">Tip {step + 1} of {steps.length}</span>
          <button onClick={dismiss} className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <FiX size={16} />
          </button>
        </div>

        <div className="flex gap-2 mb-2">
          {steps.map((_, i) => (
            <div key={i} className={cn('h-1.5 flex-1 rounded-full', i === step ? 'bg-zinc-900 dark:bg-zinc-50' : 'bg-zinc-200 dark:bg-zinc-700')} />
          ))}
        </div>

        <h3 className="text-sm font-semibold mb-1">{current.title}</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{current.description}</p>

        <div className="flex items-center justify-end gap-2 mt-4">
          <button onClick={dismiss} className="text-xs text-zinc-400 hover:text-zinc-600 px-2 py-1">Skip</button>
          <button onClick={() => { if (isLast) dismiss(); else setStep(s => s + 1); }}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors">
            {isLast ? (
              <><FiCheck size={14} /> Done</>
            ) : (
              <><FiArrowRight size={14} /> Next</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
