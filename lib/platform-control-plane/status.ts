/** Semantic status tokens for Platform control-plane surfaces. */

export const PLATFORM_CONTROL_PLANE_STATUS = [
  "healthy",
  "active",
  "paid",
  "approved",
  "completed",
  "info",
  "processing",
  "attention",
  "pending",
  "degraded",
  "overdue",
  "critical",
  "failed",
  "blocked",
  "unpaid_critical",
  "product",
  "automation",
  "inactive",
  "archived",
  "unknown",
  "not_configured",
  "no_data",
] as const;

export type PlatformControlPlaneStatus = (typeof PLATFORM_CONTROL_PLANE_STATUS)[number];

export type PlatformSemanticTone = "green" | "blue" | "amber" | "red" | "purple" | "gray";

const STATUS_TONE: Record<PlatformControlPlaneStatus, PlatformSemanticTone> = {
  healthy: "green",
  active: "green",
  paid: "green",
  approved: "green",
  completed: "green",
  info: "blue",
  processing: "blue",
  attention: "amber",
  pending: "amber",
  degraded: "amber",
  overdue: "amber",
  critical: "red",
  failed: "red",
  blocked: "red",
  unpaid_critical: "red",
  product: "purple",
  automation: "purple",
  inactive: "gray",
  archived: "gray",
  unknown: "gray",
  not_configured: "gray",
  no_data: "gray",
};

export function toneForControlPlaneStatus(status: PlatformControlPlaneStatus): PlatformSemanticTone {
  return STATUS_TONE[status];
}

export function isKnownControlPlaneStatus(value: string): value is PlatformControlPlaneStatus {
  return (PLATFORM_CONTROL_PLANE_STATUS as readonly string[]).includes(value);
}
