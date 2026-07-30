import type { ThemeStatus } from "@/types/api";

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatConfidence(value: number | null) {
  if (value === null) {
    return "Not scored";
  }

  return `${Math.round(value * 100)}%`;
}

export function getStatusTone(status: ThemeStatus): "green" | "red" | "amber" {
  if (status === "APPROVED") {
    return "green";
  }

  if (status === "REJECTED") {
    return "red";
  }

  return "amber";
}
