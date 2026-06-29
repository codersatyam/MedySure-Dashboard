import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { SectionCard } from "@/components/common/SectionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalyticsSummary } from "../api/analytics.queries";

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  fontSize: 12,
};

export function AnalyticsPage() {
  const { data } = useAnalyticsSummary();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Insights"
        title="Analytics"
        description="Operational trends across admissions, departments, and payer mix."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <SectionCard
          title="Admissions vs. discharges"
          subtitle="Last 6 months"
          className="lg:col-span-2"
        >
          <div className="h-72">
            {data ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.monthly}>
                  <defs>
                    <linearGradient id="adm" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="dis" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--info)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--info)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                  <Area
                    type="monotone"
                    dataKey="admissions"
                    stroke="var(--primary)"
                    strokeWidth={2.5}
                    fill="url(#adm)"
                  />
                  <Area
                    type="monotone"
                    dataKey="discharges"
                    stroke="var(--info)"
                    strokeWidth={2.5}
                    fill="url(#dis)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Skeleton className="h-full w-full rounded-xl" />
            )}
          </div>
        </SectionCard>

        <SectionCard title="Payer mix" subtitle="Share of patients">
          {data ? (
            <div className="flex items-center gap-4">
              <div className="size-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.payerMix}
                      dataKey="value"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {data.payerMix.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="space-y-2 flex-1">
                {data.payerMix.map((d) => (
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

        <SectionCard
          title="Patient load by department"
          subtitle="Active patients"
          className="lg:col-span-3"
        >
          <div className="h-72">
            {data ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.departments}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="dept"
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
                  <Bar dataKey="patients" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Skeleton className="h-full w-full rounded-xl" />
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
