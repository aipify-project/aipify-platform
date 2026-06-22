import type { SemanticBadgeType } from "@/lib/design/semantic-status-system";

/** Customer-facing connection status for integration setup. */
export type IntegrationConnectionSemanticStatus =
  | "pending"
  | "missing_info"
  | "needs_review"
  | "connected"
  | "failed"
  | "read_only";

export type IntegrationConnectionBadgeConfig = {
  semanticStatus: IntegrationConnectionSemanticStatus;
  badgeType: SemanticBadgeType;
  badgeValue: string;
  labelKey: string;
};

const STATUS_LABEL_KEYS: Record<IntegrationConnectionSemanticStatus, string> = {
  pending: "customerApp.portalStructure.integrations.statuses.pending",
  missing_info: "customerApp.portalStructure.integrations.statuses.missingInfo",
  needs_review: "customerApp.portalStructure.integrations.statuses.needsReview",
  connected: "customerApp.portalStructure.integrations.statuses.connected",
  failed: "customerApp.portalStructure.integrations.statuses.failed",
  read_only: "customerApp.portalStructure.integrations.statuses.readOnly",
};

const STATUS_BADGE: Record<
  IntegrationConnectionSemanticStatus,
  { type: SemanticBadgeType; value: string }
> = {
  pending: { type: "workflow", value: "pending" },
  missing_info: { type: "workflow", value: "open" },
  needs_review: { type: "workflow", value: "awaiting_approval" },
  connected: { type: "health", value: "healthy" },
  failed: { type: "severity", value: "critical" },
  read_only: { type: "access", value: "restricted" },
};

export function mapConnectionStatusToSemantic(
  status: string | null | undefined,
  options?: {
    permissionLevel?: string | null;
    hasCredential?: boolean;
    lastTestSuccessAt?: string | null;
    lastTestFailedAt?: string | null;
    lastTestError?: string | null;
  }
): IntegrationConnectionSemanticStatus {
  const key = (status ?? "").toLowerCase().replace(/[\s-]+/g, "_");
  const permission = (options?.permissionLevel ?? "").toLowerCase();

  if (key === "connected" || key === "active" || key === "verified") {
    if (options?.lastTestFailedAt || options?.lastTestError) return "failed";
    if (permission === "read_only" || permission === "readonly") return "read_only";
    if (options?.lastTestSuccessAt) return "connected";
    return "connected";
  }

  if (key === "failed" || key === "error" || key === "disconnected") return "failed";
  if (key === "needs_review" || key === "review" || key === "attention") return "needs_review";
  if (key === "missing_info" || key === "incomplete" || key === "draft") return "missing_info";
  if (key === "read_only" || key === "readonly") return "read_only";

  if (!options?.hasCredential && (key === "pending" || key === "" || key === "new")) {
    return "missing_info";
  }

  if (options?.lastTestFailedAt || options?.lastTestError) return "failed";
  if (options?.lastTestSuccessAt) {
    return permission === "read_only" || permission === "readonly" ? "read_only" : "connected";
  }

  return "pending";
}

export function getIntegrationConnectionBadgeConfig(
  semanticStatus: IntegrationConnectionSemanticStatus
): IntegrationConnectionBadgeConfig {
  const badge = STATUS_BADGE[semanticStatus];
  return {
    semanticStatus,
    badgeType: badge.type,
    badgeValue: badge.value,
    labelKey: STATUS_LABEL_KEYS[semanticStatus],
  };
}
