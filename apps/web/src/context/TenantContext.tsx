'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';

interface TenantContextValue {
  tenantId: string;
}

const TenantContext = createContext<TenantContextValue>({ tenantId: '' });

export function TenantProvider({
  tenantId,
  children,
}: {
  tenantId: string;
  children: ReactNode;
}) {
  // Persistir en localStorage para que api-client lo lea en el cliente
  useEffect(() => {
    if (tenantId) {
      localStorage.setItem('tenantId', tenantId);
    }
  }, [tenantId]);

  return (
    <TenantContext.Provider value={{ tenantId }}>
      {children}
    </TenantContext.Provider>
  );
}

/** Hook seguro – devuelve '' si se usa fuera del provider (ej: root layout) */
export function useTenant(): TenantContextValue {
  return useContext(TenantContext);
}
