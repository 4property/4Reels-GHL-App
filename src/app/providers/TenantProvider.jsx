/**
 * Loads the current tenant's cross-cutting data once and shares it with every
 * feature via a small set of hooks:
 *
 *   useAgency()     → { name, plan, logo, color, ... }
 *   useSocials()    → list of social networks (connected / handles / colors)
 *   useVariables()  → list of {{tag}} placeholders for descriptions
 *   useSocial(id)   → convenience lookup for a single network by id
 *
 * Rendered once near the root so sub-trees don't refetch. Individual hooks
 * surface `{ loading, error }` to allow consumers to render their own state.
 */
import { createContext, useContext } from 'react';
import { apiRequest } from '../../lib/api/client.js';
import { useApi } from '../../lib/hooks/useApi.js';

const TenantContext = createContext(/** @type {any} */(null));

export function TenantProvider({ children }) {
  const agency = useApi(() => apiRequest('/tenant'));
  const socials = useApi(() => apiRequest('/socials'));
  const variables = useApi(() => apiRequest('/tenant/variables'));

  const value = {
    agency: agency.data,
    socials: socials.data?.data ?? [],
    variables: variables.data?.data ?? [],
    loading: agency.loading || socials.loading || variables.loading,
    error: agency.error || socials.error || variables.error,
    refetch: () => {
      agency.refetch();
      socials.refetch();
      variables.refetch();
    },
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

function useTenantContext() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('Tenant hooks must be used inside <TenantProvider>');
  return ctx;
}

export function useAgency() {
  return useTenantContext().agency;
}

export function useSocials() {
  return useTenantContext().socials;
}

export function useVariables() {
  return useTenantContext().variables;
}

export function useSocial(id) {
  return useSocials().find((s) => s.id === id) || null;
}

export function useTenantStatus() {
  const { loading, error, refetch } = useTenantContext();
  return { loading, error, refetch };
}
