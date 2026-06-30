/**
 * Centralized query-key factory. Every feature derives its keys from here so
 * invalidation stays consistent and typo-free. Add a namespace per feature.
 */
export const queryKeys = {
  overview: {
    all: ["overview"] as const,
    kpis: () => [...queryKeys.overview.all, "kpis"] as const,
    revenue: () => [...queryKeys.overview.all, "revenue"] as const,
    demographics: () => [...queryKeys.overview.all, "demographics"] as const,
    queue: () => [...queryKeys.overview.all, "queue"] as const,
    doctorAvailability: () => [...queryKeys.overview.all, "doctor-availability"] as const,
    inventory: () => [...queryKeys.overview.all, "inventory"] as const,
    appointmentsByHour: () => [...queryKeys.overview.all, "appointments-by-hour"] as const,
    activity: () => [...queryKeys.overview.all, "activity"] as const,
  },
  patients: {
    all: ["patients"] as const,
    list: () => [...queryKeys.patients.all, "list"] as const,
  },
  doctors: {
    all: ["doctors"] as const,
    list: () => [...queryKeys.doctors.all, "list"] as const,
  },
  appointments: {
    all: ["appointments"] as const,
    list: () => [...queryKeys.appointments.all, "list"] as const,
  },
  billing: {
    all: ["billing"] as const,
    stats: () => [...queryKeys.billing.all, "stats"] as const,
    invoices: () => [...queryKeys.billing.all, "invoices"] as const,
  },
  analytics: {
    all: ["analytics"] as const,
    summary: () => [...queryKeys.analytics.all, "summary"] as const,
  },
} as const;
