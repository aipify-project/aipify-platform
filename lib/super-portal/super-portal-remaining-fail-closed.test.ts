/**
 * Synthetic fail-closed matrix for J3B1 remaining /api/super-portal/* routes:
 * executive-insights GET, language-administration GET/POST, platform-administrators GET/POST.
 * No Production login or mutations.
 */
import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  evaluateSuperPortalDashboardAccess,
  mapSuperPortalDashboardAccessToResponse,
} from "@/lib/super-portal/dashboard-access";
import { NO_STORE_HEADERS } from "@/lib/super-portal/dashboard-access-constants";
import { classifyPrivilegedPlatformRequest } from "@/lib/auth/platform-privileged-request";
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
  suspended?: boolean;
  rpcError?: boolean;
};

type RpcName =
  | "get_super_executive_insights"
  | "get_super_language_administration"
  | "perform_super_language_administration_action"
  | "get_super_platform_administrators"
  | "perform_super_platform_administrator_action";

function buildMockSupabase(options: MockOptions) {
  const twoFactor = options.status === null ? null : baseStatus(options.status ?? {});
  const rpcCalls: string[] = [];
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
            maybeSingle: async () => ({
              data:
                options.role && options.user && !options.suspended
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
        return { data: options.user ? twoFactor : null, error: null };
      }
      rpcCalls.push(fn);
      if (options.rpcError) {
        return { data: null, error: { message: "Super Admin access required" } };
      }
      if (fn === "get_super_executive_insights") {
        return {
          data: { found: true, organization_growth: { total: 1 } },
          error: null,
        };
      }
      if (fn === "get_super_language_administration") {
        return { data: [{ locale: "en", enabled: true }], error: null };
      }
      if (fn === "perform_super_language_administration_action") {
        return { data: { ok: true }, error: null };
      }
      if (fn === "get_super_platform_administrators") {
        return {
          data: [{ id: "pa-2", role: "platform_support", email: "support@aipify.ai" }],
          error: null,
        };
      }
      if (fn === "perform_super_platform_administrator_action") {
        return { data: { ok: true }, error: null };
      }
      return { data: {}, error: null };
    },
  };
  return {
    client: client as unknown as SupabaseClient,
    rpcCalls,
  };
}

function denyBodyLeaksPrivileged(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const row = body as Record<string, unknown>;
  return (
    "languages" in row ||
    "administrators" in row ||
    "organization_growth" in row ||
    "found" in row ||
    "ok" in row
  );
}

/** Mirrors hardened route order: gate → then RPC (body parse only after gate for POST). */
async function simulateRoute(
  method: "GET" | "POST",
  rpcName: RpcName,
  options: MockOptions,
): Promise<{ status: number; body: unknown; cache: string | null; rpcCalled: boolean }> {
  const { client, rpcCalls } = buildMockSupabase(options);
  const access = await evaluateSuperPortalDashboardAccess(client);
  if (!access.allowed) {
    const response = mapSuperPortalDashboardAccessToResponse(access);
    return {
      status: response.status,
      body: await response.json(),
      cache: response.headers.get("Cache-Control"),
      rpcCalled: rpcCalls.includes(rpcName),
    };
  }

  const { data, error } = await client.rpc(rpcName, method === "POST" ? { p_payload: {} } : undefined);
  if (error) {
    const status = method === "POST" ? 400 : 403;
    return {
      status,
      body: { error: method === "POST" ? error.message : "Forbidden" },
      cache: NO_STORE_HEADERS["Cache-Control"],
      rpcCalled: true,
    };
  }
  return {
    status: 200,
    body: data,
    cache: NO_STORE_HEADERS["Cache-Control"],
    rpcCalled: true,
  };
}

const DENY_CASES: Array<{
  name: string;
  options: MockOptions;
  expectedReason: string;
}> = [
  { name: "anonymous", options: { user: null, role: null }, expectedReason: "unauthenticated" },
  {
    name: "customer / no platform profile",
    options: { user: { id: "u1" }, role: null },
    expectedReason: "forbidden",
  },
  {
    name: "platform_support",
    options: { user: { id: "u1" }, role: "platform_support", status: baseStatus() },
    expectedReason: "forbidden",
  },
  {
    name: "suspended super_admin",
    options: {
      user: { id: "u1" },
      role: "super_admin",
      status: baseStatus(),
      suspended: true,
    },
    expectedReason: "forbidden",
  },
  {
    name: "MFA enrollment needed",
    options: {
      user: { id: "u1" },
      role: "super_admin",
      status: baseStatus({
        enabled: false,
        needs_enrollment: true,
        session_verified: false,
      }),
    },
    expectedReason: "mfa_required",
  },
  {
    name: "MFA verification incomplete",
    options: {
      user: { id: "u1" },
      role: "super_admin",
      status: baseStatus({ needs_verification: true, session_verified: false }),
    },
    expectedReason: "mfa_required",
  },
  {
    name: "no recovery codes",
    options: {
      user: { id: "u1" },
      role: "super_admin",
      status: baseStatus({ recovery_codes_remaining: 0 }),
    },
    expectedReason: "recovery_required",
  },
];

const ROUTES: Array<{ method: "GET" | "POST"; rpc: RpcName; label: string }> = [
  { method: "GET", rpc: "get_super_executive_insights", label: "executive-insights GET" },
  { method: "GET", rpc: "get_super_language_administration", label: "language GET" },
  { method: "POST", rpc: "perform_super_language_administration_action", label: "language POST" },
  { method: "GET", rpc: "get_super_platform_administrators", label: "platform-admins GET" },
  {
    method: "POST",
    rpc: "perform_super_platform_administrator_action",
    label: "platform-admins POST",
  },
];

async function main() {
  for (const path of [
    "/api/super-portal/executive-insights",
    "/api/super-portal/language-administration",
    "/api/super-portal/platform-administrators",
  ]) {
    assert.equal(
      classifyPrivilegedPlatformRequest({ pathname: path }).privileged,
      false,
      `${path} remains proxy-excluded`,
    );
  }

  for (const route of ROUTES) {
    for (const row of DENY_CASES) {
      const result = await simulateRoute(route.method, route.rpc, row.options);
      assert.ok([401, 403, 503].includes(result.status), `${route.label} ${row.name} status`);
      assert.equal(
        result.cache,
        NO_STORE_HEADERS["Cache-Control"],
        `${route.label} ${row.name} cache`,
      );
      assert.equal(result.rpcCalled, false, `${route.label} ${row.name} no RPC before gate`);
      assert.equal(
        denyBodyLeaksPrivileged(result.body),
        false,
        `${route.label} ${row.name} no privileged leak`,
      );

      const access = await evaluateSuperPortalDashboardAccess(
        buildMockSupabase(row.options).client,
      );
      assert.equal(access.allowed, false, `${route.label} ${row.name} denied`);
      if (!access.allowed) {
        assert.equal(access.reason, row.expectedReason, `${route.label} ${row.name} reason`);
      }
    }

    const happy = await simulateRoute(route.method, route.rpc, {
      user: { id: "u1" },
      role: "super_admin",
      status: baseStatus(),
    });
    assert.equal(happy.status, 200, `${route.label} happy status`);
    assert.equal(happy.rpcCalled, true, `${route.label} happy RPC`);
    assert.equal(happy.cache, NO_STORE_HEADERS["Cache-Control"], `${route.label} happy cache`);

    const rpcDenied = await simulateRoute(route.method, route.rpc, {
      user: { id: "u1" },
      role: "super_admin",
      status: baseStatus(),
      rpcError: true,
    });
    assert.ok([400, 403].includes(rpcDenied.status), `${route.label} rpc deny status`);
    assert.equal(rpcDenied.rpcCalled, true, `${route.label} rpc deny called after gate`);
    assert.equal(
      rpcDenied.cache,
      NO_STORE_HEADERS["Cache-Control"],
      `${route.label} rpc deny cache`,
    );
    if (route.method === "GET") {
      assert.equal(denyBodyLeaksPrivileged(rpcDenied.body), false, `${route.label} rpc deny leak`);
    }
  }

  console.log("super-portal-remaining-fail-closed.test.ts: all assertions passed");
}

void main();
