import { Component } from 'react';
import { reportError } from './reportError.js';

/**
 * React Error Boundary. Wraps a subtree so any render/commit-phase throw is
 * caught, reported, and replaced with a friendly fallback instead of a blank
 * white page.
 *
 * Usage:
 *   <ErrorBoundary><App/></ErrorBoundary>
 *
 * The fallback UI is intentionally minimal — single "Reload" button. Anything
 * fancier belongs in a dedicated screen.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    reportError(error, {
      source: 'ErrorBoundary',
      componentStack: info?.componentStack,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        background: 'var(--bg, #fff)',
        color: 'var(--text, #0f1729)',
        fontFamily: 'var(--font-sans, system-ui)',
      }}>
        <div style={{
          maxWidth: 440,
          textAlign: 'center',
          background: 'var(--surface, #fff)',
          border: '1px solid var(--border, #e6e8ee)',
          borderRadius: 12,
          padding: 32,
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          <h1 style={{
            fontSize: 18,
            fontWeight: 600,
            margin: '0 0 8px',
          }}>
            Something went wrong
          </h1>
          <p style={{
            fontSize: 13,
            color: 'var(--text-muted, #5a6478)',
            margin: '0 0 20px',
            lineHeight: 1.5,
          }}>
            The page hit an unexpected error. Our team has been notified. Reload to try again.
          </p>
          {import.meta.env.DEV && (
            <pre style={{
              textAlign: 'left',
              background: 'var(--bg-soft, #f7f8fa)',
              padding: 12,
              borderRadius: 6,
              fontSize: 11,
              overflow: 'auto',
              maxHeight: 180,
              margin: '0 0 20px',
            }}>
              {String(this.state.error?.stack || this.state.error)}
            </pre>
          )}
          <button
            onClick={this.handleReload}
            style={{
              height: 36,
              padding: '0 16px',
              borderRadius: 6,
              border: 'none',
              background: 'var(--accent, #2b57f6)',
              color: 'white',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
