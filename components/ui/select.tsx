import * as React from 'react';
import { cn } from '@/lib/utils';

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select ref={ref} className={cn(
      'flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-900 shadow-sm transition-colors',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus-visible:ring-zinc-500',
      className
    )} {...props}>
      {children}
    </select>
  </div>
));
Select.displayName = 'Select';

export { Select };
