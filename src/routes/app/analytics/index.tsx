import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsPage } from "@/features/analytics";

export const Route = createFileRoute("/app/analytics/")({
  head: () => ({ meta: [{ title: "Analytics · MediSure" }] }),
  component: AnalyticsPage,
});
