import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/queryKeys";
import { doctorsApi } from "./doctors.api";
import type { CreateDoctorPayload, Doctor, UpdateDoctorPayload } from "../types";

export function useDoctors() {
  return useQuery({
    queryKey: queryKeys.doctors.list(),
    queryFn: doctorsApi.list,
    retry: false,
  });
}

/** Create a doctor, then upload the photo if one was chosen. */
export function useCreateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      input,
      photoFile,
    }: {
      input: CreateDoctorPayload;
      photoFile?: File | null;
    }): Promise<Doctor> => {
      const doctor = await doctorsApi.create(input);
      if (photoFile) {
        const { photoUrl } = await doctorsApi.uploadPhoto({ id: doctor.id, file: photoFile });
        return { ...doctor, photoUrl };
      }
      return doctor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.doctors.all });
    },
  });
}

/** Patch a doctor, then upload the photo if a new one was chosen. */
export function useUpdateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
      photoFile,
    }: {
      id: string;
      input: UpdateDoctorPayload;
      photoFile?: File | null;
    }): Promise<Doctor> => {
      let doctor = await doctorsApi.update({ id, input });
      if (photoFile) {
        const { photoUrl } = await doctorsApi.uploadPhoto({ id, file: photoFile });
        doctor = { ...doctor, photoUrl };
      }
      return doctor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.doctors.all });
    },
  });
}
