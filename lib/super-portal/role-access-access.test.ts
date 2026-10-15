import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  evaluateSuperPortalDashboardAccess,
  mapSuperPortalDashboardAccessToResponse,
  responseBodyContainsSuperRoleAccessPayload,
} from "@/lib/super-portal/dashboard-access";
import { NO_STORE_HEADERS } from "@/lib/super-portal/dashboard-access-constants";
import {
  parsePlatformSuperRoleAccessOverview,
  payloadContainsForbiddenRoleAccessFields,
  toPlatformSuperRoleAccessResponseBody,
} from "@/lib/super-portal/platform-role-access";
import type { TwoFactorStatus } from "@/lib/auth/two-factor";
import { classifyPrivilegedPlatformRequest } from "@/lib/auth/platform-privileged-request";

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
  rpcPayload?: unknown;
};

const SAMPLE_RPC = {
  found: true,
  privacy_note: "Aggregates only",
  principle: "APP controls people.",
  governance_note: "APP owners retain live control.",
  catalog: {
    total_permissions: 42,
    total_modules: 7,
    permission_kinds: ["read", "write"],
  },
  adoption: {
    organizations_with_grants: 3,
    total_role_grants: 11,
    user_overrides: 2,
    custom_roles: 1,
  },
  templates: 4,
  recent_audit: [
    {
      action: "grant",
      summary: "secret",
      organization_id: "org-should-never-leak",
      created_at: "2026-10-01T12:00:00Z",
    },
  ],
};

function buildMockSupabase(options: MockOptions): SupabaseClient {
  const twoFactor = options.status === null ? null : baseStatus(options.status ?? {});
  let rpcCalled = false;
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
      if (fn === "get_super_admin_role_permission_matrix_overview") {
        rpcCalled = true;
        if (options.rpcError) {
          return { data: null, error: { message: "Super Admin access required" } };
        }
        return { data: options.rpcPayload ?? SAMPLE_RPC, error: null };
      }
      return { data: {}, error: null };
    },
    __wasRpcCalled: () => rpcCalled,
  };
  return client as unknown as SupabaseClient & { __wasRpcCalled: () => boolean };
}

/** Mirrors GET /api/super-portal/role-permission-matrix fail-closed order. */
async function simulateRoleAccessRoute(supabase: SupabaseClient) {
  const access = await evaluateSuperPortalDashboardAccess(supabase);
  if (!access.allowed) {
    return {
      kind: "deny" as const,
      response: mapSuperPortalDashboardAccessToResponse(access),
      rpcCalled: (supabase as unknown as { __wasRpcCalled: () => boolean }).__wasRpcCalled?.() ?? false,
    };
  }

  const { data, error } = await supabase.rpc(
    "get_super_admin_role_permission_matrix_overview",
  );
  if (error) {
    return {
      kind: "deny" as const,
      response: NextResponseLike(403, { error: "Forbidden" }),
      rpcCalled: true,
    };
  }
  const overview = parsePlatformSuperRoleAccessOverview(data);
  if (!overview) {
    return {
      kind: "deny" as const,
      response: NextResponseLike(403, { error: "Forbidden" }),
      rpcCalled: true,
    };
  }
  return {
    kind: "ok" as const,
    body: toPlatformSuperRoleAccessResponseBody(overview),
    rpcCalled: true,
  };
}

function NextResponseLike(status: number, body: unknown) {
  return {
    status,
    headers: { get: (name: string) => (name === "Cache-Control" ? NO_STORE_HEADERS["Cache-Control"] : null) },
    json: async () => body,
  };
}

async function main() {
  assert.equal(
    classifyPrivilegedPlatformRequest({
      pathname: "/api/super-portal/role-permission-matrix",
    }).privileged,
    false,
    "proxy still excludes /api/super-portal — route-local gate is authority",
  );

  const matrix: Array<{
    name: string;
    options: MockOptions;
    expected: { allowed: false; reason: string } | { allowed: true };
    expectRpc: boolean;
  }> = [
    {
      name: "anonymous",
      options: { user: null, role: null },
      expected: { allowed: false, reason: "unauthenticated" },
      expectRpc: false,
    },
    {
      name: "customer / no platform profile",
      options: { user: { id: "u1" }, role: null },
      expected: { allowed: false, reason: "forbidden" },
      expectRpc: false,
    },
    {
      name: "platform_support",
      options: { user: { id: "u1" }, role: "platform_support", status: baseStatus() },
      expected: { allowed: false, reason: "forbidden" },
      expectRpc: false,
    },
    {
      name: "suspended super_admin",
      options: {
        user: { id: "u1" },
        role: "super_admin",
        status: baseStatus(),
        suspended: true,
      },
      expected: { allowed: false, reason: "forbidden" },
      expectRpc: false,
    },
    {
      name: "super_admin MFA enrollment needed",
      options: {
        user: { id: "u1" },
        role: "super_admin",
        status: baseStatus({
          enabled: false,
          needs_enrollment: true,
          session_verified: false,
        }),
      },
      expected: { allowed: false, reason: "mfa_required" },
      expectRpc: false,
    },
    {
      name: "super_admin MFA verification incomplete",
      options: {
        user: { id: "u1" },
        role: "super_admin",
        status: baseStatus({ needs_verification: true, session_verified: false }),
      },
      expected: { allowed: false, reason: "mfa_required" },
      expectRpc: false,
    },
    {
      name: "super_admin without recovery codes",
      options: {
        user: { id: "u1" },
        role: "super_admin",
        status: baseStatus({ recovery_codes_remaining: 0 }),
      },
      expected: { allowed: false, reason: "recovery_required" },
      expectRpc: false,
    },
    {
      name: "authorized super_admin",
      options: { user: { id: "u1" }, role: "super_admin", status: baseStatus() },
      expected: { allowed: true },
      expectRpc: true,
    },
  ];

  for (const row of matrix) {
    const supabase = buildMockSupabase(row.options);
    const access = await evaluateSuperPortalDashboardAccess(supabase);
    assert.deepEqual(access, row.expected, row.name);

    if (!access.allowed) {
      const response = mapSuperPortalDashboardAccessToResponse(access);
      assert.ok([401, 403, 503].includes(response.status), `${row.name} status`);
      assert.equal(
        response.headers.get("Cache-Control"),
        NO_STORE_HEADERS["Cache-Control"],
        `${row.name} cache`,
      );
      const body = await response.json();
      assert.equal(
        responseBodyContainsSuperRoleAccessPayload(body),
        false,
        `${row.name} no aggregate leak`,
      );
      assert.equal("recent_audit" in body, false, `${row.name} no recent_audit`);
      assert.equal("organization_id" in body, false, `${row.name} no organization_id`);
      const simulated = await simulateRoleAccessRoute(buildMockSupabase(row.options));
      assert.equal(simulated.rpcCalled, false, `${row.name} RPC not called before gate`);
    }
  }

  const happy = await simulateRoleAccessRoute(
    buildMockSupabase({
      user: { id: "u1" },
      role: "super_admin",
      status: baseStatus(),
    }),
  );
  assert.equal(happy.kind, "ok");
  if (happy.kind === "ok") {
    assert.equal(happy.rpcCalled, true);
    assert.equal(happy.body.total_permissions, 42);
    assert.equal(happy.body.templates, 4);
    assert.equal("recent_audit" in happy.body, false);
    assert.equal("catalog" in happy.body, false);
    assert.equal("adoption" in happy.body, false);
    assert.equal(payloadContainsForbiddenRoleAccessFields(happy.body), false);
  }

  const coreDenied = await simulateRoleAccessRoute(
    buildMockSupabase({
      user: { id: "u1" },
      role: "super_admin",
      status: baseStatus(),
      rpcError: true,
    }),
  );
  assert.equal(coreDenied.kind, "deny");
  if (coreDenied.kind === "deny") {
    assert.equal(coreDenied.response.status, 403);
    const body = await coreDenied.response.json();
    assert.equal(responseBodyContainsSuperRoleAccessPayload(body), false);
  }

  const malformed = parsePlatformSuperRoleAccessOverview({ found: true, catalog: {} });
  assert.equal(malformed, null);

  const stripped = parsePlatformSuperRoleAccessOverview(SAMPLE_RPC);
  assert.ok(stripped);
  assert.equal(stripped!.organizations_with_grants, 3);
  const responseBody = toPlatformSuperRoleAccessResponseBody(stripped!);
  assert.equal("recent_audit" in responseBody, false);
  assert.equal(payloadContainsForbiddenRoleAccessFields(SAMPLE_RPC), true);
  assert.equal(payloadContainsForbiddenRoleAccessFields(responseBody), false);

  assert.equal(parsePlatformSuperRoleAccessOverview({ found: false }), null);
  assert.equal(parsePlatformSuperRoleAccessOverview(null), null);
  assert.equal(responseBodyContainsSuperRoleAccessPayload({ error: "Forbidden" }), false);
  assert.equal(responseBodyContainsSuperRoleAccessPayload({ total_permissions: 1 }), false);
  assert.equal(responseBodyContainsSuperRoleAccessPayload({ catalog: {} }), true);

  console.log("role-access-access.test.ts: all assertions passed");
}

void main();
