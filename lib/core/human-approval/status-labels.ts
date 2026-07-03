import type { AipifyStatusKind } from "@/lib/design/status-system";
import type {
  CoreHumanApprovalAccessMode,
  CoreHumanApprovalStatus,
} from "./types";
import { CORE_HUMAN_APPROVAL_ACCESS_MODES, CORE_HUMAN_APPROVAL_STATUSES } from "./types";

export const CORE_HUMAN_APPROVAL_STATUS_LABEL_KEYS: Record<CoreHumanApprovalStatus, string> = {
  pending: "status.pending",
  approved: "status.approved",
  denied: "status.denied",
  expired: "status.expired",
  revoked: "status.revoked",
  executing: "status.executing",
  succeeded: "status.succeeded",
  failed: "status.failed",
};

export const CORE_HUMAN_APPROVAL_RISK_LABEL_KEYS: Record<number, string> = {
  0: "risk.information",
  1: "risk.draft",
  2: "risk.reversible",
  3: "risk.sensitive",
  4: "risk.critical",
};

export const CORE_HUMAN_APPROVAL_ACCESS_MODE_LABEL_KEYS: Record<
  CoreHumanApprovalAccessMode,
  string
> = {
  one_time: "accessMode.oneTime",
  ongoing: "accessMode.ongoing",
};

export function mapCoreHumanApprovalStatusToKind(
  status: string,
): AipifyStatusKind {
  switch (status) {
    case "pending":
      return "waiting";
    case "approved":
    case "succeeded":
      return "completed";
    case "denied":
    case "failed":
    case "revoked":
      return "not_allowed";
    case "expired":
      return "restricted";
    case "executing":
      return "needs_attention";
    default:
      return "information";
  }
}

export function mapTrustStatusToCoreStatus(status: string): CoreHumanApprovalStatus | string {
  if (status === "rejected") return "denied";
  if (status === "completed") return "succeeded";
  if (status === "cancelled") return "revoked";
  if ((CORE_HUMAN_APPROVAL_STATUSES as readonly string[]).includes(status)) {
    return status as CoreHumanApprovalStatus;
  }
  return status;
}

export function normalizeRiskLevel(value: unknown): number {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return 1;
  return Math.min(4, Math.max(0, Math.round(numeric)));
}

export function riskLabelKeyForLevel(level: number): string {
  return CORE_HUMAN_APPROVAL_RISK_LABEL_KEYS[normalizeRiskLevel(level)] ?? "risk.draft";
}

export function accessModeLabelKey(mode: string): string {
  if (mode === "ongoing") return CORE_HUMAN_APPROVAL_ACCESS_MODE_LABEL_KEYS.ongoing;
  return CORE_HUMAN_APPROVAL_ACCESS_MODE_LABEL_KEYS.one_time;
}

export function statusLabelKey(status: string): string {
  const mapped = mapTrustStatusToCoreStatus(status);
  if ((CORE_HUMAN_APPROVAL_STATUSES as readonly string[]).includes(mapped)) {
    return CORE_HUMAN_APPROVAL_STATUS_LABEL_KEYS[mapped as CoreHumanApprovalStatus];
  }
  return "status.pending";
}

export function isKnownAccessMode(mode: string): mode is CoreHumanApprovalAccessMode {
  return (CORE_HUMAN_APPROVAL_ACCESS_MODES as readonly string[]).includes(mode);
}
