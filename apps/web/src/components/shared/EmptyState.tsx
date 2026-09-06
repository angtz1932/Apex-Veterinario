import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-dashed border-white/20 bg-white/5 backdrop-blur-sm',
        className,
      )}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-white/10 shadow-sm border border-white/10 flex items-center justify-center text-brand-300 mb-4">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h4 className="text-base font-bold text-slate-100">{title}</h4>
      {description && (
        <p className="mt-1 text-sm text-slate-400 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
