import { env } from "@/lib/env";
import { getSession, setSession } from "../storage";
import type {
  ApiEnvelope,
  AuthUser,
  Me,
  OAuthProvider,
  Session,
} from "../types";

/** Error carrying the HTTP status and backend error code, for callers to branch on. */
export class AuthApiError extends Error {
  status: number;
  code: string;
  constructor(message: string, status: number, code = "UNKNOWN") {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.code = code;
  }
}

/** Resolve the backend base URL or fail loudly — auth cannot work without it. */
function baseUrl(): string {
  if (!env.VITE_API_BASE_URL) {
    throw new AuthApiError(
      "VITE_API_BASE_URL is not set — point it at the MedySure backend (e.g. http://localhost:3000/api/v1).",
      0,
      "CONFIG",
    );
  }
  return env.VITE_API_BASE_URL.replace(/\/$/, "");
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  accessToken?: string;
};

/** Fetch + unwrap the `{ success, data }` envelope, throwing AuthApiError otherwise. */
async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, accessToken } = opts;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  let res: Response;
  try {
    res = await fetch(`${baseUrl()}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (cause) {
    // Network / CORS failure — backend down or origin mismatch.
    throw new AuthApiError(
      "Could not reach the backend. Is the MedySure API running?",
      0,
      "NETWORK",
    );
  }

  let envelope: ApiEnvelope<T> | null = null;
  try {
    envelope = (await res.json()) as ApiEnvelope<T>;
  } catch {
    // Non-JSON body (unexpected) — surface the status.
  }

  if (!res.ok || !envelope || envelope.success === false) {
    const code = envelope && !envelope.success ? envelope.error.code : "HTTP_ERROR";
    const message =
      envelope && !envelope.success
        ? envelope.error.message
        : `Request to ${path} failed (${res.status})`;
    throw new AuthApiError(message, res.status, code);
  }

  return envelope.data;
}

export const authApi = {
  /** Get the Supabase OAuth redirect URL for a provider. */
  getOAuthUrl: (provider: OAuthProvider) =>
    request<{ url: string; provider: OAuthProvider }>(`/auth/oauth/${provider}`),

  /** Current user, organization and permissions for a given access token. */
  getMe: (accessToken: string) => request<Me>("/auth/me", { accessToken }),

  /** Exchange a refresh token for a fresh session. */
  refresh: (refreshToken: string) =>
    request<{ user: AuthUser; session: Session }>("/auth/refresh", {
      method: "POST",
      body: { refreshToken },
    }),

  /** Best-effort server-side session revocation. */
  logout: (accessToken: string) =>
    request<{ message: string }>("/auth/logout", { method: "POST", accessToken }),
};

/**
 * Load the current user for a stored session, transparently refreshing the
 * access token once if it has expired. Persists any refreshed session.
 * Throws AuthApiError if the session is unrecoverable (caller should sign out).
 */
export async function resolveMe(session: Session): Promise<{ me: Me; session: Session }> {
  try {
    const me = await authApi.getMe(session.accessToken);
    return { me, session };
  } catch (err) {
    if (!(err instanceof AuthApiError) || err.status !== 401) throw err;

    // Access token expired/invalid — try the refresh token once.
    const refreshed = await authApi.refresh(session.refreshToken);
    setSession(refreshed.session);
    const me = await authApi.getMe(refreshed.session.accessToken);
    return { me, session: refreshed.session };
  }
}

/** Convenience: resolve the user from whatever session is in storage. */
export async function resolveMeFromStorage(): Promise<{ me: Me; session: Session } | null> {
  const session = getSession();
  if (!session) return null;
  return resolveMe(session);
}
