import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronsLeft, ChevronsRight, LogOut, Sparkles, Activity } from "lucide-react";
import { navGroups, type NavItem } from "@/constants/navigation";
import { cn } from "@/lib/utils";

function useIsActive() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (to?: string) => {
    if (!to) return false;
    // "/app" should only match the overview exactly; nested routes match by prefix.
    return to === "/app" ? pathname === to : pathname.startsWith(to);
  };
}

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const isActive = useIsActive();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col glass-dark border-r border-sidebar-border text-sidebar-foreground",
        "transition-[width] duration-300 ease-out shrink-0 sticky top-0 h-screen",
        collapsed ? "w-[76px]" : "w-[272px]",
      )}
    >
      {/* Logo */}
      <Link to="/app" className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
        <div className="relative size-9 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow shrink-0">
          <Activity className="size-5 text-primary-foreground" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="font-display font-semibold text-[15px] leading-tight text-white">
              MediSure
            </div>
            <div className="text-[11px] text-sidebar-foreground/60 truncate">
              Healthcare Operations
            </div>
          </div>
        )}
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide px-3 py-4 space-y-6">
        {navGroups.map((g) => (
          <div key={g.title}>
            {!collapsed && (
              <div className="px-3 mb-2 text-[10.5px] font-semibold tracking-[0.12em] uppercase text-sidebar-foreground/40">
                {g.title}
              </div>
            )}
            <ul className="space-y-0.5">
              {g.items.map((it) => (
                <NavRow key={it.label} item={it} collapsed={collapsed} active={isActive(it.to)} />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-sidebar-border p-3 space-y-2">
        {!collapsed && (
          <div className="rounded-xl p-3 bg-gradient-to-br from-primary/20 to-primary-glow/10 border border-primary/20">
            <div className="flex items-center gap-2 text-white text-sm font-medium">
              <Sparkles className="size-4 text-primary-glow" />
              Upgrade to Pro
            </div>
            <p className="text-[11.5px] text-sidebar-foreground/70 mt-1 leading-snug">
              Unlock AI insights, unlimited records & multi-branch.
            </p>
            <button className="mt-2.5 w-full text-xs font-medium rounded-lg bg-primary hover:bg-primary-glow transition-colors text-primary-foreground py-2">
              Upgrade plan
            </button>
          </div>
        )}

        <div
          className={cn(
            "flex items-center gap-3 rounded-xl p-2 hover:bg-sidebar-accent transition-colors",
            collapsed && "justify-center",
          )}
        >
          <div className="size-9 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-xs font-semibold shrink-0">
            DR
          </div>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-white truncate">Dr. Reyes</div>
                <div className="text-[11px] text-sidebar-foreground/60 truncate">
                  Cardiology Lead
                </div>
              </div>
              <button className="text-sidebar-foreground/60 hover:text-white transition-colors p-1.5 rounded-md hover:bg-sidebar-accent">
                <LogOut className="size-4" />
              </button>
            </>
          )}
        </div>

        <button
          onClick={onToggle}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white transition-colors",
            collapsed && "justify-center",
          )}
        >
          {collapsed ? (
            <ChevronsRight className="size-4" />
          ) : (
            <>
              <ChevronsLeft className="size-4" /> Collapse
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

function NavRow({
  item,
  collapsed,
  active,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
}) {
  const Icon = item.icon;

  const inner = (
    <>
      {active && (
        <motion.span
          layoutId="active-indicator"
          className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-primary-glow"
        />
      )}
      <Icon className="size-[18px] shrink-0" />
      {!collapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
      {!collapsed && item.badge !== undefined && (
        <span className="text-[10.5px] font-medium px-1.5 py-0.5 rounded-full bg-primary/20 text-primary-glow border border-primary/30">
          {item.badge}
        </span>
      )}
    </>
  );

  const className = cn(
    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all relative",
    active
      ? "bg-sidebar-accent text-white"
      : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-white",
    collapsed && "justify-center px-0",
    !item.to && "cursor-not-allowed opacity-60",
  );

  return (
    <li className="relative group">
      {item.to ? (
        <Link to={item.to} className={className}>
          {inner}
        </Link>
      ) : (
        <button type="button" className={className} aria-disabled title="Coming soon">
          {inner}
        </button>
      )}
      {collapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-md bg-popover text-popover-foreground text-xs font-medium shadow-elevated opacity-0 group-hover:opacity-100 pointer-events-none translate-x-1 group-hover:translate-x-0 transition-all whitespace-nowrap z-50 border">
          {item.label}
        </div>
      )}
    </li>
  );
}
