import { createFileRoute } from "@tanstack/react-router";
import { BillingPage } from "@/features/billing";

export const Route = createFileRoute("/app/billing/")({
  head: () => ({ meta: [{ title: "Billing · MediSure" }] }),
  component: BillingPage,
});
