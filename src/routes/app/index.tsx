import { createFileRoute } from "@tanstack/react-router";
import { OverviewPage } from "@/features/overview";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [{ title: "Dashboard · MediSure" }],
  }),
  component: OverviewPage,
});
