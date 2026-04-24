import { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../../lib/hooks/useLocalStorage.js';

/**
 * Single source of truth for the current theme. Writes `data-theme` on the
 * root element so CSS variables in `tokens.css` switch.
 *
 *   const { theme, toggle, setTheme } = useTheme();
 */
const ThemeContext = createContext(/** @type {any} */(null));

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('4r_theme', 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggle = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
