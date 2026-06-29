import { mockResponse } from "@/lib/api/mock";
import type { AnalyticsSummary } from "../types";

const summary: AnalyticsSummary = {
  monthly: [
    { m: "Jan", admissions: 320, discharges: 298 },
    { m: "Feb", admissions: 345, discharges: 330 },
    { m: "Mar", admissions: 410, discharges: 388 },
    { m: "Apr", admissions: 390, discharges: 401 },
    { m: "May", admissions: 455, discharges: 430 },
    { m: "Jun", admissions: 482, discharges: 470 },
  ],
  departments: [
    { dept: "Cardiology", patients: 184 },
    { dept: "Neurology", patients: 132 },
    { dept: "Pediatrics", patients: 211 },
    { dept: "Oncology", patients: 96 },
    { dept: "Orthopedics", patients: 148 },
    { dept: "Emergency", patients: 263 },
  ],
  payerMix: [
    { name: "Private insurance", value: 48, color: "var(--primary)" },
    { name: "Medicare", value: 27, color: "var(--info)" },
    { name: "Medicaid", value: 16, color: "var(--success)" },
    { name: "Self-pay", value: 9, color: "var(--warning)" },
  ],
};

export const analyticsApi = {
  summary: () => mockResponse(summary),
};
