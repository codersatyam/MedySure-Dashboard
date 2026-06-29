import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/queryKeys";
import { patientsApi } from "./patients.api";

export function usePatients() {
  return useQuery({ queryKey: queryKeys.patients.list(), queryFn: patientsApi.list });
}
