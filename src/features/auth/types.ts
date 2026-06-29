/**
 * Auth domain types. These mirror the MedySure backend's `/auth/*` response
 * shapes (see MedySure-Backend/src/modules/auth). The backend always wraps
 * payloads in an envelope: `{ success, data }` on success, `{ success:false,
 * error:{ code, message } }` on failure.
 */

/** A bearer session as returned by the backend (camelCased in the response body). */
export type Session = {
  accessToken: string;
  refreshToken: string;
  /** Unix seconds at which the access token expires. */
  expiresAt: number;
  tokenType: string;
};

/** Minimal auth user returned alongside a session. */
export type AuthUser = {
  id: string;
  email: string;
};

/** Profile row joined to the auth user. */
export type Profile = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  org_id: string;
  created_at?: string;
  updated_at?: string;
};

export type Organization = {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
};

/** Shape of `GET /auth/me` → data. */
export type Me = {
  id: string;
  profile: Profile;
  organization: Organization;
  groups: string[];
  permissions: string[];
};

/** Standard success envelope. */
export type ApiSuccess<T> = { success: true; data: T };

/** Standard error envelope. */
export type ApiError = {
  success: false;
  error: { code: string; message: string; details?: unknown };
};

export type ApiEnvelope<T> = ApiSuccess<T> | ApiError;

export type OAuthProvider = "google" | "github" | "azure";
