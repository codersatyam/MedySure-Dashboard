import { Link } from "@tanstack/react-router";
import { Activity, ArrowRight } from "lucide-react";
import { Hero } from "./Hero";
import { Features } from "./Features";
import { Testimonials } from "./Testimonials";
import { CTA } from "./CTA";
import { Footer } from "./Footer";

/** Public marketing landing page. Shares the app theme but lives outside the dashboard shell. */
export function MarketingLanding() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 glass border-b border-border">
        <div className="mx-auto max-w-7xl h-16 px-4 md:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
              <Activity className="size-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-display font-semibold text-[15px]">MediSure</div>
              <div className="text-[11px] text-muted-foreground">Healthcare Operations</div>
            </div>
          </Link>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow-glow hover:bg-primary-glow transition-colors"
          >
            Open Dashboard <ArrowRight className="size-4" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-8 space-y-16">
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
