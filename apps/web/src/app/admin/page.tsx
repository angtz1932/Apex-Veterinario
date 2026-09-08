'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/shared/Spinner';

export default function GlobalAdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirige al tenant predeterminado o último visitado
    router.replace('/clinica-norte/admin');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060010]">
      <div className="text-center space-y-3">
        <Spinner size="lg" />
        <p className="text-xs text-slate-400">Accediendo al Panel Clínico...</p>
      </div>
    </div>
  );
}
