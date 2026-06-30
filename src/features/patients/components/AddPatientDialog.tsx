import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiError } from "@/lib/api/http";
import { useDoctors } from "@/features/doctors/api/doctors.queries";
import { useCreatePatient } from "../api/patients.queries";
import { createPatientSchema, GENDERS, PATIENT_STATUSES, type CreatePatientInput } from "../types";

const defaultValues: Partial<CreatePatientInput> = {
  name: "",
  age: undefined,
  gender: undefined,
  condition: "",
  doctor: "",
  status: "Outpatient",
};

/** Parse a numeric `<input>` change into a number | undefined for RHF/zod. */
function toNumber(value: string): number | undefined {
  if (value.trim() === "") return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

export function AddPatientDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createPatient = useCreatePatient();
  const { data: doctors } = useDoctors();

  const form = useForm<CreatePatientInput>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: defaultValues as CreatePatientInput,
  });

  function onSubmit(values: CreatePatientInput) {
    createPatient.mutate(values, {
      onSuccess: (patient) => {
        toast.success(`${patient.name} added · ${patient.mrn}`);
        form.reset(defaultValues as CreatePatientInput);
        onOpenChange(false);
      },
      onError: (error) => {
        if (error instanceof ApiError && error.details?.length) {
          for (const { field, message } of error.details) {
            form.setError(field as keyof CreatePatientInput, { message });
          }
          return;
        }
        toast.error(error instanceof Error ? error.message : "Could not add patient");
      },
    });
  }

  function handleOpenChange(next: boolean) {
    if (!next) form.reset(defaultValues as CreatePatientInput);
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add patient</DialogTitle>
          <DialogDescription>
            Register a new patient. An MRN and visit date are generated automatically.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Rahul Sharma" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
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
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {GENDERS.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g === "M" ? "Male" : "Female"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <FormControl>
                    <Input placeholder="Hypertension" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="doctor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned doctor</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(doctors ?? []).map((d) => {
                          const label = `Dr. ${d.firstName} ${d.lastName}`;
                          return (
                            <SelectItem key={d.id} value={label}>
                              {label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PATIENT_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={createPatient.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createPatient.isPending}>
                {createPatient.isPending && <Loader2 className="size-4 animate-spin" />}
                Save patient
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
