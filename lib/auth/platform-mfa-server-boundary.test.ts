import assert from "node:assert/strict";
import {
  buildMfaEnrollPath,
  buildMfaVerifyPath,
  isPlatformPortalDestination,
  resolveMfaSuccessDestination,
} from "./two-factor/mfa-portal-routing";
import { isPrivilegedPlatformApiPath } from "./platform-server-access";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok ${name}`);
  } catch (error) {
    console.error(`fail ${name}`);
    throw error;
  }
}

test("platform destinations use neutral MFA routes", () => {
  assert.equal(isPlatformPortalDestination("/platform"), true);
  assert.equal(isPlatformPortalDestination("/super/trust"), true);
  assert.equal(isPlatformPortalDestination("/app/command-center"), false);

  assert.equal(
    buildMfaEnrollPath("/platform", "platform"),
    "/auth/two-factor/enroll?required=1&next=%2Fplatform",
  );
  assert.equal(
    buildMfaVerifyPath("/platform", "platform"),
    "/auth/two-factor/verify?next=%2Fplatform",
  );
});

test("customer destinations keep existing MFA routes", () => {
  assert.equal(
    buildMfaEnrollPath("/app/command-center", "customer"),
    "/app/settings/two-factor?required=1&next=%2Fapp%2Fcommand-center",
  );
  assert.equal(
    buildMfaVerifyPath("/app/command-center", "customer"),
    "/verify-2fa?next=%2Fapp%2Fcommand-center",
  );
});

test("auto portal kind resolves from next path", () => {
  assert.equal(
    buildMfaEnrollPath("/platform/customers"),
    "/auth/two-factor/enroll?required=1&next=%2Fplatform%2Fcustomers",
  );
  assert.equal(
    buildMfaVerifyPath("/app/settings/security"),
    "/verify-2fa?next=%2Fapp%2Fsettings%2Fsecurity",
  );
});

test("redirect safety rejects external next values", () => {
  assert.equal(buildMfaEnrollPath("https://evil.example"), "/app/settings/two-factor?required=1");
  assert.equal(
    buildMfaEnrollPath("/platform", "platform"),
    "/auth/two-factor/enroll?required=1&next=%2Fplatform",
  );
  assert.equal(
    buildMfaVerifyPath("//evil.example", "platform"),
    "/auth/two-factor/verify?next=%2Fplatform",
  );
});

test("missing next resolves to platform for platform MFA verify", () => {
  assert.equal(resolveMfaSuccessDestination(null, "platform"), "/platform");
  assert.equal(resolveMfaSuccessDestination(null, "customer"), "/app/command-center");
});

test("privileged platform API path coverage", () => {
  const covered = [
    "/api/platform/navigation",
    "/api/platform-admin/audit",
    "/api/platform-decision-center/overview",
    "/api/platform-portal/dashboard",
    "/api/aipify/platform-install/trial/cancel",
    "/api/aipify/platform-integrity/briefings/generate",
  ];

  for (const path of covered) {
    assert.equal(isPrivilegedPlatformApiPath(path), true, `expected covered: ${path}`);
  }

  assert.equal(isPrivilegedPlatformApiPath("/api/aipify/v1/platform-snapshot"), false);
  assert.equal(isPrivilegedPlatformApiPath("/api/auth/2fa/status"), false);
  assert.equal(isPrivilegedPlatformApiPath("/api/app/organization-context"), false);
});

console.log("platform-mfa-server-boundary.test.ts: all assertions passed");
