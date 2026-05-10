import { API_BASE_URL } from '@/config/api';
import { useAuthStore } from '@/stores/auth.store';

export class ApiError extends Error {
  status: number;
  errors: Record<string, string[]>;

  constructor(status: number, message: string, errors: Record<string, string[]> = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function tryRefreshToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = (async () => {
    const { refreshToken } = useAuthStore.getState();
    if (!refreshToken) return null;

    try {
      const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
      const res = await fetch(`${base}/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!res.ok) return null;

      const data = await res.json();
      const newToken = data.access;
      useAuthStore.getState().setToken(newToken);
      if (data.refresh) {
        useAuthStore.setState({ refreshToken: data.refresh });
      }
      return newToken;
    } catch {
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = useAuthStore.getState().token;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const base = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${base}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      });
    }
    return url.toString();
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (res.ok) {
      if (res.status === 204) return undefined as T;
      return res.json() as Promise<T>;
    }

    let message = `Xatolik: ${res.status}`;
    let errors: Record<string, string[]> = {};
    try {
      const body = await res.json();
      if (body.detail) message = body.detail;
      else if (body.message) message = body.message;
      if (body.errors) errors = body.errors;
      else if (typeof body === 'object' && !body.detail && !body.message) {
        errors = body;
      }
    } catch {
      // body is not JSON
    }

    throw new ApiError(res.status, message, errors);
  }

  private async requestWithRetry<T>(url: string, init: RequestInit): Promise<T> {
    let lastError: unknown;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch(url, init);

        if (res.status === 401 && !url.includes('/auth/token/refresh')) {
          const newToken = await tryRefreshToken();
          if (newToken) {
            const retryHeaders = { ...(init.headers as Record<string, string>), Authorization: `Bearer ${newToken}` };
            const retryRes = await fetch(url, { ...init, headers: retryHeaders });
            return this.handleResponse<T>(retryRes);
          }
          useAuthStore.getState().logout();
          throw new ApiError(401, 'Sessiya tugadi, qayta kiring');
        }

        return this.handleResponse<T>(res);
      } catch (err) {
        lastError = err;
        if (err instanceof ApiError && err.status < 500) throw err;
        if (attempt === 0) await new Promise((r) => setTimeout(r, 1000));
      }
    }
    throw lastError;
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    return this.requestWithRetry<T>(url, {
      ...options,
      method: 'GET',
      headers: this.getHeaders(),
    });
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    return this.requestWithRetry<T>(url, {
      ...options,
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    return this.requestWithRetry<T>(url, {
      ...options,
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    return this.requestWithRetry<T>(url, {
      ...options,
      method: 'PATCH',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    return this.requestWithRetry<T>(url, {
      ...options,
      method: 'DELETE',
      headers: this.getHeaders(),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

interface DrfPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export function transformPaginated<T>(
  drf: { count: number; results: T[] },
  page: number = 1,
  pageSize: number = 20,
): { data: T[]; total: number; page: number; pageSize: number; totalPages: number } {
  return {
    data: drf.results,
    total: drf.count,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(drf.count / pageSize)),
  };
}

export function drfListToArray<T>(drf: DrfPaginatedResponse<T> | T[]): T[] {
  if (Array.isArray(drf)) return drf;
  return drf.results;
}
