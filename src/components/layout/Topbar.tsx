import { Bell, MessageSquare, Search, Moon, Sun, Globe, ChevronDown, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type TopbarProps = {
  /** Breadcrumb trail leading to the current page, e.g. ["Operations", "Overview"]. */
  breadcrumb?: string[];
  /** Page title shown beneath the breadcrumb. */
  title?: string;
};

export function Topbar({
  breadcrumb = ["Operations", "Overview"],
  title = "Dashboard",
}: TopbarProps) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 glass border-b border-border">
      <div className="h-16 px-4 md:px-6 flex items-center gap-4">
        {/* Left: breadcrumbs */}
        <div className="hidden md:flex flex-col min-w-0">
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            {breadcrumb.map((crumb, i) => (
              <span key={crumb} className="flex items-center gap-1.5">
                {i > 0 && <span className="opacity-40">/</span>}
                <span>{crumb}</span>
              </span>
            ))}
          </div>
          <h1 className="text-[15px] font-semibold tracking-tight truncate">{title}</h1>
        </div>

        {/* Center: search */}
        <div className="flex-1 max-w-xl mx-auto">
          <div className="relative">
            <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search patients, doctors, appointments…"
              className="w-full h-10 pl-10 pr-16 rounded-xl bg-muted/60 border border-transparent focus:bg-card focus:border-ring focus:outline-none text-sm placeholder:text-muted-foreground transition-all"
            />
            <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium px-1.5 py-0.5 rounded border bg-card text-muted-foreground">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">
          <IconBtn label="Messages">
            <MessageSquare className="size-[18px]" />
            <Dot color="bg-info" />
          </IconBtn>
          <IconBtn label="Notifications">
            <Bell className="size-[18px]" />
            <Dot color="bg-destructive" />
          </IconBtn>
          <IconBtn label="Language">
            <Globe className="size-[18px]" />
          </IconBtn>
          <IconBtn label="Theme" onClick={() => setDark((d) => !d)}>
            {dark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
          </IconBtn>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}

/** Build up-to-two-letter initials from a display name or email. */
function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0]?.slice(0, 2) ?? "?").toUpperCase();
}

/** Authenticated user chip + dropdown (profile summary, logout). */
function UserMenu() {
  const { user, logout } = useAuth();
  const profile = user?.profile;

  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim() ||
    profile?.email ||
    "Account";
  const email = profile?.email ?? "";
  const role = user?.groups?.[0] ?? "Member";
  const initials = initialsFrom(displayName);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Account menu"
          className="ml-2 pl-3 border-l flex items-center gap-2 cursor-pointer hover:bg-muted/60 rounded-lg p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <div className="size-8 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-xs font-semibold">
            {initials}
          </div>
          <div className="hidden lg:block leading-tight text-left">
            <div className="text-[13px] font-medium max-w-[160px] truncate">{displayName}</div>
            <div className="text-[10.5px] text-muted-foreground">{role}</div>
          </div>
          <ChevronDown className="size-4 text-muted-foreground hidden lg:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="leading-tight">
          <div className="text-sm font-medium truncate">{displayName}</div>
          {email && <div className="text-xs font-normal text-muted-foreground truncate">{email}</div>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => logout()}>
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function IconBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="relative size-9 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
    >
      {children}
    </button>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <span
      className={`absolute top-2 right-2 size-1.5 rounded-full ${color} ring-2 ring-background`}
    />
  );
}
