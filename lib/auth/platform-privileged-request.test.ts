import assert from "node:assert/strict";
import {
  classifyPrivilegedPlatformRequest,
  CONDITIONAL_COMMAND_BAR_PATHS,
  CUSTOMER_TENANT_OBSERVABILITY_PATHS,
  EXCLUDED_PLATFORM_GUARD_PATHS,
  isPrivilegedPlatformApiPath,
  listPlatformPrivilegedInventory,
  normalizeApiPathname,
  PLATFORM_ADMIN_IF_PREFIXES,
  PLATFORM_DASHED_SLUG_PREFIX,
  PLATFORM_SESSION_PREFIXES,
  PLATFORM_PRIVILEGED_PORTAL_VALUES,
} from "./platform-privileged-request";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok ${name}`);
  } catch (error) {
    console.error(`fail ${name}`);
    throw error;
  }
}

function classify(pathname: string, search = "", method = "GET") {
  const url = new URL(`http://localhost${pathname}${search ? `?${search}` : ""}`);
  return classifyPrivilegedPlatformRequest({
    pathname: url.pathname,
    method,
    searchParams: url.searchParams,
  });
}

test("inventory covers all known always-privileged prefix families", () => {
  const inventory = listPlatformPrivilegedInventory();
  assert.ok(inventory.alwaysPrivilegedPrefixes.length >= 14);
  assert.equal(inventory.platformDashedSlugPrefix, PLATFORM_DASHED_SLUG_PREFIX);
  assert.deepEqual(inventory.conditionalCommandBarPaths, [...CONDITIONAL_COMMAND_BAR_PATHS]);
});

test("platform path families classify as platform_session", () => {
  const paths = [
    "/api/platform/navigation",
    "/api/platform-admin/audit",
    "/api/platform-decision-center/overview",
    "/api/platform-portal/dashboard",
    "/api/aipify/platform-install/trial/cancel",
    "/api/aipify/platform-integrity/briefings/generate",
    "/api/customer-success-operations/overview",
    "/api/customer-success-operations/actions",
    "/api/compliance-governance-center/overview",
    "/api/subscription-operations/overview",
    "/api/executive-operations-center/actions",
    "/api/aipify/install/unonight/status",
    "/api/voice-of-the-customer/feedback-center",
  ];

  for (const path of paths) {
    const result = classify(path);
    assert.equal(result.privileged, true, path);
    assert.equal(result.kind, "platform_session", path);
  }
});

test("platform dashed slug routes classify as platform_session", () => {
  for (const path of [
    "/api/platform-health-operations-center/overview",
    "/api/platform-playbook-center/actions",
  ]) {
    const result = classify(path);
    assert.equal(result.privileged, true, path);
    assert.equal(result.trigger, PLATFORM_DASHED_SLUG_PREFIX, path);
  }
});

test("command-bar conditional portal behavior", () => {
  for (const path of CONDITIONAL_COMMAND_BAR_PATHS) {
    assert.equal(classify(path, "portal=platform").privileged, true);
    assert.equal(classify(path, "portal=platform").trigger, "portal=platform");
    assert.equal(classify(path, "portal=super_admin").privileged, true);
    assert.equal(classify(path, "portal=customer").privileged, false);
    assert.equal(classify(path).privileged, false);
    assert.equal(classify(path, "portal=evil").privileged, false);
    assert.equal(classify(path, "q=test&portal=platform").privileged, true);
  }
});

test("skills marketplace scope=platform is privileged", () => {
  assert.equal(classify("/api/skills-marketplace", "scope=platform").privileged, true);
  assert.equal(classify("/api/skills-marketplace").privileged, false);
  assert.equal(classify("/api/skills-marketplace", "scope=customer").privileged, false);
  assert.equal(classify("/api/skills-marketplace", "scope=invalid").privileged, false);
});

test("payment providers GET scope=platform is privileged", () => {
  assert.equal(classify("/api/payment-providers", "scope=platform").privileged, true);
  assert.equal(classify("/api/payment-providers").privileged, false);
  assert.equal(classify("/api/payment-providers", "scope=tenant").privileged, false);
});

test("aipify tenants routes use platform_admin_if", () => {
  const result = classify("/api/aipify/tenants/00000000-0000-0000-0000-000000000001/modules");
  assert.equal(result.privileged, true);
  assert.equal(result.kind, "platform_admin_if");
  assert.equal(PLATFORM_ADMIN_IF_PREFIXES.length, 1);
});

test("explicit exclusions remain unprivileged", () => {
  for (const path of EXCLUDED_PLATFORM_GUARD_PATHS) {
    const normalized = path.endsWith("/") ? path.slice(0, -1) : path;
    assert.equal(classify(normalized).privileged, false, path);
    assert.equal(classify(`${normalized}/nested`).privileged, false, path);
  }
  assert.equal(classify("/api/aipify/v1/platform-snapshot").privileged, false);
});

test("customer tenant observability routes are not platform-privileged", () => {
  for (const path of CUSTOMER_TENANT_OBSERVABILITY_PATHS) {
    assert.equal(classify(path).privileged, false, path);
    assert.equal(classify(`${path}/resolve`).privileged, false, path);
  }
});

test("trailing slash normalization", () => {
  assert.equal(
    classify("/api/customer-success-operations/overview/").privileged,
    true,
  );
  assert.equal(normalizeApiPathname("/api/platform/foo/"), "/api/platform/foo");
});

test("all HTTP methods share pathname classification", () => {
  for (const method of ["GET", "POST", "PATCH", "PUT", "DELETE"]) {
    const result = classify("/api/customer-success-operations/actions", "", method);
    assert.equal(result.privileged, true, method);
  }
});

test("legacy isPrivilegedPlatformApiPath aligns with classifier", () => {
  assert.equal(isPrivilegedPlatformApiPath("/api/platform/foo"), true);
  assert.equal(isPrivilegedPlatformApiPath("/api/command-bar/search"), false);
  assert.equal(isPrivilegedPlatformApiPath("/api/customer-success-operations/overview"), true);
});

test("platform privileged portal values are fixed", () => {
  assert.equal(PLATFORM_PRIVILEGED_PORTAL_VALUES.has("platform"), true);
  assert.equal(PLATFORM_PRIVILEGED_PORTAL_VALUES.has("super_admin"), true);
  assert.equal(PLATFORM_PRIVILEGED_PORTAL_VALUES.has("customer"), false);
});

test("registry includes every PLATFORM_SESSION_PREFIX entry", () => {
  for (const prefix of PLATFORM_SESSION_PREFIXES) {
    const sample = prefix.endsWith("/") ? `${prefix}sample` : prefix;
    const result = classify(sample);
    assert.equal(result.privileged, true, prefix);
  }
});

console.log("platform-privileged-request.test.ts: all assertions passed");
