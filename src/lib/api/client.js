/**
 * Single entry point for every network request the app makes.
 *
 * - In dev, if VITE_USE_MOCK is not set to "false", requests are routed to the
 *   in-memory mock in `./mock.js`. The mock resolves with plain JS objects and
 *   simulates ~150ms of latency.
 * - In prod (or when VITE_USE_MOCK=false), requests go to fetch() against
 *   VITE_API_URL.
 *
 * Feature code must never call fetch directly — call `apiRequest` through a
 * feature-level `api.js` module (e.g. `features/reels/api.js`) which knows its
 * own paths and shapes.
 */
import { ApiError } from './ApiError.js';

const BASE_URL = import.meta.env.VITE_API_URL || '';
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

/**
 * @typedef {'GET'|'POST'|'PUT'|'PATCH'|'DELETE'} HttpMethod
 *
 * @typedef {object} RequestOptions
 * @property {HttpMethod} [method]      HTTP verb, defaults to 'GET'.
 * @property {unknown}    [body]        Plain JS object — will be JSON-stringified.
 * @property {Record<string, string|number|boolean|undefined>} [query]
 *                                      Flat object of query params.
 * @property {Record<string, string>}   [headers]  Extra headers.
 * @property {AbortSignal}              [signal]   Forwarded to fetch.
 */

/**
 * @param {string} path  Path starting with `/`, e.g. `/reels`.
 * @param {RequestOptions} [options]
 * @returns {Promise<any>} Parsed JSON response.
 */
export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, query, headers, signal } = options;

  if (USE_MOCK) {
    const { handleMockRequest } = await import('./mock/index.js');
    return handleMockRequest(path, { method, body, query });
  }

  const url = new URL(BASE_URL + path, window.location.origin);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') {
        url.searchParams.set(k, String(v));
      }
    }
  }

  const res = await fetch(url.toString(), {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...getAuthHeaders(),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
    credentials: 'include',
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      payload?.message || payload?.error || res.statusText,
      payload,
    );
  }

  if (res.status === 204) return null;
  return res.json();
}

/**
 * Placeholder — when auth is wired, this is the single spot that attaches
 * Authorization + X-Tenant-Id headers.
 */
function getAuthHeaders() {
  return {};
}
