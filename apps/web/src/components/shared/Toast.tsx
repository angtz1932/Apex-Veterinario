'use client';

import React, { useEffect, useRef } from 'react';
import { useToastStore, ToastMessage } from '@/stores/useToastStore';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

export const Toast: React.FC<{ toast: ToastMessage }> = ({ toast }) => {
  const removeToast = useToastStore((state) => state.removeToast);
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Entrance animation
    if (toastRef.current) {
      gsap.fromTo(
        toastRef.current,
        { x: 100, opacity: 0, scale: 0.9 },
        { x: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' }
      );
    }

    // Auto-remove after duration
    const timer = setTimeout(() => {
      handleClose();
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast]);

  const handleClose = () => {
    if (toastRef.current) {
      gsap.to(toastRef.current, {
        x: 100,
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => removeToast(toast.id),
      });
    } else {
      removeToast(toast.id);
    }
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400" />,
    info: <Info className="w-5 h-5 text-brand-300" />,
  };

  const borders = {
    success: 'border-emerald-500/30',
    error: 'border-rose-500/30',
    info: 'border-brand-500/30',
  };

  return (
    <div
      ref={toastRef}
      className={cn(
        'luxury-glass pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl p-4 border shadow-2xl',
        borders[toast.type]
      )}
    >
      <div className="shrink-0 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 space-y-1">
        <h4 className="text-sm font-semibold text-white">{toast.title}</h4>
        {toast.description && (
          <p className="text-xs text-slate-300 leading-relaxed">{toast.description}</p>
        )}
      </div>
      <button
        onClick={handleClose}
        className="shrink-0 rounded-lg p-1 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
