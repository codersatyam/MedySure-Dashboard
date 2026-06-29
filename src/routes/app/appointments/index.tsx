import { createFileRoute } from "@tanstack/react-router";
import { AppointmentsPage } from "@/features/appointments";

export const Route = createFileRoute("/app/appointments/")({
  head: () => ({ meta: [{ title: "Appointments · MediSure" }] }),
  component: AppointmentsPage,
});
