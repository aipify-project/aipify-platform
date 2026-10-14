import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  ADMIN_PROVISION_INVITE_DELIVERY_CONNECTED,
  ADMIN_PROVISION_OWNER_ALLOWLIST,
  assertNoHardcodedProductionAdminEmail,
  buildAdminProvisionPlan,
  buildAdminProvisionReadiness,
  createAdminProvisionIdempotencyKey,
  isAdminProvisionOwnerAuthorized,
  parseAdminProvisionPrepareInput,
} from "./admin-provisioning";

const customerId = "32d748eb-9a66-4174-a416-18a813610d3e";

assert.equal(ADMIN_PROVISION_OWNER_ALLOWLIST.size, 0);
assert.equal(ADMIN_PROVISION_INVITE_DELIVERY_CONNECTED, false);
assert.equal(isAdminProvisionOwnerAuthorized(customerId), false);

assert.equal(
  parseAdminProvisionPrepareInput(customerId, {
    adminEmail: "ops.admin@example.com",
    role: "owner",
    internalReason: "Bedrift test tenant prepare",
    confirmation: true,
    idempotencyKey: "apk-key-123456",
    mode: "prepare",
  }).ok,
  true,
);
assert.equal(
  parseAdminProvisionPrepareInput(customerId, {
    adminEmail: "not-an-email",
    role: "owner",
    internalReason: "Bedrift test tenant prepare",
    confirmation: true,
    idempotencyKey: "apk-key-123456",
  }).ok,
  false,
);
assert.equal(
  parseAdminProvisionPrepareInput(customerId, {
    adminEmail: "ops.admin@example.com",
    role: "superadmin",
    internalReason: "Bedrift test tenant prepare",
    confirmation: true,
    idempotencyKey: "apk-key-123456",
  }).ok,
  false,
);
assert.equal(
  parseAdminProvisionPrepareInput(customerId, {
    adminEmail: "ops.admin@example.com",
    role: "owner",
    internalReason: "Contains sk-secretvaluehere",
    confirmation: true,
    idempotencyKey: "apk-key-123456",
  }).ok,
  false,
);
assert.equal(
  parseAdminProvisionPrepareInput(customerId, {
    adminEmail: "ops.admin@example.com",
    role: "owner",
    internalReason: "Bedrift test tenant prepare",
    confirmation: false,
    idempotencyKey: "apk-key-123456",
  }).ok,
  false,
);
assert.equal(
  parseAdminProvisionPrepareInput(customerId, {
    adminEmail: "ops.admin@example.com",
    role: "owner",
    internalReason: "Bedrift test tenant prepare",
    confirmation: true,
    idempotencyKey: "bad-key-123456",
  }).ok,
  false,
);
assert.match(createAdminProvisionIdempotencyKey(), /^apk-/);

const readiness = buildAdminProvisionReadiness({
  customerId,
  organizationId: customerId,
  slug: "example-co",
  companyName: "Example Co",
  contactEmail: null,
  memberCount: 0,
  customerStatus: "active",
});
assert.equal(readiness.readyForAdminPrepare, true);
assert.equal(readiness.executeAuthorized, false);
assert.equal(readiness.inviteDeliveryConnected, false);
assert.equal(readiness.notes.createCustomerDoesNotAttachAdmin, true);
assert.equal(readiness.notes.membershipDoesNotGrantBedrift, true);
assert.equal(readiness.notes.existingEmailRequiresExplicitAccept, true);

const inactive = buildAdminProvisionReadiness({
  customerId,
  organizationId: customerId,
  slug: "example-co",
  companyName: "Example Co",
  contactEmail: null,
  memberCount: 0,
  customerStatus: "suspended",
});
assert.equal(inactive.readyForAdminPrepare, false);

const plan = buildAdminProvisionPlan({
  readiness,
  adminEmail: "Ops.Admin@Example.com",
  role: "owner",
  internalReason: "prepare only",
  idempotencyKey: "apk-plan-12345678",
});
assert.equal(plan.dryRun, true);
assert.equal(plan.mode, "prepare");
assert.equal(plan.adminEmail, "ops.admin@example.com");
assert.equal(plan.sideEffects.createsAuthUser, false);
assert.equal(plan.sideEffects.sendsEmail, false);
assert.equal(plan.sideEffects.writesMembership, false);
assert.equal(plan.sideEffects.grantsKompisBedrift, false);
assert.equal(plan.sideEffects.mutatesUnoNight, false);
assert.ok(plan.executeBlockedReasons.includes("owner_provision_authorization_required"));
assert.ok(plan.executeBlockedReasons.includes("invite_delivery_not_connected"));
assert.equal(plan.authProbe, "not_run");

const route = readFileSync(
  "app/api/platform-portal/customers/[id]/admin-provisioning/route.ts",
  "utf8",
);
assert.match(route, /get_platform_portal_customer_identity/);
assert.match(route, /get_platform_portal_customer_detail/);
assert.match(route, /owner_provision_authorization_required/);
assert.match(route, /invite_delivery_not_connected/);
assert.match(route, /no-store/);
assert.doesNotMatch(route, /rpc\(\s*["']invite_organization_user["']/);
assert.doesNotMatch(route, /\.auth\.admin\b/);
assert.doesNotMatch(route, /generateLink\(/);
assert.doesNotMatch(route, /createUser\(/);
assert.doesNotMatch(route, /ADMIN_PROVISION_OWNER_ALLOWLIST\.add/);
assert.ok(assertNoHardcodedProductionAdminEmail(route));

const lib = readFileSync("lib/platform-portal/admin-provisioning.ts", "utf8");
assert.match(lib, /ADMIN_PROVISION_OWNER_ALLOWLIST[\s\S]*new Set\(\)/);
assert.match(lib, /ADMIN_PROVISION_INVITE_DELIVERY_CONNECTED = false/);
assert.ok(assertNoHardcodedProductionAdminEmail(lib));

const panel = readFileSync(
  "components/platform/platform-portal/PlatformPortalAdminProvisioningPanel.tsx",
  "utf8",
);
assert.match(panel, /mode:\s*["']prepare["']/);
assert.match(panel, /executeLockedTitle/);
assert.match(panel, /disabled/);
assert.doesNotMatch(panel, /mode:\s*["']execute["']/);
assert.ok(assertNoHardcodedProductionAdminEmail(panel));

const detail = readFileSync(
  "components/platform/platform-portal/PlatformPortalCustomerDetailPanel.tsx",
  "utf8",
);
assert.match(detail, /PlatformPortalAdminProvisioningPanel/);
assert.match(detail, /adminProvisionLabels/);

const page = readFileSync("app/platform/customers/[id]/page.tsx", "utf8");
assert.match(page, /buildPlatformPortalAdminProvisionLabels/);

for (const locale of ["en", "no", "da", "sv", "pl", "uk", "es"]) {
  const ap = JSON.parse(readFileSync(`locales/${locale}/platform.json`, "utf8"))
    .customers.adminProvisioning;
  assert.ok(ap.sectionTitle, locale);
  assert.ok(ap.executeLockedBody, locale);
  assert.ok(ap.executeUnavailable, locale);
  assert.ok(ap.checks.inviteDeliveryContractMissing, locale);
  assert.ok(ap.noBedriftFromMembership, locale);
  assert.ok(assertNoHardcodedProductionAdminEmail(JSON.stringify(ap)), locale);
}

// Frozen Website Kompis public chain — 46/46
const manifest = JSON.parse(
  readFileSync(
    "docs/integrations/website-kompis-public-chain-frozen-manifest.json",
    "utf8",
  ),
) as { protectedRuntimeFiles: Array<{ path: string; sha256: string }> };
assert.equal(manifest.protectedRuntimeFiles.length, 46);
for (const entry of manifest.protectedRuntimeFiles) {
  const actual = createHash("sha256")
    .update(readFileSync(entry.path))
    .digest("hex");
  assert.equal(actual, entry.sha256, `frozen hash mismatch: ${entry.path}`);
}

// Bedrift activate allowlist must remain empty (do not weaken prior gate)
const bedrift = readFileSync(
  "lib/platform-portal/kompis-bedrift-activation.ts",
  "utf8",
);
assert.match(
  bedrift,
  /KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST[\s\S]*new Set\(\)/,
);

console.log("admin-provisioning: all tests passed");
