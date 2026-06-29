import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Clock, Package } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  useAppointmentsByHour,
  useDemographics,
  useDoctorAvailability,
  useInventory,
  usePatientQueue,
  useRevenue,
} from "../api/overview.queries";

const statusClasses: Record<string, string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
  muted: "bg-muted text-muted-foreground",
};

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  fontSize: 12,
};

export function Widgets() {
  const revenue = useRevenue();
  const demographics = useDemographics();
  const queue = usePatientQueue();
  const schedule = useDoctorAvailability();
  const inventory = useInventory();
  const byHour = useAppointmentsByHour();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Revenue chart */}
      <SectionCard
        title="Revenue analytics"
        subtitle="Last 10 months · USD (thousands)"
        className="lg:col-span-2"
      >
        <div className="h-72">
          {revenue.data ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenue.data}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="m"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="var(--muted-foreground)"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Skeleton className="h-full w-full rounded-xl" />
          )}
        </div>
      </SectionCard>

      {/* Demographics */}
      <SectionCard title="Patient demographics" subtitle="By age group">
        {demographics.data ? (
          <div className="flex items-center gap-4">
            <div className="size-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={demographics.data}
                    dataKey="value"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {demographics.data.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2 flex-1">
              {demographics.data.map((d) => (
                <li key={d.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full" style={{ background: d.color }} />
                    {d.name}
                  </span>
                  <span className="font-medium">{d.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <Skeleton className="h-44 w-full rounded-xl" />
        )}
      </SectionCard>

      {/* Patient queue */}
      <SectionCard
        title="Live patient queue"
        subtitle="Updated in real time"
        className="lg:col-span-2"
      >
        <div className="overflow-x-auto -mx-1">
          {queue.data ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                  <th className="px-2 py-2 font-medium">Patient</th>
                  <th className="px-2 py-2 font-medium">Reason</th>
                  <th className="px-2 py-2 font-medium">Status</th>
                  <th className="px-2 py-2 font-medium text-right">Wait</th>
                </tr>
              </thead>
              <tbody>
                {queue.data.map((q) => (
                  <tr key={q.name} className="border-t hover:bg-muted/40 transition-colors">
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-[11px] font-semibold">
                          {q.name
                            .split(" ")
                            .map((s) => s[0])
                            .join("")}
                        </div>
                        <span className="font-medium">{q.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-muted-foreground">{q.reason}</td>
                    <td className="px-2 py-3">
                      <span
                        className={cn(
                          "text-[11px] font-medium px-2 py-0.5 rounded-full",
                          statusClasses[q.color],
                        )}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-right text-muted-foreground tabular-nums">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" />
                        {q.time}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Skeleton className="h-56 w-full rounded-xl" />
          )}
        </div>
      </SectionCard>

      {/* Doctor schedule */}
      <SectionCard title="Doctor availability" subtitle="On-shift today">
        {schedule.data ? (
          <ul className="space-y-3">
            {schedule.data.map((s) => (
              <li
                key={s.dr}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div>
                  <div className="text-sm font-medium">{s.dr}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {s.spec} · {s.patients} patients
                  </div>
                </div>
                <span
                  className={cn(
                    "text-[10.5px] font-medium px-2 py-0.5 rounded-full",
                    statusClasses[s.color],
                  )}
                >
                  {s.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <Skeleton className="h-44 w-full rounded-xl" />
        )}
      </SectionCard>

      {/* Inventory */}
      <SectionCard
        title="Medical inventory"
        subtitle="Stock levels"
        icon={<Package className="size-4" />}
      >
        {inventory.data ? (
          <ul className="space-y-3">
            {inventory.data.map((i) => (
              <li key={i.item}>
                <div className="flex justify-between text-sm">
                  <span>{i.item}</span>
                  <span
                    className={cn(
                      "font-medium tabular-nums",
                      i.level < 30
                        ? "text-destructive"
                        : i.level < 60
                          ? "text-warning"
                          : "text-success",
                    )}
                  >
                    {i.level}%
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      i.level < 30 ? "bg-destructive" : i.level < 60 ? "bg-warning" : "bg-success",
                    )}
                    style={{ width: `${i.level}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <Skeleton className="h-44 w-full rounded-xl" />
        )}
      </SectionCard>

      {/* Appointments today bar */}
      <SectionCard title="Appointments by hour" subtitle="Today" className="lg:col-span-2">
        <div className="h-56">
          {byHour.data ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byHour.data}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="h"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="v" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Skeleton className="h-full w-full rounded-xl" />
          )}
        </div>
      </SectionCard>
    </div>
  );
}
