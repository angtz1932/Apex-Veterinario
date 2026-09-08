import type { Metadata } from 'next';
import { TenantProvider } from '@/context/TenantContext';
import { ThemeProvider, type TenantTheme } from '@/context/ThemeProvider';

/** Carga el tema de la clínica desde la API interna (Server-Side). */
async function fetchTenantTheme(tenantId: string): Promise<TenantTheme> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/tenants/${tenantId}`, {
      next: { revalidate: 60 }, // cache de 60 segundos
    });
    if (!res.ok) return {};
    return (await res.json()) as TenantTheme;
  } catch {
    return {};
  }
}

export async function generateMetadata({
  params,
}: {
  params: { tenant: string };
}): Promise<Metadata> {
  const theme = await fetchTenantTheme(params.tenant);
  return {
    title: `${theme.clinicName ?? 'Apex Veterinario'} | Clínica & Boutique de Alta Gama`,
    description:
      'Plataforma integral de salud y bienestar animal: consultas veterinarias, vacunación, grooming, farmacia y alimentos premium.',
  };
}

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { tenant: string };
}) {
  const tenantId = params.tenant;
  const theme = await fetchTenantTheme(tenantId);

  return (
    <TenantProvider tenantId={tenantId}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </TenantProvider>
  );
}
