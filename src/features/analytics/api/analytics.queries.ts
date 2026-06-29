import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/queryKeys";
import { analyticsApi } from "./analytics.api";

export function useAnalyticsSummary() {
  return useQuery({ queryKey: queryKeys.analytics.summary(), queryFn: analyticsApi.summary });
}
