/**
 * Loads the current user once and shares them with every feature via
 * `useCurrentUser()` / `usePermissions()`.
 *
 * Rendered near the root so sub-trees don't re-fetch. While loading, a very
 * small placeholder is shown — permissions must be resolved before any tab
 * renders, otherwise `<RequirePermission>` would flash a redirect.
 */
import { createContext, useContext } from 'react';
import { useApi } from '../../lib/hooks/useApi.js';
import { sessionApi } from './api.js';
import './session.css';

const SessionContext = createContext(/** @type {any} */(null));

export function SessionProvider({ children }) {
  const { data, loading, error } = useApi(() => sessionApi.getCurrentUser(), []);

  if (loading) {
    return <div className="session-fallback loading">Loading…</div>;
  }

  if (error || !data) {
    return <div className="session-fallback error">Could not load session.</div>;
  }

  return (
    <SessionContext.Provider value={data}>
      {children}
    </SessionContext.Provider>
  );
}

export function useCurrentUser() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useCurrentUser must be used inside <SessionProvider>');
  return ctx;
}

export function usePermissions() {
  return useCurrentUser().permissions || {};
}
