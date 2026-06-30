import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, LockKeyhole, TriangleAlert, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { SectionCard } from "@/components/common/SectionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api/http";
import { useDoctors } from "../api/doctors.queries";
import { AddDoctorDialog } from "./AddDoctorDialog";
import { DoctorDetail } from "./DoctorDetail";

function activeClasses(isActive: boolean) {
  return isActive ? "bg-success/10 text-success" : "bg-muted text-muted-foreground";
}

export function DoctorsPage() {
  const { data: doctors, isPending, isError, error } = useDoctors();
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<{ id: string; edit: boolean } | null>(null);

  const isUnauthorized = error instanceof ApiError && error.status === 401;

  const selectedDoctor = useMemo(
    () => doctors?.find((d) => d.id === selected?.id),
    [doctors, selected],
  );

  // Detail view replaces the list in-place (no navigation / no refresh).
  if (selectedDoctor) {
    return (
      <DoctorDetail
        doctor={selectedDoctor}
        initialEdit={selected?.edit ?? false}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Care team"
        title="Doctors"
        description="Manage your medical staff — specialties, fees, experience, and availability."
        actions={
          <button
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow-glow hover:bg-primary-glow transition-colors"
          >
            <UserPlus className="size-4" /> Add Doctor
          </button>
        }
      />

      <SectionCard
        title="All doctors"
        subtitle={doctors ? `${doctors.length} total members` : "Loading…"}
      >
        {isPending ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="size-11 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
              {isUnauthorized ? (
                <LockKeyhole className="size-5" />
              ) : (
                <TriangleAlert className="size-5" />
              )}
            </div>
            {isUnauthorized ? (
              <>
                <p className="text-sm font-medium">Please log in to load doctors.</p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary-glow transition-colors"
                >
                  Go to login
                </Link>
              </>
            ) : (
              <p className="text-sm text-muted-foreground max-w-sm">
                {error instanceof Error ? error.message : "Couldn't load doctors."}
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground border-b">
                  <th className="px-2 py-2.5 font-medium">Doctor</th>
                  <th className="px-2 py-2.5 font-medium">Specialization</th>
                  <th className="px-2 py-2.5 font-medium">Qualification</th>
                  <th className="px-2 py-2.5 font-medium">Experience</th>
                  <th className="px-2 py-2.5 font-medium text-right">Fees</th>
                  <th className="px-2 py-2.5 font-medium">Status</th>
                  <th className="px-2 py-2.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(doctors ?? []).map((d) => (
                  <tr key={d.id} className="border-t hover:bg-muted/40 transition-colors">
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-8">
                          {d.photoUrl && <AvatarImage src={d.photoUrl} alt="" />}
                          <AvatarFallback className="bg-gradient-hero text-primary-foreground text-[11px] font-semibold">
                            {(d.firstName[0] ?? "") + (d.lastName[0] ?? "")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          Dr. {d.firstName} {d.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-muted-foreground">{d.specialization ?? "—"}</td>
                    <td className="px-2 py-3 text-muted-foreground">
                      {d.qualification?.length ? d.qualification.join(", ") : "—"}
                    </td>
                    <td className="px-2 py-3 text-muted-foreground tabular-nums">
                      {d.totalExperience != null ? `${d.totalExperience} yrs` : "—"}
                    </td>
                    <td className="px-2 py-3 text-right tabular-nums">
                      {d.consultingFees != null ? `₹${d.consultingFees}` : "—"}
                    </td>
                    <td className="px-2 py-3">
                      <span
                        className={cn(
                          "text-[11px] font-medium px-2 py-0.5 rounded-full",
                          activeClasses(d.isActive),
                        )}
                      >
                        {d.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => setSelected({ id: d.id, edit: false })}
                          className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                        >
                          <Eye className="size-3.5" /> View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(doctors ?? []).length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-2 py-10 text-center text-muted-foreground">
                      No doctors yet. Click “Add Doctor” to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <AddDoctorDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
