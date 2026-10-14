import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  CUSTOMER_CREATE_EXECUTE_ENABLED,
  CUSTOMER_CREATE_EXECUTE_OWNER_ALLOWLIST,
  assertNoHardcodedBedriftTestOrg,
  buildCustomerCreatePreparePlan,
  createCustomerPrepareIdempotencyKey,
  extractRegistryScanRows,
  mapCustomerCreatePrepareError,
  parseCustomerCreatePrepareInput,
  scanRegistryForCustomerConflicts,
} from "./create-customer-prepare";

const validIdentity = {
  organizationNumber: "937978960",
  legalName: "Example Bedrift AS",
  displayName: "Example Bedrift",
  slug: "example-bedrift",
  country: "NO",
  verificationSource: "operator",
};

assert.equal(CUSTOMER_CREATE_EXECUTE_OWNER_ALLOWLIST.size, 0);
assert.equal(CUSTOMER_CREATE_EXECUTE_ENABLED, false);

assert.equal(
  parseCustomerCreatePrepareInput({
    ...validIdentity,
    internalReason: "D1 prepare for separate Bedrift test customer",
    confirmation: true,
    idempotencyKey: "cpk-key-12345678",
    mode: "prepare",
  }).ok,
  true,
);

assert.equal(
  parseCustomerCreatePrepareInput({
    ...validIdentity,
    internalReason: "ab",
    confirmation: true,
    idempotencyKey: "cpk-key-12345678",
  }).ok,
  false,
);

assert.equal(
  parseCustomerCreatePrepareInput({
    ...validIdentity,
    internalReason: "Contains sk-secretvaluehere",
    confirmation: true,
    idempotencyKey: "cpk-key-12345678",
  }).ok,
  false,
);

assert.equal(
  parseCustomerCreatePrepareInput({
    ...validIdentity,
    internalReason: "D1 prepare for separate Bedrift test customer",
    confirmation: false,
    idempotencyKey: "cpk-key-12345678",
  }).ok,
  false,
);

assert.equal(
  parseCustomerCreatePrepareInput({
    ...validIdentity,
    internalReason: "D1 prepare for separate Bedrift test customer",
    confirmation: true,
    idempotencyKey: "bad-key-12345678",
  }).ok,
  false,
);

assert.equal(
  parseCustomerCreatePrepareInput({
    organizationNumber: "",
    legalName: "Example",
    displayName: "Example",
    slug: "example",
    country: "NO",
    verificationSource: "operator",
    internalReason: "D1 prepare",
    confirmation: true,
    idempotencyKey: "cpk-key-12345678",
  }).ok,
  false,
);

assert.match(createCustomerPrepareIdempotencyKey(), /^cpk-/);

const conflicts = scanRegistryForCustomerConflicts(
  [
    {
      customerId: "cust-org",
      organizationNumber: "937978960",
      organizationSlug: "other-slug",
    },
    {
      customerId: "cust-slug",
      organizationNumber: "111111111",
      organizationSlug: "example-bedrift",
    },
  ],
  {
    organizationNumber: "937978960",
    legalName: "Example Bedrift AS",
    displayName: "Example Bedrift",
    slug: "example-bedrift",
    country: "NO",
    verificationSource: "operator",
  },
);
assert.equal(conflicts.organizationNumberMatchCustomerId, "cust-org");
assert.equal(conflicts.slugMatchCustomerId, "cust-slug");

const extracted = extractRegistryScanRows({
  customers: [
    {
      customer_id: "c1",
      organization_number: "123456789",
      organization_slug: "acme",
    },
  ],
});
assert.equal(extracted.length, 1);
assert.equal(extracted[0]?.customerId, "c1");
assert.equal(extracted[0]?.organizationSlug, "acme");

const plan = buildCustomerCreatePreparePlan({
  creation: {
    organizationNumber: "937978960",
    legalName: "Example Bedrift AS",
    displayName: "Example Bedrift",
    slug: "example-bedrift",
    country: "NO",
    verificationSource: "operator",
  },
  registryRows: [],
  internalReason: "prepare only",
  idempotencyKey: "cpk-plan-12345678",
});
assert.equal(plan.dryRun, true);
assert.equal(plan.mode, "prepare");
// D2F: Core environment_type RPC not connected — must not claim ready for create.
assert.equal(plan.readyForLaterCreate, false);
assert.equal(plan.environmentType.resolved, "production");
assert.equal(plan.environmentType.rpcConnected, false);
assert.equal(plan.environmentType.coreWouldPersistToday, "production");
assert.ok(
  plan.executeBlockedReasons.includes("environment_type_rpc_not_connected"),
);
assert.equal(plan.ownerApprovalRequired, true);

assert.equal(
  parseCustomerCreatePrepareInput({
    ...validIdentity,
    environmentType: "internal",
    internalReason: "client forgery attempt",
    confirmation: true,
    idempotencyKey: "cpk-key-internal01",
    mode: "prepare",
  }).ok,
  false,
);

assert.equal(
  parseCustomerCreatePrepareInput({
    ...validIdentity,
    environmentType: "staging",
    internalReason: "invalid environment",
    confirmation: true,
    idempotencyKey: "cpk-key-staging001",
    mode: "prepare",
  }).ok,
  false,
);
assert.equal(plan.sideEffects.createsCompany, false);
assert.equal(plan.sideEffects.createsCustomer, false);
assert.equal(plan.sideEffects.createsOrganization, false);
assert.equal(plan.sideEffects.createsAuthUser, false);
assert.equal(plan.sideEffects.sendsEmail, false);
assert.equal(plan.sideEffects.writesMembership, false);
assert.equal(plan.sideEffects.grantsKompisBedrift, false);
assert.equal(plan.sideEffects.mutatesUnoNight, false);
assert.equal(plan.productSeparation.noAdminAttach, true);
assert.equal(plan.productSeparation.noEmailAsTenantLink, true);
assert.ok(plan.executeBlockedReasons.includes("owner_create_authorization_required"));
assert.ok(plan.executeBlockedReasons.includes("create_execute_not_enabled"));
assert.ok(plan.executeBlockedReasons.includes("d1_prepare_only_no_production_create"));
assert.equal(plan.duplicateProbe.authoritative, false);

const conflictPlan = buildCustomerCreatePreparePlan({
  creation: plan.normalizedInput,
  registryRows: [
    {
      customerId: "dup",
      organizationNumber: "937978960",
      organizationSlug: "example-bedrift",
    },
  ],
  internalReason: "prepare only",
  idempotencyKey: "cpk-plan-conflict01",
});
assert.equal(conflictPlan.readyForLaterCreate, false);
assert.ok(
  conflictPlan.executeBlockedReasons.includes("registry_scan_conflict_advisory"),
);

assert.equal(mapCustomerCreatePrepareError("create_execute_not_enabled").status, 403);
assert.equal(
  mapCustomerCreatePrepareError("owner_create_authorization_required").status,
  403,
);
assert.equal(mapCustomerCreatePrepareError("unauthorized").status, 401);
assert.equal(mapCustomerCreatePrepareError("invalid_internal_reason").status, 400);

const route = readFileSync(
  "app/api/platform-portal/customers/prepare/route.ts",
  "utf8",
);
assert.match(route, /get_platform_portal_customers/);
assert.match(route, /create_execute_not_enabled/);
assert.match(route, /owner_create_authorization_required/);
assert.match(route, /no-store/);
assert.doesNotMatch(
  route,
  /rpc\(\s*["']create_platform_portal_customer["']/,
);
assert.doesNotMatch(route, /\.auth\.admin\b/);
assert.doesNotMatch(route, /rpc\(\s*["']invite_organization_user["']/);
assert.doesNotMatch(route, /generateLink\(/);
assert.doesNotMatch(route, /createUser\(/);
assert.ok(assertNoHardcodedBedriftTestOrg(route));

const lib = readFileSync("lib/platform-portal/create-customer-prepare.ts", "utf8");
assert.match(lib, /CUSTOMER_CREATE_EXECUTE_OWNER_ALLOWLIST[\s\S]*new Set\(\)/);
assert.match(lib, /CUSTOMER_CREATE_EXECUTE_ENABLED = false/);
assert.ok(assertNoHardcodedBedriftTestOrg(lib));

const panel = readFileSync(
  "components/platform/platform-portal/PlatformPortalCustomerCreationPanel.tsx",
  "utf8",
);
assert.match(panel, /mode:\s*["']prepare["']/);
assert.match(panel, /\/api\/platform-portal\/customers\/prepare/);
assert.match(panel, /prepareExecuteLocked/);
assert.doesNotMatch(panel, /mode:\s*["']execute["']/);
assert.doesNotMatch(
  panel,
  /fetch\(\s*["']\/api\/platform-portal\/customers["']/,
);
assert.ok(assertNoHardcodedBedriftTestOrg(panel));

const customersRoute = readFileSync(
  "app/api/platform-portal/customers/route.ts",
  "utf8",
);
assert.match(customersRoute, /create_platform_portal_customer/);

for (const locale of ["en", "no", "da", "sv", "pl", "uk", "es"]) {
  const creation = JSON.parse(readFileSync(`locales/${locale}/platform.json`, "utf8"))
    .customers.creation;
  assert.ok(creation.prepareAction, locale);
  assert.ok(creation.prepareRunning, locale);
  assert.ok(creation.prepareReady, locale);
  assert.ok(creation.prepareBlocked, locale);
  assert.ok(creation.prepareReason, locale);
  assert.ok(creation.prepareSideEffectsNone, locale);
  assert.ok(creation.prepareDuplicateAdvisory, locale);
  assert.ok(creation.prepareCoreDeferred, locale);
  assert.ok(creation.prepareExecuteLocked, locale);
  assert.ok(creation.prepareProductSeparation, locale);
  assert.ok(assertNoHardcodedBedriftTestOrg(JSON.stringify(creation)), locale);
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

// Prior Bedrift / admin gates must remain empty
const bedrift = readFileSync(
  "lib/platform-portal/kompis-bedrift-activation.ts",
  "utf8",
);
assert.match(
  bedrift,
  /KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST[\s\S]*new Set\(\)/,
);
const admin = readFileSync("lib/platform-portal/admin-provisioning.ts", "utf8");
assert.match(admin, /ADMIN_PROVISION_OWNER_ALLOWLIST[\s\S]*new Set\(\)/);

console.log("create-customer-prepare: all tests passed");
