import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/queryKeys";
import { billingApi } from "./billing.api";

export function useBillingStats() {
  return useQuery({ queryKey: queryKeys.billing.stats(), queryFn: billingApi.stats });
}

export function useInvoices() {
  return useQuery({ queryKey: queryKeys.billing.invoices(), queryFn: billingApi.invoices });
}
