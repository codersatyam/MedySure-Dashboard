import { z } from "zod";

/**
 * Validated client environment. Vite exposes only `VITE_*` vars to the browser.
 * Parsing at module load means a misconfigured deploy fails fast and loudly
 * instead of surfacing as undefined-at-runtime bugs.
 *
 * Add new client vars here; for server-only secrets use `config.server.ts`.
 */
const clientEnvSchema = z.object({
  VITE_APP_NAME: z.string().default("MediSure"),
  /** Base URL of the backend API. Optional while the app runs on mock data. */
  VITE_API_BASE_URL: z.string().url().optional(),
});

export const env = clientEnvSchema.parse(import.meta.env);
export type ClientEnv = z.infer<typeof clientEnvSchema>;
