/**
 * Central error reporter.
 *
 * In dev: logs the error to the console with any provided context.
 * In prod: if `VITE_ERROR_ENDPOINT` is set, POSTs a small JSON payload there.
 *   Fire-and-forget — if the reporter itself fails we silently swallow the
 *   failure so we don't loop (an error in the reporter cannot trigger the
 *   reporter again).
 *
 * Context is a plain object — anything that helps diagnose, e.g.
 *   reportError(err, { source: 'ErrorBoundary', component: 'ReelEditor' })
 *
 * When we later move to a vendor (Sentry / Datadog / …), swap the body of
 * `dispatch()` — callers don't change.
 */

const ENDPOINT = import.meta.env.VITE_ERROR_ENDPOINT;
const IS_DEV = import.meta.env.DEV;

/**
 * @param {unknown} error
 * @param {Record<string, unknown>} [context]
 */
export function reportError(error, context = {}) {
  const payload = buildPayload(error, context);

  if (IS_DEV || !ENDPOINT) {
    console.error('[reportError]', payload);
    return;
  }

  dispatch(payload);
}

function buildPayload(error, context) {
  const err = error instanceof Error ? error : new Error(String(error));
  return {
    message: err.message,
    name: err.name,
    stack: err.stack,
    // If it's an ApiError we carry status + body for triage.
    status: /** @type {any} */ (err).status,
    body: /** @type {any} */ (err).body,
    context,
    url: typeof window !== 'undefined' ? window.location.href : null,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    timestamp: new Date().toISOString(),
  };
}

function dispatch(payload) {
  try {
    // `keepalive` so the request survives if the page is unloading.
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      /* reporter failures are silent on purpose — never throw from here */
    });
  } catch {
    /* ditto */
  }
}
