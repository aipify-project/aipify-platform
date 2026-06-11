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
  "support.assign",
  "support.close",
  "support.view_metrics",
  "knowledge.view",
  "knowledge.create",
  "knowledge.update",
  "knowledge.edit",
  "knowledge.review",
  "knowledge.publish",
  "knowledge.archive",
  "assistant.view",
  "assistant.recommend",
  "assistant.manage_tasks",
  "assistant.view_notifications",
  "audit.view",
  "integrations.manage",
  "integrations.view",
  "integrations.create",
  "integrations.update",
  "integrations.disable",
  "integrations.delete",
  "integrations.sync",
  "dashboard.view",
  "dashboard.configure",
  "dashboard.view_alerts",
  "onboarding.view",
  "onboarding.manage",
  "self_support.view",
  "self_support.escalate",
  "subscription.view",
  "subscription.manage",
  "subscription.upgrade",
  "quality.view",
  "quality.manage",
  "quality.resolve",
  "quality.ignore",
  "governance.view",
  "governance.manage",
  "governance.review",
  "governance.approve",
  "pilot.view",
  "pilot.manage",
  "pilot.feedback",
  "pilot.configure",
  "analytics.view",
  "analytics.export",
  "analytics.manage",
  "notifications.view",
  "notifications.manage",
  "notifications.send",
  "notifications.configure",
  "deployments.view",
  "deployments.manage",
  "feature_flags.manage",
  "rollback.execute",
  "observability.view",
  "observability.manage",
  "incidents.view",
  "incidents.manage",
  "incidents.resolve",
  "incidents.escalate",
  "maintenance.manage",
  "install.view",
  "install.manage",
  "install.discover",
  "install.approve_permissions",
  "modules.activate",
  "modules.configure",
  "modules.update",
  "modules.deactivate",
  "internal_ops.view",
  "internal_ops.manage",
  "internal_ops.validate",
  "internal_ops.feedback",
  "launch.view",
  "launch.manage",
  "launch.review",
  "launch.monitor",
  "success.view",
  "success.manage",
  "success.intervene",
  "success.assess",
  "status.view",
  "status.manage",
  "incidents.publish",
  "maintenance.manage",
  "enterprise.view",
  "enterprise.manage",
  "enterprise.export",
  "enterprise.override",
  "executive.view",
  "executive.export",
  "executive.schedule",
  "learning_training.view",
  "learning_training.assign",
  "learning_training.manage",
  "learning_training.review",
  "certifications.view",
  "certifications.issue",
  "certifications.revoke",
  "certifications.export",
  "certifications.manage",
  "memory.view",
  "memory.create",
  "memory.edit",
  "memory.archive",
  "memory.review",
  "impact.view",
  "impact.export",
  "impact.manage",
  "compliance.view",
  "compliance.manage",
  "compliance.export",
  "compliance.review",
  "intelligence.view",
  "intelligence.manage",
  "intelligence.dismiss",
  "intelligence.export",
  "operations.view",
  "operations.manage",
  "operations.assign",
  "operations.resolve",
  "operations.escalate",
  "improvements.view",
  "improvements.manage",
  "improvements.approve",
  "improvements.dismiss",
  "oversight.view",
  "oversight.approve",
  "oversight.reject",
  "oversight.override",
  "workflows.view",
  "workflows.manage",
  "workflows.approve",
  "workflows.pause",
  "business_packs.view",
  "business_packs.activate",
  "business_packs.manage",
  "business_packs.customize",
  "industry.view",
  "industry.manage",
  "industry.override",
  "industry.export",
  "ecosystem.view",
  "ecosystem.manage",
  "ecosystem.approve",
  "ecosystem.suspend",
  "ethics.view",
  "ethics.manage",
  "ethics.review",
  "ethics.override",
  "changes.view",
  "changes.manage",
  "changes.communicate",
  "changes.review",
  "value.view",
  "value.manage",
  "value.export",
  "value.review",
  "resilience.view",
  "resilience.manage",
  "resilience.review",
  "resilience.approve",
  "communications.view",
  "communications.manage",
  "communications.publish",
  "communications.export",
  "improvements.review",
  "commitments.view",
  "commitments.manage",
  "commitments.review",
  "commitments.export",
  "decisions.view",
  "decisions.manage",
  "decisions.review",
  "decisions.export",
  "strategy.view",
  "strategy.manage",
  "strategy.review",
  "strategy.export",
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
    "dashboard.view",
    "dashboard.view_alerts",
    "onboarding.view",
    "subscription.view",
    "quality.view",
    "quality.resolve",
    "governance.view",
    "governance.review",
    "analytics.view",
    "analytics.export",
    "notifications.view",
    "notifications.manage",
    "notifications.configure",
    "deployments.view",
    "feature_flags.manage",
    "observability.view",
    "incidents.view",
    "incidents.manage",
    "incidents.resolve",
    "incidents.escalate",
    "status.view",
    "incidents.publish",
    "enterprise.view",
    "enterprise.export",
    "executive.view",
    "executive.export",
    "learning_training.view",
    "learning_training.review",
    "certifications.view",
    "certifications.issue",
    "certifications.export",
    "memory.view",
    "memory.create",
    "memory.edit",
    "memory.review",
    "oversight.view",
    "oversight.approve",
    "oversight.reject",
    "workflows.view",
    "workflows.approve",
    "workflows.pause",
    "industry.view",
    "industry.override",
    "ecosystem.view",
    "ecosystem.manage",
    "ethics.view",
    "ethics.review",
    "changes.view",
    "changes.manage",
    "changes.communicate",
    "changes.review",
    "value.view",
    "value.manage",
    "value.export",
    "value.review",
    "resilience.view",
    "resilience.manage",
    "resilience.review",
    "communications.view",
    "communications.manage",
    "communications.publish",
    "communications.export",
    "improvements.view",
    "improvements.manage",
    "improvements.approve",
    "improvements.review",
    "commitments.view",
    "commitments.manage",
    "commitments.review",
    "commitments.export",
    "decisions.view",
    "decisions.manage",
    "decisions.review",
    "decisions.export",
    "strategy.view",
    "strategy.manage",
    "strategy.review",
    "strategy.export",
    "ai.approve",
    "ai.reject",
  ],
  support_agent: [
    "support.view",
    "support.reply",
    "knowledge.view",
    "dashboard.view",
    "dashboard.view_alerts",
    "onboarding.view",
    "self_support.view",
    "self_support.escalate",
    "quality.view",
    "governance.view",
    "analytics.view",
    "notifications.view",
    "notifications.manage",
    "deployments.view",
    "observability.view",
    "incidents.view",
    "incidents.escalate",
    "status.view",
    "enterprise.view",
    "executive.view",
    "learning_training.view",
    "certifications.view",
    "memory.view",
    "memory.create",
    "workflows.view",
    "industry.view",
    "ecosystem.view",
    "ethics.view",
    "changes.view",
    "value.view",
    "resilience.view",
    "communications.view",
    "communications.manage",
    "improvements.view",
    "commitments.view",
    "commitments.review",
    "decisions.view",
    "strategy.view",
  ],
  viewer: [
    "users.view",
    "modules.view",
    "support.view",
    "knowledge.view",
    "audit.view",
    "dashboard.view",
    "onboarding.view",
    "subscription.view",
    "self_support.view",
    "quality.view",
    "governance.view",
    "analytics.view",
    "notifications.view",
    "deployments.view",
    "observability.view",
    "incidents.view",
    "status.view",
    "enterprise.view",
    "executive.view",
    "learning_training.view",
    "certifications.view",
    "memory.view",
    "workflows.view",
    "industry.view",
    "ecosystem.view",
    "ethics.view",
    "changes.view",
    "value.view",
    "resilience.view",
    "communications.view",
    "improvements.view",
    "commitments.view",
    "decisions.view",
    "strategy.view",
  ],
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
  if (moduleKey === "self_support") {
    return hasPermission(role, "self_support.view");
  }
  if (moduleKey === "governance_policy") {
    return hasPermission(role, "governance.view");
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
