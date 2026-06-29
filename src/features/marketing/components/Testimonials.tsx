import { Star } from "lucide-react";

const reviews = [
  {
    quote: "MediSure cut our patient intake time by 42%. The scheduling AI is uncanny.",
    name: "Dr. Shubham Pandey",
    role: "Clinic Owner",
    rating: 5,
  },
  {
    quote: "MediSure has streamlined our clinic operations and improved patient care.",
    name: "Dr. Ravi Patel",
    role: "Clinic Owner",
    rating: 5,
  },
  {
    quote: "MediSure has improved our patient flow and reduced wait times significantly.",
    name: "Dr. Anjali Sharma",
    role: "Clinic Owner",
    rating: 5,
  },
];

const logos = [
  ""
];

export function Testimonials() {
  return (
    <section>
      <div className="text-center mb-8">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          Trusted by care teams
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold font-display tracking-tight mt-2">
          Powering 1,200+ healthcare organizations
        </h2>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 mb-10 opacity-70">
        {logos.map((l) => (
          <span
            key={l}
            className="text-sm font-display font-semibold tracking-tight text-muted-foreground"
          >
            {l}
          </span>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {reviews.map((r) => (
          <figure
            key={r.name}
            className="bg-card border rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-shadow"
          >
            <div className="flex gap-0.5 text-warning mb-3">
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>
            <blockquote className="text-[14.5px] leading-relaxed text-foreground">
              "{r.quote}"
            </blockquote>
            <figcaption className="mt-5 pt-4 border-t">
              <div className="text-sm font-semibold">{r.name}</div>
              <div className="text-[11.5px] text-muted-foreground">{r.role}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
