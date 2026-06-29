import { QueryClient } from "@tanstack/react-query";

/**
 * Shared QueryClient factory. Defaults are tuned for a dashboard:
 * data is treated as fresh for 30s to avoid refetch storms on navigation,
 * and retries are capped so transient failures surface quickly.
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}
