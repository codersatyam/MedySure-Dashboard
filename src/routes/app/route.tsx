import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { getSession } from "@/features/auth";

/** Layout route for the authenticated dashboard. Renders the persistent shell. */
export const Route = createFileRoute("/app")({
  // Cheap gate: no stored session → bounce to /login before rendering the shell.
  // Token *validity* is confirmed by `getMe` in AuthProvider, which signs the
  // user out if the session turns out to be stale.
  beforeLoad: () => {
    if (!getSession()) {
      throw redirect({ to: "/login" });
    }
  },
  component: AppShell,
});
