import { z } from "zod";

/**
 * Client-side validation for the demo-request form. Mirrors the MedySure
 * backend's rules exactly so the client and server agree; the server stays the
 * source of truth and its 400 `details` are surfaced per-field as a backstop.
 * Field names (`name`/`email`/`phoneNo`) must match the server's `details.field`.
 */
export const demoRequestSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be at most 100 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email")
    .max(255, "Email must be at most 255 characters"),
  phoneNo: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "Enter a valid phone number"),
});

export type DemoRequestFormValues = z.infer<typeof demoRequestSchema>;
