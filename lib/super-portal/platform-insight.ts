import type { SuperPortalDashboard } from "./types";

/**
 * Safe read-only aggregates for Platform Dashboard Super Admin insight cards.
 * Omits scaffolded / non-authoritative fields (e.g. hardcoded platform_uptime_pct).
 */
export type PlatformSuperAdminInsightView = {
  total_organizations: number;
  total_registered_users: number;
  total_active_subscriptions: number;
  active_platform_support_administrators: number;
  open_critical_incidents: number;
  global_platform_status: SuperPortalDashboard["global_platform_status"];
  organization_growth_30d_pct: number | null;
  subscription_growth_30d_pct: number | null;
  executive_alert_count: number;
  privacy_note: string;
};

export function toPlatformSuperAdminInsightView(
  dashboard: SuperPortalDashboard,
): PlatformSuperAdminInsightView {
  const orgTrend = dashboard.growth_trends.find((t) => t.key === "organizations");
  const subTrend = dashboard.growth_trends.find((t) => t.key === "subscriptions");

  return {
    total_organizations: dashboard.total_organizations,
    total_registered_users: dashboard.total_active_users,
    total_active_subscriptions: dashboard.total_active_subscriptions,
    active_platform_support_administrators: dashboard.platform_administrator_count,
    open_critical_incidents: dashboard.open_critical_incidents,
    global_platform_status: dashboard.global_platform_status,
    organization_growth_30d_pct: orgTrend ? orgTrend.value_pct : null,
    subscription_growth_30d_pct: subTrend ? subTrend.value_pct : null,
    executive_alert_count: dashboard.executive_alerts.length,
    privacy_note: dashboard.privacy_note,
  };
}
