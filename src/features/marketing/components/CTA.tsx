import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Activity, Heart, Stethoscope } from "lucide-react";
import { DemoRequestDialog } from "./DemoRequestDialog";

export function CTA() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 md:p-16 text-center">
      <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
      {[Activity, Heart, Stethoscope, Sparkles].map((Icon, i) => (
        <motion.div
          key={i}
          className="absolute text-white/10"
          style={{ top: `${15 + i * 18}%`, left: `${10 + i * 22}%` }}
          animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        >
          <Icon className="size-12 md:size-16" />
        </motion.div>
      ))}
      <div className="relative max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-medium">
          <Sparkles className="size-3" /> Now with AI-assisted triage
        </div>
        <h2 className="mt-5 text-3xl md:text-5xl font-semibold font-display tracking-tight text-white">
          Transform Healthcare Operations with AI
        </h2>
        <p className="mt-4 text-white/80 text-base md:text-lg leading-relaxed">
          Join thousands of clinicians using MediFlow to deliver better care, faster.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <DemoRequestDialog
            trigger={
              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary font-semibold text-sm hover:bg-white/90 transition-colors shadow-elevated"
              >
                Request Demo <ArrowRight className="size-4" />
              </button>
            }
          />
          {/* <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/30 text-white font-semibold text-sm hover:bg-white/20 transition-colors">
            Start Free Trial
          </button> */}
        </div>
      </div>
    </section>
  );
}
