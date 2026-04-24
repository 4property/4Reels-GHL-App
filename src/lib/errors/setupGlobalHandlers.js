import { reportError } from './reportError.js';

/**
 * Wires global error handlers once at app boot.
 *
 * - `window.error`            catches uncaught sync errors outside React.
 * - `unhandledrejection`      catches promises rejected with nothing handling them.
 *
 * React render errors are caught by <ErrorBoundary>, not here.
 */
export function setupGlobalHandlers() {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    reportError(event.error || event.message, {
      source: 'window.error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    reportError(event.reason, { source: 'unhandledrejection' });
  });
}
