/**
 * Mock request dispatcher. Walks through every feature's handler map and
 * returns the first match. Adding a new feature only requires registering its
 * handler file in `handlers[]`.
 *
 * Each handler file exports an array of { method, pattern, handler }. Patterns
 * support `:param` placeholders (e.g. `/reels/:id`).
 */
import { ApiError } from '../ApiError.js';
import { reelsHandlers } from './handlers/reels.js';
import { musicHandlers } from './handlers/music.js';
import { socialHandlers } from './handlers/social.js';
import { tenantHandlers } from './handlers/tenant.js';
import { adminHandlers } from './handlers/admin.js';
import { sessionHandlers } from './handlers/session.js';

const handlers = [
  ...reelsHandlers,
  ...musicHandlers,
  ...socialHandlers,
  ...tenantHandlers,
  ...adminHandlers,
  ...sessionHandlers,
];

/**
 * @param {string} path
 * @param {{ method: string, body?: unknown, query?: Record<string, unknown> }} opts
 */
export async function handleMockRequest(path, { method, body, query }) {
  await sleep(150);

  for (const { method: m, pattern, handler } of handlers) {
    if (m !== method) continue;
    const params = matchPath(pattern, path);
    if (params) {
      return handler({ params, body, query });
    }
  }

  throw new ApiError(404, `No mock handler for ${method} ${path}`);
}

function matchPath(pattern, path) {
  const pParts = pattern.split('/');
  const xParts = path.split('/');
  if (pParts.length !== xParts.length) return null;
  const params = {};
  for (let i = 0; i < pParts.length; i++) {
    const p = pParts[i];
    const x = xParts[i];
    if (p.startsWith(':')) {
      params[p.slice(1)] = decodeURIComponent(x);
    } else if (p !== x) {
      return null;
    }
  }
  return params;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
