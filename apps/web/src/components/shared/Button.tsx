import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-sans font-medium transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#120524] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-[0.97]';

    const variants = {
      primary:
        'bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:from-brand-500 hover:to-brand-400 focus:ring-brand-500 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40',
      secondary:
        'bg-white/5 text-gold-300 border border-gold-500/20 hover:bg-gold-500/10 hover:border-gold-500/30 focus:ring-gold-500 backdrop-blur-sm',
      outline:
        'border border-white/15 bg-white/[0.03] text-slate-100 hover:bg-white/[0.08] hover:border-white/25 focus:ring-brand-500 backdrop-blur-sm',
      ghost:
        'text-slate-300 hover:bg-white/[0.06] hover:text-white focus:ring-slate-500',
      danger:
        'bg-gradient-to-r from-rose-600 to-rose-500 text-white hover:from-rose-500 hover:to-rose-400 focus:ring-rose-500 shadow-lg shadow-rose-500/20',
      gold:
        'bg-gradient-to-r from-gold-600 to-gold-500 text-white hover:from-gold-500 hover:to-gold-400 focus:ring-gold-500 shadow-lg shadow-gold-500/20',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3 gap-2.5 font-semibold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
