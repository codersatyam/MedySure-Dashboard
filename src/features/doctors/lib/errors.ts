import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { ApiError } from "@/lib/api/http";

export const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
export const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Client-side photo pre-check mirroring the backend's rules. Returns an error message or null. */
export function validatePhoto(file: File): string | null {
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) return "Photo must be a JPG, PNG, or WebP image.";
  if (file.size > MAX_PHOTO_BYTES) return "Photo must be less than 2MB.";
  return null;
}

/**
 * Returns a handler that maps an `ApiError` to the right UI reaction:
 * validation → per-field errors, 401 → login redirect, 403/404/file errors →
 * toast. Pass the RHF form so VALIDATION_ERROR details land on the fields.
 */
export function useDoctorErrorHandler() {
  const navigate = useNavigate();

  return function handle<T extends FieldValues>(error: unknown, form?: UseFormReturn<T>): void {
    if (error instanceof ApiError) {
      switch (error.code) {
        case "VALIDATION_ERROR":
          if (error.details?.length && form) {
            for (const { field, message } of error.details) {
              form.setError(field as Path<T>, { message });
            }
            return;
          }
          break;
        case "UNAUTHORIZED":
          toast.error("Session expired — please log in.");
          navigate({ to: "/login" });
          return;
        case "FORBIDDEN":
          toast.error("You don't have permission to do that.");
          return;
        case "NOT_FOUND":
          toast.error("That doctor no longer exists.");
          return;
        case "FILE_TOO_LARGE":
        case "UNSUPPORTED_FILE_TYPE":
          toast.error(error.message);
          return;
      }
      toast.error(error.message || "Something went wrong.");
      return;
    }
    toast.error(error instanceof Error ? error.message : "Something went wrong.");
  };
}
