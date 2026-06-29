import { CalendarPlus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { SectionCard } from "@/components/common/SectionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAppointments } from "../api/appointments.queries";
import type { AppointmentStatus } from "../types";

const statusClasses: Record<AppointmentStatus, string> = {
  Confirmed: "bg-info/10 text-info",
  "Checked in": "bg-success/10 text-success",
  Waiting: "bg-warning/10 text-warning",
  Completed: "bg-muted text-muted-foreground",
  Cancelled: "bg-destructive/10 text-destructive",
};

export function AppointmentsPage() {
  const { data: appointments, isPending } = useAppointments();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Scheduling"
        title="Appointments"
        description="Today's schedule across all departments and providers."
        actions={
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow-glow hover:bg-primary-glow transition-colors">
            <CalendarPlus className="size-4" /> Schedule
          </button>
        }
      />

      <SectionCard
        title="Today's appointments"
        subtitle={appointments ? `${appointments.length} scheduled` : "Loading…"}
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
                  <th className="px-2 py-2.5 font-medium">Time</th>
                  <th className="px-2 py-2.5 font-medium">Patient</th>
                  <th className="px-2 py-2.5 font-medium">Doctor</th>
                  <th className="px-2 py-2.5 font-medium">Department</th>
                  <th className="px-2 py-2.5 font-medium">Type</th>
                  <th className="px-2 py-2.5 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments?.map((a) => (
                  <tr key={a.id} className="border-t hover:bg-muted/40 transition-colors">
                    <td className="px-2 py-3 font-medium tabular-nums">{a.time}</td>
                    <td className="px-2 py-3">{a.patient}</td>
                    <td className="px-2 py-3 text-muted-foreground">{a.doctor}</td>
                    <td className="px-2 py-3 text-muted-foreground">{a.department}</td>
                    <td className="px-2 py-3 text-muted-foreground">{a.type}</td>
                    <td className="px-2 py-3 text-right">
                      <span
                        className={cn(
                          "text-[11px] font-medium px-2 py-0.5 rounded-full",
                          statusClasses[a.status],
                        )}
                      >
                        {a.status}
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
