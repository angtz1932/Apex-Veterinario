'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

/** Rutas que requieren autenticacion */
const PROTECTED_PATHS = ['/checkout', '/orders', '/pets', '/appointments'];

/**
 * HOC que protege paginas de la aplicacion.
 * Redirige a /login si el usuario no esta autenticado.
 */
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthGuard(props: P) {
    const params = useParams<{ tenant: string }>();
    const router = useRouter();
    const user = useAuthStore((s) => s.user);

    useEffect(() => {
      if (!user) {
        router.replace(`/${params.tenant}/login`);
      }
    }, [user, router, params.tenant]);

    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    return <Component {...props} />;
  };
}
