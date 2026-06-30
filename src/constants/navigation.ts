import type { ComponentType } from "react";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  Video,
  FileText,
  CreditCard,
  BarChart3,
  Pill,
  FlaskConical,
  ShoppingBag,
  Bell,
  UserCog,
  Building2,
  ShieldCheck,
  Plug,
  Settings,
  Lock,
  ScrollText,
  HelpCircle,
} from "lucide-react";

export type NavItem = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  /** Route to navigate to. Items without a `to` are not yet implemented. */
  to?: string;
  badge?: number;
};

export type NavGroup = { title: string; items: NavItem[] };

/**
 * Sidebar navigation. Items with a `to` link to real routes; the rest are
 * placeholders for screens not yet built. Active state is derived from the
 * router, not hardcoded.
 */
export const navGroups: NavGroup[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, to: "/app" },
      { label: "Patients", icon: Users, to: "/app/patients", badge: 12 },
      { label: "Doctors", icon: Stethoscope, to: "/app/doctors" },
      { label: "Appointments", icon: CalendarDays, to: "/app/appointments", badge: 4 },
      // { label: "Telemedicine", icon: Video },
      // { label: "Medical Records", icon: FileText },
      // { label: "Billing", icon: CreditCard, to: "/app/billing" },
      // { label: "Analytics", icon: BarChart3, to: "/app/analytics" },
      // { label: "Prescriptions", icon: Pill },
      // { label: "Laboratories", icon: FlaskConical },
      // { label: "Pharmacy", icon: ShoppingBag },
      // { label: "Notifications", icon: Bell, badge: 9 },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Staff Management", icon: UserCog },
      // { label: "Departments", icon: Building2 },
      // { label: "Insurance", icon: ShieldCheck },
      // { label: "Integrations", icon: Plug },
    ],
  },
  {
    title: "System",
    items: [
      // { label: "Settings", icon: Settings },
      // { label: "Security", icon: Lock },
      // { label: "Audit Logs", icon: ScrollText },
      { label: "Help Center", icon: HelpCircle },
    ],
  },
];
