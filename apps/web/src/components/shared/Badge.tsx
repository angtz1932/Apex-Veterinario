import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral' | 'outline' | 'gold';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  children,
  variant = 'brand',
  size = 'md',
  ...props
}) => {
  const variants = {
    brand: 'bg-brand-500/15 text-brand-300 border-brand-500/25',
    success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
    danger: 'bg-rose-500/15 text-rose-300 border-rose-500/25',
    neutral: 'bg-white/5 text-slate-300 border-white/10',
    outline: 'bg-transparent text-slate-400 border-white/15',
    gold: 'bg-gold-500/10 text-gold-300 border-gold-500/20',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border backdrop-blur-sm transition-colors',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
