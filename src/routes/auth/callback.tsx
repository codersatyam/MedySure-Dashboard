import { createFileRoute } from "@tanstack/react-router";
import { AuthCallback } from "@/features/auth";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({
    meta: [{ title: "Signing in · MediSure" }],
  }),
  component: AuthCallback,
});
