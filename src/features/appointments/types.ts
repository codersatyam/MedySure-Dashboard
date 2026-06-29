import { z } from "zod";

export const appointmentStatus = z.enum([
  "Confirmed",
  "Checked in",
  "Waiting",
  "Completed",
  "Cancelled",
]);
export type AppointmentStatus = z.infer<typeof appointmentStatus>;

export const appointmentSchema = z.object({
  id: z.string(),
  time: z.string(),
  patient: z.string(),
  doctor: z.string(),
  department: z.string(),
  type: z.string(),
  status: appointmentStatus,
});
export type Appointment = z.infer<typeof appointmentSchema>;
