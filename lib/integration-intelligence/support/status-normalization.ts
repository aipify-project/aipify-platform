import type { NormalizedSlaStatus, NormalizedSupportStatus } from "./types";

const SUPPORT_STATUS_MAP: Record<string, NormalizedSupportStatus> = {
  received: "new",
  triaged: "open",
  draft: "in_progress",
  pending_approval: "waiting_for_support",
  pending: "open",
  open: "open",
  assigned: "assigned",
  in_progress: "in_progress",
  waiting_for_customer: "waiting_for_customer",
  waiting_for_support: "waiting_for_support",
  waiting_on_customer: "waiting_for_customer",
  escalated: "escalated",
  resolved: "resolved",
  closed: "closed",
  auto_replied: "resolved",
  cancelled: "cancelled",
  reopened: "reopened",
};

export function normalizeSupportStatus(raw: string | null | undefined): NormalizedSupportStatus {
  const key = String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  return SUPPORT_STATUS_MAP[key] ?? "open";
}

export function normalizeSupportPriority(raw: string | null | undefined): "low" | "normal" | "high" | "urgent" | null {
  const key = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (key === "critical" || key === "urgent" || key === "high") return "urgent";
  if (key === "medium" || key === "normal") return "normal";
  if (key === "low") return "low";
  return null;
}

export function normalizeSlaStatus(raw: string | null | undefined): NormalizedSlaStatus {
  const key = String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  switch (key) {
    case "on_track":
    case "healthy":
    case "ok":
      return "on_track";
    case "warning":
    case "approaching":
      return "warning";
    case "at_risk":
    case "risk":
      return "at_risk";
    case "breached":
    case "overdue":
      return "breached";
    default:
      return "unavailable";
  }
}

export function inferSlaStatusFromCase(input: {
  sla_status?: string | null;
}): NormalizedSlaStatus {
  return normalizeSlaStatus(input.sla_status);
}
