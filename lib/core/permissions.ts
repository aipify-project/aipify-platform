/**
 * Identity, roles & permission helpers (Phase A.2).
 * Authoritative enforcement lives in Supabase RPCs (_irp_*).
 */

import {
  type OrganizationRole,
  ORGANIZATION_ROLES,
  roleHasPermission as roleHasLegacyPermission,
  type OrganizationPermission,
} from "./organization";
import { type RiskLevel } from "./risk";

export const PERMISSION_KEYS = [
  "users.view",
  "users.create",
  "users.update",
  "users.delete",
  "modules.view",
  "modules.manage",
  "support.view",
  "support.reply",
  "support.escalate",
  "knowledge.view",
  "knowledge.create",
  "knowledge.update",
  "knowledge.publish",
  "audit.view",
  "integrations.manage",
  "ai.approve",
  "ai.reject",
  "settings.manage",
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export const USER_ACCOUNT_STATUSES = [
  "pending_verification",
  "active",
  "suspended",
  "locked",
  "deleted",
] as const;

export type UserAccountStatus = (typeof USER_ACCOUNT_STATUSES)[number];

export const APPROVAL_STATUSES = ["pending", "approved", "rejected", "expired"] as const;
export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];

export type { RiskLevel };

const DEFAULT_ROLE_PERMISSIONS: Record<OrganizationRole, PermissionKey[]> = {
  owner: [...PERMISSION_KEYS],
  administrator: PERMISSION_KEYS.filter((k) => k !== "users.delete"),
  manager: [
    "users.view",
    "modules.view",
    "support.view",
    "support.reply",
    "support.escalate",
    "knowledge.view",
    "knowledge.update",
    "audit.view",
    "ai.approve",
    "ai.reject",
  ],
  support_agent: ["support.view", "support.reply", "knowledge.view"],
  viewer: ["users.view", "modules.view", "support.view", "knowledge.view", "audit.view"],
};

/** Client-side permission preview — server RPCs are authoritative. */
export function hasPermission(
  role: OrganizationRole,
  permissionKey: PermissionKey,
  userOverride?: boolean | null
): boolean {
  if (userOverride === true) return true;
  if (userOverride === false) return false;
  return DEFAULT_ROLE_PERMISSIONS[role]?.includes(permissionKey) ?? false;
}

export function isOwner(role: OrganizationRole): boolean {
  return role === "owner";
}

export function isAdministrator(role: OrganizationRole): boolean {
  return role === "owner" || role === "administrator";
}

export function canApproveRisk(role: OrganizationRole, riskLevel: RiskLevel): boolean {
  switch (riskLevel) {
    case "low":
    case "medium":
      return role === "owner" || role === "administrator" || role === "manager";
    case "high":
      return role === "owner" || role === "administrator";
    default:
      return false;
  }
}

export function canAccessModule(
  role: OrganizationRole,
  moduleKey: string,
  enabled: boolean
): boolean {
  if (!enabled) return false;
  if (moduleKey === "admin_assistant") return isAdministrator(role) || role === "manager";
  if (moduleKey === "support_ai") {
    return role !== "viewer" || hasPermission(role, "support.view");
  }
  return true;
}

export function requirePermission(
  role: OrganizationRole,
  permissionKey: PermissionKey,
  userOverride?: boolean | null
): void {
  if (!hasPermission(role, permissionKey, userOverride)) {
    throw new Error(`Permission denied: ${permissionKey}`);
  }
}

export function requireApproval(riskLevel: RiskLevel): boolean {
  return riskLevel === "medium" || riskLevel === "high";
}

/** Bridge legacy organization permission checks. */
export function hasLegacyOrganizationPermission(
  role: OrganizationRole,
  permission: OrganizationPermission
): boolean {
  return roleHasLegacyPermission(role, permission);
}

export { ORGANIZATION_ROLES, type OrganizationRole };
