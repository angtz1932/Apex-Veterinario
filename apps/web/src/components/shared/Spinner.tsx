import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className,
  ...props
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div
      role="status"
      className={cn('flex items-center justify-center text-brand-600', className)}
      {...props}
    >
      <Loader2 className={cn('animate-spin', sizes[size])} />
      <span className="sr-only">Cargando...</span>
    </div>
  );
};
