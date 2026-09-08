import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Rutas que requieren sesion activa */
const PROTECTED_SEGMENTS = ['checkout', 'orders', 'pets', 'appointments'];

/** Segmentos del path que pertenecen a rutas directas de la app (no son tenants) */
const NON_TENANT_SEGMENTS = new Set([
  '',
  'api',
  '_next',
  'favicon.ico',
  'icon.svg',
  'login',
  'register',
  'admin',
  'catalog',
  'services',
  'cart',
  'checkout',
  'appointments',
  'pets',
  'wellness',
  'orders',
  'verify',
]);

/**
 * Detecta el tenant desde sub-dominio o prefijo de ruta.
 * Tambien protege rutas privadas verificando la cookie de auth.
 */
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // ── 1. Resolver tenant ────────────────────────────────────────
  // A. Detectar desde subdominio real (ej: clinica-norte.apexvet.com)
  const rawHost = req.headers.get('host') ?? '';
  const hostname = rawHost.split(':')[0].toLowerCase();
  let tenant = '';

  const isLocalOrIp =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.local') ||
    /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);

  if (!isLocalOrIp && !hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('.');
    if (parts.length > 2 && !['www', 'app'].includes(parts[0])) {
      tenant = parts[0];
    }
  }

  // B. Detectar desde prefijo de ruta (ej: /clinica-norte/catalog)
  const segments = url.pathname.split('/').filter(Boolean);
  const firstSegment = segments[0] ?? '';

  if (!tenant && firstSegment && !NON_TENANT_SEGMENTS.has(firstSegment)) {
    tenant = firstSegment;
  }

  // C. Fallback a cookie previa o default
  if (!tenant) {
    tenant = req.cookies.get('tenantId')?.value || 'clinica-norte';
  }

  // ── 2. Proteger rutas privadas ────────────────────────────────
  const isProtected = PROTECTED_SEGMENTS.some((seg) => segments.includes(seg));
  const token = req.cookies.get('apex_auth_token')?.value;

  if (isProtected && !token) {
    const loginUrl = req.nextUrl.clone();
    // Si la ruta tenia prefijo de tenant, enviar a /[tenant]/login, sino /login
    loginUrl.pathname = firstSegment && !NON_TENANT_SEGMENTS.has(firstSegment)
      ? `/${tenant}/login`
      : `/login`;
    loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 3. Propagar tenant en headers y cookie SIN romper el path ──
  const resp = NextResponse.next();
  resp.headers.set('x-tenant-id', tenant);
  resp.cookies.set('tenantId', tenant, { path: '/', sameSite: 'lax' });
  return resp;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.svg).*)'],
};

