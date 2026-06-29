import { useState } from "react";
import { Outlet, useRouterState } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

/** Maps a route path to the breadcrumb + title shown in the Topbar. */
const PAGE_META: Record<string, { breadcrumb: string[]; title: string }> = {
  "/app": { breadcrumb: ["Operations", "Overview"], title: "Dashboard" },
  "/app/patients": { breadcrumb: ["Operations", "Patients"], title: "Patients" },
  "/app/appointments": { breadcrumb: ["Operations", "Appointments"], title: "Appointments" },
  "/app/billing": { breadcrumb: ["Operations", "Billing"], title: "Billing" },
  "/app/analytics": { breadcrumb: ["Operations", "Analytics"], title: "Analytics" },
};

const FALLBACK = { breadcrumb: ["Operations"], title: "Dashboard" };

/**
 * Authenticated dashboard shell: sticky sidebar + topbar rendered once, with
 * child routes swapping inside <Outlet />. The collapse state and theme toggle
 * persist across navigation because this layout is not remounted per page.
 */
export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const meta = PAGE_META[pathname] ?? FALLBACK;

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar breadcrumb={meta.breadcrumb} title={meta.title} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
