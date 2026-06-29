import type { ComponentType } from "react";
import {
  Users,
  CalendarCheck,
  Stethoscope,
  FlaskConical,
  DollarSign,
  Siren,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useKpis } from "../api/overview.queries";
import type { Kpi } from "../types";

const spark = (seed: number) =>
  Array.from({ length: 12 }, (_, i) => ({
    v: Math.round(50 + Math.sin(i / 1.5 + seed) * 18 + Math.random() * 12),
  }));

const iconMap: Record<Kpi["icon"], ComponentType<{ className?: string }>> = {
  patients: Users,
  appointments: CalendarCheck,
  doctors: Stethoscope,
  labs: FlaskConical,
  revenue: DollarSign,
  emergency: Siren,
};

const colorMap: Record<string, { bg: string; text: string; fill: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary", fill: "var(--primary)" },
  info: { bg: "bg-info/10", text: "text-info", fill: "var(--info)" },
  success: { bg: "bg-success/10", text: "text-success", fill: "var(--success)" },
  warning: { bg: "bg-warning/10", text: "text-warning", fill: "var(--warning)" },
  destructive: { bg: "bg-destructive/10", text: "text-destructive", fill: "var(--destructive)" },
};

export function KpiCards() {
  const { data: kpis, isPending } = useKpis();

  if (isPending || !kpis) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[164px] rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((k, i) => {
        const c = colorMap[k.color];
        const Icon = iconMap[k.icon];
        const data = spark(i);
        return (
          <motion.div
            key={k.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.35 }}
            className="group relative bg-card border rounded-2xl p-4 shadow-soft hover:shadow-elevated transition-all overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className={cn("size-9 rounded-lg flex items-center justify-center", c.bg)}>
                <Icon className={cn("size-[18px]", c.text)} />
              </div>
              <span
                className={cn(
                  "text-[11px] font-medium inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full",
                  k.up ? "text-success bg-success/10" : "text-destructive bg-destructive/10",
                )}
              >
                {k.up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                {k.delta}
              </span>
            </div>
            <div className="mt-3">
              <div className="text-[11.5px] text-muted-foreground font-medium uppercase tracking-wide">
                {k.label}
              </div>
              <div className="text-2xl font-semibold font-display mt-1">{k.value}</div>
            </div>
            <div className="h-10 -mx-1 mt-2 opacity-80 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id={`g-${i}`} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={c.fill} stopOpacity={0.45} />
                      <stop offset="100%" stopColor={c.fill} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke={c.fill}
                    strokeWidth={1.75}
                    fill={`url(#g-${i})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
