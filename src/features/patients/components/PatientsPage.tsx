import { useMemo, useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { SectionCard } from "@/components/common/SectionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { usePatients } from "../api/patients.queries";
import type { PatientStatus } from "../types";
import { AddPatientDialog } from "./AddPatientDialog";

const statusClasses: Record<PatientStatus, string> = {
  Admitted: "bg-info/10 text-info",
  Outpatient: "bg-success/10 text-success",
  Discharged: "bg-muted text-muted-foreground",
  Critical: "bg-destructive/10 text-destructive",
};

export function PatientsPage() {
  const { data: patients, isPending } = usePatients();
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!patients) return [];
    const q = query.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.mrn.toLowerCase().includes(q) ||
        p.condition.toLowerCase().includes(q),
    );
  }, [patients, query]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Care management"
        title="Patients"
        description="Search, monitor, and manage every patient record across your organization."
        actions={
          <button
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow-glow hover:bg-primary-glow transition-colors"
          >
            <UserPlus className="size-4" /> Add Patient
          </button>
        }
      />

      <SectionCard
        title="All patients"
        subtitle={patients ? `${patients.length} total records` : "Loading…"}
      >
        <div className="relative mb-4 max-w-sm">
          <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, MRN, or condition…"
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-muted/60 border border-transparent focus:bg-card focus:border-ring focus:outline-none text-sm transition-all"
          />
        </div>

        {isPending ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground border-b">
                  <th className="px-2 py-2.5 font-medium">Patient</th>
                  <th className="px-2 py-2.5 font-medium">MRN</th>
                  <th className="px-2 py-2.5 font-medium">Age</th>
                  <th className="px-2 py-2.5 font-medium">Condition</th>
                  <th className="px-2 py-2.5 font-medium">Doctor</th>
                  <th className="px-2 py-2.5 font-medium">Status</th>
                  <th className="px-2 py-2.5 font-medium text-right">Last visit</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-muted/40 transition-colors">
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-[11px] font-semibold">
                          {p.name
                            .split(" ")
                            .map((s) => s[0])
                            .join("")}
                        </div>
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-muted-foreground tabular-nums">{p.mrn}</td>
                    <td className="px-2 py-3 text-muted-foreground tabular-nums">
                      {p.age} · {p.gender}
                    </td>
                    <td className="px-2 py-3">{p.condition}</td>
                    <td className="px-2 py-3 text-muted-foreground">{p.doctor}</td>
                    <td className="px-2 py-3">
                      <span
                        className={cn(
                          "text-[11px] font-medium px-2 py-0.5 rounded-full",
                          statusClasses[p.status],
                        )}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-right text-muted-foreground tabular-nums">
                      {p.lastVisit}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-2 py-10 text-center text-muted-foreground">
                      No patients match “{query}”.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <AddPatientDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
