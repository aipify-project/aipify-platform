import type { AvailabilitySlotStatus, NormalizedBookingStatus } from "./types";

const BOOKING_STATUS_ALIASES: Record<string, NormalizedBookingStatus> = {
  scheduled: "scheduled",
  confirmed: "confirmed",
  booked: "confirmed",
  in_progress: "in_progress",
  active: "in_progress",
  completed: "completed",
  done: "completed",
  cancelled: "cancelled",
  canceled: "cancelled",
  no_show: "no_show",
  noshow: "no_show",
  pending: "pending",
  blocked: "blocked",
  hold: "pending",
};

export function normalizeBookingStatus(raw: string | null | undefined): NormalizedBookingStatus {
  if (!raw) return "pending";
  const normalized = raw.trim().toLowerCase().replace(/\s+/g, "_");
  return BOOKING_STATUS_ALIASES[normalized] ?? "pending";
}

export function normalizeAvailabilitySlotStatus(
  raw: string | null | undefined,
): AvailabilitySlotStatus {
  if (!raw) return "unknown";
  const normalized = raw.trim().toLowerCase();
  if (normalized.includes("avail") || normalized === "open" || normalized === "free") return "available";
  if (normalized.includes("busy") || normalized.includes("booked") || normalized.includes("occupied")) {
    return "busy";
  }
  if (normalized.includes("block") || normalized.includes("closed")) return "blocked";
  return "unknown";
}
