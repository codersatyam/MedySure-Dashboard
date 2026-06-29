import { Banknote, Clock, AlertTriangle, FileText } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { SectionCard } from "@/components/common/SectionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useBillingStats, useInvoices } from "../api/billing.queries";
import type { InvoiceStatus } from "../types";

const statusClasses: Record<InvoiceStatus, string> = {
  Paid: "bg-success/10 text-success",
  Pending: "bg-warning/10 text-warning",
  Overdue: "bg-destructive/10 text-destructive",
  Refunded: "bg-muted text-muted-foreground",
};

const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function BillingPage() {
  const { data: stats } = useBillingStats();
  const { data: invoices, isPending } = useInvoices();

  const tiles = [
    {
      label: "Collected (MTD)",
      value: stats?.collectedMtd,
      icon: Banknote,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Outstanding",
      value: stats?.outstanding,
      icon: Clock,
      color: "text-info",
      bg: "bg-info/10",
    },
    {
      label: "Overdue",
      value: stats?.overdue,
      icon: AlertTriangle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      label: "Claims pending",
      value: stats ? String(stats.claimsPending) : undefined,
      icon: FileText,
      color: "text-warning",
      bg: "bg-warning/10",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Revenue cycle"
        title="Billing"
        description="Track collections, outstanding balances, and insurance claims."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.label} className="bg-card border rounded-2xl p-4 shadow-soft">
              <div className={cn("size-9 rounded-lg flex items-center justify-center", t.bg)}>
                <Icon className={cn("size-[18px]", t.color)} />
              </div>
              <div className="mt-3 text-[11.5px] text-muted-foreground font-medium uppercase tracking-wide">
                {t.label}
              </div>
              {t.value ? (
                <div className="text-2xl font-semibold font-display mt-1">{t.value}</div>
              ) : (
                <Skeleton className="h-8 w-24 mt-1 rounded-md" />
              )}
            </div>
          );
        })}
      </div>

      <SectionCard
        title="Recent invoices"
        subtitle={invoices ? `${invoices.length} invoices` : "Loading…"}
      >
        {isPending ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground border-b">
                  <th className="px-2 py-2.5 font-medium">Invoice</th>
                  <th className="px-2 py-2.5 font-medium">Patient</th>
                  <th className="px-2 py-2.5 font-medium">Insurer</th>
                  <th className="px-2 py-2.5 font-medium">Issued</th>
                  <th className="px-2 py-2.5 font-medium text-right">Amount</th>
                  <th className="px-2 py-2.5 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices?.map((inv) => (
                  <tr key={inv.id} className="border-t hover:bg-muted/40 transition-colors">
                    <td className="px-2 py-3 font-medium tabular-nums">{inv.invoiceNo}</td>
                    <td className="px-2 py-3">{inv.patient}</td>
                    <td className="px-2 py-3 text-muted-foreground">{inv.insurer}</td>
                    <td className="px-2 py-3 text-muted-foreground tabular-nums">{inv.issued}</td>
                    <td className="px-2 py-3 text-right font-medium tabular-nums">
                      {currency(inv.amount)}
                    </td>
                    <td className="px-2 py-3 text-right">
                      <span
                        className={cn(
                          "text-[11px] font-medium px-2 py-0.5 rounded-full",
                          statusClasses[inv.status],
                        )}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
