/**
 * Mock data layer helpers. Every feature's `api/` module returns data through
 * `mockResponse`, which mimics network latency. When a real backend lands,
 * swap the body of each fetcher for a `fetch()` / server-fn call — the query
 * hooks and components above stay unchanged.
 */
export function mockResponse<T>(data: T, delayMs = 400): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delayMs);
  });
}
