import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  evaluateSuperPortalDashboardAccess,
  meetsSuperPortalDashboardTwoFactorPolicy,
} from "@/lib/super-portal/dashboard-access";
import { toPlatformSuperAdminInsightView } from "@/lib/super-portal/platform-insight";
import type { SuperPortalDashboard } from "@/lib/super-portal/types";
import type { TwoFactorStatus } from "@/lib/auth/two-factor";

function baseStatus(overrides: Partial<TwoFactorStatus> = {}): TwoFactorStatus {
  return {
    authenticated: true,
    enabled: true,
    required: true,
    confirmed_at: "2026-01-01T00:00:00Z",
    last_verified_at: "2026-01-01T00:00:00Z",
    session_verified: true,
    recovery_codes_remaining: 5,
    needs_enrollment: false,
    needs_verification: false,
    ...overrides,
  };
}

type MockOptions = {
  user?: { id: string } | null;
  role?: "super_admin" | "platform_support" | null;
  status?: Partial<TwoFactorStatus> | null;
  rpcError?: boolean;
};

function buildMockSupabase(options: MockOptions): SupabaseClient {
  const twoFactor = options.status === null ? null : baseStatus(options.status ?? {});
  return {
    auth: {
      getUser: async () => ({ data: { user: options.user ?? null }, error: null }),
      getSession: async () =>
        options.user
          ? { data: { session: { access_token: "token-for-fingerprint" } }, error: null }
          : { data: { session: null }, error: null },
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          in: () => ({
            maybeSingle: async () => ({
              data:
                options.role && options.user
                  ? {
                      id: "pa-1",
                      auth_user_id: options.user.id,
                      role: options.role,
                      status: "active",
                      created_at: "2026-01-01T00:00:00Z",
                    }
                  : null,
              error: null,
            }),
          }),
        }),
      }),
    }),
    rpc: async (fn: string) => {
      if (fn === "get_two_factor_status") {
        if (options.rpcError) return { data: null, error: { message: "unavailable" } };
        return { data: options.user ? twoFactor : null, error: null };
      }
      return { data: {}, error: null };
    },
  } as unknown as SupabaseClient;
}

async function main() {
  assert.equal(
    meetsSuperPortalDashboardTwoFactorPolicy(baseStatus({ enabled: false })),
    false,
  );
  assert.equal(
    meetsSuperPortalDashboardTwoFactorPolicy(baseStatus({ recovery_codes_remaining: 0 })),
    false,
  );
  assert.equal(meetsSuperPortalDashboardTwoFactorPolicy(baseStatus()), true);

  {
    const result = await evaluateSuperPortalDashboardAccess(
      buildMockSupabase({ user: null, role: null }),
    );
    assert.deepEqual(result, { allowed: false, reason: "unauthenticated" });
  }

  {
    const result = await evaluateSuperPortalDashboardAccess(
      buildMockSupabase({ user: { id: "u1" }, role: null }),
    );
    assert.deepEqual(result, { allowed: false, reason: "forbidden" });
  }

  {
    const result = await evaluateSuperPortalDashboardAccess(
      buildMockSupabase({
        user: { id: "u1" },
        role: "platform_support",
        status: baseStatus(),
      }),
    );
    assert.deepEqual(result, { allowed: false, reason: "forbidden" });
  }

  {
    const result = await evaluateSuperPortalDashboardAccess(
      buildMockSupabase({
        user: { id: "u1" },
        role: "super_admin",
        status: baseStatus({ needs_verification: true, session_verified: false }),
      }),
    );
    assert.deepEqual(result, { allowed: false, reason: "mfa_required" });
  }

  {
    const result = await evaluateSuperPortalDashboardAccess(
      buildMockSupabase({
        user: { id: "u1" },
        role: "super_admin",
        status: baseStatus({ recovery_codes_remaining: 0 }),
      }),
    );
    assert.deepEqual(result, { allowed: false, reason: "recovery_required" });
  }

  {
    const result = await evaluateSuperPortalDashboardAccess(
      buildMockSupabase({
        user: { id: "u1" },
        role: "super_admin",
        status: baseStatus(),
      }),
    );
    assert.deepEqual(result, { allowed: true });
  }

  {
    const dashboard: SuperPortalDashboard = {
      principle: "x",
      total_organizations: 10,
      total_active_users: 100,
      total_active_subscriptions: 8,
      platform_administrator_count: 2,
      global_platform_status: "operational",
      open_critical_incidents: 0,
      growth_trends: [
        { key: "organizations", label: "Organization growth", value_pct: 12.5 },
        { key: "subscriptions", label: "Subscription growth", value_pct: 5 },
      ],
      executive_alerts: [{ id: "a1", title: "t", severity: "high", category: "g", created_at: "x" }],
      platform_uptime_pct: 99.9,
      platform_health_indicators: {
        uptime_pct: 99.9,
        global_status: "operational",
        open_critical_incidents: 0,
        operational_services: 0,
        degraded_services: 0,
        maintenance_services: 0,
        incident_services: 0,
      },
      privacy_note: "note",
    };
    const view = toPlatformSuperAdminInsightView(dashboard);
    assert.equal(view.total_organizations, 10);
    assert.equal(view.organization_growth_30d_pct, 12.5);
    assert.equal(view.executive_alert_count, 1);
    assert.equal("platform_uptime_pct" in view, false);
  }

  console.log("dashboard-access.test.ts: all assertions passed");
}

void main();
