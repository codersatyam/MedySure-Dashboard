import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Stethoscope, Upload, UserRound } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useCreateDoctor } from "../api/doctors.queries";
import { useDoctorErrorHandler, validatePhoto } from "../lib/errors";
import {
  ACTIVE_OPTIONS,
  doctorFormSchema,
  DOCTOR_TYPES,
  emptyDoctorForm,
  formToPayload,
  type DoctorFormValues,
} from "../types";

/** Parse a numeric `<input>` change into a number | undefined for RHF/zod. */
function toNumber(value: string): number | undefined {
  if (value.trim() === "") return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

/** Hairline section heading used to group fields inside the form. */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
        {children}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export function AddDoctorDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const createDoctor = useCreateDoctor();
  const handleError = useDoctorErrorHandler();

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: emptyDoctorForm,
  });

  const firstName = form.watch("firstName");
  const lastName = form.watch("lastName");
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || undefined;

  function resetAll() {
    form.reset(emptyDoctorForm);
    setPhotoFile(null);
    setPhotoPreview(null);
  }

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

  function onSubmit(values: DoctorFormValues) {
    createDoctor.mutate(
      { input: formToPayload(values), photoFile },
      {
        onSuccess: (doctor) => {
          toast.success(`Dr. ${doctor.firstName} ${doctor.lastName} added`);
          resetAll();
          onOpenChange(false);
        },
        onError: (error) => handleError(error, form),
      },
    );
  }

  function handleOpenChange(next: boolean) {
    if (!next) resetAll();
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Gradient header */}
        <div className="relative bg-gradient-hero text-primary-foreground px-6 py-5 shrink-0">
          <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
          <DialogHeader className="relative space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="size-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <Stethoscope className="size-5" />
              </span>
              <div>
                <DialogTitle className="text-lg font-display tracking-tight">
                  Add doctor
                </DialogTitle>
                <DialogDescription className="text-primary-foreground/80">
                  Add a new member to your care team.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col min-h-0 flex-1">
            <div className="px-6 py-5 space-y-5 overflow-y-auto">
              {/* Photo upload */}
              <div className="flex items-center gap-4 rounded-2xl border bg-muted/40 p-4">
                <Avatar className="size-16 ring-2 ring-background shadow-sm">
                  {photoPreview && <AvatarImage src={photoPreview} alt="Doctor photo" />}
                  <AvatarFallback className="bg-gradient-hero text-primary-foreground text-base font-semibold">
                    {initials ?? <UserRound className="size-6" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm font-medium">Profile photo</div>
                  <p className="text-[11px] text-muted-foreground mb-2">
                    JPG, PNG, or WebP — up to 2MB.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="size-4" /> {photoFile ? "Change photo" : "Upload photo"}
                  </Button>
                </div>
              </div>

              <SectionLabel>Personal information</SectionLabel>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input placeholder="Rahul" {...field} />
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
                        <Input placeholder="Sharma" {...field} />
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
                      <FormLabel>Email (optional)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="rahul@clinic.com" {...field} />
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
                      <FormLabel>Phone (optional)</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+91 98765 43210" {...field} />
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
                      <FormLabel>Age (optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={20}
                          max={120}
                          placeholder="e.g. 42"
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

              <SectionLabel>Professional details</SectionLabel>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization (optional)</FormLabel>
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
                      <FormLabel>License number (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="MH-12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="qualification"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Qualifications (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="MBBS, MD (comma separated)" {...field} />
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
                      <FormLabel>Consultation fee (₹, optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="e.g. 800"
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
                      <FormLabel>Experience (years, optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={80}
                          placeholder="e.g. 10"
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
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t bg-muted/30 px-6 py-4 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={createDoctor.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createDoctor.isPending} className="shadow-glow">
                {createDoctor.isPending && <Loader2 className="size-4 animate-spin" />}
                Save doctor
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
