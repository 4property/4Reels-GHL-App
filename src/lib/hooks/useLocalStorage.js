import { useCallback, useEffect, useState } from 'react';

/**
 * useState, but persisted to localStorage under a stable key.
 *
 * @template T
 * @param {string} key
 * @param {T} initialValue
 * @returns {[T, (v: T | ((prev: T) => T)) => void]}
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? initialValue : JSON.parse(raw);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota or disabled — silently drop */
    }
  }, [key, value]);

  const set = useCallback(
    (v) => setValue((prev) => (typeof v === 'function' ? v(prev) : v)),
    [],
  );

  return [value, set];
}
