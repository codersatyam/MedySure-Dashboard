import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Sign in · MediSure" }],
  }),
  component: LoginPage,
});
