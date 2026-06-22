import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  COMPANION_VERIFICATION_AUDIT,
  COMPANION_VERIFICATION_AUTO_APPROVE,
  COMPANION_VERIFICATION_CORE,
  COMPANION_VERIFICATION_DOCUMENTS,
  COMPANION_VERIFICATION_PII_DEFAULT,
  COMPANION_VERIFICATION_READ_ONLY,
  companionVerificationPolicyMetadata,
} from "@/lib/companion-runtime/companion-verification-policy";
import { COMPANION_COVERAGE_LOCALES } from "@/lib/companion-runtime/companion-foundation-coverage-i18n";
import { buildCompanionFoundationCoverageRegistry } from "@/lib/companion-runtime/companion-foundation-coverage-registry";
import {
  listVerificationAuditEvents,
  resetVerificationAuditLogForTests,
} from "@/lib/companion-runtime/verification-audit";
import {
  buildVerificationCommandBriefSignals,
  executeVerificationCaseRead,
  executeVerificationQueueRead,
  type VerificationProviderReader,
} from "@/lib/companion-runtime/verification-read-orchestrator";
import {
  collectVerificationDescriptorsFromManifests,
  resolveVerificationSemanticIntent,
} from "@/lib/companion-runtime/verification-semantic-intent";
import { VERIFICATION_OUTCOME_I18N_KEYS } from "@/lib/integration-intelligence/verification/outcomes";
import {
  maskVerificationSubjectReference,
  stripForbiddenVerificationFields,
} from "@/lib/integration-intelligence/verification/masking";
import { normalizeVerificationStatus } from "@/lib/integration-intelligence/verification/status-normalization";
import { isVerificationCapabilityBlocked } from "@/lib/integration-intelligence/verification/types";
import { UNONIGHT_COMMUNITY_ADAPTER_MANIFEST } from "@/lib/unonight/provider-adapter/manifest";
import {
  UNONIGHT_MEMBER_VERIFICATION_CONTRACT,
  buildUnonightVerificationCasesFromProxy,
  buildUnonightVerificationQueueSummary,
  findUnonightVerificationCaseById,
} from "@/lib/unonight/provider-adapter/verification-queue-contract";
import { UNONIGHT_VERIFICATION_SOURCE_MAP } from "@/lib/unonight/provider-adapter/verification-source-map";

const repoRoot = path.join(import.meta.dirname, "..", "..", "..", "..");
const ORG_A = "org-verification-a";
const ORG_B = "org-verification-b";

const proxyRows = [
  {
    practice_key: "verify_case_1",
    title: "Ola Nordmann",
    moderation_status: "pending",
    status_key: "needs_information",
    practice_type: "member",
  },
  {
    practice_key: "verify_case_2",
    title: "Kari Hansen",
    moderation_status: "pending",
    status_key: "high_priority",
    practice_type: "member",
  },
  {
    practice_key: "verify_case_3",
    title: "Approved Member",
    moderation_status: "approved",
    status_key: "approved",
    practice_type: "member",
  },
];

const fetchedAt = new Date().toISOString();
const sourceReference = "rpc:get_customer_community_network_center:best_practices";

const queueSummary = buildUnonightVerificationQueueSummary({
  rows: proxyRows,
  organization_id: ORG_A,
  source_reference: sourceReference,
  fetched_at: fetchedAt,
});

const proxyCases = buildUnonightVerificationCasesFromProxy({
  rows: proxyRows,
  organization_id: ORG_A,
  source_reference: sourceReference,
  fetched_at: fetchedAt,
});

const testProvider: VerificationProviderReader = {
  provider_key: "unonight_community_adapter",
  active: true,
  read_queue: async () => ({
    queue: queueSummary,
    cases: proxyCases,
    limitations: [
      "Queue summary uses community metadata proxy until dedicated Unonight verification queue RPC is approved.",
    ],
  }),
  read_case: async (caseId) => ({
    case_summary: findUnonightVerificationCaseById({
      rows: proxyRows,
      case_id: caseId,
      organization_id: ORG_A,
      source_reference: sourceReference,
      fetched_at: fetchedAt,
    }),
    limitations: ["Case lookup uses metadata-only proxy records."],
  }),
};

assert.equal(companionVerificationPolicyMetadata().read_only, COMPANION_VERIFICATION_READ_ONLY);
assert.equal(COMPANION_VERIFICATION_CORE, "provider_agnostic");
assert.equal(COMPANION_VERIFICATION_PII_DEFAULT, "masked");
assert.equal(COMPANION_VERIFICATION_AUDIT, "required");
assert.equal(COMPANION_VERIFICATION_DOCUMENTS, "forbidden");
assert.equal(COMPANION_VERIFICATION_AUTO_APPROVE, "forbidden");
assert.equal(isVerificationCapabilityBlocked("verification_review.create"), true);

assert.equal(normalizeVerificationStatus("pending"), "pending");
assert.equal(normalizeVerificationStatus("review_required"), "in_review");
assert.equal(normalizeVerificationStatus("needs_information"), "needs_information");
assert.equal(normalizeVerificationStatus("approved"), "approved");
assert.equal(normalizeVerificationStatus("rejected"), "rejected");

assert.ok(maskVerificationSubjectReference("Ola Nordmann").includes("*"));
assert.ok(!maskVerificationSubjectReference("Ola Nordmann").includes("Nordmann"));

const sanitized = stripForbiddenVerificationFields({
  case_id: "verify_case_1",
  document_url: "secret",
  id_number: "12345678901",
  status: "pending",
});
assert.equal(sanitized.document_url, undefined);
assert.equal(sanitized.id_number, undefined);
assert.equal(sanitized.status, "pending");

assert.equal(queueSummary.total_pending, 2);
assert.equal(queueSummary.needs_information, 1);
assert.equal(queueSummary.high_priority, 1);
assert.equal(queueSummary.completeness, "partial");

const descriptors = collectVerificationDescriptorsFromManifests([UNONIGHT_COMMUNITY_ADAPTER_MANIFEST]);
assert.ok(descriptors.some((entry) => entry.capability_key === "verification_queue.read"));

const queueIntent = resolveVerificationSemanticIntent({
  query: "Hvor mange venter i verifiseringsko?",
  locale: "no",
  descriptors,
});
assert.equal(queueIntent.capability_key, "verification_queue.read");

const needsInfoIntent = resolveVerificationSemanticIntent({
  query: "Er det noen som mangler informasjon?",
  locale: "no",
  descriptors,
});
assert.equal(needsInfoIntent.metric, "needs_information");

const caseIntent = resolveVerificationSemanticIntent({
  query: "Vis saken verify_case_1",
  locale: "no",
  descriptors,
});
assert.equal(caseIntent.capability_key, "verification_case.read");
assert.equal(caseIntent.case_id, "verify_case_1");

resetVerificationAuditLogForTests();

async function runPhase35AsyncTests() {
  const permission = {
    organization_id: ORG_A,
    tenant_id: ORG_A,
    user_role: "owner",
    app_suspended: false,
    provider_active: true,
    can_view_queue: true,
    can_view_case: true,
    rate_limit_ok: true,
  };

  const queueResult = await executeVerificationQueueRead({
    organization_id: ORG_A,
    tenant_id: ORG_A,
    user_role: "owner",
    permission,
    providers: [testProvider],
  });
  assert.equal(queueResult.outcome, "partial_result");
  assert.ok(queueResult.queue);
  assert.equal(queueResult.queue?.total_pending, 2);
  assert.ok(queueResult.audit_id);
  assert.ok(queueResult.cases.every((entry) => entry.subject_reference.includes("*")));

  const caseResult = await executeVerificationCaseRead({
    organization_id: ORG_A,
    tenant_id: ORG_A,
    user_role: "owner",
    case_id: "verify_case_1",
    permission,
    providers: [testProvider],
  });
  assert.equal(caseResult.outcome, "partial_result");
  assert.equal(caseResult.case_summary?.case_id, "verify_case_1");
  assert.ok(caseResult.case_summary?.missing_requirements.length);

  const denied = await executeVerificationQueueRead({
    organization_id: ORG_A,
    tenant_id: ORG_A,
    user_role: "staff",
    permission: { ...permission, can_view_queue: false },
    providers: [testProvider],
  });
  assert.equal(denied.outcome, "permission_denied");

  const suspended = await executeVerificationQueueRead({
    organization_id: ORG_A,
    tenant_id: ORG_A,
    user_role: "owner",
    permission: { ...permission, app_suspended: true },
    providers: [testProvider],
  });
  assert.equal(suspended.outcome, "activation_pending");

  const crossTenant = await executeVerificationQueueRead({
    organization_id: ORG_B,
    tenant_id: ORG_B,
    user_role: "owner",
    permission,
    providers: [testProvider],
  });
  assert.equal(crossTenant.outcome, "permission_denied");

  const emptyProvider: VerificationProviderReader = {
    provider_key: "missing",
    active: false,
    read_queue: async () => ({ queue: null, cases: [], limitations: [] }),
    read_case: async () => ({ case_summary: null, limitations: [] }),
  };
  const providerMissing = await executeVerificationQueueRead({
    organization_id: ORG_A,
    tenant_id: ORG_A,
    user_role: "owner",
    permission,
    providers: [emptyProvider],
  });
  assert.equal(providerMissing.outcome, "provider_missing");

  const audit = listVerificationAuditEvents(ORG_A);
  assert.ok(audit.length > 0);
  const auditPayload = JSON.stringify(audit);
  assert.doesNotMatch(auditPayload, /Ola Nordmann/);
  assert.doesNotMatch(auditPayload, /document_url/);

  const briefExact = buildVerificationCommandBriefSignals({
    queue: queueSummary,
    source_exact: true,
  });
  assert.ok(briefExact.some((signal) => signal.signal_key === "pending_verification"));
  assert.ok(briefExact.some((signal) => signal.signal_key === "verification_needs_information"));

  const briefPartial = buildVerificationCommandBriefSignals({
    queue: queueSummary,
    source_exact: false,
  });
  assert.equal(briefPartial.length, 0);
}

runPhase35AsyncTests()
  .then(() => {
    const coverage = buildCompanionFoundationCoverageRegistry();
    assert.ok(coverage.some((entry) => entry.module_id === "verification.queue_read"));
    assert.ok(coverage.some((entry) => entry.module_id === "verification.case_read"));
    assert.equal(coverage.find((entry) => entry.module_id === "verification.queue_read")?.readiness, "connected_but_partial");
    assert.notEqual(UNONIGHT_MEMBER_VERIFICATION_CONTRACT.readiness.verification_queue, "production_ready");
    assert.equal(UNONIGHT_MEMBER_VERIFICATION_CONTRACT.document_exposure_blocked, true);

    const coreSources = [
      "lib/companion-runtime/verification-read-orchestrator.ts",
      "lib/companion-runtime/verification-semantic-intent.ts",
      "lib/integration-intelligence/verification/types.ts",
    ].map((file) => fs.readFileSync(path.join(repoRoot, file), "utf8"));
    for (const source of coreSources) {
      assert.doesNotMatch(source, /practice_key/i);
      assert.doesNotMatch(source, /best_practices/i);
      assert.doesNotMatch(source, /unonight_member_id/i);
    }

    const adapterSource = fs.readFileSync(
      path.join(repoRoot, "lib/unonight/provider-adapter/verification-queue-contract.ts"),
      "utf8",
    );
    assert.match(adapterSource, /mapUnonightVerificationProxyRow/);
    assert.ok(UNONIGHT_VERIFICATION_SOURCE_MAP.length >= 3);

    for (const locale of COMPANION_COVERAGE_LOCALES) {
      const dict = JSON.parse(
        fs.readFileSync(path.join(repoRoot, `locales/${locale}/customer-app/companionPlatformKnowledge.json`), "utf8"),
      );
      const verification = dict.companionPlatformKnowledge.verification;
      assert.ok(verification?.outcomes?.exactMatch, `${locale} verification outcomes`);
      assert.ok(verification?.status?.pending, `${locale} verification status`);
      assert.ok(verification?.masking?.subject, `${locale} verification masking`);
    }

    for (const key of Object.values(VERIFICATION_OUTCOME_I18N_KEYS)) {
      assert.ok(key.startsWith("customerApp.companionPlatformKnowledge.verification."), key);
    }

    console.log("phase35.test.ts: all assertions passed");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
