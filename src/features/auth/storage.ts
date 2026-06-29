import type { Session } from "./types";

/**
 * Plain (non-hook) session persistence. Kept framework-agnostic so it can be
 * called from both the React context (`AuthProvider`) and the router's
 * `beforeLoad` guard, which runs outside the React tree.
 *
 * Tokens live in localStorage because the backend returns them in the response
 * body (no httpOnly cookie). This is XSS-exposed by design of that contract; if
 * the backend later moves to cookies, swap this module out and the rest stays.
 */
const STORAGE_KEY = "medisure.session";

/** SSR-safe access — `window` is undefined during server render. */
const hasWindow = () => typeof window !== "undefined";

export function getSession(): Session | null {
  if (!hasWindow()) return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Session;
    if (!parsed?.accessToken || !parsed?.refreshToken) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setSession(session: Session): void {
  if (!hasWindow()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (!hasWindow()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}
