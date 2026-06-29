import { z } from "zod";

/** Theme color tokens used to style badges, charts, and status pills. */
export const themeColor = z.enum(["primary", "info", "success", "warning", "destructive", "muted"]);
export type ThemeColor = z.infer<typeof themeColor>;

/** Icon keys are resolved to lucide components in the UI layer (see iconMap). */
export const kpiSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
  delta: z.string(),
  up: z.boolean(),
  icon: z.enum(["patients", "appointments", "doctors", "labs", "revenue", "emergency"]),
  color: themeColor,
});
export type Kpi = z.infer<typeof kpiSchema>;

export const revenuePointSchema = z.object({
  m: z.string(),
  revenue: z.number(),
  expenses: z.number(),
});
export type RevenuePoint = z.infer<typeof revenuePointSchema>;

export const demographicSliceSchema = z.object({
  name: z.string(),
  value: z.number(),
  color: z.string(),
});
export type DemographicSlice = z.infer<typeof demographicSliceSchema>;

export const queueEntrySchema = z.object({
  name: z.string(),
  reason: z.string(),
  status: z.string(),
  color: themeColor,
  time: z.string(),
});
export type QueueEntry = z.infer<typeof queueEntrySchema>;

export const doctorAvailabilitySchema = z.object({
  dr: z.string(),
  spec: z.string(),
  patients: z.number(),
  status: z.string(),
  color: themeColor,
});
export type DoctorAvailability = z.infer<typeof doctorAvailabilitySchema>;

export const inventoryItemSchema = z.object({
  item: z.string(),
  level: z.number(),
});
export type InventoryItem = z.infer<typeof inventoryItemSchema>;

export const hourlyPointSchema = z.object({
  h: z.string(),
  v: z.number(),
});
export type HourlyPoint = z.infer<typeof hourlyPointSchema>;

export const activityEntrySchema = z.object({
  id: z.string(),
  icon: z.enum(["check-in", "doctor", "prescription", "lab", "emergency"]),
  color: themeColor,
  title: z.string(),
  desc: z.string(),
  time: z.string(),
});
export type ActivityEntry = z.infer<typeof activityEntrySchema>;
