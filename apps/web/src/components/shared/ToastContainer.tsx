'use client';

import React from 'react';
import { useToastStore } from '@/stores/useToastStore';
import { Toast } from './Toast';

export const ToastContainer: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="fixed bottom-0 right-0 z-[100] m-4 sm:m-6 flex w-full max-w-sm flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
