import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Activity, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../AuthProvider";

/** Google "G" mark — inline SVG so we don't pull in an icon dependency. */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

/**
 * Dedicated sign-in screen. Sends the user through the backend-driven Google
 * OAuth flow. Already-authenticated users are bounced straight to the dashboard.
 */
export function LoginPage() {
  const { status, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authed") navigate({ to: "/app" });
  }, [status, navigate]);

  const handleGoogle = async () => {
    setError(null);
    setSubmitting(true);
    try {
      // On success this navigates away to Google, so we stay in `submitting`.
      await loginWithGoogle();
    } catch (err) {
      setSubmitting(false);
      setError(
        err instanceof Error ? err.message : "Could not start Google sign-in. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl h-16 px-4 md:px-6 flex items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
              <Activity className="size-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-display font-semibold text-[15px]">MediSure</div>
              <div className="text-[11px] text-muted-foreground">Healthcare Operations</div>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-glow">
          <div className="text-center">
            <h1 className="font-display text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to access your healthcare operations dashboard.
            </p>
          </div>

          <div className="mt-8">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleGoogle}
              disabled={submitting || status === "loading"}
            >
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <GoogleIcon className="size-4" />
              )}
              {submitting ? "Redirecting to Google…" : "Continue with Google"}
            </Button>

            {error && (
              <p className="mt-4 text-center text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            By continuing you agree to MediSure's Terms of Service and Privacy Policy.
          </p>
        </div>
      </main>
    </div>
  );
}
