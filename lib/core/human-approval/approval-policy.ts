import { isAdministrator, type OrganizationRole } from "@/lib/core/permissions";

export type HumanApprovalActorContext = {
  role: OrganizationRole | string | null;
  user_id: string | null;
};

const TRUST_APPROVER_LADDER: Record<string, readonly string[]> = {
  staff: ["owner", "administrator", "admin", "support", "staff"],
  admin: ["owner", "administrator", "admin"],
  owner: ["owner"],
};

export function canApproveTrustActionRisk(
  role: string | null,
  approverRoleRequired: string | null,
): boolean {
  if (!role || !approverRoleRequired) return false;
  const allowed = TRUST_APPROVER_LADDER[approverRoleRequired];
  if (!allowed) return false;
  return allowed.includes(role);
}

export function isElevatedSelfApprovalRole(role: string | null): boolean {
  if (!role) return false;
  return isAdministrator(role as OrganizationRole) || role === "owner" || role === "admin";
}

/** Block requester from approving own request unless elevated role permits exact action. */
export function isSelfGrantBlocked(input: {
  requester_user_id: string | null;
  approver_user_id: string | null;
  approver_role: string | null;
  can_approve_action: boolean;
}): boolean {
  if (!input.requester_user_id || !input.approver_user_id) return false;
  if (input.requester_user_id !== input.approver_user_id) return false;
  if (!input.can_approve_action) return true;
  return !isElevatedSelfApprovalRole(input.approver_role);
}

export function shouldBlockApproverFromSubmittingRequest(canApprove: boolean): boolean {
  return canApprove;
}
