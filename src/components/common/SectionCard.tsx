import type { ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Standard dashboard panel: titled card with optional subtitle/icon and an
 * overflow affordance. Shared across overview widgets and feature pages.
 */
export function SectionCard({
  title,
  subtitle,
  children,
  className,
  icon,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <div className={cn("bg-card border rounded-2xl p-5 shadow-soft", className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            {icon}
            {title}
          </div>
          {subtitle && <div className="text-[11.5px] text-muted-foreground mt-0.5">{subtitle}</div>}
        </div>
        <button className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors">
          <MoreHorizontal className="size-4" />
        </button>
      </div>
      {children}
    </div>
  );
}
