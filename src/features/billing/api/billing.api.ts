import { mockResponse } from "@/lib/api/mock";
import type { BillingStats, Invoice } from "../types";

const stats: BillingStats = {
  collectedMtd: "$284.5K",
  outstanding: "$62.1K",
  overdue: "$18.4K",
  claimsPending: 47,
};

const invoices: Invoice[] = [
  {
    id: "i1",
    invoiceNo: "INV-20451",
    patient: "Anna Cole",
    amount: 1280,
    insurer: "BlueCare",
    issued: "Jun 24, 2026",
    status: "Paid",
  },
  {
    id: "i2",
    invoiceNo: "INV-20452",
    patient: "James Park",
    amount: 540,
    insurer: "Helix Medical",
    issued: "Jun 22, 2026",
    status: "Pending",
  },
  {
    id: "i3",
    invoiceNo: "INV-20453",
    patient: "Marco Diaz",
    amount: 9650,
    insurer: "Vitality Health",
    issued: "Jun 18, 2026",
    status: "Overdue",
  },
  {
    id: "i4",
    invoiceNo: "INV-20454",
    patient: "Sara Khan",
    amount: 320,
    insurer: "BlueCare",
    issued: "Jun 26, 2026",
    status: "Paid",
  },
  {
    id: "i5",
    invoiceNo: "INV-20455",
    patient: "David Klein",
    amount: 4210,
    insurer: "Northwind",
    issued: "Jun 27, 2026",
    status: "Pending",
  },
  {
    id: "i6",
    invoiceNo: "INV-20456",
    patient: "Emily Nwosu",
    amount: 760,
    insurer: "Helix Medical",
    issued: "Jun 15, 2026",
    status: "Refunded",
  },
];

export const billingApi = {
  stats: () => mockResponse(stats),
  invoices: () => mockResponse(invoices),
};
