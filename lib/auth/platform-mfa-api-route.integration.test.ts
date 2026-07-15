import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import type { SupabaseClient } from "@supabase/supabase-js";
import { guardPrivilegedPlatformPortalSession } from "./platform-server-access";

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

type MockSupabase = SupabaseClient & {
  _rpcCalls: Array<{ fn: string; params?: Record<string, unknown> }>;
};

function buildRouteMockSupabase(options: {
  user?: { id: string } | null;
  platformAdmin?: boolean;
  aal2?: boolean;
}): MockSupabase {
  const rpcCalls: Array<{ fn: string; params?: Record<string, unknown> }> = [];
  const twoFactor = options.aal2
    ? { needs_enrollment: false, needs_verification: false, session_verified: true }
    : { needs_enrollment: false, needs_verification: true, session_verified: false };

  const client = {
    _rpcCalls: rpcCalls,
    auth: {
      getUser: async () => ({ data: { user: options.user ?? null } }),
      getSession: async () =>
        options.user
          ? { data: { session: { access_token: "token" } } }
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
    rpc: async (fn: string, params?: Record<string, unknown>) => {
      rpcCalls.push({ fn, params });
      if (fn === "get_two_factor_status") {
        return { data: options.user ? twoFactor : null, error: null };
      }
      return { data: {}, error: null };
    },
  } as unknown as MockSupabase;

  return client;
}

/** Mirrors command-bar search route guard → business-logic order. */
async function simulateCommandBarSearch(
  supabase: MockSupabase,
  portal: string,
): Promise<{ status: number; rpcCalls: string[] }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: 401, rpcCalls: [] };

  const platformGuard = await guardPrivilegedPlatformPortalSession(supabase, portal);
  if (platformGuard) {
    return { status: platformGuard.status, rpcCalls: supabase._rpcCalls.map((c) => c.fn) };
  }

  supabase._rpcCalls.push({ fn: "list_platform_customers" });
  return { status: 200, rpcCalls: supabase._rpcCalls.map((c) => c.fn) };
}

async function main() {
  await test("command-bar platform AAL1 denied with no platform search RPC", async () => {
    const supabase = buildRouteMockSupabase({
      user: { id: "platform-admin" },
      platformAdmin: true,
      aal2: false,
    });
    const result = await simulateCommandBarSearch(supabase, "platform");
    assert.equal(result.status, 403);
    assert.equal(result.rpcCalls.includes("list_platform_customers"), false);
  });

  await test("command-bar super_admin AAL1 denied with no platform search RPC", async () => {
    const supabase = buildRouteMockSupabase({
      user: { id: "platform-admin" },
      platformAdmin: true,
      aal2: false,
    });
    const result = await simulateCommandBarSearch(supabase, "super_admin");
    assert.equal(result.status, 403);
    assert.equal(result.rpcCalls.includes("list_platform_customers"), false);
  });

  await test("command-bar platform AAL2 allowed to proceed", async () => {
    const supabase = buildRouteMockSupabase({
      user: { id: "platform-admin" },
      platformAdmin: true,
      aal2: true,
    });
    const result = await simulateCommandBarSearch(supabase, "platform");
    assert.equal(result.status, 200);
    assert.equal(result.rpcCalls.includes("list_platform_customers"), true);
  });

  await test("command-bar customer portal does not require platform AAL2", async () => {
    const supabase = buildRouteMockSupabase({
      user: { id: "customer-user" },
      platformAdmin: false,
      aal2: false,
    });
    const result = await simulateCommandBarSearch(supabase, "customer");
    assert.equal(result.status, 200);
  });

  await test("customer-success-operations routes are edge-classified as privileged", async () => {
    const { classifyPrivilegedPlatformRequest } = await import("./platform-privileged-request");
    for (const route of [
      "/api/customer-success-operations/overview",
      "/api/customer-success-operations/actions",
    ]) {
      assert.equal(classifyPrivilegedPlatformRequest({ pathname: route }).privileged, true);
    }
  });

  await test("customer tenant observability remains outside platform MFA guard", async () => {
    const { classifyPrivilegedPlatformRequest } = await import("./platform-privileged-request");
    assert.equal(
      classifyPrivilegedPlatformRequest({ pathname: "/api/incidents", method: "POST" }).privileged,
      false,
    );
    assert.equal(
      classifyPrivilegedPlatformRequest({ pathname: "/api/observability/status", method: "GET" })
        .privileged,
      false,
    );
  });

  await test("alternate privileged route files exist and are session-authenticated", async () => {
    const routes = [
      "app/api/customer-success-operations/overview/route.ts",
      "app/api/customer-success-operations/actions/route.ts",
      "app/api/subscription-operations/overview/route.ts",
      "app/api/command-bar/search/route.ts",
      "app/api/command-bar/context/route.ts",
    ];
    for (const route of routes) {
      const source = fs.readFileSync(path.join(process.cwd(), route), "utf8");
      assert.match(source, /getUser/);
    }
  });

  console.log("platform-mfa-api-route.integration.test.ts: all assertions passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
