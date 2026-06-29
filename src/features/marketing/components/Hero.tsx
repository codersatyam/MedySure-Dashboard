import { motion } from "framer-motion";
import { UserPlus, CalendarPlus, Activity, Heart, BedDouble, Siren } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const chart = [
  { d: "Mon", v: 240 },
  { d: "Tue", v: 280 },
  { d: "Wed", v: 310 },
  { d: "Thu", v: 295 },
  { d: "Fri", v: 340 },
  { d: "Sat", v: 220 },
  { d: "Sun", v: 310 },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border bg-card shadow-soft">
      <div className="absolute inset-0 bg-gradient-mesh opacity-90" />
      <div className="relative grid lg:grid-cols-[1.1fr_1fr] gap-8 p-6 md:p-10">
        {/* Left */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20"
          >
            <span className="size-1.5 rounded-full bg-success animate-pulse" />
            All systems operational · 99.99% uptime
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-4 text-3xl md:text-4xl lg:text-5xl font-semibold font-display tracking-tight"
          >
            Healthcare Operations,
            <br />
            <span className="bg-gradient-hero bg-clip-text text-transparent">Simplified.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-muted-foreground max-w-lg leading-relaxed"
          >
            Manage patients, appointments, medical records, billing, and analytics from one
            intelligent platform built for modern care teams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6 flex flex-wrap gap-3"
          >
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow-glow hover:bg-primary-glow transition-colors">
              <UserPlus className="size-4" /> Add Patient
            </button>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card border text-foreground font-medium text-sm hover:bg-muted transition-colors">
              <CalendarPlus className="size-4" /> Schedule Appointment
            </button>
          </motion.div>

          <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
            {[
              { k: "+24%", v: "Patient growth" },
              { k: "98.2%", v: "Satisfaction" },
              { k: "1.4h", v: "Avg. response" },
            ].map((s) => (
              <div key={s.v}>
                <div className="text-xl font-semibold font-display">{s.k}</div>
                <div className="text-[11px] text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right widgets */}
        <div className="relative min-h-[360px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-0 right-0 w-[78%] bg-card border rounded-2xl shadow-elevated p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-xs text-muted-foreground">Patient flow · this week</div>
                <div className="text-lg font-semibold font-display">1,994 visits</div>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">
                +12.4%
              </span>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chart}>
                  <defs>
                    <linearGradient id="hero-g" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="d"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fill="url(#hero-g)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-16 left-0 w-[58%] bg-card border rounded-2xl shadow-elevated p-4"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Bed occupancy</div>
              <BedDouble className="size-4 text-info" />
            </div>
            <div className="mt-2 text-2xl font-semibold font-display">
              82<span className="text-sm text-muted-foreground">/100</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "82%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-full bg-gradient-hero rounded-full"
              />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-1 text-[10.5px]">
              <span className="text-success">ICU 12</span>
              <span className="text-warning">Gen 48</span>
              <span className="text-info">Mat 22</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-0 right-4 w-[62%] bg-card border rounded-2xl shadow-elevated p-4"
          >
            <div className="flex items-center gap-2 text-destructive">
              <Siren className="size-4" />
              <div className="text-xs font-semibold uppercase tracking-wide">Emergency alert</div>
            </div>
            <div className="mt-1.5 text-sm font-medium">Trauma case incoming · ETA 4 min</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Bay 3 prepped · Dr. Mendoza on call
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute top-32 left-4 size-20 rounded-2xl bg-card border shadow-elevated flex flex-col items-center justify-center"
          >
            <Heart className="size-5 text-destructive animate-pulse" />
            <div className="text-[10px] text-muted-foreground mt-1">Avg HR</div>
            <div className="text-sm font-semibold">78 bpm</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
