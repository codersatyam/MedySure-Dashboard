import { createFileRoute } from "@tanstack/react-router";
import { MarketingLanding } from "@/features/marketing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediFlow AI — Healthcare Operations Platform" },
      {
        name: "description",
        content:
          "Manage patients, appointments, medical records, billing and analytics from one intelligent, HIPAA-aligned healthcare platform.",
      },
      { property: "og:title", content: "MediFlow AI — Healthcare Operations Platform" },
      {
        property: "og:description",
        content: "The intelligent operating system for modern healthcare organizations.",
      },
    ],
  }),
  component: MarketingLanding,
});
