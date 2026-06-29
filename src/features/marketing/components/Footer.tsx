import { Activity, Github, Linkedin, Twitter } from "lucide-react";

const cols = [
  { title: "Product", links: ["Dashboard", "Patients", "Doctors", "Appointments"] },
  // { title: "Compliance", links: ["HIPAA", "SOC 2 Type II", "GDPR", "Security", "Trust Center"] },
  { title: "Resources", links: ["API Docs", "Help Center", "Changelog", "Community", "Status"] },
  { title: "Company", links: ["About", "Customers", "Careers", "Privacy Policy", "Terms"] },
];

export function Footer() {
  return (
    <footer className="bg-card border rounded-3xl p-8 md:p-12 shadow-soft">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-gradient-hero flex items-center justify-center">
              <Activity className="size-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-display font-semibold">MediSure</div>
              <div className="text-[11px] text-muted-foreground">Healthcare Operations</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
            The intelligent operating system for modern healthcare organizations.
          </p>
          {/* <form className="mt-5 flex gap-2 max-w-sm">
            <input
              type="email"
              placeholder="your@hospital.com"
              className="flex-1 h-10 px-3.5 rounded-lg bg-muted border border-transparent focus:bg-card focus:border-ring focus:outline-none text-sm"
            />
            <button className="px-4 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-glow transition-colors">
              Subscribe
            </button>
          </form> */}
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              {c.title}
            </div>
            <ul className="space-y-2">
              {c.links.map((l) => (
                <li key={l}>
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-10 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xs text-muted-foreground">
          © 2026 MediSure 
        </div>
        {/* <div className="flex items-center gap-2">
          {[Twitter, Linkedin, Github].map((Icon, i) => (
            <a
              key={i}
              className="size-9 rounded-lg border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div> */}
      </div>
    </footer>
  );
}
