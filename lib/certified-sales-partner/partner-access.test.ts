import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import type { SupabaseClient } from "@supabase/supabase-js";

const require = createRequire(import.meta.url);
const ROOT = process.cwd();

type StatusMap = Record<string, string | null>;

const partnerStatusByUser: StatusMap = {};
const activeAppUsers = new Set<string>();
let overviewStatusByCall: string | null | undefined = undefined;

function installServiceRoleShim(): void {
  const moduleApi = require("node:module") as {
    Module: { _load: (request: string, parent: unknown, isMain: boolean) => unknown };
  };
  const originalLoad = moduleApi.Module._load;
  moduleApi.Module._load = function (request, parent, isMain) {
    if (request === "@/lib/supabase/service-role") {
      return {
        createServiceRoleClient: () => ({
          from: (table: string) => {
            if (table === "csp_partner_profiles") {
              return {
                select: () => ({
                  eq: (_col: string, authUserId: string) => ({
                    maybeSingle: async () => {
                      if (!(authUserId in partnerStatusByUser)) {
                        return { data: null, error: null };
                      }
                      const status = partnerStatusByUser[authUserId];
                      if (status === null) return { data: null, error: null };
                      return { data: { status }, error: null };
                    },
                  }),
                }),
              };
            }
            if (table === "company_users") {
              return {
                select: () => ({
                  eq: (_col: string, authUserId: string) => ({
                    eq: () => ({
                      limit: () => ({
                        maybeSingle: async () => ({
                          data: activeAppUsers.has(authUserId) ? { id: "cu-1" } : null,
                          error: null,
                        }),
                      }),
                    }),
                  }),
                }),
              };
            }
            throw new Error(`unexpected table ${table}`);
          },
        }),
      };
    }
    return originalLoad.call(this, request, parent, isMain);
  };
}

installServiceRoleShim();

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

function mockSupabase(options: {
  userId?: string | null;
  platformRole?: string | null;
  growthAccess?: unknown;
}): SupabaseClient {
  return {
    auth: {
      getUser: async () => ({
        data: { user: options.userId ? { id: options.userId } : null },
        error: null,
      }),
    },
    from: (table: string) => {
      if (table === "platform_admins") {
        return {
          select: () => ({
            maybeSingle: async () => ({
              data: options.platformRole ? { role: options.platformRole } : null,
              error: null,
            }),
          }),
        };
      }
      throw new Error(`unexpected from(${table})`);
    },
    rpc: async (fn: string) => {
      if (fn === "get_growth_portal_access") {
        return { data: options.growthAccess ?? { has_access: false, role: "none" }, error: null };
      }
      if (fn === "csp_get_partner_overview") {
        if (overviewStatusByCall === undefined) {
          return { data: null, error: { message: "unavailable" } };
        }
        if (overviewStatusByCall === null) {
          return { data: { partner: null }, error: null };
        }
        return { data: { partner: { status: overviewStatusByCall } }, error: null };
      }
      throw new Error(`unexpected rpc ${fn}`);
    },
  } as unknown as SupabaseClient;
}

function read(rel: string): string {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

async function main() {
  const {
    isCspPartnerPortalStatusAllowed,
    isGrowthPortalAccessGranted,
    userHasCspPartnerAccess,
    authUserHasActiveCustomerMembership,
  } = await import("./partner-access");
  const { getPostLoginPath } = await import("@/lib/auth/get-post-login-path");

  await test("status allowlist denies pending/rejected/suspended", () => {
    for (const denied of [
      "under_review",
      "registered",
      "applied",
      "rejected",
      "suspended",
      "terminated",
      "needs_information",
      "",
    ]) {
      assert.equal(isCspPartnerPortalStatusAllowed(denied), false, denied);
    }
    for (const allowed of ["approved", "active", "certified", "in_academy"]) {
      assert.equal(isCspPartnerPortalStatusAllowed(allowed), true, allowed);
    }
  });

  await test("growth access requires authoritative has_access + role", () => {
    assert.equal(isGrowthPortalAccessGranted({ has_access: true, role: "growth_partner" }), true);
    assert.equal(isGrowthPortalAccessGranted({ has_access: true, role: "super_admin" }), true);
    assert.equal(isGrowthPortalAccessGranted({ has_access: false, role: "growth_partner" }), false);
    assert.equal(isGrowthPortalAccessGranted({ has_access: true, role: "none" }), false);
    assert.equal(isGrowthPortalAccessGranted({ has_access: true, role: "customer" }), false);
    assert.equal(isGrowthPortalAccessGranted({ role: "growth_partner" }), false);
  });

  await test("APP customer without partner profile is denied CSP access", async () => {
    const userId = "app-only";
    delete partnerStatusByUser[userId];
    activeAppUsers.add(userId);
    overviewStatusByCall = null;
    assert.equal(await userHasCspPartnerAccess(mockSupabase({ userId }), userId), false);
  });

  await test("partner under_review is denied", async () => {
    const userId = "pending-partner";
    partnerStatusByUser[userId] = "under_review";
    overviewStatusByCall = "under_review";
    assert.equal(await userHasCspPartnerAccess(mockSupabase({ userId }), userId), false);
  });

  await test("rejected / suspended partners are denied", async () => {
    for (const status of ["rejected", "suspended", "terminated"]) {
      const userId = `denied-${status}`;
      partnerStatusByUser[userId] = status;
      overviewStatusByCall = status;
      assert.equal(await userHasCspPartnerAccess(mockSupabase({ userId }), userId), false, status);
    }
  });

  await test("approved Growth Partner is allowed", async () => {
    const userId = "approved-partner";
    partnerStatusByUser[userId] = "approved";
    assert.equal(await userHasCspPartnerAccess(mockSupabase({ userId }), userId), true);
  });

  await test("client-manipulated overview cannot override denied service-role status", async () => {
    const userId = "spoof-attempt";
    partnerStatusByUser[userId] = "under_review";
    overviewStatusByCall = "approved";
    assert.equal(await userHasCspPartnerAccess(mockSupabase({ userId }), userId), false);
  });

  await test("ordinary APP login prefers APP destination over seller portal", async () => {
    const userId = "dual-app-csp";
    partnerStatusByUser[userId] = "approved";
    activeAppUsers.add(userId);
    assert.equal(await authUserHasActiveCustomerMembership(userId), true);
    const destination = await getPostLoginPath(mockSupabase({ userId }), null, "app.aipify.ai");
    assert.match(destination, /\/app\//);
    assert.doesNotMatch(destination, /\/partners/);
  });

  await test("explicit partner portal intent still routes to /partners", async () => {
    const destination = await getPostLoginPath(mockSupabase({ userId: "anyone" }), null, "app.aipify.ai", {
      portalIntent: "partner",
    });
    assert.match(destination, /\/partners/);
  });

  await test("approved partner without APP membership lands on /partners", async () => {
    const userId = "partner-only";
    partnerStatusByUser[userId] = "approved";
    activeAppUsers.delete(userId);
    const destination = await getPostLoginPath(mockSupabase({ userId }), null, "app.aipify.ai");
    assert.match(destination, /\/partners/);
  });

  await test("server layout and access API enforce status-gated partner access", () => {
    const accessRoute = read("app/api/partners-portal/access/route.ts");
    const layout = read("app/partners/layout.tsx");
    const partnerAccess = read("lib/certified-sales-partner/partner-access.ts");
    const platformPartners = read("app/api/platform/sellers/partners/route.ts");
    const serverAccess = read("lib/partners-portal/server-access.ts");

    assert.match(partnerAccess, /CSP_PARTNER_PORTAL_ALLOWED_STATUSES/);
    assert.match(accessRoute, /isGrowthPortalAccessGranted/);
    assert.match(accessRoute, /userHasCspPartnerAccess/);
    assert.match(layout, /resolvePartnersPortalServerAccess/);
    assert.match(layout, /csp_partner_required/);
    assert.match(serverAccess, /requirePartnersPortalApiAccess/);
    assert.match(platformPartners, /confirm_active_app_customer_required/);
    assert.match(platformPartners, /confirm_active_app_customer/);

    for (const rel of [
      "app/api/partners-portal/dashboard/route.ts",
      "app/api/partners-portal/economy/sales/route.ts",
      "app/api/partners-portal/economy/commissions/route.ts",
      "app/api/partners-portal/economy/settlements/route.ts",
    ]) {
      assert.match(read(rel), /requirePartnersPortalApiAccess/);
    }

    const registerSql = read(
      "supabase/migrations/20261941100000_certified_sales_partner_impl_rpcs_v1.sql",
    );
    assert.match(registerSql, /never auto-approved/);
    assert.match(registerSql, /values \(v_uid, v_name, v_country, 'under_review'\)/);
    assert.match(registerSql, /if v_uid is null or not coalesce\(public\.is_platform_admin\(\), false\) then/);
  });

  console.log("partner-access security matrix passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
