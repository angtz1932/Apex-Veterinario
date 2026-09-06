import React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeId,
  onChange,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-1 p-1 bg-white/5 backdrop-blur-md rounded-xl max-w-full overflow-x-auto no-scrollbar border border-white/10',
        className,
      )}
    >
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap',
              isActive
                ? 'bg-white/20 text-white shadow-sm border border-white/10'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/10',
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px]',
                  isActive
                    ? 'bg-brand-500/30 text-brand-200'
                    : 'bg-white/10 text-slate-400',
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
