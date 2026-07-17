import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2', {
  variants: {
    variant: {
      default: 'border-transparent bg-[var(--bg-muted)] text-[var(--text-muted)]',
      primary: 'border-transparent bg-[var(--primary)] text-white',
      secondary: 'border-transparent bg-[var(--secondary)] text-white',
      destructive: 'border-transparent bg-[var(--danger)] text-white',
      outline: 'border-[var(--border)] text-[var(--text-muted)]',
      success: 'border-transparent bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      warning: 'border-transparent bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      info: 'border-transparent bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
