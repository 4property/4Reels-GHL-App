import { Shell } from './app/Shell.jsx';
import { TenantProvider } from './app/providers/TenantProvider.jsx';
import { ThemeProvider } from './app/providers/ThemeProvider.jsx';
import { SessionProvider } from './features/session/index.js';
import { ErrorBoundary } from './lib/errors/ErrorBoundary.jsx';

/** App root — error boundary + providers + shell. One-level composition. */
export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SessionProvider>
          <TenantProvider>
            <Shell />
          </TenantProvider>
        </SessionProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
