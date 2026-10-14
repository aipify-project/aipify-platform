import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  AGREEMENT_APPROVAL_EXECUTE_ENABLED,
  AGREEMENT_APPROVAL_EXECUTE_OWNER_ALLOWLIST,
  PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_SOURCE_CONNECTED,
  assertNoHardcodedAgreementTestTarget,
  buildAgreementApprovalPreparePlan,
  createAgreementApprovalIdempotencyKey,
  mapAgreementApprovalPrepareError,
  parseAgreementApprovalPrepareInput,
} from "./agreement-approval-prepare";
import {
  CUSTOMER_CREATE_EXECUTE_ENABLED,
  CUSTOMER_CREATE_EXECUTE_OWNER_ALLOWLIST,
} from "./create-customer-prepare";

const validIdentity = {
  organizationNumber: "937978960",
  legalName: "Example Bedrift AS",
  displayName: "Example Bedrift",
  slug: "example-bedrift-d2",
  country: "NO",
  verificationSource: "operator",
};

assert.equal(AGREEMENT_APPROVAL_EXECUTE_OWNER_ALLOWLIST.size, 0);
assert.equal(AGREEMENT_APPROVAL_EXECUTE_ENABLED, false);
assert.equal(PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_SOURCE_CONNECTED, false);
assert.equal(CUSTOMER_CREATE_EXECUTE_ENABLED, false);
assert.equal(CUSTOMER_CREATE_EXECUTE_OWNER_ALLOWLIST.size, 0);

assert.equal(
  parseAgreementApprovalPrepareInput({
    ...validIdentity,
    internalReason: "D2 agreement readiness prepare",
    confirmation: true,
    idempotencyKey: "aap-key-12345678",
    mode: "prepare",
  }).ok,
  true,
);

assert.equal(
  parseAgreementApprovalPrepareInput({
    ...validIdentity,
    internalReason: "ab",
    confirmation: true,
    idempotencyKey: "aap-key-12345678",
  }).ok,
  false,
);

assert.equal(
  parseAgreementApprovalPrepareInput({
    ...validIdentity,
    internalReason: "Contains sk-secretvaluehere",
    confirmation: true,
    idempotencyKey: "aap-key-12345678",
  }).ok,
  false,
);

assert.equal(
  parseAgreementApprovalPrepareInput({
    ...validIdentity,
    internalReason: "D2 agreement readiness prepare",
    confirmation: false,
    idempotencyKey: "aap-key-12345678",
  }).ok,
  false,
);

assert.equal(
  parseAgreementApprovalPrepareInput({
    ...validIdentity,
    internalReason: "D2 agreement readiness prepare",
    confirmation: true,
    idempotencyKey: "cpk-wrong-prefix01",
  }).ok,
  false,
);

assert.equal(
  parseAgreementApprovalPrepareInput({
    ...validIdentity,
    internalReason: "D2 agreement readiness prepare",
    confirmation: true,
    idempotencyKey: "aap-key-12345678",
    proposedPlanKey: "!!!",
  }).ok,
  false,
);

assert.match(createAgreementApprovalIdempotencyKey(), /^aap-/);

const catalog = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    key: "business",
    name: "Business",
    description: null,
    planType: "business",
    billingCycle: "monthly",
    amountMinor: 10000,
    currency: "NOK",
    trialDays: null,
    active: true,
    supportsLifetime: true,
    supportsRecurring: true,
    supportsTrial: false,
  },
];

const plan = buildAgreementApprovalPreparePlan({
  creation: {
    organizationNumber: "937978960",
    legalName: "Example Bedrift AS",
    displayName: "Example Bedrift",
    slug: "example-bedrift-d2",
    country: "NO",
    verificationSource: "operator",
  },
  registryRows: [],
  commercialPlans: catalog,
  internalReason: "prepare only",
  idempotencyKey: "aap-plan-12345678",
  proposedPlanKey: "business",
  adminProvisionAllowlistEmpty: true,
  bedriftActivateAllowlistEmpty: true,
});

assert.equal(plan.dryRun, true);
assert.equal(plan.mode, "prepare");
assert.equal(plan.readyToExecute, false);
assert.equal(plan.readinessStatus, "AGREEMENT_UNVERIFIED");
assert.equal(plan.readyForOwnerDecision, true);
assert.equal(plan.agreement.verificationStatus, "AGREEMENT_UNVERIFIED");
assert.equal(plan.agreement.independentlyVerifiableEvidence, false);
assert.equal(plan.agreement.sourceConnected, false);
assert.equal(plan.agreement.proposedPlanKey, "business");
assert.equal(plan.sideEffects.createsCustomer, false);
assert.equal(plan.sideEffects.writesAgreement, false);
assert.equal(plan.sideEffects.writesLegalAcceptance, false);
assert.equal(plan.sideEffects.setsCommercialPlan, false);
assert.equal(plan.sideEffects.grantsKompisBedrift, false);
assert.equal(plan.sideEffects.mutatesUnoNight, false);
assert.equal(plan.productSeparation.noPayment, true);
assert.ok(plan.executeBlockedReasons.includes("agreement_execute_not_enabled"));
assert.ok(
  plan.executeBlockedReasons.includes(
    "platform_customer_legal_acceptance_source_missing",
  ),
);
assert.equal(plan.priorGatesIntact.d1CreateExecuteEnabled, false);
assert.equal(plan.priorGatesIntact.d1CreateOwnerAllowlistEmpty, true);
assert.equal(plan.priorGatesIntact.d3AdminProvisionAllowlistEmpty, true);
assert.equal(plan.priorGatesIntact.d4BedriftActivateAllowlistEmpty, true);
assert.equal(plan.ownerDecisionPacket.legalEntity, "UNKNOWN_REQUIRES_OWNER");

const missingIdentity = buildAgreementApprovalPreparePlan({
  creation: {
    organizationNumber: "",
    legalName: "",
    displayName: "",
    slug: "",
    country: "NO",
    verificationSource: "operator",
  },
  registryRows: [],
  commercialPlans: catalog,
  internalReason: "prepare only",
  idempotencyKey: "aap-plan-missing01",
  proposedPlanKey: null,
  adminProvisionAllowlistEmpty: true,
  bedriftActivateAllowlistEmpty: true,
});
assert.equal(missingIdentity.readinessStatus, "NOT_FOUND");
assert.equal(missingIdentity.readyForOwnerDecision, false);

const duplicate = buildAgreementApprovalPreparePlan({
  creation: plan.candidateIdentity,
  registryRows: [
    {
      customerId: "dup",
      organizationNumber: "937978960",
      organizationSlug: "example-bedrift-d2",
    },
  ],
  commercialPlans: catalog,
  internalReason: "prepare only",
  idempotencyKey: "aap-plan-dup00001",
  proposedPlanKey: null,
  adminProvisionAllowlistEmpty: true,
  bedriftActivateAllowlistEmpty: true,
});
assert.equal(duplicate.readyForOwnerDecision, false);
assert.ok(duplicate.missingConditions.includes("registry_scan_conflict_advisory"));

const badPlan = buildAgreementApprovalPreparePlan({
  creation: plan.candidateIdentity,
  registryRows: [],
  commercialPlans: catalog,
  internalReason: "prepare only",
  idempotencyKey: "aap-plan-badplan01",
  proposedPlanKey: "does-not-exist",
  adminProvisionAllowlistEmpty: true,
  bedriftActivateAllowlistEmpty: true,
});
assert.equal(badPlan.readyForOwnerDecision, false);
assert.ok(
  badPlan.blockReasons.some(
    (reason) =>
      reason.code === "proposed_plan_resolves_when_provided" && !reason.satisfied,
  ),
);

assert.equal(mapAgreementApprovalPrepareError("agreement_execute_not_enabled").status, 403);
assert.equal(
  mapAgreementApprovalPrepareError("owner_agreement_authorization_required").status,
  403,
);
assert.equal(mapAgreementApprovalPrepareError("agreement_unverified").status, 403);
assert.equal(mapAgreementApprovalPrepareError("unauthorized").status, 401);

const route = readFileSync(
  "app/api/platform-portal/customers/agreement-approval/prepare/route.ts",
  "utf8",
);
assert.match(route, /get_platform_portal_customers/);
assert.match(route, /get_platform_portal_commercial_plans/);
assert.match(route, /agreement_execute_not_enabled/);
assert.match(route, /owner_agreement_authorization_required/);
assert.match(route, /no-store/);
assert.doesNotMatch(
  route,
  /rpc\(\s*["']create_platform_portal_customer["']/,
);
assert.doesNotMatch(
  route,
  /rpc\(\s*["']set_platform_portal_customer_commercial_plan["']/,
);
assert.doesNotMatch(route, /\.auth\.admin\b/);
assert.doesNotMatch(route, /rpc\(\s*["']invite_organization_user["']/);
assert.ok(assertNoHardcodedAgreementTestTarget(route));

const lib = readFileSync(
  "lib/platform-portal/agreement-approval-prepare.ts",
  "utf8",
);
assert.match(lib, /AGREEMENT_APPROVAL_EXECUTE_OWNER_ALLOWLIST[\s\S]*new Set\(\)/);
assert.match(lib, /AGREEMENT_APPROVAL_EXECUTE_ENABLED = false/);
assert.match(lib, /PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_SOURCE_CONNECTED = false/);
assert.match(lib, /readyToExecute: false/);
assert.match(
  lib,
  /AgreementApprovalReadinessStatus[\s\S]*"NOT_FOUND"[\s\S]*"NEEDS_REVIEW"[\s\S]*"READY_FOR_OWNER_DECISION"[\s\S]*"AGREEMENT_UNVERIFIED"/,
);
assert.ok(assertNoHardcodedAgreementTestTarget(lib));

const panel = readFileSync(
  "components/platform/platform-portal/PlatformPortalCustomerCreationPanel.tsx",
  "utf8",
);
assert.match(panel, /\/api\/platform-portal\/customers\/agreement-approval\/prepare/);
assert.match(panel, /mode:\s*["']prepare["']/);
assert.match(panel, /agreementExecuteLocked/);
assert.doesNotMatch(panel, /mode:\s*["']execute["']/);
assert.ok(assertNoHardcodedAgreementTestTarget(panel));

// Prior gates must remain fail-closed
const d1Route = readFileSync(
  "app/api/platform-portal/customers/prepare/route.ts",
  "utf8",
);
assert.match(d1Route, /create_execute_not_enabled/);
const admin = readFileSync("lib/platform-portal/admin-provisioning.ts", "utf8");
assert.match(admin, /ADMIN_PROVISION_OWNER_ALLOWLIST[\s\S]*new Set\(\)/);
const bedrift = readFileSync(
  "lib/platform-portal/kompis-bedrift-activation.ts",
  "utf8",
);
assert.match(
  bedrift,
  /KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST[\s\S]*new Set\(\)/,
);

const agreementKeys = [
  "agreementSectionTitle",
  "agreementSectionBody",
  "agreementPrepareAction",
  "agreementPrepareRunning",
  "agreementReason",
  "agreementProposedPlanKey",
  "agreementProposedPlanKeyHelp",
  "agreementStatusNotFound",
  "agreementStatusNeedsReview",
  "agreementStatusReadyForOwnerDecision",
  "agreementStatusUnverified",
  "agreementReadyToExecuteNever",
  "agreementSideEffectsNone",
  "agreementLegalSourceMissing",
  "agreementCommercialCatalogNote",
  "agreementOwnerPacketTitle",
  "agreementExecuteLocked",
  "agreementExecuteUnavailable",
] as const;

for (const locale of ["en", "no", "da", "sv", "pl", "uk", "es"]) {
  const creation = JSON.parse(readFileSync(`locales/${locale}/platform.json`, "utf8"))
    .customers.creation;
  for (const key of agreementKeys) {
    assert.ok(creation[key], `${locale}.${key}`);
  }
  assert.ok(assertNoHardcodedAgreementTestTarget(JSON.stringify(creation)), locale);
}

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

console.log("agreement-approval-prepare: all tests passed");
