import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { authApi, resolveMe } from "./api/auth.api";
import { clearSession, getSession, setSession } from "./storage";
import type { Me, Session } from "./types";

type AuthStatus = "loading" | "authed" | "anon";

type AuthContextValue = {
  status: AuthStatus;
  user: Me | null;
  session: Session | null;
  /** Kick off the Google OAuth redirect flow (navigates away from the SPA). */
  loginWithGoogle: () => Promise<void>;
  /** Adopt a session obtained from the OAuth callback and hydrate the user. */
  completeLogin: (session: Session) => Promise<void>;
  /** Revoke the session (best-effort server-side) and clear local state. */
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<Me | null>(null);
  const [session, setSessionState] = useState<Session | null>(null);

  // Guards against double-hydration in React 18/19 StrictMode dev double-mount.
  const hydratedRef = useRef(false);

  const applyAuthed = useCallback((me: Me, sess: Session) => {
    setUser(me);
    setSessionState(sess);
    setStatus("authed");
  }, []);

  const applyAnon = useCallback(() => {
    clearSession();
    setUser(null);
    setSessionState(null);
    setStatus("anon");
  }, []);

  // On mount, restore any persisted session and validate it against the backend.
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    const stored = getSession();
    if (!stored) {
      setStatus("anon");
      return;
    }

    let cancelled = false;
    resolveMe(stored)
      .then(({ me, session: fresh }) => {
        if (cancelled) return;
        setSession(fresh);
        applyAuthed(me, fresh);
      })
      .catch(() => {
        if (!cancelled) applyAnon();
      });

    return () => {
      cancelled = true;
    };
  }, [applyAuthed, applyAnon]);

  const loginWithGoogle = useCallback(async () => {
    const { url } = await authApi.getOAuthUrl("google");
    window.location.href = url;
  }, []);

  const completeLogin = useCallback(
    async (sess: Session) => {
      setSession(sess);
      const { me, session: fresh } = await resolveMe(sess);
      setSession(fresh);
      applyAuthed(me, fresh);
    },
    [applyAuthed],
  );

  const logout = useCallback(async () => {
    const current = getSession();
    if (current) {
      try {
        await authApi.logout(current.accessToken);
      } catch {
        // Best-effort — clear locally regardless of the server's response.
      }
    }
    applyAnon();
  }, [applyAnon]);

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, session, loginWithGoogle, completeLogin, logout }),
    [status, user, session, loginWithGoogle, completeLogin, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an <AuthProvider>");
  return ctx;
}
