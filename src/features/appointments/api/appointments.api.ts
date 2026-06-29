import { mockResponse } from "@/lib/api/mock";
import type { Appointment } from "../types";

const appointments: Appointment[] = [
  {
    id: "ap1",
    time: "08:30",
    patient: "Anna Cole",
    doctor: "Dr. Mendoza",
    department: "Cardiology",
    type: "Consultation",
    status: "Checked in",
  },
  {
    id: "ap2",
    time: "09:00",
    patient: "James Park",
    doctor: "Dr. Chen",
    department: "Endocrinology",
    type: "Follow-up",
    status: "Confirmed",
  },
  {
    id: "ap3",
    time: "09:30",
    patient: "Lin Wei",
    doctor: "Dr. Patel",
    department: "General",
    type: "Checkup",
    status: "Waiting",
  },
  {
    id: "ap4",
    time: "10:15",
    patient: "Sara Khan",
    doctor: "Dr. Chen",
    department: "Pediatrics",
    type: "Consultation",
    status: "Confirmed",
  },
  {
    id: "ap5",
    time: "11:00",
    patient: "Emily Nwosu",
    doctor: "Dr. Patel",
    department: "Obstetrics",
    type: "Prenatal",
    status: "Completed",
  },
  {
    id: "ap6",
    time: "13:30",
    patient: "David Klein",
    doctor: "Dr. Okafor",
    department: "Oncology",
    type: "Treatment",
    status: "Confirmed",
  },
  {
    id: "ap7",
    time: "14:45",
    patient: "Marco Diaz",
    doctor: "Dr. Mendoza",
    department: "Cardiology",
    type: "Post-op",
    status: "Cancelled",
  },
];

export const appointmentsApi = {
  list: () => mockResponse(appointments),
};
