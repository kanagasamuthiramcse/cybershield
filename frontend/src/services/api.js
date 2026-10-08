/**
 * CyberShield API Service
 * Supports production environment variable VITE_API_URL, runtime override, and relative fallback.
 */

export function getBaseApiUrl() {
  // 1. Runtime override in localStorage (configured via Settings page)
  const runtimeUrl = localStorage.getItem('cs_api_url');
  if (runtimeUrl && runtimeUrl.trim()) {
    const clean = runtimeUrl.trim().replace(/\/+$/, '');
    return clean.endsWith('/api') ? clean : `${clean}/api`;
  }

  // 2. Vite environment variable (set in Vercel project settings as VITE_API_URL)
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() && !envUrl.includes('cybershield-backend.onrender.com')) {
    const clean = envUrl.trim().replace(/\/+$/, '');
    return clean.endsWith('/api') ? clean : `${clean}/api`;
  }

  // 3. Clean same-origin /api path (works on Vercel serverless and dev proxy)
  return '/api';
}

function getAuthHeader() {
  const token = localStorage.getItem('cs_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function request(url, options = {}) {
  const baseUrl = getBaseApiUrl();
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(`${baseUrl}${url}`, {
      ...options,
      headers
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `HTTP Error ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error(`API Request Error [${baseUrl}${url}]:`, err);
    throw err;
  }
}

export const api = {
  getBaseApiUrl,

  // Authentication
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  verifyAuth: () => request('/auth/verify'),

  // Dashboard Stats
  getDashboardStats: () => request('/dashboard/stats'),

  // Threats Feed
  getThreats: (params = {}) => {
    const query = new URLSearchParams();
    if (params.severity && params.severity !== 'all') query.set('severity', params.severity);
    if (params.status && params.status !== 'all') query.set('status', params.status);
    if (params.search) query.set('search', params.search);
    if (params.limit) query.set('limit', params.limit);
    if (params.offset) query.set('offset', params.offset);
    return request(`/threats?${query.toString()}`);
  },
  takeThreatAction: (threatId, action) => request(`/threats/${threatId}/action`, {
    method: 'POST',
    body: JSON.stringify({ action })
  }),

  // Attack Simulator
  simulateAttack: (scenario, customParams = {}) => request('/simulate', {
    method: 'POST',
    body: JSON.stringify({ scenario, custom_params: customParams })
  }),

  // Defensive Threat Analysis
  analyzePayload: (payload, sourceIp, requestRate, saveToFeed = true) => request('/analyze', {
    method: 'POST',
    body: JSON.stringify({ payload, source_ip: sourceIp, request_rate: requestRate, save_to_feed: saveToFeed })
  }),

  // IP Monitoring
  getMonitoredIPs: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'all') query.set('status', params.status);
    if (params.search) query.set('search', params.search);
    return request(`/ips?${query.toString()}`);
  },
  updateIPStatus: (ipAddress, status) => request(`/ips/${encodeURIComponent(ipAddress)}/status`, {
    method: 'POST',
    body: JSON.stringify({ status })
  }),

  // Security Logs
  getSecurityLogs: (params = {}) => {
    const query = new URLSearchParams();
    if (params.severity && params.severity !== 'all') query.set('severity', params.severity);
    if (params.search) query.set('search', params.search);
    if (params.limit) query.set('limit', params.limit);
    return request(`/logs?${query.toString()}`);
  },
  clearLogs: () => request('/logs/clear', { method: 'POST' }),

  // System Health
  getSystemHealth: () => request('/health'),

  // Settings
  getSettings: () => request('/settings'),
  updateSettings: (settings) => request('/settings', {
    method: 'POST',
    body: JSON.stringify({ settings })
  }),
  resetDatabase: () => request('/database/reset', { method: 'POST' })
};
