import { useMutation } from "@tanstack/react-query";
import { demoRequestsApi } from "./demoRequests.api";

/** Mutation hook for submitting a demo request. */
export function useCreateDemoRequest() {
  return useMutation({ mutationFn: demoRequestsApi.create });
}
