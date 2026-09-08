import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface TenantThemeData {
  primaryColor: string;
  accentColor: string;
  logoUrl: string;
  clinicName: string;
  phone?: string;
  address?: string;
}

const TENANT_THEMES: Record<string, TenantThemeData> = {
  'clinica-norte': {
    primaryColor: '#0f766e',
    accentColor: '#5eead4',
    logoUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=400&q=80',
    clinicName: 'Apex Clínica Norte',
    phone: '+593 99 111 2233',
    address: 'Av. Juan Tanca Marengo Km 4.5, Guayaquil',
  },
  'vet-central': {
    primaryColor: '#7c3aed',
    accentColor: '#a78bfa',
    logoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    clinicName: 'Apex Veterinaria Central',
    phone: '+593 99 444 5566',
    address: 'Calle 9 de Octubre y Malecón, Guayaquil',
  },
  clinica1: {
    primaryColor: '#7c3aed',
    accentColor: '#a78bfa',
    logoUrl: '/tenants/clinica1/logo.svg',
    clinicName: 'Clínica Veterinaria San Lucas',
  },
  clinica2: {
    primaryColor: '#0f766e',
    accentColor: '#5eead4',
    logoUrl: '/tenants/clinica2/logo.svg',
    clinicName: 'Veterinaria del Valle',
  },
  clinica3: {
    primaryColor: '#b45309',
    accentColor: '#fbbf24',
    logoUrl: '/tenants/clinica3/logo.svg',
    clinicName: 'Paws and Care',
  },
};

const DEFAULT_THEME: TenantThemeData = {
  primaryColor: '#0f766e',
  accentColor: '#5eead4',
  logoUrl: '',
  clinicName: 'Apex Veterinario',
};

export async function GET(
  _req: NextRequest,
  { params }: { params: { tenantId: string } },
) {
  const theme = TENANT_THEMES[params.tenantId] ?? DEFAULT_THEME;
  return NextResponse.json(theme);
}
