/**
 * Minimal data-fetching hooks — intentionally tiny. Pattern: call a function
 * that returns a promise, get `{ data, loading, error, refetch }`.
 *
 * Not a cache layer. If two components call `useReels()` in parallel, they
 * fetch twice. For this app that's fine; if caching becomes a real problem
 * we can add a small per-key cache here without touching consumers.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * @template T
 * @param {() => Promise<T>} fetcher
 * @param {unknown[]} [deps]  Re-run when any dep changes.
 * @returns {{ data: T | null, loading: boolean, error: Error | null, refetch: () => void }}
 */
export function useApi(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);
  const latestCall = useRef(0);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    const myCall = ++latestCall.current;
    setLoading(true);
    setError(null);
    fetcherRef.current()
      .then((res) => {
        if (latestCall.current !== myCall) return;
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        if (latestCall.current !== myCall) return;
        setError(err);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return { data, loading, error, refetch };
}

/**
 * @template TArgs, TResult
 * @param {(args: TArgs) => Promise<TResult>} performer
 * @returns {[
 *   (args: TArgs) => Promise<TResult>,
 *   { loading: boolean, error: Error | null, reset: () => void }
 * ]}
 */
export function useMutation(performer) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const performerRef = useRef(performer);
  performerRef.current = performer;

  const mutate = useCallback(async (args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await performerRef.current(args);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return [mutate, { loading, error, reset }];
}
