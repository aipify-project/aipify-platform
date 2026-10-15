import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  evaluateSuperPortalDashboardAccess,
  mapSuperPortalDashboardAccessToResponse,
  responseBodyContainsSuperAuditPayload,
} from "@/lib/super-portal/dashboard-access";
import { NO_STORE_HEADERS } from "@/lib/super-portal/dashboard-access-constants";
import { parseSuperGlobalAuditCenter } from "@/lib/super-portal/parse";
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
      if (fn === "get_super_global_audit_center") {
        return {
          data: {
            audit_logs: [
              {
                id: "log-1",
                user_email: "admin@aipify.ai",
                action: "role_change",
                target_type: "platform_admin",
                target_id: "pa-2",
                previous_state: { role: "platform_support" },
                new_state: { role: "super_admin" },
                created_at: "2026-10-01T12:00:00Z",
              },
            ],
            categories: ["governance"],
          },
          error: null,
        };
      }
      return { data: {}, error: null };
    },
  } as unknown as SupabaseClient;
}

async function main() {
  const matrix: Array<{
    name: string;
    options: MockOptions;
    expected: { allowed: false; reason: string } | { allowed: true };
  }> = [
    {
      name: "anonymous",
      options: { user: null, role: null },
      expected: { allowed: false, reason: "unauthenticated" },
    },
    {
      name: "customer / no platform profile",
      options: { user: { id: "u1" }, role: null },
      expected: { allowed: false, reason: "forbidden" },
    },
    {
      name: "platform_support",
      options: { user: { id: "u1" }, role: "platform_support", status: baseStatus() },
      expected: { allowed: false, reason: "forbidden" },
    },
    {
      name: "suspended super_admin (no active profile)",
      options: {
        user: { id: "u1" },
        role: "super_admin",
        status: baseStatus(),
        suspended: true,
      },
      expected: { allowed: false, reason: "forbidden" },
    },
    {
      name: "super_admin without MFA verification",
      options: {
        user: { id: "u1" },
        role: "super_admin",
        status: baseStatus({ needs_verification: true, session_verified: false }),
      },
      expected: { allowed: false, reason: "mfa_required" },
    },
    {
      name: "super_admin without recovery codes",
      options: {
        user: { id: "u1" },
        role: "super_admin",
        status: baseStatus({ recovery_codes_remaining: 0 }),
      },
      expected: { allowed: false, reason: "recovery_required" },
    },
    {
      name: "authorized super_admin",
      options: { user: { id: "u1" }, role: "super_admin", status: baseStatus() },
      expected: { allowed: true },
    },
  ];

  for (const row of matrix) {
    const result = await evaluateSuperPortalDashboardAccess(buildMockSupabase(row.options));
    assert.deepEqual(result, row.expected, row.name);

    if (!result.allowed) {
      const response = mapSuperPortalDashboardAccessToResponse(result);
      assert.ok([401, 403, 503].includes(response.status), `${row.name} status`);
      assert.equal(
        response.headers.get("Cache-Control"),
        NO_STORE_HEADERS["Cache-Control"],
        `${row.name} cache`,
      );
      const body = await response.json();
      assert.equal(responseBodyContainsSuperAuditPayload(body), false, `${row.name} no audit leak`);
      assert.equal("audit_logs" in body, false, `${row.name} no audit_logs key`);
    }
  }

  const authorized = await evaluateSuperPortalDashboardAccess(
    buildMockSupabase({
      user: { id: "u1" },
      role: "super_admin",
      status: baseStatus(),
    }),
  );
  assert.equal(authorized.allowed, true);

  const parsed = parseSuperGlobalAuditCenter({
    audit_logs: [
      {
        id: "log-1",
        user_email: "admin@aipify.ai",
        action: "role_change",
        target_type: "platform_admin",
        target_id: "pa-2",
        previous_state: { role: "platform_support" },
        new_state: { role: "super_admin" },
        created_at: "2026-10-01T12:00:00Z",
      },
    ],
  });
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0]?.action, "role_change");

  assert.equal(parseSuperGlobalAuditCenter({ audit_logs: "bad" }).length, 0);
  assert.equal(parseSuperGlobalAuditCenter(null).length, 0);
  assert.equal(responseBodyContainsSuperAuditPayload({ audit_logs: [] }), true);
  assert.equal(responseBodyContainsSuperAuditPayload({ error: "Forbidden" }), false);

  console.log("global-audit-access.test.ts: all assertions passed");
}

void main();
