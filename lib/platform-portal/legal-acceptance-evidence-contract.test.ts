import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  AGREEMENT_APPROVAL_EXECUTE_ENABLED,
  AGREEMENT_APPROVAL_EXECUTE_OWNER_ALLOWLIST,
  buildAgreementApprovalPreparePlan,
} from "./agreement-approval-prepare";
import {
  PLATFORM_CUSTOMER_AGREEMENT_IDENTITY_UNKNOWN,
  PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_EVIDENCE_CONTRACT_ID,
  PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_SOURCE_CONNECTED,
  assertNoLegalAcceptanceSideEffects,
  denyMismatchedLegalAcceptanceClaim,
  probePlatformCustomerLegalAcceptanceEvidence,
  rejectIneligibleLegalEvidenceProxy,
  validateClaimedLegalAcceptanceEvidence,
} from "./legal-acceptance-evidence-contract";

assert.equal(PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_SOURCE_CONNECTED, false);
assert.equal(AGREEMENT_APPROVAL_EXECUTE_ENABLED, false);
assert.equal(AGREEMENT_APPROVAL_EXECUTE_OWNER_ALLOWLIST.size, 0);

const missing = probePlatformCustomerLegalAcceptanceEvidence({
  candidateOrganizationNumber: null,
  candidateSlug: null,
});
assert.equal(missing.verificationStatus, "AGREEMENT_UNVERIFIED");
assert.equal(missing.sourceConnected, false);
assert.equal(missing.evidence, null);
assert.equal(missing.independentlyVerifiableEvidence, false);
assert.equal(missing.canExecute, false);
assert.equal(missing.canActivate, false);
assert.equal(missing.canCreateCustomer, false);
assert.equal(missing.canAcceptOnBehalf, false);
assert.equal(
  missing.contractId,
  PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_EVIDENCE_CONTRACT_ID,
);
assert.equal(
  missing.agreementIdentity,
  PLATFORM_CUSTOMER_AGREEMENT_IDENTITY_UNKNOWN,
);
assert.ok(
  missing.denialCodes.includes(
    "platform_customer_legal_acceptance_source_missing",
  ),
);
assert.ok(assertNoLegalAcceptanceSideEffects(missing));

const forged = denyMismatchedLegalAcceptanceClaim({
  claimed: {
    actorId: "forged-actor",
    customerLegalEntityId: "937978960",
    agreementId: "msa-1",
    agreementVersion: "v1",
    agreementContentHash: "a".repeat(64),
    acceptanceAction: "accept",
    acceptedAtUtc: "2026-10-14T12:00:00.000Z",
    ipAddress: null,
    userAgent: null,
    auditRecordId: "audit-1",
  },
  expectedCustomerLegalEntityId: "937978960",
  expectedActorId: "real-actor",
  expectedAgreementVersion: "v1",
});
assert.equal(forged.denied, true);
assert.ok(forged.denialCodes.includes("forged_or_mismatched_actor"));
assert.ok(forged.rejectedSources.includes("forged_or_mismatched_actor"));

const wrongCustomer = denyMismatchedLegalAcceptanceClaim({
  claimed: {
    actorId: "actor-1",
    customerLegalEntityId: "other-org",
    agreementId: "msa-1",
    agreementVersion: "v1",
    agreementContentHash: "b".repeat(64),
    acceptanceAction: "accept",
    acceptedAtUtc: "2026-10-14T12:00:00.000Z",
    ipAddress: null,
    userAgent: null,
    auditRecordId: "audit-2",
  },
  expectedCustomerLegalEntityId: "937978960",
  expectedActorId: "actor-1",
  expectedAgreementVersion: "v1",
});
assert.ok(wrongCustomer.denialCodes.includes("mismatched_customer_entity"));

const badVersion = denyMismatchedLegalAcceptanceClaim({
  claimed: {
    actorId: "actor-1",
    customerLegalEntityId: "937978960",
    agreementId: "msa-1",
    agreementVersion: PLATFORM_CUSTOMER_AGREEMENT_IDENTITY_UNKNOWN,
    agreementContentHash: "c".repeat(64),
    acceptanceAction: "accept",
    acceptedAtUtc: "2026-10-14T12:00:00.000Z",
    ipAddress: null,
    userAgent: null,
    auditRecordId: "audit-3",
  },
  expectedCustomerLegalEntityId: "937978960",
  expectedActorId: "actor-1",
  expectedAgreementVersion: "approved-v1",
});
assert.ok(badVersion.denialCodes.includes("unverified_agreement_version"));

const unrelated = denyMismatchedLegalAcceptanceClaim({
  claimed: {
    actorId: "actor-1",
    customerLegalEntityId: "tenant-unrelated",
    agreementId: "msa-1",
    agreementVersion: "v1",
    agreementContentHash: "d".repeat(64),
    acceptanceAction: "accept",
    acceptedAtUtc: "2026-10-14T12:00:00.000Z",
    ipAddress: null,
    userAgent: null,
    auditRecordId: "audit-4",
  },
  expectedCustomerLegalEntityId: "937978960",
  expectedActorId: "actor-1",
  expectedAgreementVersion: "v1",
  unrelatedTenantId: "tenant-unrelated",
});
assert.ok(unrelated.denialCodes.includes("unrelated_tenant"));

const duplicate = rejectIneligibleLegalEvidenceProxy("duplicate_acceptance_event");
assert.equal(duplicate.accepted, false);
assert.equal(duplicate.denialCode, "duplicate_acceptance_event");

for (const proxy of [
  "subscriptions_overview",
  "business_pack_legal_acceptances",
  "growth_partner_agreements",
  "registration_terms_checkbox",
  "operator_audit",
] as const) {
  const rejected = rejectIneligibleLegalEvidenceProxy(proxy);
  assert.equal(rejected.accepted, false);
  assert.equal(rejected.denialCode, "ineligible_proxy_source");
}

const claimedProbe = probePlatformCustomerLegalAcceptanceEvidence({
  candidateOrganizationNumber: "937978960",
  candidateSlug: "example-bedrift-d2b",
  claimedEvidence: {
    actorId: "actor-1",
    customerLegalEntityId: "937978960",
    agreementId: "msa-1",
    agreementVersion: "v1",
    agreementContentHash: "e".repeat(64),
    acceptanceAction: "accept",
    acceptedAtUtc: "2026-10-14T12:00:00.000Z",
    ipAddress: "203.0.113.10",
    userAgent: "TestAgent/1.0",
    auditRecordId: "audit-5",
  },
  offeredProxySources: ["subscriptions_overview", "duplicate_acceptance_event"],
});
assert.equal(claimedProbe.evidence, null);
assert.equal(claimedProbe.verificationStatus, "AGREEMENT_UNVERIFIED");
assert.ok(claimedProbe.rejectedSources.includes("claimed_without_source"));
assert.ok(claimedProbe.rejectedSources.includes("subscriptions_overview"));
assert.ok(claimedProbe.rejectedSources.includes("duplicate_acceptance_event"));
assert.ok(
  claimedProbe.denialCodes.includes(
    "platform_customer_legal_acceptance_source_missing",
  ),
);
assert.ok(assertNoLegalAcceptanceSideEffects(claimedProbe));

const incomplete = validateClaimedLegalAcceptanceEvidence({
  actorId: "only-actor",
});
assert.equal(incomplete.ok, false);
assert.ok(incomplete.denialCodes.includes("missing_required_evidence_fields"));

const plan = buildAgreementApprovalPreparePlan({
  creation: {
    organizationNumber: "937978960",
    legalName: "Example Bedrift AS",
    displayName: "Example Bedrift",
    slug: "example-bedrift-d2b",
    country: "NO",
    verificationSource: "operator",
  },
  registryRows: [],
  commercialPlans: [
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
  ],
  internalReason: "D2B evidence contract prepare",
  idempotencyKey: "aap-d2b-evidence01",
  proposedPlanKey: null,
  adminProvisionAllowlistEmpty: true,
  bedriftActivateAllowlistEmpty: true,
});

assert.equal(plan.readinessStatus, "AGREEMENT_UNVERIFIED");
assert.equal(plan.readyToExecute, false);
assert.equal(plan.evidenceProbe.verificationStatus, "AGREEMENT_UNVERIFIED");
assert.equal(plan.evidenceProbe.evidence, null);
assert.equal(plan.evidenceProbe.canExecute, false);
assert.equal(plan.evidenceProbe.canCreateCustomer, false);
assert.equal(plan.sideEffects.writesLegalAcceptance, false);
assert.ok(assertNoLegalAcceptanceSideEffects(plan.evidenceProbe));

const route = readFileSync(
  "app/api/platform-portal/customers/agreement-approval/prepare/route.ts",
  "utf8",
);
assert.match(route, /agreement_execute_not_enabled/);
assert.doesNotMatch(route, /writesLegalAcceptance:\s*true/);
assert.doesNotMatch(route, /accept_on_behalf|acceptOnBehalf/i);

const contractLib = readFileSync(
  "lib/platform-portal/legal-acceptance-evidence-contract.ts",
  "utf8",
);
assert.match(
  contractLib,
  /PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_SOURCE_CONNECTED = false/,
);
assert.doesNotMatch(contractLib, /unonight/i);
assert.doesNotMatch(contractLib, /admin@aipify\.tech/i);

const evidenceKeys = [
  "evidenceContractTitle",
  "evidenceContractBody",
  "evidenceSourceDisconnected",
  "evidenceRejectedSourcesNote",
  "evidenceRequiredFields",
  "evidenceNoExecute",
] as const;

for (const locale of ["en", "no", "sv", "da", "pl", "uk", "es"]) {
  const creation = JSON.parse(readFileSync(`locales/${locale}/platform.json`, "utf8"))
    .customers.creation as Record<string, string>;
  for (const key of evidenceKeys) {
    assert.ok(creation[key], `${locale}.${key}`);
    assert.notEqual(creation[key].trim(), "", `${locale}.${key} empty`);
  }
  if (locale !== "en") {
    assert.notEqual(
      creation.evidenceContractTitle,
      "Legal acceptance evidence contract (D2B)",
      `${locale} evidenceContractTitle still English`,
    );
  }
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

const draft = readFileSync(
  "docs/platform/NOT_APPLIED_platform_customer_legal_acceptance_evidence_contract_v1.sql",
  "utf8",
);
assert.match(draft, /NOT_APPLIED/);
assert.match(draft, /platform_customer_legal_acceptance/);
assert.doesNotMatch(draft, /unonight/i);

console.log("legal-acceptance-evidence-contract: all tests passed");
