import { env } from "@/lib/env";

/** A single field-level validation problem returned by the backend (400s). */
export type ApiErrorDetail = { field: string; message: string };

/**
 * Error carrying the HTTP status, the backend error `code`, and optional
 * per-field `details` (validation failures). Callers branch on `status`/`code`
 * and map `details` back onto form fields.
 */
export class ApiError extends Error {
  status: number;
  code: string;
  details?: ApiErrorDetail[];

  constructor(message: string, status: number, code = "UNKNOWN", details?: ApiErrorDetail[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/** Backend response envelope: `{ success:true, data }` or `{ success:false, error }`. */
type ApiEnvelope<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string; details?: ApiErrorDetail[] } };

type RequestOptions = {
  method?: string;
  body?: unknown;
  /** Bearer token for authenticated endpoints. */
  accessToken?: string;
};

function baseUrl(): string {
  if (!env.VITE_API_BASE_URL) {
    throw new ApiError(
      "VITE_API_BASE_URL is not set — point it at the MedySure backend (e.g. http://127.0.0.1:3000/api/v1).",
      0,
      "CONFIG",
    );
  }
  return env.VITE_API_BASE_URL.replace(/\/$/, "");
}

/**
 * Fetch a backend endpoint and unwrap its `{ success, data }` envelope.
 * Throws `ApiError` on network failure, non-OK status, or `success:false`.
 */
export async function apiFetch<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, accessToken } = opts;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  let res: Response;
  try {
    res = await fetch(`${baseUrl()}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      "Could not reach the backend. Is the MedySure API running?",
      0,
      "NETWORK",
    );
  }

  let envelope: ApiEnvelope<T> | null = null;
  try {
    envelope = (await res.json()) as ApiEnvelope<T>;
  } catch {
    // Non-JSON body — fall through to the status-based error below.
  }

  if (!res.ok || !envelope || envelope.success === false) {
    if (envelope && envelope.success === false) {
      const { code, message, details } = envelope.error;
      throw new ApiError(message, res.status, code, details);
    }
    throw new ApiError(`Request to ${path} failed (${res.status})`, res.status, "HTTP_ERROR");
  }

  return envelope.data;
}
