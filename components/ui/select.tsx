import * as React from 'react';
import { cn } from '@/lib/utils';

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select ref={ref} className={cn(
      'flex h-12 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-sm text-[var(--text)] shadow-sm transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/20 focus-visible:border-[var(--primary)]/50',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )} {...props}>
      {children}
    </select>
  </div>
));
Select.displayName = 'Select';

export { Select };
