import { z } from "zod";

export const monthlyPointSchema = z.object({
  m: z.string(),
  admissions: z.number(),
  discharges: z.number(),
});
export type MonthlyPoint = z.infer<typeof monthlyPointSchema>;

export const departmentLoadSchema = z.object({
  dept: z.string(),
  patients: z.number(),
});
export type DepartmentLoad = z.infer<typeof departmentLoadSchema>;

export const payerSliceSchema = z.object({
  name: z.string(),
  value: z.number(),
  color: z.string(),
});
export type PayerSlice = z.infer<typeof payerSliceSchema>;

export const analyticsSummarySchema = z.object({
  monthly: z.array(monthlyPointSchema),
  departments: z.array(departmentLoadSchema),
  payerMix: z.array(payerSliceSchema),
});
export type AnalyticsSummary = z.infer<typeof analyticsSummarySchema>;
