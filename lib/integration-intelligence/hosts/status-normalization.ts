import type { NormalizedPropertyStatus, NormalizedReservationStatus } from "./types";

const RESERVATION_STATUS_MAP: Record<string, NormalizedReservationStatus> = {
  inquiry: "inquiry",
  pending: "pending",
  confirmed: "confirmed",
  checked_in: "checked_in",
  checked_out: "checked_out",
  cancelled: "cancelled",
  canceled: "cancelled",
};

const PROPERTY_STATUS_MAP: Record<string, NormalizedPropertyStatus> = {
  active: "active",
  inactive: "inactive",
  maintenance: "maintenance",
  archived: "archived",
};

export function normalizeReservationStatus(raw: string | null | undefined): NormalizedReservationStatus {
  const key = String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  return RESERVATION_STATUS_MAP[key] ?? "pending";
}

export function normalizePropertyStatus(raw: string | null | undefined): NormalizedPropertyStatus {
  const key = String(raw ?? "")
    .trim()
    .toLowerCase();
  return PROPERTY_STATUS_MAP[key] ?? "active";
}
