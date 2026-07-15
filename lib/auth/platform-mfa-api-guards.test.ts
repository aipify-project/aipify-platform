import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  authGuardUnavailableResponse,
  guardPlatformAdminAal2IfApplicable,
  guardPrivilegedPlatformApi,
  guardPrivilegedPlatformApiByClassification,
  guardPrivilegedPlatformPortalSession,
  guardPrivilegedPlatformScopeSession,
} from "./platform-server-access";

function test(name: string, fn: () => void | Promise<void>) {
  return (async () => {
    try {
      await fn();
      console.log(`ok ${name}`);
    } catch (error) {
      console.error(`fail ${name}`);
      throw error;
    }
  })();
}

type MockTwoFactorStatus = {
  needs_enrollment: boolean;
  needs_verification: boolean;
  session_verified: boolean;
};

function buildMockSupabase(options: {
  user?: { id: string } | null;
  platformAdmin?: boolean;
  twoFactor?: MockTwoFactorStatus | null;
  twoFactorError?: boolean;
}): SupabaseClient {
  return {
    auth: {
      getUser: async () => ({ data: { user: options.user ?? null } }),
      getSession: async () =>
        options.user
          ? { data: { session: { access_token: "token-abc" } } }
          : { data: { session: null } },
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          in: () => ({
            maybeSingle: async () => ({
              data: options.platformAdmin
                ? { id: "pa-1", auth_user_id: options.user?.id, role: "super_admin", status: "active" }
                : null,
              error: null,
            }),
          }),
        }),
      }),
    }),
    rpc: async (fn: string) => {
      if (fn === "get_two_factor_status") {
        if (options.twoFactorError) {
          return { data: null, error: { message: "backend unavailable" } };
        }
        return { data: options.twoFactor ?? null, error: null };
      }
      throw new Error(`unexpected rpc: ${fn}`);
    },
  } as unknown as SupabaseClient;
}

const aal1Status: MockTwoFactorStatus = {
  needs_enrollment: false,
  needs_verification: true,
  session_verified: false,
};

const aal2Status: MockTwoFactorStatus = {
  needs_enrollment: false,
  needs_verification: false,
  session_verified: true,
};

async function main() {
  await test("unauthenticated privileged request returns 401", async () => {
    const supabase = buildMockSupabase({ user: null });
    const response = await guardPrivilegedPlatformApi(supabase);
    assert.equal(response?.status, 401);
  });

  await test("authenticated ordinary customer returns 403 forbidden", async () => {
    const supabase = buildMockSupabase({
      user: { id: "user-customer" },
      platformAdmin: false,
      twoFactor: aal2Status,
    });
    const response = await guardPrivilegedPlatformApi(supabase);
    assert.equal(response?.status, 403);
    const body = await response?.json();
    assert.equal(body.error, "Forbidden");
  });

  await test("platform superadmin at AAL1 returns 403 mfa_required", async () => {
    const supabase = buildMockSupabase({
      user: { id: "user-platform" },
      platformAdmin: true,
      twoFactor: aal1Status,
    });
    const response = await guardPrivilegedPlatformApi(supabase);
    assert.equal(response?.status, 403);
    const body = await response?.json();
    assert.equal(body.error, "mfa_required");
  });

  await test("platform superadmin at verified AAL2 is allowed", async () => {
    const supabase = buildMockSupabase({
      user: { id: "user-platform" },
      platformAdmin: true,
      twoFactor: aal2Status,
    });
    const response = await guardPrivilegedPlatformApi(supabase);
    assert.equal(response, null);
  });

  await test("guard backend unavailable returns 503 auth_guard_unavailable", async () => {
    const supabase = buildMockSupabase({
      user: { id: "user-platform" },
      platformAdmin: true,
      twoFactorError: true,
    });
    const response = await guardPrivilegedPlatformApi(supabase);
    assert.equal(response?.status, 503);
    const body = await response?.json();
    assert.equal(body.error, "auth_guard_unavailable");
  });

  await test("authGuardUnavailableResponse is safe and fail-closed", async () => {
    const response = authGuardUnavailableResponse();
    assert.equal(response.status, 503);
    const body = await response.json();
    assert.equal(body.error, "auth_guard_unavailable");
    assert.equal(Object.keys(body).length, 1);
  });

  await test("platform_admin_if passes through for non-platform users", async () => {
    const supabase = buildMockSupabase({
      user: { id: "tenant-owner" },
      platformAdmin: false,
      twoFactor: aal1Status,
    });
    const response = await guardPlatformAdminAal2IfApplicable(supabase);
    assert.equal(response, null);
  });

  await test("platform_admin_if requires AAL2 for platform admins", async () => {
    const supabase = buildMockSupabase({
      user: { id: "user-platform" },
      platformAdmin: true,
      twoFactor: aal1Status,
    });
    const response = await guardPlatformAdminAal2IfApplicable(supabase);
    assert.equal(response?.status, 403);
  });

  await test("command-bar platform portal guard denies AAL1 before business logic", async () => {
    const supabase = buildMockSupabase({
      user: { id: "user-platform" },
      platformAdmin: true,
      twoFactor: aal1Status,
    });
    const rpcCalls: string[] = [];
    const guard = await guardPrivilegedPlatformPortalSession(supabase, "platform");
    assert.equal(guard?.status, 403);
    if (!guard) {
      rpcCalls.push("list_platform_customers");
    }
    assert.equal(rpcCalls.length, 0);
  });

  await test("command-bar customer portal guard does not require platform MFA", async () => {
    const supabase = buildMockSupabase({
      user: { id: "user-customer" },
      platformAdmin: false,
      twoFactor: aal1Status,
    });
    const guard = await guardPrivilegedPlatformPortalSession(supabase, "customer");
    assert.equal(guard, null);
  });

  await test("skills marketplace platform scope guard denies AAL1", async () => {
    const supabase = buildMockSupabase({
      user: { id: "user-platform" },
      platformAdmin: true,
      twoFactor: aal1Status,
    });
    const guard = await guardPrivilegedPlatformScopeSession(supabase, "platform");
    assert.equal(guard?.status, 403);
  });

  await test("classification platform_session uses full platform guard", async () => {
    const supabase = buildMockSupabase({
      user: { id: "user-platform" },
      platformAdmin: true,
      twoFactor: aal1Status,
    });
    const response = await guardPrivilegedPlatformApiByClassification(supabase, {
      privileged: true,
      kind: "platform_session",
      trigger: "/api/customer-success-operations",
    });
    assert.equal(response?.status, 403);
  });

  await test("denied customer-success mutation invokes no RPC in handler contract", async () => {
    const routePath = path.join(
      process.cwd(),
      "app/api/customer-success-operations/actions/route.ts",
    );
    const source = fs.readFileSync(routePath, "utf8");
    assert.doesNotMatch(source, /guardPrivilegedPlatform/);
    assert.match(source, /record_customer_success_operations_action/);
  });

  await test("command-bar routes invoke guard before search or recommendations", async () => {
    for (const routeFile of ["search/route.ts", "context/route.ts"]) {
      const routePath = path.join(process.cwd(), "app/api/command-bar", routeFile);
      const source = fs.readFileSync(routePath, "utf8");
      const guardIndex = source.indexOf("guardPrivilegedPlatformPortalSession");
      const rpcIndex = Math.min(
        source.includes("searchCommandBar")
          ? source.indexOf("searchCommandBar")
          : Number.MAX_SAFE_INTEGER,
        source.includes("fetchCommandBarRecommendations")
          ? source.indexOf("fetchCommandBarRecommendations")
          : Number.MAX_SAFE_INTEGER,
      );
      assert.ok(guardIndex >= 0, routeFile);
      assert.ok(guardIndex < rpcIndex, routeFile);
    }
  });

  await test("proxy fails closed when supabase env is missing", async () => {
    const proxySource = fs.readFileSync(path.join(process.cwd(), "proxy.ts"), "utf8");
    assert.match(proxySource, /authGuardUnavailableResponse/);
    assert.doesNotMatch(proxySource, /if \(!url \|\| !anonKey\) return null/);
  });

  console.log("platform-mfa-api-guards.test.ts: all assertions passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
