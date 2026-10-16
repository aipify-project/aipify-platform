/**
 * Preparation-only contract check for NOT_APPLIED_core_super_portal_dashboard_rpc_v1.sql
 * Does not touch Production. Fixture mirrors the jsonb_build_object keys in that SQL.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseSuperPortalDashboard } from "./parse";
import { toPlatformSuperAdminInsightView } from "./platform-insight";

const ROOT = join(__dirname, "../..");
const SQL_PATH = join(
  ROOT,
  "docs/platform/NOT_APPLIED_core_super_portal_dashboard_rpc_v1.sql",
);

const REQUIRED_TOP_KEYS = [
  "principle",
  "total_organizations",
  "total_active_users",
  "total_active_subscriptions",
  "platform_administrator_count",
  "global_platform_status",
  "open_critical_incidents",
  "growth_trends",
  "executive_alerts",
  "platform_uptime_pct",
  "platform_health_indicators",
  "privacy_note",
] as const;

const REQUIRED_HEALTH_KEYS = [
  "uptime_pct",
  "global_status",
  "open_critical_incidents",
  "operational_services",
  "degraded_services",
  "maintenance_services",
  "incident_services",
] as const;

function fixturePayload() {
  return {
    principle: "Executive oversight and governance — not a daily operational workspace.",
    total_organizations: 3,
    total_active_users: 10,
    total_active_subscriptions: 2,
    platform_administrator_count: 1,
    global_platform_status: "operational",
    open_critical_incidents: 0,
    growth_trends: [
      { key: "organizations", label: "Organization growth", value_pct: 10 },
      { key: "subscriptions", label: "Subscription growth", value_pct: 5 },
    ],
    executive_alerts: [],
    platform_uptime_pct: 99.9,
    platform_health_indicators: {
      uptime_pct: 99.9,
      global_status: "operational",
      open_critical_incidents: 0,
      operational_services: 8,
      degraded_services: 0,
      maintenance_services: 0,
      incident_services: 0,
    },
    privacy_note: "Aggregate executive metrics only — no customer business content.",
  };
}

function main() {
  const sql = readFileSync(SQL_PATH, "utf8");
  assert.match(sql, /NOT_APPLIED/);
  assert.match(sql, /create or replace function public\.get_super_portal_dashboard\(\)/);
  assert.match(sql, /perform public\._spsf257_require_super_admin\(\)/);
  assert.match(sql, /perform public\._super_admin_require_super_admin\(\)/);
  assert.match(sql, /set search_path = public/);
  assert.match(sql, /grant execute on function public\.get_super_portal_dashboard\(\) to authenticated/);
  assert.match(sql, /revoke all on function public\.get_super_portal_dashboard\(\) from public, anon/);
  assert.doesNotMatch(sql, /grant execute on function public\.get_super_portal_dashboard\(\) to anon/i);
  assert.doesNotMatch(sql, /grant execute on function public\.get_super_portal_dashboard\(\) to public/i);
  assert.doesNotMatch(sql, /perform_super_platform_administrator_action/);
  assert.doesNotMatch(sql, /insert into public\./i);

  for (const key of REQUIRED_TOP_KEYS) {
    assert.match(sql, new RegExp(`'${key}'`));
  }
  for (const key of REQUIRED_HEALTH_KEYS) {
    assert.match(sql, new RegExp(`'${key}'`));
  }

  const parsed = parseSuperPortalDashboard(fixturePayload());
  assert.ok(parsed);
  assert.equal(parsed.total_organizations, 3);
  assert.equal(parsed.platform_health_indicators.operational_services, 8);

  const view = toPlatformSuperAdminInsightView(parsed);
  assert.equal(view.total_organizations, 3);
  assert.equal(view.total_registered_users, 10);
  assert.equal(view.organization_growth_30d_pct, 10);

  console.log("core-super-portal-dashboard-rpc-prep.contract.test.ts: all assertions passed");
}

main();
