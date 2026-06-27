import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { COMPANION_COVERAGE_LOCALES } from "@/lib/companion-runtime/companion-foundation-coverage-i18n";
import { buildCompanionFoundationCoverageRegistry } from "@/lib/companion-runtime/companion-foundation-coverage-registry";
import { collectCommandBriefSignalsFromDomainContexts } from "@/lib/companion-runtime/command-brief-signal-collector";
import { createEmptyCompanionCommunityContext } from "@/lib/companion-runtime/companion-community-context";
import { createEmptyCompanionFinanceContext } from "@/lib/companion-runtime/companion-finance-context";
import { createEmptyCompanionHrContext } from "@/lib/companion-runtime/companion-hr-context";
import { createEmptyCompanionOperationalContext } from "@/lib/companion-runtime/companion-operational-context";
import { createEmptyCompanionProactiveContext } from "@/lib/companion-runtime/companion-proactive-context";
import { createEmptyCompanionSalesContext } from "@/lib/companion-runtime/companion-sales-context";
import { createEmptyCompanionSecurityContext } from "@/lib/companion-runtime/companion-security-context";
import { createEmptyCompanionSupportContext } from "@/lib/companion-runtime/companion-support-context";
import { createEmptyCompanionWarehouseContext } from "@/lib/companion-runtime/companion-warehouse-context";
import { mapAsoDashboardToSupportBundle } from "@/lib/integration-intelligence/providers/support-operations/support-operations-contract";
import { SUPPORT_OPERATIONS_SOURCE_MAP } from "@/lib/integration-intelligence/providers/support-operations/support-source-map";
import {
  normalizeSlaStatus,
  normalizeSupportStatus,
} from "@/lib/integration-intelligence/support/status-normalization";
import { maskSupportCustomerReference } from "@/lib/integration-intelligence/support/masking";
import { isSupportCapabilityBlocked } from "@/lib/integration-intelligence/support/types";
import {
  buildSupportCommandBriefSignals,
  executeSupportCaseRead,
  executeSupportQueueRead,
  type SupportProviderReader,
} from "@/lib/companion-runtime/support-read-orchestrator";
import {
  executeSupportWrite,
  type SupportWriteRequest,
} from "@/lib/companion-runtime/support-write-orchestrator";
import {
  listSupportAuditEvents,
  resetSupportAuditLogForTests,
} from "@/lib/companion-runtime/support-audit";
import { resolveSupportSemanticIntent } from "@/lib/companion-runtime/support-semantic-intent";
import { getCommandBriefCatalogEntry } from "@/lib/integration-intelligence/command-brief/signal-catalog";

const repoRoot = path.join(import.meta.dirname, "..", "..");
const ORG = "org-support-38";

assert.equal(normalizeSupportStatus("pending_approval"), "waiting_for_support");
assert.equal(normalizeSupportStatus("waiting_on_customer"), "waiting_for_customer");
assert.equal(normalizeSlaStatus("unknown_field"), "unavailable");
assert.equal(normalizeSlaStatus("at_risk"), "at_risk");

assert.match(maskSupportCustomerReference("ola@example.com"), /\*\*\*@example\.com/);
assert.equal(isSupportCapabilityBlocked("support_response.send"), true);
assert.equal(isSupportCapabilityBlocked("support_case.close"), true);

const asoPayload = {
  has_customer: true,
  performance: { open_cases: 3 },
  open_cases: [
    {
      id: "case-1",
      subject: "Billing question",
      category: "billing",
      risk_level: "high",
      status: "open",
      created_at: "2026-06-01T08:00:00.000Z",
    },
    {
      id: "case-2",
      subject: "Waiting on customer",
      category: "general",
      risk_level: "low",
      status: "waiting_for_customer",
      created_at: "2026-06-10T08:00:00.000Z",
    },
  ],
  high_risk_cases: [{ id: "case-3", subject: "Escalation", risk_level: "critical", status: "escalated" }],
  approval_queue: [{ id: "case-4", subject: "Draft pending" }],
};

const bundle = mapAsoDashboardToSupportBundle(asoPayload);
assert.equal(bundle.queue?.total_open, 3);
assert.ok(bundle.cases.length >= 3);
assert.equal(bundle.cases.every((entry) => entry.sla_status === "unavailable"), true);
assert.ok(bundle.source_exact);

const briefSignals = buildSupportCommandBriefSignals({
  queue: bundle.queue,
  cases: bundle.cases,
  pending_drafts_count: +2,
  source_exact: true,
});
assert.ok(briefSignals.some((signal) => signal.signal_key === "unresolved_support_case"));
assert.ok(briefSignals.some((signal) => signal.signal_key === "urgent_support_case"));
assert.ok(briefSignals.some((signal) => signal.signal_key === "support_response_draft_ready"));
assert.equal(
  buildSupportCommandBriefSignals({
    queue: bundle.queue,
    cases: bundle.cases,
    pending_drafts_count: 1,
    source_exact: false,
  }).length,
  0,
);

const permission = {
  organization_id: ORG,
  tenant_id: ORG,
  user_role: "owner",
  app_suspended: false,
  provider_active: true,
  can_read_queue: true,
  can_read_cases: true,
  can_read_sla: true,
  can_draft_response: true,
  can_assign_case: true,
  can_escalate_case: true,
  rate_limit_ok: true,
};

const testProvider: SupportProviderReader = {
  provider_key: "autonomous_support_operations",
  active: true,
  read_queue: async () => ({
    queue: bundle.queue,
    cases: bundle.cases,
    source_exact: true,
    limitations: [],
  }),
  read_case: async (caseId) => ({
    case_detail:
      bundle.cases.find((entry) => entry.case_id === caseId)
        ? {
            case_summary: bundle.cases.find((entry) => entry.case_id === caseId)!,
            latest_public_message_summary: null,
            internal_status_summary: null,
            related_customer_reference: "[customer]",
            related_organization_reference: null,
            suggested_knowledge_sources: ["business_dna_knowledge"],
            available_actions: ["support_response.draft"],
          }
        : null,
    limitations: [],
  }),
};

async function runPhase38AsyncTests() {
  resetSupportAuditLogForTests();

  const queueRead = await executeSupportQueueRead({
    organization_id: ORG,
    tenant_id: ORG,
    user_role: "owner",
    permission,
    providers: [testProvider],
  });
  assert.equal(queueRead.outcome, "partial_result");
  assert.ok(queueRead.queue);
  assert.ok(queueRead.cases.length > 0);

  const caseRead = await executeSupportCaseRead({
    organization_id: ORG,
    tenant_id: ORG,
    user_role: "owner",
    case_id: "case-1",
    permission,
    providers: [testProvider],
  });
  assert.equal(caseRead.outcome, "partial_result");
  assert.equal(caseRead.case_detail?.case_summary.case_id, "case-1");

  const draftWrite = await executeSupportWrite({
    organization_id: ORG,
    tenant_id: ORG,
    user_role: "owner",
    permission,
    provider_key: "support_ai_engine",
    provider_write: { write_source_available: false, requires_approval_before_execution: true },
    request: {
      capability_key: "support_response.draft",
      case_id: "case-1",
      draft_text: "Thank you for contacting us. We are reviewing your request.",
      assignee_reference: null,
      escalation_reason: null,
      grounded_sources: ["business_dna_knowledge"],
      confirmed: false,
      approved: false,
      idempotency_key: null,
    } satisfies SupportWriteRequest,
  });
  assert.equal(draftWrite.outcome, "draft_created");
  assert.ok(draftWrite.proposal);
  assert.equal(draftWrite.proposal?.requires_confirmation, true);

  const assignWrite = await executeSupportWrite({
    organization_id: ORG,
    tenant_id: ORG,
    user_role: "owner",
    permission,
    provider_key: "support_ai_engine",
    provider_write: { write_source_available: false, requires_approval_before_execution: true },
    request: {
      capability_key: "support_case.assign",
      case_id: "case-1",
      draft_text: null,
      assignee_reference: "agent-1",
      escalation_reason: null,
      grounded_sources: [],
      confirmed: true,
      approved: false,
      idempotency_key: "assign-1",
    },
  });
  assert.equal(assignWrite.outcome, "execution_source_missing");
  assert.equal(assignWrite.action_request_id, null);

  const assignCaseId = "case-1";
  const assigneeUserId = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
  const assignIdempotencyKey = "support-assign-idem-phase38";
  const assignActionRequestId = "11111111-2222-3333-4444-555555555555";
  const assignProviderWrite = {
    write_source_available: true,
    requires_approval_before_execution: true,
  } as const;
  const assignLookup = async () => ({
    found: true as const,
    case_summary: bundle.cases.find((entry) => entry.case_id === assignCaseId) ?? null,
  });
  const assignRequestBase = {
    capability_key: "support_case.assign" as const,
    case_id: assignCaseId,
    draft_text: null,
    assignee_reference: assigneeUserId,
    escalation_reason: null,
    grounded_sources: [] as const,
    approved: false,
    idempotency_key: assignIdempotencyKey,
  };

  let assignBridgeCalls = 0;
  const unconfirmedAssign = await executeSupportWrite({
    organization_id: ORG,
    tenant_id: ORG,
    user_role: "owner",
    permission,
    provider_key: "support_ai_engine",
    provider_write: assignProviderWrite,
    lookup_case: assignLookup,
    record_assign_approval: async () => {
      assignBridgeCalls += 1;
      return {
        success: true,
        outcome_code: "SUPPORT_ACTION_REQUESTED",
        action_request_id: assignActionRequestId,
        payload_hash: "hash",
        idempotency_key: assignIdempotencyKey,
        expires_at: "2026-07-01T00:00:00.000Z",
        idempotent_replay: false,
      };
    },
    request: {
      ...assignRequestBase,
      confirmed: false,
    },
  });
  assert.equal(unconfirmedAssign.outcome, "confirmation_required");
  assert.equal(unconfirmedAssign.action_request_id, null);
  assert.equal(assignBridgeCalls, 0);

  let executeWriteCalls = 0;
  assignBridgeCalls = 0;
  let capturedBridgeRequest: {
    case_id: string;
    assignee_user_id: string;
    idempotency_key: string;
  } | null = null;

  const confirmedAssign = await executeSupportWrite({
    organization_id: ORG,
    tenant_id: ORG,
    user_role: "owner",
    permission,
    provider_key: "support_ai_engine",
    provider_write: assignProviderWrite,
    lookup_case: assignLookup,
    execute_write: async () => {
      executeWriteCalls += 1;
      return {
        executed: true,
        failure_reason: null,
        verified_after_reread: true,
      };
    },
    record_assign_approval: async (request) => {
      assignBridgeCalls += 1;
      capturedBridgeRequest = request;
      assert.equal(Object.keys(request).sort().join(","), "assignee_user_id,case_id,idempotency_key");
      return {
        success: true,
        outcome_code: "SUPPORT_ACTION_REQUESTED",
        action_request_id: assignActionRequestId,
        payload_hash: "hash",
        idempotency_key: request.idempotency_key,
        expires_at: "2026-07-01T00:00:00.000Z",
        idempotent_replay: false,
      };
    },
    request: {
      ...assignRequestBase,
      confirmed: true,
    },
  });
  assert.equal(confirmedAssign.outcome, "approval_required");
  assert.equal(confirmedAssign.action_request_id, assignActionRequestId);
  assert.equal(assignBridgeCalls, 1);
  assert.equal(executeWriteCalls, 0);
  assert.deepEqual(capturedBridgeRequest, {
    case_id: assignCaseId,
    assignee_user_id: assigneeUserId,
    idempotency_key: assignIdempotencyKey,
  });

  assignBridgeCalls = 0;
  const replayAssign = await executeSupportWrite({
    organization_id: ORG,
    tenant_id: ORG,
    user_role: "owner",
    permission,
    provider_key: "support_ai_engine",
    provider_write: assignProviderWrite,
    lookup_case: assignLookup,
    record_assign_approval: async () => {
      assignBridgeCalls += 1;
      return {
        success: true,
        outcome_code: "IDEMPOTENT_REPLAY",
        action_request_id: assignActionRequestId,
        payload_hash: "hash",
        idempotency_key: assignIdempotencyKey,
        expires_at: "2026-07-01T00:00:00.000Z",
        idempotent_replay: true,
      };
    },
    request: {
      ...assignRequestBase,
      confirmed: true,
    },
  });
  assert.equal(replayAssign.outcome, "approval_required");
  assert.equal(replayAssign.action_request_id, assignActionRequestId);
  assert.equal(assignBridgeCalls, 1);

  const failedAssign = await executeSupportWrite({
    organization_id: ORG,
    tenant_id: ORG,
    user_role: "owner",
    permission,
    provider_key: "support_ai_engine",
    provider_write: assignProviderWrite,
    lookup_case: assignLookup,
    execute_write: async () => {
      executeWriteCalls += 1;
      return { executed: true, failure_reason: null };
    },
    record_assign_approval: async () => ({
      success: false,
      outcome_code: "REQUEST_FAILED",
      action_request_id: null,
      payload_hash: "hash",
      idempotency_key: assignIdempotencyKey,
      expires_at: null,
      idempotent_replay: false,
    }),
    request: {
      ...assignRequestBase,
      confirmed: true,
    },
  });
  assert.equal(failedAssign.outcome, "failed");
  assert.equal(failedAssign.action_request_id, null);
  assert.equal(executeWriteCalls, 0);

  let escalateBridgeCalls = 0;
  const escalateWrite = await executeSupportWrite({
    organization_id: ORG,
    tenant_id: ORG,
    user_role: "owner",
    permission,
    provider_key: "support_ai_engine",
    provider_write: assignProviderWrite,
    lookup_case: assignLookup,
    record_assign_approval: async () => {
      escalateBridgeCalls += 1;
      return {
        success: true,
        outcome_code: "SUPPORT_ACTION_REQUESTED",
        action_request_id: assignActionRequestId,
        payload_hash: "hash",
        idempotency_key: "escalate-idem",
        expires_at: "2026-07-01T00:00:00.000Z",
        idempotent_replay: false,
      };
    },
    request: {
      capability_key: "support_case.escalate",
      case_id: assignCaseId,
      draft_text: null,
      assignee_reference: null,
      escalation_reason: "Needs senior review",
      grounded_sources: [],
      confirmed: true,
      approved: false,
      idempotency_key: "escalate-idem",
    },
  });
  assert.equal(escalateWrite.outcome, "approval_required");
  assert.equal(escalateWrite.action_request_id, null);
  assert.equal(escalateBridgeCalls, 0);

  assert.equal(draftWrite.action_request_id, null);

  const denied = await executeSupportQueueRead({
    organization_id: ORG,
    tenant_id: ORG,
    user_role: "staff",
    permission: { ...permission, can_read_queue: false },
    providers: [testProvider],
  });
  assert.equal(denied.outcome, "permission_denied");

  const crossTenant = await executeSupportQueueRead({
    organization_id: "other-org",
    tenant_id: ORG,
    user_role: "owner",
    permission,
    providers: [testProvider],
  });
  assert.equal(crossTenant.outcome, "permission_denied");

  const audit = listSupportAuditEvents(ORG);
  assert.ok(audit.length > 0);
  const auditPayload = JSON.stringify(audit);
  assert.doesNotMatch(auditPayload, /ola@example\.com/);
  assert.doesNotMatch(auditPayload, /Billing question/);
}

const semanticUrgent = resolveSupportSemanticIntent({
  query: "Har vi noen supportsaker som haster?",
  locale: "no",
});
assert.equal(semanticUrgent.metric, "urgent_cases");
assert.equal(semanticUrgent.capability_key, "support_queue.read");

const semanticUnassigned = resolveSupportSemanticIntent({
  query: "Hvor mange saker står uten ansvarlig?",
  locale: "no",
});
assert.equal(semanticUnassigned.metric, "unassigned_cases");

const semanticDraft = resolveSupportSemanticIntent({
  query: "Lag et svarutkast til case id case-1",
  locale: "no",
});
assert.equal(semanticDraft.operation, "draft");
assert.equal(semanticDraft.case_id, "case-1");

const semanticNewInquiriesPlural = resolveSupportSemanticIntent({
  query: "Er det noen nye henvendelser?",
  locale: "no",
});
assert.equal(semanticNewInquiriesPlural.capability_key, "support_queue.read");
assert.equal(semanticNewInquiriesPlural.operation, "status");
assert.equal(semanticNewInquiriesPlural.metric, "open_cases");
assert.equal(semanticNewInquiriesPlural.confidence, "high");

const semanticNewInquirySingular = resolveSupportSemanticIntent({
  query: "Er det noen ny henvendelse?",
  locale: "no",
});
assert.equal(semanticNewInquirySingular.capability_key, "support_queue.read");
assert.equal(semanticNewInquirySingular.operation, "status");
assert.equal(semanticNewInquirySingular.metric, "open_cases");

const supportContext = createEmptyCompanionSupportContext({
  autonomous_support_enabled: true,
  queue_summary: bundle.queue,
  case_summaries: bundle.cases,
  pending_drafts_count: 2,
  support_source_exact: true,
  command_brief_events_linked: true,
  command_brief_signals: briefSignals,
});

const domainSignals = collectCommandBriefSignalsFromDomainContexts({
  organization_id: ORG,
  contexts: {
    hrContext: createEmptyCompanionHrContext(),
    warehouseContext: createEmptyCompanionWarehouseContext(),
    financeContext: createEmptyCompanionFinanceContext(),
    salesContext: createEmptyCompanionSalesContext(),
    securityContext: createEmptyCompanionSecurityContext(),
    communityContext: createEmptyCompanionCommunityContext(),
    operationalContext: createEmptyCompanionOperationalContext(),
    proactiveContext: createEmptyCompanionProactiveContext(),
    supportContext,
  },
  supportContext,
});
assert.ok(domainSignals.some((signal) => signal.source_module === "support"));

for (const signalKey of [
  "unresolved_support_case",
  "urgent_support_case",
  "support_response_draft_ready",
  "oldest_support_case",
]) {
  assert.ok(getCommandBriefCatalogEntry(signalKey), signalKey);
}

runPhase38AsyncTests()
  .then(() => {
    const coverage = buildCompanionFoundationCoverageRegistry();
    assert.ok(coverage.some((entry) => entry.module_id === "support.queue_read"));
    assert.ok(coverage.some((entry) => entry.module_id === "support.command_brief_signals"));
    assert.notEqual(coverage.find((entry) => entry.module_id === "support.queue_read")?.readiness, "production_ready");

    const coreSources = [
      "lib/companion-runtime/support-read-orchestrator.ts",
      "lib/companion-runtime/support-semantic-intent.ts",
      "lib/integration-intelligence/support/types.ts",
    ].map((file) => fs.readFileSync(path.join(repoRoot, file), "utf8"));
    for (const source of coreSources) {
      assert.doesNotMatch(source, /triage_action/i);
      assert.doesNotMatch(source, /customer_identifier/i);
    }

    assert.ok(SUPPORT_OPERATIONS_SOURCE_MAP.length >= 5);

    for (const locale of COMPANION_COVERAGE_LOCALES) {
      const dict = JSON.parse(
        fs.readFileSync(path.join(repoRoot, `locales/${locale}/customer-app/companionPlatformKnowledge.json`), "utf8"),
      );
      const support = dict.companionPlatformKnowledge.support;
      assert.ok(support.outcomes.exactMatch, locale);
      assert.ok(support.status.open, locale);
      assert.ok(support.sla.unavailable, locale);
      assert.ok(support.commandBrief.unresolvedSupportCase, locale);
      assert.ok(support.warnings.writeExecutionSourceMissing, locale);
    }

    console.log("phase38.test.ts passed");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
