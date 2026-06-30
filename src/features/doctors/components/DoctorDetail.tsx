import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Activity,
  ArrowLeft,
  Award,
  CalendarClock,
  GraduationCap,
  IndianRupee,
  Loader2,
  Pencil,
  Stethoscope,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useUpdateDoctor } from "../api/doctors.queries";
import { useDoctorErrorHandler, validatePhoto } from "../lib/errors";
import {
  ACTIVE_OPTIONS,
  doctorFormSchema,
  doctorToForm,
  DOCTOR_TYPES,
  formToPayload,
  type Doctor,
  type DoctorFormValues,
} from "../types";

/** Parse a numeric `<input>` change into a number | undefined for RHF/zod. */
function toNumber(value: string): number | undefined {
  if (value.trim() === "") return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

function activeClasses(isActive: boolean) {
  return isActive
    ? "bg-success/10 text-success ring-1 ring-success/20"
    : "bg-muted text-muted-foreground ring-1 ring-border";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Compact stat tile (icon chip + label + value) used across the view header. */
function StatTile({
  icon: Icon,
  tone,
  label,
  value,
}: {
  icon: typeof Activity;
  tone: string;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-card border rounded-2xl p-4 shadow-soft hover:shadow-elevated transition-shadow">
      <div className={cn("size-9 rounded-lg flex items-center justify-center mb-3", tone)}>
        <Icon className="size-5" />
      </div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold mt-0.5 truncate">{value}</div>
    </div>
  );
}

/** A labelled field group used in edit mode, with an icon-led section heading. */
function FieldSection({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Activity;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border rounded-2xl p-5 shadow-soft">
      <div className="flex items-center gap-2 mb-4">
        <div className="size-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
          <Icon className="size-4" />
        </div>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function DoctorDetail({
  doctor,
  initialEdit = false,
  onBack,
}: {
  doctor: Doctor;
  initialEdit?: boolean;
  onBack: () => void;
}) {
  const [editing, setEditing] = useState(initialEdit);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateDoctor = useUpdateDoctor();
  const handleError = useDoctorErrorHandler();

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: doctorToForm(doctor),
  });

  const photoUrl = editing ? (photoPreview ?? doctor.photoUrl) : doctor.photoUrl;
  const fullName = `Dr. ${doctor.firstName} ${doctor.lastName}`;
  const initials = `${doctor.firstName[0] ?? ""}${doctor.lastName[0] ?? ""}`.toUpperCase();
  const dash = "—";

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const error = validatePhoto(file);
    if (error) {
      toast.error(error);
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function startEdit() {
    form.reset(doctorToForm(doctor));
    setPhotoFile(null);
    setPhotoPreview(null);
    setEditing(true);
  }

  function cancelEdit() {
    form.reset(doctorToForm(doctor));
    setPhotoFile(null);
    setPhotoPreview(null);
    setEditing(false);
  }

  function onSubmit(values: DoctorFormValues) {
    updateDoctor.mutate(
      { id: doctor.id, input: formToPayload(values), photoFile },
      {
        onSuccess: (updated) => {
          toast.success(`Dr. ${updated.firstName} ${updated.lastName} updated`);
          setPhotoFile(null);
          setPhotoPreview(null);
          setEditing(false);
        },
        onError: (error) => handleError(error, form),
      },
    );
  }

  const qualificationText = doctor.qualification?.length ? doctor.qualification.join(", ") : dash;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
      >
        <span className="size-7 rounded-full border bg-card flex items-center justify-center group-hover:bg-muted transition-colors">
          <ArrowLeft className="size-4" />
        </span>
        Back to doctors
      </button>

      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl border shadow-elevated bg-gradient-hero text-primary-foreground">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative">
            <Avatar className="size-24 ring-4 ring-white/25 shadow-lg">
              {photoUrl && <AvatarImage src={photoUrl} alt={fullName} />}
              <AvatarFallback className="bg-white/15 text-primary-foreground text-2xl font-semibold backdrop-blur-sm">
                {initials || <UserRound className="size-9" />}
              </AvatarFallback>
            </Avatar>
            {editing && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 size-8 rounded-full bg-card text-foreground border shadow-md flex items-center justify-center hover:bg-muted transition-colors"
                  aria-label="Change photo"
                >
                  <Upload className="size-4" />
                </button>
              </>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground/70">
              {editing ? "Editing profile" : (doctor.specialization ?? "Doctor")}
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold font-display tracking-tight mt-1 truncate">
              {fullName}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm">
                <GraduationCap className="size-3.5" /> {qualificationText}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm">
                <Activity className="size-3.5" /> {doctor.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="shrink-0">
            {!editing ? (
              <button
                onClick={startEdit}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-primary font-medium text-sm shadow-md hover:bg-white/90 transition-colors"
              >
                <Pencil className="size-4" /> Edit details
              </button>
            ) : (
              <button
                onClick={cancelEdit}
                disabled={updateDoctor.isPending}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 text-primary-foreground font-medium text-sm hover:bg-white/25 transition-colors disabled:opacity-50"
              >
                <X className="size-4" /> Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {!editing ? (
        /* ---------- VIEW MODE ---------- */
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatTile
              icon={Stethoscope}
              tone="bg-primary/10 text-primary"
              label="Specialization"
              value={doctor.specialization ?? dash}
            />
            <StatTile
              icon={IndianRupee}
              tone="bg-success/10 text-success"
              label="Consultation fee"
              value={doctor.consultingFees != null ? `₹${doctor.consultingFees}` : dash}
            />
            <StatTile
              icon={Award}
              tone="bg-warning/10 text-warning"
              label="Experience"
              value={doctor.totalExperience != null ? `${doctor.totalExperience} yrs` : dash}
            />
            <StatTile
              icon={CalendarClock}
              tone="bg-info/10 text-info"
              label="Age"
              value={doctor.age != null ? `${doctor.age} yrs` : dash}
            />
          </div>

          <div className="bg-card border rounded-2xl p-6 shadow-soft">
            <h3 className="text-sm font-semibold mb-5">Profile details</h3>
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5">
              {[
                ["First name", doctor.firstName],
                ["Last name", doctor.lastName],
                ["Email", doctor.email || dash],
                ["Phone", doctor.phone || dash],
                ["Specialization", doctor.specialization || dash],
                ["Qualifications", qualificationText],
                ["License number", doctor.licenseNumber || dash],
                [
                  "Consultation fee",
                  doctor.consultingFees != null ? `₹${doctor.consultingFees}` : dash,
                ],
                ["Age", doctor.age != null ? `${doctor.age} yrs` : dash],
                [
                  "Experience",
                  doctor.totalExperience != null ? `${doctor.totalExperience} yrs` : dash,
                ],
                ["Added on", formatDate(doctor.createdAt)],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="text-sm font-medium mt-1 truncate">{value}</dd>
                </div>
              ))}
              <div className="min-w-0">
                <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Status
                </dt>
                <dd className="mt-1">
                  <span
                    className={cn(
                      "inline-block text-[11px] font-medium px-2 py-0.5 rounded-full",
                      activeClasses(doctor.isActive),
                    )}
                  >
                    {doctor.isActive ? "Active" : "Inactive"}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </>
      ) : (
        /* ---------- EDIT MODE ---------- */
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FieldSection icon={UserRound} title="Personal information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={20}
                          max={120}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(toNumber(e.target.value))}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(v === "true")}
                        value={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ACTIVE_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FieldSection>

            <FieldSection icon={Stethoscope} title="Professional details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select specialty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DOCTOR_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="qualification"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Qualifications (comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="MBBS, MD" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="consultingFees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consultation fee (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(toNumber(e.target.value))}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience (years)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={80}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(toNumber(e.target.value))}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FieldSection>

            {/* Sticky action bar */}
            <div className="sticky bottom-0 flex justify-end gap-2 bg-gradient-to-t from-background via-background to-transparent pt-4 pb-1">
              <Button
                type="button"
                variant="outline"
                onClick={cancelEdit}
                disabled={updateDoctor.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateDoctor.isPending} className="shadow-glow">
                {updateDoctor.isPending && <Loader2 className="size-4 animate-spin" />}
                Save changes
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
