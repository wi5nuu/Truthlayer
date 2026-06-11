const isServer = typeof window === 'undefined';
const API_BASE = isServer ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') : '';

interface AnalyzeRequest {
  pageData: Record<string, unknown>;
  tier?: 'free' | 'pro';
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE}${endpoint}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    clearTimeout(timeout);

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error || `HTTP ${response.status}` };
    }
    return { success: true, data };
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        return { success: false, error: 'Request timed out' };
      }
      return { success: false, error: err.message };
    }
    return { success: false, error: 'Unknown error' };
  }
}

export async function analyzeSite(pageData: AnalyzeRequest['pageData'], tier: 'free' | 'pro' = 'free') {
  return fetchApi<Record<string, unknown>>('/api/v1/analyze', {
    method: 'POST',
    body: JSON.stringify({ pageData, tier })
  });
}

export async function getReport(domain: string) {
  return fetchApi<Record<string, unknown>>(`/api/v1/report/${encodeURIComponent(domain)}`);
}

export async function getReportHistory(domain: string) {
  return fetchApi<Record<string, unknown>>(`/api/v1/report/${encodeURIComponent(domain)}/history`);
}

export async function checkHealth() {
  return fetchApi<{ status: string }>('/health');
}

export async function register(email: string, password: string) {
  return fetchApi<{ token: string; user: { email: string; tier: string } }>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function login(email: string, password: string) {
  return fetchApi<{ token: string; user: { email: string; tier: string } }>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}
