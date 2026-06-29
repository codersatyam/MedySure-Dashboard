import { apiFetch } from "@/lib/api/http";
import type { DemoRequestInput, DemoRequestResult } from "../types";

export const demoRequestsApi = {
  /** Submit a public demo request. POST /demo-requests → { id, createdAt }. */
  create: (input: DemoRequestInput) =>
    apiFetch<DemoRequestResult>("/demo-requests", { method: "POST", body: input }),
};
