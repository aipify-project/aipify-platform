/**
 * SYNTHETIC authorization matrix for PR #243 dashboard path.
 * Mirrors GET /api/super-portal/dashboard fail-closed order — no Production login.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  evaluateSuperPortalDashboardAccess,
  mapSuperPortalDashboardAccessToResponse,
  responseBodyContainsSuperAggregates,
} from "@/lib/super-portal/dashboard-access";
import { NO_STORE_HEADERS } from "@/lib/super-portal/dashboard-access-constants";
import { parseSuperPortalDashboard } from "@/lib/super-portal/parse";
import type { TwoFactorStatus } from "@/lib/auth/two-factor";
import { classifyPrivilegedPlatformRequest } from "@/lib/auth/platform-privileged-request";

const AGGREGATE_FIXTURE = {
  principle: "Executive oversight",
  total_organizations: 42,
  total_active_users: 1000,
  total_active_subscriptions: 30,
  platform_administrator_count: 3,
  global_platform_status: "operational",
  open_critical_incidents: 1,
  growth_trends: [{ key: "organizations", label: "Organization growth", value_pct: 10 }],
  executive_alerts: [],
  platform_uptime_pct: 99.9,
  platform_health_indicators: {
    uptime_pct: 99.9,
    global_status: "operational",
    open_critical_incidents: 1,
    operational_services: 1,
    degraded_services: 0,
    maintenance_services: 0,
    incident_services: 0,
  },
  privacy_note: "Aggregate executive metrics only — no customer business content.",
};

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
  adminStatus?: "active" | "suspended";
  status?: Partial<TwoFactorStatus> | null;
  twoFactorRpcError?: boolean;
  dashboardRpc?:
    | { ok: true; data: unknown }
    | { ok: false; message: string }
    | "not_called";
};

type RouteResult = {
  status: number;
  body: unknown;
  headers: Headers;
  dashboardRpcCalled: boolean;
};

function buildMockSupabase(options: MockOptions): {
  client: SupabaseClient;
  state: { dashboardRpcCalled: boolean };
} {
  const state = { dashboardRpcCalled: false };
  const twoFactor = options.status === null ? null : baseStatus(options.status ?? {});
  const adminStatus = options.adminStatus ?? "active";

  const client = {
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
            maybeSingle: async () => {
              if (!options.role || !options.user) {
                return { data: null, error: null };
              }
              // Mirrors getPlatformProfile active-only filter.
              if (adminStatus !== "active") {
                return { data: null, error: null };
              }
              return {
                data: {
                  id: "pa-1",
                  auth_user_id: options.user.id,
                  role: options.role,
                  status: adminStatus,
                  created_at: "2026-01-01T00:00:00Z",
                },
                error: null,
              };
            },
          }),
        }),
      }),
    }),
    rpc: async (fn: string) => {
      if (fn === "get_two_factor_status") {
        if (options.twoFactorRpcError) {
          return { data: null, error: { message: "unavailable" } };
        }
        return { data: options.user ? twoFactor : null, error: null };
      }
      if (fn === "get_super_portal_dashboard") {
        state.dashboardRpcCalled = true;
        if (!options.dashboardRpc || options.dashboardRpc === "not_called") {
          return { data: AGGREGATE_FIXTURE, error: null };
        }
        if (options.dashboardRpc.ok) {
          return { data: options.dashboardRpc.data, error: null };
        }
        return { data: null, error: { message: options.dashboardRpc.message } };
      }
      return { data: {}, error: null };
    },
  } as unknown as SupabaseClient;

  return { client, state };
}

/** Exact fail-closed order of app/api/super-portal/dashboard/route.ts */
async function simulateDashboardGet(options: MockOptions): Promise<RouteResult> {
  const { client, state } = buildMockSupabase(options);
  const access = await evaluateSuperPortalDashboardAccess(client);
  if (!access.allowed) {
    const res = mapSuperPortalDashboardAccessToResponse(access);
    return {
      status: res.status,
      body: await res.json(),
      headers: res.headers,
      dashboardRpcCalled: state.dashboardRpcCalled,
    };
  }

  const { data, error } = await client.rpc("get_super_portal_dashboard");
  if (error) {
    const res = new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "content-type": "application/json", ...NO_STORE_HEADERS },
    });
    return {
      status: 403,
      body: await res.json(),
      headers: res.headers,
      dashboardRpcCalled: state.dashboardRpcCalled,
    };
  }

  const parsed = parseSuperPortalDashboard(data);
  if (!parsed) {
    const res = new Response(JSON.stringify({ error: "Invalid response" }), {
      status: 500,
      headers: { "content-type": "application/json", ...NO_STORE_HEADERS },
    });
    return {
      status: 500,
      body: await res.json(),
      headers: res.headers,
      dashboardRpcCalled: state.dashboardRpcCalled,
    };
  }

  const res = new Response(JSON.stringify(parsed), {
    status: 200,
    headers: { "content-type": "application/json", ...NO_STORE_HEADERS },
  });
  return {
    status: 200,
    body: await res.json(),
    headers: res.headers,
    dashboardRpcCalled: state.dashboardRpcCalled,
  };
}

function assertNoStore(headers: Headers) {
  const cache = headers.get("Cache-Control") ?? "";
  assert.match(cache, /no-store/i);
  assert.match(cache, /private/i);
}

function assertDeny(result: RouteResult, status: number, error: string) {
  assert.equal(result.status, status);
  assert.equal(result.dashboardRpcCalled, false, "dashboard RPC must not run on deny");
  assert.equal(responseBodyContainsSuperAggregates(result.body), false);
  assert.deepEqual(result.body, { error });
  assertNoStore(result.headers);
}

async function main() {
  // Proxy still excludes /api/super-portal — route-local gate is the MFA authority for this path.
  assert.equal(
    classifyPrivilegedPlatformRequest({ pathname: "/api/super-portal/dashboard" }).privileged,
    false,
  );

  // Matrix
  assertDeny(
    await simulateDashboardGet({ user: null, role: null, dashboardRpc: "not_called" }),
    401,
    "Unauthorized",
  );

  assertDeny(
    await simulateDashboardGet({
      user: { id: "customer-1" },
      role: null,
      dashboardRpc: "not_called",
    }),
    403,
    "Forbidden",
  );

  assertDeny(
    await simulateDashboardGet({
      user: { id: "support-1" },
      role: "platform_support",
      status: baseStatus(),
      dashboardRpc: "not_called",
    }),
    403,
    "Forbidden",
  );

  // "platform_admin" in product language = either role; support already covered.
  // Suspended / deactivated super_admin → profile null → forbidden; RPC not called.
  assertDeny(
    await simulateDashboardGet({
      user: { id: "super-suspended" },
      role: "super_admin",
      adminStatus: "suspended",
      status: baseStatus(),
      dashboardRpc: "not_called",
    }),
    403,
    "Forbidden",
  );

  assertDeny(
    await simulateDashboardGet({
      user: { id: "super-1" },
      role: "super_admin",
      status: baseStatus({ needs_enrollment: true, enabled: false, session_verified: false }),
      dashboardRpc: "not_called",
    }),
    403,
    "mfa_required",
  );

  assertDeny(
    await simulateDashboardGet({
      user: { id: "super-1" },
      role: "super_admin",
      status: baseStatus({ needs_verification: true, session_verified: false }),
      dashboardRpc: "not_called",
    }),
    403,
    "mfa_required",
  );

  assertDeny(
    await simulateDashboardGet({
      user: { id: "super-1" },
      role: "super_admin",
      status: baseStatus({ recovery_codes_remaining: 0 }),
      dashboardRpc: "not_called",
    }),
    403,
    "recovery_required",
  );

  assertDeny(
    await simulateDashboardGet({
      user: { id: "super-1" },
      role: "super_admin",
      status: baseStatus({ enabled: false }),
      dashboardRpc: "not_called",
    }),
    403,
    "recovery_required",
  );

  {
    const result = await simulateDashboardGet({
      user: { id: "super-1" },
      role: "super_admin",
      status: baseStatus(),
      twoFactorRpcError: true,
      dashboardRpc: "not_called",
    });
    assertDeny(result, 503, "auth_guard_unavailable");
  }

  // Core RPC rejects after access gate (e.g. role revoked mid-request)
  {
    const result = await simulateDashboardGet({
      user: { id: "super-1" },
      role: "super_admin",
      status: baseStatus(),
      dashboardRpc: { ok: false, message: "Super Admin access required" },
    });
    assert.equal(result.status, 403);
    assert.equal(result.dashboardRpcCalled, true);
    assert.equal(responseBodyContainsSuperAggregates(result.body), false);
    assert.deepEqual(result.body, { error: "Forbidden" });
    assertNoStore(result.headers);
  }

  // Invalid RPC payload — no partial aggregates
  {
    const result = await simulateDashboardGet({
      user: { id: "super-1" },
      role: "super_admin",
      status: baseStatus(),
      dashboardRpc: { ok: true, data: null },
    });
    assert.equal(result.status, 500);
    assert.equal(responseBodyContainsSuperAggregates(result.body), false);
    assertNoStore(result.headers);
  }

  // Happy path — aggregates only for fully qualified super_admin
  {
    const result = await simulateDashboardGet({
      user: { id: "super-1" },
      role: "super_admin",
      status: baseStatus(),
      dashboardRpc: { ok: true, data: AGGREGATE_FIXTURE },
    });
    assert.equal(result.status, 200);
    assert.equal(result.dashboardRpcCalled, true);
    assert.equal(responseBodyContainsSuperAggregates(result.body), true);
    assert.equal((result.body as { total_organizations: number }).total_organizations, 42);
    assertNoStore(result.headers);
  }

  // Cross-user / mount gate: eligibility boolean only — never returns fixture aggregates
  {
    const denied = await evaluateSuperPortalDashboardAccess(
      buildMockSupabase({
        user: { id: "support-1" },
        role: "platform_support",
        status: baseStatus(),
      }).client,
    );
    assert.equal(denied.allowed, false);
    assert.equal("total_organizations" in denied, false);
  }

  // Static Core contract: latest health-indicators SQL still requires super_admin
  {
    const sqlPath = path.join(
      process.cwd(),
      "supabase/migrations/20261531000000_super_portal_phase257_health_indicators.sql",
    );
    const sql = fs.readFileSync(sqlPath, "utf8");
    assert.match(sql, /create or replace function public\.get_super_portal_dashboard/);
    assert.match(sql, /perform public\._spsf257_require_super_admin\(\)/);
  }

  // SSR mount contract: page only passes labels when allowed — no aggregate props in source
  {
    const page = fs.readFileSync(path.join(process.cwd(), "app/platform/page.tsx"), "utf8");
    assert.match(page, /canRenderPlatformSuperAdminInsight/);
    assert.match(page, /superAdminInsightLabels/);
    assert.doesNotMatch(page, /total_organizations/);
    assert.doesNotMatch(page, /get_super_portal_dashboard/);
  }

  console.log("dashboard-route-rbac.test.ts: all SYNTHETIC matrix assertions passed");
}

void main();
