import assert from "node:assert/strict";
import { sanitizeNextPath, isCustomerPortalPath } from "@/lib/auth/safe-next-path";
import { mergeAuthCookieOptions } from "@/lib/supabase/auth-cookies";
import {
  CUSTOMER_PORTAL_DOMAIN,
  isCustomerPortalHost,
  isMarketingApexHost,
} from "@/lib/portals/hosts";
import { resolvePostLoginPath } from "@/lib/portals/separation";
import { resolvePostLoginRedirectUrl } from "@/lib/portals/customer-portal-url";

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

test("auth cookies use shared production domain on aipify hosts", () => {
  const merged = mergeAuthCookieOptions({}, "app.aipify.ai");
  if (process.env.NODE_ENV === "production") {
    assert.equal(merged.domain, ".aipify.ai");
    assert.equal(merged.sameSite, "lax");
  } else {
    assert.equal(merged.domain, undefined);
  }
});

console.log("portal-auth tests passed");
