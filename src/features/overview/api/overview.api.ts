import { mockResponse } from "@/lib/api/mock";
import type {
  ActivityEntry,
  DemographicSlice,
  DoctorAvailability,
  HourlyPoint,
  InventoryItem,
  Kpi,
  QueueEntry,
  RevenuePoint,
} from "../types";

/**
 * Mock fetchers for the overview dashboard. Each returns through `mockResponse`
 * to emulate latency. Replace the bodies with real `fetch()`/server-fn calls
 * when the backend is ready — the query hooks and components stay unchanged.
 */

const kpis: Kpi[] = [
  {
    id: "patients",
    label: "Total Patients",
    value: "12,847",
    delta: "+12.4%",
    up: true,
    icon: "patients",
    color: "primary",
  },
  {
    id: "appointments",
    label: "Today's Appointments",
    value: "248",
    delta: "+5.2%",
    up: true,
    icon: "appointments",
    color: "info",
  },
  {
    id: "doctors",
    label: "Active Doctors",
    value: "94",
    delta: "+2.1%",
    up: true,
    icon: "doctors",
    color: "success",
  },
  {
    id: "labs",
    label: "Pending Lab Reports",
    value: "37",
    delta: "-8.0%",
    up: false,
    icon: "labs",
    color: "warning",
  },
  {
    id: "revenue",
    label: "Revenue (MTD)",
    value: "$284.5K",
    delta: "+18.7%",
    up: true,
    icon: "revenue",
    color: "success",
  },
  {
    id: "emergency",
    label: "Emergency Cases",
    value: "12",
    delta: "+3",
    up: false,
    icon: "emergency",
    color: "destructive",
  },
];

const revenue: RevenuePoint[] = [
  { m: "Jan", revenue: 42, expenses: 28 },
  { m: "Feb", revenue: 48, expenses: 30 },
  { m: "Mar", revenue: 55, expenses: 32 },
  { m: "Apr", revenue: 51, expenses: 33 },
  { m: "May", revenue: 64, expenses: 36 },
  { m: "Jun", revenue: 72, expenses: 38 },
  { m: "Jul", revenue: 68, expenses: 39 },
  { m: "Aug", revenue: 78, expenses: 41 },
  { m: "Sep", revenue: 84, expenses: 43 },
  { m: "Oct", revenue: 92, expenses: 45 },
];

const demographics: DemographicSlice[] = [
  { name: "0–17", value: 18, color: "var(--info)" },
  { name: "18–34", value: 27, color: "var(--primary)" },
  { name: "35–54", value: 31, color: "var(--success)" },
  { name: "55+", value: 24, color: "var(--warning)" },
];

const queue: QueueEntry[] = [
  {
    name: "Anna Cole",
    reason: "Cardiology consult",
    status: "In room",
    color: "success",
    time: "Now",
  },
  {
    name: "James Park",
    reason: "Lab results review",
    status: "Waiting",
    color: "warning",
    time: "5 min",
  },
  { name: "Lin Wei", reason: "Annual checkup", status: "Vitals", color: "info", time: "8 min" },
  { name: "Marco Diaz", reason: "Follow-up", status: "Waiting", color: "warning", time: "12 min" },
  {
    name: "Sara Khan",
    reason: "Pediatric visit",
    status: "Scheduled",
    color: "muted",
    time: "20 min",
  },
];

const doctorAvailability: DoctorAvailability[] = [
  { dr: "Dr. Mendoza", spec: "Cardiology", patients: 14, status: "Available", color: "success" },
  { dr: "Dr. Patel", spec: "Neurology", patients: 9, status: "In surgery", color: "destructive" },
  { dr: "Dr. Chen", spec: "Pediatrics", patients: 18, status: "Available", color: "success" },
  { dr: "Dr. Okafor", spec: "Oncology", patients: 7, status: "On break", color: "warning" },
];

const inventory: InventoryItem[] = [
  { item: "Surgical masks", level: 82 },
  { item: "IV fluids", level: 64 },
  { item: "Antibiotics", level: 41 },
  { item: "Vaccines (flu)", level: 23 },
];

const appointmentsByHour: HourlyPoint[] = [
  { h: "8a", v: 12 },
  { h: "9a", v: 18 },
  { h: "10a", v: 24 },
  { h: "11a", v: 22 },
  { h: "12p", v: 14 },
  { h: "1p", v: 20 },
  { h: "2p", v: 28 },
  { h: "3p", v: 26 },
  { h: "4p", v: 19 },
  { h: "5p", v: 11 },
];

const activity: ActivityEntry[] = [
  {
    id: "a1",
    icon: "check-in",
    color: "success",
    title: "Patient check-in",
    desc: "Anna Cole arrived for cardiology consult",
    time: "Just now",
  },
  {
    id: "a2",
    icon: "doctor",
    color: "primary",
    title: "Doctor update",
    desc: "Dr. Patel completed surgery #4821",
    time: "12 min ago",
  },
  {
    id: "a3",
    icon: "prescription",
    color: "info",
    title: "New prescription",
    desc: "Amoxicillin 500mg issued to James Park",
    time: "27 min ago",
  },
  {
    id: "a4",
    icon: "lab",
    color: "warning",
    title: "Lab test completed",
    desc: "Blood panel results ready for Lin Wei",
    time: "1 hr ago",
  },
  {
    id: "a5",
    icon: "emergency",
    color: "destructive",
    title: "Emergency alert",
    desc: "Trauma case admitted to Bay 3",
    time: "2 hr ago",
  },
  {
    id: "a6",
    icon: "check-in",
    color: "success",
    title: "Patient check-in",
    desc: "Sara Khan arrived for pediatric visit",
    time: "3 hr ago",
  },
];

export const overviewApi = {
  getKpis: () => mockResponse(kpis),
  getRevenue: () => mockResponse(revenue),
  getDemographics: () => mockResponse(demographics),
  getQueue: () => mockResponse(queue),
  getDoctorAvailability: () => mockResponse(doctorAvailability),
  getInventory: () => mockResponse(inventory),
  getAppointmentsByHour: () => mockResponse(appointmentsByHour),
  getActivity: () => mockResponse(activity),
};
