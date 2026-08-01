/**
 * Shared actionable-approval rules for Dashboard / ECC / Approval Center parity.
 */

import { isApprovalRequestUuid } from "@/lib/companion-action-approval/parse";
import { isShowcaseCustomerRecord } from "./showcase-filter";

const ACTIONABLE_STATUSES = new Set(["pending", "awaiting_approval"]);
const NON_ACTIONABLE_STATUSES = new Set([
  "approved",
  "rejected",
  "expired",
  "cancelled",
  "canceled",
  "consumed",
  "completed",
  "failed",
  "dismissed",
]);

export function isActionableApprovalStatus(status: string | null | undefined): boolean {
  const key = String(status ?? "")
    .trim()
    .toLowerCase();
  if (!key) return false;
  if (NON_ACTIONABLE_STATUSES.has(key)) return false;
  return ACTIONABLE_STATUSES.has(key);
}

export function isActionableApprovalRecord(record: Record<string, unknown>): boolean {
  if (isShowcaseCustomerRecord(record)) return false;

  const category = String(record.category ?? "").toLowerCase();
  if (category === "notification") return false;

  const actionType = String(record.action_type ?? record.category ?? "").toLowerCase();
  const looksLikeApproval =
    actionType === "approval" ||
    actionType.includes("approval") ||
    category === "action" ||
    Boolean(record.action_request_id) ||
    Boolean(record.approval_id);

  if (!looksLikeApproval) return false;

  const status = String(
    record.action_status ?? record.status ?? record.approval_status ?? "pending",
  ).toLowerCase();
  if (!isActionableApprovalStatus(status)) return false;

  const idCandidates = [record.approval_id, record.action_request_id, record.request_id, record.id];
  const hasUuid = idCandidates.some(
    (value) => typeof value === "string" && isApprovalRequestUuid(value),
  );
  // Seed placeholders without CORE ids are not actionable.
  if (!hasUuid && String(record.action_key ?? "").toLowerCase() === "approval_trust") {
    return false;
  }

  return true;
}

export function countActionableApprovals(records: Record<string, unknown>[]): number {
  return records.filter((record) => isActionableApprovalRecord(record)).length;
}

/** Stale approval-delay alerts must not appear when no actionable approvals exist. */
export function shouldShowApprovalDelayAlert(
  record: Record<string, unknown>,
  actionableApprovalCount: number,
): boolean {
  const alertType = String(record.alert_type ?? "").toLowerCase();
  if (alertType !== "approval_delay") return true;
  return actionableApprovalCount > 0;
}
