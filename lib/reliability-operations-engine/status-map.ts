import type { AipifyStatusKind } from "@/lib/design/status-system";

const STATUS_MAP: Record<string, AipifyStatusKind> = {
  operational: "completed",
  healthy: "completed",
  connected: "completed",
  valid: "completed",
  passed: "completed",
  resolved: "completed",
  completed: "completed",
  verified_restored: "verified",
  verified: "verified",
  degraded: "needs_attention",
  needs_attention: "needs_attention",
  at_risk: "needs_attention",
  expiring: "needs_attention",
  delayed: "needs_attention",
  disruption: "not_allowed",
  failed: "not_allowed",
  expired: "not_allowed",
  critical: "not_allowed",
  recovery: "waiting",
  pending: "waiting",
  scheduled: "waiting",
  investigating: "waiting",
  restricted: "restricted",
  planned_maintenance: "information",
  information: "information",
  draft: "information",
};

export function mapReliabilityStatusToKind(status: unknown): AipifyStatusKind {
  const key = String(status ?? "information").toLowerCase().replace(/-/g, "_");
  return STATUS_MAP[key] ?? "information";
}

export { mapReliabilityStatusToSemantic } from "@/lib/design/semantic-status-system";
