import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/queryKeys";
import { overviewApi } from "./overview.api";

export function useKpis() {
  return useQuery({ queryKey: queryKeys.overview.kpis(), queryFn: overviewApi.getKpis });
}

export function useRevenue() {
  return useQuery({ queryKey: queryKeys.overview.revenue(), queryFn: overviewApi.getRevenue });
}

export function useDemographics() {
  return useQuery({
    queryKey: queryKeys.overview.demographics(),
    queryFn: overviewApi.getDemographics,
  });
}

export function usePatientQueue() {
  return useQuery({ queryKey: queryKeys.overview.queue(), queryFn: overviewApi.getQueue });
}

export function useDoctorAvailability() {
  return useQuery({
    queryKey: queryKeys.overview.doctorAvailability(),
    queryFn: overviewApi.getDoctorAvailability,
  });
}

export function useInventory() {
  return useQuery({ queryKey: queryKeys.overview.inventory(), queryFn: overviewApi.getInventory });
}

export function useAppointmentsByHour() {
  return useQuery({
    queryKey: queryKeys.overview.appointmentsByHour(),
    queryFn: overviewApi.getAppointmentsByHour,
  });
}

export function useActivity() {
  return useQuery({ queryKey: queryKeys.overview.activity(), queryFn: overviewApi.getActivity });
}
