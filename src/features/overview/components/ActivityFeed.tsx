import type { ComponentType } from "react";
import { UserCheck, Stethoscope, Pill, FlaskConical, Siren } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useActivity } from "../api/overview.queries";
import type { ActivityEntry } from "../types";

const iconMap: Record<ActivityEntry["icon"], ComponentType<{ className?: string }>> = {
  "check-in": UserCheck,
  doctor: Stethoscope,
  prescription: Pill,
  lab: FlaskConical,
  emergency: Siren,
};

const colorMap: Record<string, string> = {
  success: "bg-success/10 text-success",
  primary: "bg-primary/10 text-primary",
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
};

export function ActivityFeed() {
  const { data: activities } = useActivity();

  return (
    <div className="bg-card border rounded-2xl p-5 shadow-soft">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold">Recent activity</h3>
          <p className="text-[11.5px] text-muted-foreground">Across all departments</p>
        </div>
        <button className="text-xs text-primary hover:underline">View all</button>
      </div>
      {activities ? (
        <ol className="relative space-y-5">
          <span className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
          {activities.map((a) => {
            const Icon = iconMap[a.icon];
            return (
              <li key={a.id} className="relative flex gap-3.5">
                <div
                  className={cn(
                    "relative z-10 size-8 rounded-full flex items-center justify-center ring-4 ring-card",
                    colorMap[a.color],
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="text-sm font-medium">{a.title}</div>
                    <div className="text-[10.5px] text-muted-foreground whitespace-nowrap">
                      {a.time}
                    </div>
                  </div>
                  <div className="text-[12.5px] text-muted-foreground">{a.desc}</div>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="space-y-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      )}
    </div>
  );
}
