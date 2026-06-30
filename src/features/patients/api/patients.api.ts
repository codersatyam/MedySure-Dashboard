import { mockResponse } from "@/lib/api/mock";
import type { CreatePatientInput, Patient } from "../types";

let patients: Patient[] = [
  {
    id: "p1",
    name: "Anna Cole",
    mrn: "MRN-10231",
    age: 54,
    gender: "F",
    condition: "Hypertension",
    doctor: "Dr. Mendoza",
    status: "Outpatient",
    lastVisit: "Jun 24, 2026",
  },
  {
    id: "p2",
    name: "James Park",
    mrn: "MRN-10232",
    age: 41,
    gender: "M",
    condition: "Type 2 Diabetes",
    doctor: "Dr. Chen",
    status: "Outpatient",
    lastVisit: "Jun 22, 2026",
  },
  {
    id: "p3",
    name: "Lin Wei",
    mrn: "MRN-10233",
    age: 33,
    gender: "F",
    condition: "Annual checkup",
    doctor: "Dr. Patel",
    status: "Discharged",
    lastVisit: "Jun 20, 2026",
  },
  {
    id: "p4",
    name: "Marco Diaz",
    mrn: "MRN-10234",
    age: 67,
    gender: "M",
    condition: "Post-op cardiac",
    doctor: "Dr. Mendoza",
    status: "Admitted",
    lastVisit: "Jun 25, 2026",
  },
  {
    id: "p5",
    name: "Sara Khan",
    mrn: "MRN-10235",
    age: 8,
    gender: "F",
    condition: "Pediatric asthma",
    doctor: "Dr. Chen",
    status: "Outpatient",
    lastVisit: "Jun 26, 2026",
  },
  {
    id: "p6",
    name: "Robert Hughes",
    mrn: "MRN-10236",
    age: 72,
    gender: "M",
    condition: "Trauma — ICU",
    doctor: "Dr. Okafor",
    status: "Critical",
    lastVisit: "Jun 28, 2026",
  },
  {
    id: "p7",
    name: "Emily Nwosu",
    mrn: "MRN-10237",
    age: 29,
    gender: "F",
    condition: "Prenatal care",
    doctor: "Dr. Patel",
    status: "Outpatient",
    lastVisit: "Jun 18, 2026",
  },
  {
    id: "p8",
    name: "David Klein",
    mrn: "MRN-10238",
    age: 58,
    gender: "M",
    condition: "Oncology follow-up",
    doctor: "Dr. Okafor",
    status: "Admitted",
    lastVisit: "Jun 27, 2026",
  },
];

/** Next MRN number, derived from the largest existing one so it stays unique. */
function nextMrn(): string {
  const max = patients.reduce((m, p) => {
    const n = Number(p.mrn.replace(/\D/g, ""));
    return Number.isNaN(n) ? m : Math.max(m, n);
  }, 10230);
  return `MRN-${max + 1}`;
}

function today(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const patientsApi = {
  list: () => mockResponse(patients),
  /**
   * In-memory create. MRN and lastVisit are generated here. When a real backend
   * lands, swap this for an `apiFetch("/patients", { method: "POST", body })`.
   */
  create: (input: CreatePatientInput) => {
    const patient: Patient = {
      id: crypto.randomUUID(),
      mrn: nextMrn(),
      lastVisit: today(),
      ...input,
    };
    patients = [patient, ...patients];
    return mockResponse(patient);
  },
};
