import { z } from "zod";

/** Specialization options offered in the dropdown (sent as a free string). */
export const DOCTOR_TYPES = [
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Orthopedic",
  "Neurologist",
  "Gynecologist",
  "ENT",
  "Psychiatrist",
] as const;

const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/;

/** The Doctor object returned by the backend (APIs 1–3). */
export const doctorSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  specialization: z.string().nullable().optional(),
  qualification: z.array(z.string()).default([]),
  age: z.number().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  totalExperience: z.number().nullable().optional(),
  consultingFees: z.number().nullable().optional(),
  licenseNumber: z.string().nullable().optional(),
  isActive: z.boolean(),
  createdAt: z.string(),
});
export type Doctor = z.infer<typeof doctorSchema>;

/** JSON body for POST /doctors (and PATCH, partially). Mirrors backend rules. */
export const createDoctorPayloadSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(255).optional(),
  phone: z.string().regex(PHONE_RE).optional(),
  specialization: z.string().max(150).optional(),
  qualification: z.array(z.string().max(100)).optional(),
  age: z.number().int().min(20).max(120).optional(),
  totalExperience: z.number().min(0).max(80).optional(),
  consultingFees: z.number().min(0).optional(),
  licenseNumber: z.string().max(100).optional(),
  isActive: z.boolean().optional(),
});
export type CreateDoctorPayload = z.infer<typeof createDoctorPayloadSchema>;
export type UpdateDoctorPayload = Partial<CreateDoctorPayload>;

/** Empty string allowed alongside an optional rule (blank optional inputs). */
const optionalString = (rule: z.ZodString) => rule.optional().or(z.literal(""));

/**
 * Form-shaped schema used by react-hook-form. Text fields stay strings (blank
 * allowed); numbers are number | undefined; `qualification` is a comma string.
 * `formToPayload` converts this into a `CreateDoctorPayload`.
 */
export const doctorFormSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: optionalString(z.string().email("Enter a valid email").max(255)),
  phone: optionalString(z.string().regex(PHONE_RE, "Enter a valid phone number")),
  specialization: z.string().optional(),
  qualification: z.string().optional(),
  age: z
    .number({ invalid_type_error: "Age must be a number" })
    .int("Age must be a whole number")
    .min(20, "Must be at least 20")
    .max(120, "Enter a valid age")
    .optional(),
  totalExperience: z
    .number({ invalid_type_error: "Experience must be a number" })
    .min(0, "Cannot be negative")
    .max(80, "Enter a valid value")
    .optional(),
  consultingFees: z
    .number({ invalid_type_error: "Fee must be a number" })
    .min(0, "Cannot be negative")
    .optional(),
  licenseNumber: optionalString(z.string().max(100)),
  isActive: z.boolean(),
});
export type DoctorFormValues = z.infer<typeof doctorFormSchema>;

export const ACTIVE_OPTIONS = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
] as const;

/** Blank → undefined helper (so optional fields are omitted from the payload). */
function blankToUndef(s: string | undefined): string | undefined {
  const t = s?.trim();
  return t ? t : undefined;
}

/** Map a backend Doctor into form values for editing. */
export function doctorToForm(doctor: Doctor): DoctorFormValues {
  return {
    firstName: doctor.firstName,
    lastName: doctor.lastName,
    email: doctor.email ?? "",
    phone: doctor.phone ?? "",
    specialization: doctor.specialization ?? undefined,
    qualification: (doctor.qualification ?? []).join(", "),
    age: doctor.age ?? undefined,
    totalExperience: doctor.totalExperience ?? undefined,
    consultingFees: doctor.consultingFees ?? undefined,
    licenseNumber: doctor.licenseNumber ?? "",
    isActive: doctor.isActive,
  };
}

/** Convert validated form values into the API payload (omitting blanks). */
export function formToPayload(values: DoctorFormValues): CreateDoctorPayload {
  const quals = (values.qualification ?? "")
    .split(",")
    .map((q) => q.trim())
    .filter(Boolean);

  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: blankToUndef(values.email),
    phone: blankToUndef(values.phone),
    specialization: blankToUndef(values.specialization),
    qualification: quals.length ? quals : undefined,
    age: values.age,
    totalExperience: values.totalExperience,
    consultingFees: values.consultingFees,
    licenseNumber: blankToUndef(values.licenseNumber),
    isActive: values.isActive,
  };
}

/** Default values for the Add form. */
export const emptyDoctorForm: DoctorFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  specialization: undefined,
  qualification: "",
  age: undefined,
  totalExperience: undefined,
  consultingFees: undefined,
  licenseNumber: "",
  isActive: true,
};
