import { createFileRoute } from "@tanstack/react-router";
import { PatientsPage } from "@/features/patients";

export const Route = createFileRoute("/app/patients/")({
  head: () => ({ meta: [{ title: "Patients · MediSure" }] }),
  component: PatientsPage,
});
