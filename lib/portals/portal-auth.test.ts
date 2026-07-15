import assert from "node:assert/strict";
import { sanitizeNextPath, isCustomerPortalPath } from "@/lib/auth/safe-next-path";
import { mergeAuthCookieOptions } from "@/lib/supabase/auth-cookies";
import {
  CUSTOMER_PORTAL_DOMAIN,
  isCustomerPortalHost,
  isMarketingApexHost,
} from "@/lib/portals/hosts";
import {
  resolvePortalRouteDecision,
  resolvePostLoginPath,
} from "@/lib/portals/separation";
import type { PlatformAccessProfile } from "@/lib/portals/types";
import { CUSTOMER_PORTAL_ROUTE } from "@/lib/portals/routes";
import {
  resolvePostLoginRedirectUrl,
  shouldCanonicalizeToCustomerPortal,
} from "@/lib/portals/customer-portal-url";
import { isPortalAuthPath } from "@/lib/portals/routes";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok ${name}`);
  } catch (error) {
    console.error(`fail ${name}`);
    throw error;
  }
}

test("sanitizeNextPath accepts internal app paths", () => {
  assert.equal(sanitizeNextPath("/app/command-center"), "/app/command-center");
  assert.equal(
    sanitizeNextPath("/app/support/success-center?tab=overview"),
    "/app/support/success-center?tab=overview"
  );
});

test("sanitizeNextPath rejects external and protocol-relative URLs", () => {
  assert.equal(sanitizeNextPath("https://evil.example/phish"), null);
  assert.equal(sanitizeNextPath("//evil.example/phish"), null);
  assert.equal(sanitizeNextPath("/\\evil.example"), null);
});

test("isCustomerPortalPath covers app and legacy dashboard routes", () => {
  assert.equal(isCustomerPortalPath("/app/command-center"), true);
  assert.equal(isCustomerPortalPath("/dashboard"), true);
  assert.equal(isCustomerPortalPath("/platform"), false);
});

test("dev does not canonicalize customer routes off localhost", () => {
  if (process.env.NODE_ENV !== "production") {
    assert.equal(
      shouldCanonicalizeToCustomerPortal("localhost", "/app/command-center"),
      false
    );
  }
});

test("marketing apex host detection excludes customer portal host", () => {
  assert.equal(isMarketingApexHost("aipify.ai"), true);
  assert.equal(isMarketingApexHost("app.aipify.ai"), false);
  assert.equal(isCustomerPortalHost("app.aipify.ai"), true);
});

test("resolvePostLoginRedirectUrl canonicalizes customer routes off apex", () => {
  assert.equal(
    resolvePostLoginRedirectUrl("/app/command-center", "app.aipify.ai"),
    "/app/command-center"
  );

  if (process.env.NODE_ENV === "production") {
    assert.equal(
      resolvePostLoginRedirectUrl("/app/command-center", "aipify.ai"),
      `https://${CUSTOMER_PORTAL_DOMAIN}/app/command-center`
    );
  } else {
    assert.equal(
      resolvePostLoginRedirectUrl("/app/command-center", "aipify.ai"),
      "/app/command-center"
    );
  }
});

test("resolvePostLoginPath ignores unsafe next values", () => {
  assert.equal(
    resolvePostLoginPath("aipify.ai", null, "//evil.example"),
    "/app/command-center"
  );
  assert.equal(
    resolvePostLoginPath("app.aipify.ai", null, "/app/command-center"),
    "/app/command-center"
  );
});

test("portal auth paths include password recovery routes", () => {
  assert.equal(isPortalAuthPath("/auth/callback"), true);
  assert.equal(isPortalAuthPath("/auth/reset-password"), true);
  assert.equal(isPortalAuthPath("/auth/update-password"), true);
  assert.equal(isPortalAuthPath("/forgot-password"), true);
});

test("portal auth paths include neutral MFA routes", () => {
  assert.equal(isPortalAuthPath("/auth/two-factor/enroll"), true);
  assert.equal(isPortalAuthPath("/auth/two-factor/verify"), true);
});

test("auth cookies use shared production domain on aipify hosts", () => {
  const merged = mergeAuthCookieOptions({}, "app.aipify.ai");
  if (process.env.NODE_ENV === "production") {
    assert.equal(merged.domain, ".aipify.ai");
    assert.equal(merged.sameSite, "lax");
  } else {
    assert.equal(merged.domain, undefined);
  }
});

const platformAdminAccess: PlatformAccessProfile = {
  isPlatformAdmin: true,
  isSuperAdmin: true,
  role: "super_admin",
};

const customerAccess: PlatformAccessProfile = {
  isPlatformAdmin: false,
  isSuperAdmin: false,
  role: null,
};

test("customer host allows platform admins on /platform", () => {
  assert.deepEqual(
    resolvePortalRouteDecision("/platform", "app.aipify.ai", platformAdminAccess),
    { action: "continue" },
  );
});

test("customer host allows platform admins on nested /platform routes", () => {
  assert.deepEqual(
    resolvePortalRouteDecision("/platform/customers", "app.aipify.ai", platformAdminAccess),
    { action: "continue" },
  );
});

test("customer host redirects non-platform users from /platform to /app", () => {
  assert.deepEqual(
    resolvePortalRouteDecision("/platform", "app.aipify.ai", customerAccess),
    { action: "redirect", pathname: CUSTOMER_PORTAL_ROUTE },
  );
});

test("customer host redirects non-platform users from nested /platform routes to /app", () => {
  assert.deepEqual(
    resolvePortalRouteDecision("/platform/customers", "app.aipify.ai", customerAccess),
    { action: "redirect", pathname: CUSTOMER_PORTAL_ROUTE },
  );
});

test("customer host still blocks /super even for platform admins", () => {
  assert.deepEqual(
    resolvePortalRouteDecision("/super", "app.aipify.ai", platformAdminAccess),
    { action: "redirect", pathname: CUSTOMER_PORTAL_ROUTE },
  );
});

test("customer host preserves ordinary /app routes", () => {
  assert.deepEqual(
    resolvePortalRouteDecision("/app/command-center", "app.aipify.ai", customerAccess),
    { action: "continue" },
  );
});

test("preview host preserves /platform behavior for platform admins", () => {
  assert.deepEqual(
    resolvePortalRouteDecision(
      "/platform",
      "aipify-platform-git-main.vercel.app",
      platformAdminAccess,
    ),
    { action: "continue" },
  );
});

console.log("portal-auth tests passed");
