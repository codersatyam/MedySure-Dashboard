import { createFileRoute } from "@tanstack/react-router";
import { DoctorsPage } from "@/features/doctors";

export const Route = createFileRoute("/app/doctors/")({
  head: () => ({ meta: [{ title: "Doctors · MediSure" }] }),
  component: DoctorsPage,
});
