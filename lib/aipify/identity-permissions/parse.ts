import type { IdentityPermissionsCard, IdentityPermissionsDashboard } from "./types";

export function parseIdentityPermissionsCard(data: unknown): IdentityPermissionsCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    active_users: Number(d.active_users ?? 0),
    pending_approvals: Number(d.pending_approvals ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
  };
}

export function parseIdentityPermissionsDashboard(data: unknown): IdentityPermissionsDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
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
