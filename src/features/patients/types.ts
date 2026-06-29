import { z } from "zod";

export const patientStatus = z.enum(["Admitted", "Outpatient", "Discharged", "Critical"]);
export type PatientStatus = z.infer<typeof patientStatus>;

export const patientSchema = z.object({
  id: z.string(),
  name: z.string(),
  mrn: z.string(),
  age: z.number(),
  gender: z.enum(["M", "F"]),
  condition: z.string(),
  doctor: z.string(),
  status: patientStatus,
  lastVisit: z.string(),
});
export type Patient = z.infer<typeof patientSchema>;
