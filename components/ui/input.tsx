import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type, ...props }, ref) => (
  <input type={type} className={cn(
    'flex h-12 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-sm shadow-sm transition-all duration-200',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--text)]',
    'placeholder:text-[var(--text-light)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/20 focus-visible:border-[var(--primary)]/50',
    'disabled:cursor-not-allowed disabled:opacity-50',
    className
  )} ref={ref} {...props} />
));
Input.displayName = 'Input';

export { Input };
