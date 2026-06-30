import { apiFetch, apiUpload } from "@/lib/api/http";
import { getSession } from "@/features/auth";
import type { CreateDoctorPayload, Doctor, UpdateDoctorPayload } from "../types";

/** Bearer token for the current session (undefined when logged out → 401). */
function token(): string | undefined {
  return getSession()?.accessToken;
}

export const doctorsApi = {
  /** GET /doctors — all active doctors in the caller's org, newest first. */
  list: () => apiFetch<Doctor[]>("/doctors", { accessToken: token() }),

  /** POST /doctors — create a doctor (photo is uploaded separately). */
  create: (input: CreateDoctorPayload) =>
    apiFetch<Doctor>("/doctors", { method: "POST", body: input, accessToken: token() }),

  /** PATCH /doctors/:id — partial update (only the provided fields). */
  update: ({ id, input }: { id: string; input: UpdateDoctorPayload }) =>
    apiFetch<Doctor>(`/doctors/${id}`, { method: "PATCH", body: input, accessToken: token() }),

  /** POST /doctors/:id/photo — multipart upload; returns the new photoUrl. */
  uploadPhoto: ({ id, file }: { id: string; file: File }) => {
    const fd = new FormData();
    fd.append("photo", file);
    return apiUpload<{ id: string; photoUrl: string }>(`/doctors/${id}/photo`, fd, token());
  },
};
