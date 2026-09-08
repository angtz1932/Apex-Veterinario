/**
 * Tests del middleware de deteccion de tenant.
 * Nota: NextRequest requiere el entorno Node/Edge; usamos mocks simples.
 */

// Mock de NextResponse y NextRequest para testing sin entorno Edge
jest.mock('next/server', () => {
  class MockResponse {
    public headers: Map<string, string>;
    public cookies: Map<string, string>;
    public status: number;
    public _rewritten?: string;
    public _redirected?: string;

    constructor(status = 200) {
      this.headers = new Map();
      this.cookies = new Map();
      this.status = status;
    }

    set(key: string, value: string) { this.headers.set(key, value); return this; }
    get(key: string) { return this.headers.get(key) ?? null; }

    static rewrite(url: { toString(): string }, init?: { headers?: Record<string, string> }) {
      const resp = new MockResponse(200);
      resp._rewritten = url.toString();
      Object.entries(init?.headers ?? {}).forEach(([k, v]) => resp.headers.set(k, v));
      return resp;
    }

    static redirect(url: { toString(): string }) {
      const resp = new MockResponse(307);
      resp._redirected = url.toString();
      return resp;
    }

    static next() { return new MockResponse(200); }
  }

  class MockURL {
    public pathname: string;
    public searchParams: URLSearchParams;
    private origin: string;

    constructor(url: string) {
      const parsed = new URL(url);
      this.pathname = parsed.pathname;
      this.searchParams = parsed.searchParams;
      this.origin = parsed.origin;
    }

    clone() {
      const u = new MockURL(`${this.origin}${this.pathname}`);
      this.searchParams.forEach((v, k) => u.searchParams.set(k, v));
      return u;
    }

    toString() { return `${this.origin}${this.pathname}?${this.searchParams}`; }
  }

  return {
    NextResponse: MockResponse,
    NextRequest: class {
      public nextUrl: MockURL;
      public headers: Map<string, string>;
      public cookies: Map<string, string>;
      constructor(url: string, options?: { headers?: Record<string, string> }) {
        this.nextUrl = new MockURL(url);
        this.headers = new Map(Object.entries(options?.headers ?? {}));
        this.cookies = new Map();
      }
    },
  };
});

// Importar despues del mock
import { middleware } from '../src/middleware';
import { NextRequest } from 'next/server';

function makeReq(url: string, host: string) {
  return new NextRequest(url, { headers: { host } });
}

describe('Middleware – resolucion de tenant', () => {
  it('extrae tenant del sub-dominio', () => {
    const req = makeReq('https://clinica1.apexvet.com/services', 'clinica1.apexvet.com');
    const resp = middleware(req);
    expect(resp.headers.get('x-tenant-id')).toBe('clinica1');
  });

  it('extrae tenant del primer segmento de ruta', () => {
    const req = makeReq('http://localhost:3000/clinica2/services', 'localhost');
    const resp = middleware(req);
    expect(resp.headers.get('x-tenant-id')).toBe('clinica2');
  });

  it('ignora hosts genericos como localhost', () => {
    const req = makeReq('http://localhost:3000/', 'localhost');
    const resp = middleware(req);
    // sin tenant, el header no debe existir (null o undefined)
    expect(resp.headers.get('x-tenant-id') ?? null).toBeNull();
  });

  it('redirige a /login cuando ruta protegida y sin token', () => {
    const req = makeReq('http://localhost:3000/clinica1/checkout', 'localhost');
    const resp = middleware(req);
    expect(resp.status).toBe(307);
  });
});
