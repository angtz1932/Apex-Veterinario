const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Lee el tenantId desde la cookie (SSR) o localStorage (CSR). */
function resolveTenantId(): string | null {
  if (typeof window === 'undefined') {
    // SSR: leer desde la cookie de Next.js si estuviera disponible
    return null;
  }
  // CSR: leer desde localStorage (TenantProvider lo persiste aqui)
  return localStorage.getItem('tenantId');
}

/** Construye los headers comunes, inyectando x-tenant-id cuando existe. */
function buildHeaders(extra?: HeadersInit): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const tenantId = resolveTenantId();
  if (tenantId) headers['x-tenant-id'] = tenantId;

  if (extra) {
    const extraEntries =
      extra instanceof Headers
        ? Array.from(extra.entries())
        : Object.entries(extra as Record<string, string>);
    for (const [k, v] of extraEntries) headers[k] = v;
  }

  return headers;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const config: RequestInit = {
    ...options,
    headers: buildHeaders(options.headers),
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      let errorDetails: unknown = null;

      try {
        const errorJson = await response.json();
        errorDetails = errorJson;
        if (errorJson.message) {
          errorMessage = Array.isArray(errorJson.message)
            ? errorJson.message.join(' | ')
            : errorJson.message;
        }
      } catch {
        // Fallback si la respuesta no es JSON
      }

      throw new ApiError(response.status, errorMessage, errorDetails);
    }

    // 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      0,
      error instanceof Error ? error.message : 'Error desconocido de red',
    );
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
