import type { IdentityPermissionsCard, IdentityPermissionsDashboard } from "./types";

export function parseIdentityPermissionsCard(data: unknown): IdentityPermissionsCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    active_users: Number(d.active_users ?? 0),
    pending_approvals: Number(d.pending_approvals ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    build_philosophy: typeof d.build_philosophy === "string" ? d.build_philosophy : undefined,
    implementation_blueprint:
      typeof d.implementation_blueprint === "string" ? d.implementation_blueprint : undefined,
    ...d,
  } as IdentityPermissionsCard;
}

export function parseIdentityPermissionsDashboard(data: unknown): IdentityPermissionsDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    build_philosophy: typeof d.build_philosophy === "string" ? d.build_philosophy : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    implementation_blueprint:
      typeof d.implementation_blueprint === "object" && d.implementation_blueprint
        ? (d.implementation_blueprint as Record<string, unknown>)
        : undefined,
    user_management_requirements: Array.isArray(d.user_management_requirements)
      ? (d.user_management_requirements as string[])
      : undefined,
    org_membership_model: Array.isArray(d.org_membership_model)
      ? (d.org_membership_model as string[])
      : undefined,
    default_roles: Array.isArray(d.default_roles)
      ? (d.default_roles as IdentityPermissionsDashboard["default_roles"])
      : undefined,
    permission_categories: Array.isArray(d.permission_categories)
      ? (d.permission_categories as IdentityPermissionsDashboard["permission_categories"])
      : undefined,
    least_privilege_note:
      typeof d.least_privilege_note === "string" ? d.least_privilege_note : undefined,
    approval_integration:
      typeof d.approval_integration === "object" && d.approval_integration
        ? (d.approval_integration as Record<string, unknown>)
        : undefined,
    self_love_connection:
      typeof d.self_love_connection === "object" && d.self_love_connection
        ? (d.self_love_connection as Record<string, unknown>)
        : undefined,
    trust_connection:
      typeof d.trust_connection === "object" && d.trust_connection
        ? (d.trust_connection as Record<string, unknown>)
        : undefined,
    audit_requirements: Array.isArray(d.audit_requirements)
      ? (d.audit_requirements as string[])
      : undefined,
    access_reviews:
      typeof d.access_reviews === "object" && d.access_reviews
        ? (d.access_reviews as IdentityPermissionsDashboard["access_reviews"])
        : undefined,
    companion_permission_prefs:
      typeof d.companion_permission_prefs === "object" && d.companion_permission_prefs
        ? (d.companion_permission_prefs as IdentityPermissionsDashboard["companion_permission_prefs"])
        : undefined,
    success_criteria: Array.isArray(d.success_criteria)
      ? (d.success_criteria as IdentityPermissionsDashboard["success_criteria"])
      : undefined,
    blueprint_integration_links: Array.isArray(d.blueprint_integration_links)
      ? (d.blueprint_integration_links as IdentityPermissionsDashboard["blueprint_integration_links"])
      : undefined,
    current_role: typeof d.current_role === "string" ? d.current_role : undefined,
    active_users: Number(d.active_users ?? 0),
    pending_invitations: Number(d.pending_invitations ?? 0),
    pending_approvals: Number(d.pending_approvals ?? 0),
    suspended_users: Number(d.suspended_users ?? 0),
    role_distribution: Array.isArray(d.role_distribution)
      ? (d.role_distribution as IdentityPermissionsDashboard["role_distribution"])
      : [],
    approval_requests: Array.isArray(d.approval_requests)
      ? (d.approval_requests as IdentityPermissionsDashboard["approval_requests"])
      : [],
    recent_access_events: Array.isArray(d.recent_access_events)
      ? (d.recent_access_events as IdentityPermissionsDashboard["recent_access_events"])
      : [],
    user_permissions: Array.isArray(d.user_permissions) ? (d.user_permissions as string[]) : [],
    ai_risk_classification: Array.isArray(d.ai_risk_classification)
      ? (d.ai_risk_classification as IdentityPermissionsDashboard["ai_risk_classification"])
      : [],
    mfa_readiness: Array.isArray(d.mfa_readiness)
      ? (d.mfa_readiness as IdentityPermissionsDashboard["mfa_readiness"])
      : [],
    can_approve_low: Boolean(d.can_approve_low),
    can_approve_medium: Boolean(d.can_approve_medium),
    can_approve_high: Boolean(d.can_approve_high),
  };
}
