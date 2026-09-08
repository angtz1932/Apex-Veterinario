'use client';

import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTenant } from '@/context/TenantContext';
import { useCartStore } from '@/stores/useCartStore';
import { useAppointmentStore } from '@/stores/useAppointmentStore';

/**
 * Sincroniza el tenantId de los stores con el contexto activo.
 * Seguro de usar incluso fuera de TenantProvider (tenantId sera '').
 */
function TenantSyncEffect() {
  const { tenantId } = useTenant();
  const setCartTenant = useCartStore((s) => s.setTenant);
  const setApptTenant = useAppointmentStore((s) => s.setTenant);

  useEffect(() => {
    if (tenantId) {
      setCartTenant(tenantId);
      setApptTenant(tenantId);
    }
  }, [tenantId, setCartTenant, setApptTenant]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TenantSyncEffect />
      {children}
    </QueryClientProvider>
  );
}
