import { toolRequiresCoreApproval } from "./core-approval-policy";

export type KompisCoreApprovalPresentationStatus =
  | "creating"
  | "awaiting_approval"
  | "approved"
  | "rejected"
  | "expired"
  | "cancelled"
  | "executing"
  | "consumed"
  | "creation_failed";

export function buildKompisApprovalDeepLink(actionRequestId: string | null | undefined): string | null {
  const id = typeof actionRequestId === "string" ? actionRequestId.trim() : "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return null;
  }
  return `/app/approvals?request=${encodeURIComponent(id)}`;
}

export function resolveKompisCoreApprovalPresentation(input: {
  coreApprovalRequired?: boolean | null;
  coreApprovalRequestId?: string | null;
  coreApprovalStatus?: string | null;
  runStatus?: string | null;
  approvalStatus?: string | null;
  bindingUsedAt?: string | null;
}): KompisCoreApprovalPresentationStatus {
  const required = input.coreApprovalRequired === true;
  const requestId = typeof input.coreApprovalRequestId === "string" ? input.coreApprovalRequestId.trim() : "";
  const coreStatus = String(input.coreApprovalStatus ?? "").trim().toLowerCase();
  const runStatus = String(input.runStatus ?? "").trim().toLowerCase();
  const approvalStatus = String(input.approvalStatus ?? "").trim().toLowerCase();

  if (required && !requestId) {
    if (approvalStatus === "pending" || runStatus === "awaiting_approval") {
      return "creation_failed";
    }
    return "creation_failed";
  }

  if (!required) {
    if (approvalStatus === "pending" || runStatus === "awaiting_approval") return "awaiting_approval";
    if (approvalStatus === "approved") return "approved";
    if (approvalStatus === "rejected" || runStatus === "rejected") return "rejected";
    return "awaiting_approval";
  }

  if (input.bindingUsedAt) return "consumed";
  if (coreStatus === "rejected") return "rejected";
  if (coreStatus === "cancelled" || coreStatus === "canceled") return "cancelled";
  if (coreStatus === "expired") return "expired";
  if (coreStatus === "completed" || coreStatus === "executed") return "consumed";
  if (runStatus === "executing") return "executing";
  if (coreStatus === "approved" || approvalStatus === "approved") return "approved";
  if (coreStatus === "pending" || approvalStatus === "pending" || runStatus === "awaiting_approval") {
    return "awaiting_approval";
  }
  return "awaiting_approval";
}

export function planRequiresCoreApproval(plan: {
  steps?: Array<{ toolKey?: string | null } | null> | null;
} | null | undefined): boolean {
  const steps = plan?.steps ?? [];
  return steps.some((step) => toolRequiresCoreApproval(String(step?.toolKey ?? "")));
}

export function canShowLocalApproveAndExecute(input: {
  coreApprovalRequired?: boolean | null;
  coreApprovalRequestId?: string | null;
  approvalStatus?: string | null;
}): boolean {
  if (input.coreApprovalRequired === true) return false;
  if (input.coreApprovalRequestId) return false;
  return input.approvalStatus === "pending" || input.approvalStatus === "not_required";
}

export function shouldShowApprovalCreationFailed(input: {
  coreApprovalRequired?: boolean | null;
  coreApprovalRequestId?: string | null;
  approvalStatus?: string | null;
  runStatus?: string | null;
}): boolean {
  return (
    resolveKompisCoreApprovalPresentation({
      coreApprovalRequired: input.coreApprovalRequired,
      coreApprovalRequestId: input.coreApprovalRequestId,
      approvalStatus: input.approvalStatus,
      runStatus: input.runStatus,
    }) === "creation_failed"
  );
}
