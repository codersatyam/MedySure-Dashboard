import { z } from "zod";

export const invoiceStatus = z.enum(["Paid", "Pending", "Overdue", "Refunded"]);
export type InvoiceStatus = z.infer<typeof invoiceStatus>;

export const invoiceSchema = z.object({
  id: z.string(),
  invoiceNo: z.string(),
  patient: z.string(),
  amount: z.number(),
  insurer: z.string(),
  issued: z.string(),
  status: invoiceStatus,
});
export type Invoice = z.infer<typeof invoiceSchema>;

export const billingStatsSchema = z.object({
  collectedMtd: z.string(),
  outstanding: z.string(),
  overdue: z.string(),
  claimsPending: z.number(),
});
export type BillingStats = z.infer<typeof billingStatsSchema>;
