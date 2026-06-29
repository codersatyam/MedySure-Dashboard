import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/queryKeys";
import { appointmentsApi } from "./appointments.api";

export function useAppointments() {
  return useQuery({ queryKey: queryKeys.appointments.list(), queryFn: appointmentsApi.list });
}
