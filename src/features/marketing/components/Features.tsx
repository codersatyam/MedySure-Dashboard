import { motion } from "framer-motion";
import {
  Brain,
  CalendarClock,
  Video,
  FileText,
  Receipt,
  Pill,
  FlaskConical,
  BellRing,
  ShieldCheck,
  Network,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Patient Insights",
    desc: "Predictive analytics surface risk patterns and triage recommendations.",
  },
  {
    icon: CalendarClock,
    title: "Smart Scheduling",
    desc: "Automated appointment routing with doctor availability and no-show prediction.",
  },
  {
    icon: Video,
    title: "Telemedicine",
    desc: "Built-in HD video consults with end-to-end encryption and recordings.",
  },
  {
    icon: FileText,
    title: "EMR & Records",
    desc: "Unified electronic medical records across departments and branches.",
  },
  {
    icon: Receipt,
    title: "Billing & Insurance",
    desc: "Automated claims, eligibility checks, and revenue cycle management.",
  },
  {
    icon: Pill,
    title: "Prescription Mgmt.",
    desc: "E-prescriptions with interaction checks and pharmacy integration.",
  },
  {
    icon: FlaskConical,
    title: "Lab Integration",
    desc: "Direct integration with major labs and instant report delivery.",
  },
  {
    icon: BellRing,
    title: "Real-time Alerts",
    desc: "Critical event notifications across SMS, email, and in-app.",
  },
  {
    icon: ShieldCheck,
    title: "HIPAA-grade Security",
    desc: "SOC 2 Type II compliant with full audit trails and RBAC.",
  },
  {
    icon: Network,
    title: "Multi-branch",
    desc: "Centralized control across clinics, hospitals, and satellite offices.",
  },
];

export function Features() {
  return (
    <section>
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            Platform capabilities
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold font-display tracking-tight mt-1">
            Everything your care team needs
          </h2>
        </div>
        <a className="hidden md:inline text-sm text-primary hover:underline">
          Explore all features →
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03, duration: 0.4 }}
              className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-border to-transparent hover:from-primary/40 hover:to-primary-glow/30 transition-all"
            >
              <div className="relative h-full bg-card rounded-2xl p-5 hover:shadow-glow transition-all overflow-hidden">
                <div className="absolute -top-10 -right-10 size-32 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                <div className="relative">
                  <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="size-[18px]" />
                  </div>
                  <h3 className="mt-4 font-semibold text-[15px]">{f.title}</h3>
                  <p className="mt-1.5 text-[12.5px] text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
