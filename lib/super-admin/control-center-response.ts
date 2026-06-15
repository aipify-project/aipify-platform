import type { SuperAdminControlCenter } from "./types";

const RPC_SETUP_ERROR_PATTERNS = [
  "could not find the function",
  "pgrst202",
  "function public.get_super_admin_control_center",
  "schema cache",
];

export function isSuperAdminControlCenterRpcError(message: string): boolean {
  const lower = message.toLowerCase();
  return RPC_SETUP_ERROR_PATTERNS.some((pattern) => lower.includes(pattern));
}

export function isSuperAdminAuthorizationError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("super admin access required") ||
    lower.includes("not authorized") ||
    lower.includes("permission denied")
  );
}

/** Operational shell when RPC is unavailable or returns no aggregate data yet. */
export function buildEmptySuperAdminControlCenter(
  overrides: Partial<SuperAdminControlCenter> = {}
): SuperAdminControlCenter {
  return {
    has_access: true,
    data_state: "empty",
    admin_role: "super_admin",
    display_name: "Administrator",
    platform_health_score: 0,
    platform_status: "pending_setup",
    global_status: "operational",
    system_uptime_pct: 0,
    active_organizations: 0,
    active_workspaces: 0,
    aipify_actions_today: 0,
    subscriptions_requiring_review: 0,
    growth_partner_applications_pending: 0,
    marketplace_reviews_pending: 0,
    critical_incidents: 0,
    trust_signals: {
      backup_ok: false,
      two_factor_enforced: true,
      audit_logging_active: false,
      compliance_monitoring_active: false,
    },
    privacy_note: "Aggregate platform operations only — no customer business content.",
    ...overrides,
  };
}

export function enrichSuperAdminControlCenterResponse(
  center: SuperAdminControlCenter
): SuperAdminControlCenter {
  const hasMetrics =
    (center.active_organizations ?? 0) > 0 ||
    (center.active_workspaces ?? 0) > 0 ||
    (center.aipify_actions_today ?? 0) > 0;

  if (center.data_state) return center;

  return {
    ...center,
    data_state: hasMetrics ? "live" : "empty",
  };
}
