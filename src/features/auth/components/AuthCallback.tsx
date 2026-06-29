import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Activity, Loader2, TriangleAlert } from "lucide-react";
import { useAuth } from "../AuthProvider";
import type { Session } from "../types";

/** Pull the implicit-flow session out of the URL hash, if present. */
function parseSessionFromHash(hash: string): Session | null {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  if (!accessToken || !refreshToken) return null;

  const expiresAtRaw = params.get("expires_at");
  const expiresInRaw = params.get("expires_in");
  const expiresAt = expiresAtRaw
    ? Number(expiresAtRaw)
    : Math.floor(Date.now() / 1000) + Number(expiresInRaw ?? 3600);

  return {
    accessToken,
    refreshToken,
    expiresAt,
    tokenType: params.get("token_type") ?? "bearer",
  };
}

/**
 * OAuth return handler at /auth/callback. Supabase (implicit flow) appends the
 * session to the URL hash; we adopt it, hydrate the user, then land on /app.
 * Errors — including the PKCE `?code=` case the backend can't complete — are
 * surfaced rather than failing silently.
 */
export function AuthCallback() {
  const { completeLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const queryParams = new URLSearchParams(window.location.search);

    // Provider/Supabase error (e.g. user denied consent).
    const providerError = hashParams.get("error_description") || queryParams.get("error");
    if (providerError) {
      setError(providerError.replace(/\+/g, " "));
      return;
    }

    const session = parseSessionFromHash(window.location.hash);

    if (!session) {
      if (queryParams.get("code")) {
        // PKCE flow: the backend generated the OAuth URL statelessly and has no
        // code-exchange endpoint, so the browser can't complete this. Flag it.
        setError(
          "This sign-in used the PKCE code flow, which the current backend can't complete. " +
            "Switch the Supabase project to the implicit flow or add a code-exchange endpoint.",
        );
      } else {
        setError("No session was returned from the sign-in provider. Please try again.");
      }
      return;
    }

    // Strip the tokens from the address bar before doing anything else.
    window.history.replaceState(null, "", window.location.pathname);

    completeLogin(session)
      .then(() => navigate({ to: "/app" }))
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Could not complete sign-in. Please try again.",
        ),
      );
  }, [completeLogin, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      {error ? (
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-glow">
          <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <TriangleAlert className="size-5" />
          </div>
          <h1 className="mt-4 font-display text-lg font-semibold">Sign-in failed</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <Link
            to="/login"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="size-11 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
            <Activity className="size-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Completing sign-in…
          </div>
        </div>
      )}
    </div>
  );
}
