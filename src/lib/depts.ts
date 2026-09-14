import type { Dept } from "@/generated/prisma/client";

export const DEPTS: { value: Dept; label: string }[] = [
  { value: "CSE", label: "CSE" },
  { value: "CSE_AI", label: "CSE-AI" },
  { value: "EAC", label: "EAC" },
  { value: "EEE", label: "EEE" },
  { value: "ECE", label: "ECE" },
  { value: "ELC", label: "ELC" },
  { value: "ME", label: "ME" },
  { value: "OTHER", label: "Other" },
];

export function deptLabel(dept: Dept, deptOther?: string | null) {
  if (dept === "OTHER") return deptOther || "Other";
  return DEPTS.find((d) => d.value === dept)?.label ?? dept;
}
