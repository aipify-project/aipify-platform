import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { Translator } from "@/lib/i18n/translate";
import type { SupportPermissionContext } from "@/lib/integration-intelligence/support/permissions";
import type { SupportSemanticIntent } from "@/lib/companion-runtime/support-semantic-intent";
import type { SupportWriteRequest, SupportWriteResult } from "@/lib/companion-runtime/support-write-orchestrator";
import type { SupportAssignApprovalRequest } from "@/lib/companion-runtime/support-approval-bridge";
import {
  buildSupportAssignIdempotencyKey,
  isClearSupportAssignIntent,
  parseExplicitSupportAssignCommand,
  produceSupportProposalTurn,
  type SupportProposalReadContext,
} from "@/lib/companion-runtime/support-proposal-turn-producer";

const OUTCOME_BASE = "customerApp.companionPlatformKnowledge.support.outcomes";
const SOURCE_LABEL_KEY = "customerApp.companionPlatformKnowledge.support.sourceLabel";

const CASE_ID = "a1b2c3d4-e5f6-4789-a012-3456789abcde";
const ASSIGNEE_ID = "b2c3d4e5-f6a7-4890-b123-4567890abcde";
const ACTION_REQUEST_ID = "c1d2e3f4-a5b6-4789-a012-3456789abcde";
const NIL_UUID = "00000000-0000-0000-0000-000000000000";
const ORG_ID = "org-support-proposal";

const supabaseStub = {} as SupabaseClient;

const TRANSLATIONS: Record<string, string> = {
  [`${OUTCOME_BASE}.multipleMatches`]:
    "Provide explicit support case and assignee UUIDs in one message.",
  [`${OUTCOME_BASE}.confirmationRequired`]:
    "Resend the full command with explicit confirmation.",
  [`${OUTCOME_BASE}.approvalRequired`]: "Support assignment requires approval.",
  [`${OUTCOME_BASE}.failed`]: "The support action could not be completed.",
  [`${OUTCOME_BASE}.permissionDenied`]: "Your role cannot assign support cases.",
  [`${OUTCOME_BASE}.providerMissing`]: "No live support provider is connected.",
  [`${OUTCOME_BASE}.executionSourceMissing`]: "The provider write source is not connected.",
  [`${OUTCOME_BASE}.blockedByPolicy`]: "This support operation is blocked.",
  [SOURCE_LABEL_KEY]: "Support operations",
};

const t: Translator = (key) => TRANSLATIONS[key] ?? key;

const permission: SupportPermissionContext = {
  organization_id: ORG_ID,
  tenant_id: ORG_ID,
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

const readContext: SupportProposalReadContext = {
  organization_id: ORG_ID,
  permission,
};

function confirmedIntent(): SupportSemanticIntent {
  return {
    capability_key: "support_case.assign",
    entity: "support_case",
    operation: "assign",
    metric: null,
    case_id: CASE_ID,
    confirmed: true,
    confidence: "high",
    ambiguous: false,
  };
}

function readIntent(): SupportSemanticIntent {
  return {
    capability_key: "support_case.read",
    entity: "support_case",
    operation: "inspect",
    metric: null,
    case_id: CASE_ID,
    confirmed: false,
    confidence: "high",
    ambiguous: false,
  };
}

function unconfirmedIntent(): SupportSemanticIntent {
  return {
    ...confirmedIntent(),
    confirmed: false,
  };
}

function completeAssignQuery(confirmed = true): string {
  const suffix = confirmed ? " Bekreft." : ".";
  return `Tildel sak ${CASE_ID} til bruker ${ASSIGNEE_ID}${suffix}`;
}

function writeResult(
  outcome: SupportWriteResult["outcome"],
  overrides: Partial<SupportWriteResult> = {},
): SupportWriteResult {
  return {
    outcome,
    proposal: null,
    case_id: CASE_ID,
    outcome_key: null,
    audit_id: null,
    action_request_id: null,
    limitations: [],
    ...overrides,
  };
}

function assertProposalAnswer(answer: PlatformKnowledgeAnswer) {
  assert.equal(answer.sourceId, "support-proposal");
  assert.equal(answer.source, "customer_context");
  assert.equal(typeof answer.directAnswer, "string");
  assert.ok(Array.isArray(answer.steps));
  assert.ok(Array.isArray(answer.actions));
  assert.ok(Array.isArray(answer.sources));
}

function assertNoSensitiveFields(value: unknown) {
  const serialized = JSON.stringify(value);
  for (const forbidden of [
    "receipt_id",
    "assignee_user_id",
    "payload_hash",
    "action_request_id",
    "customer@example.com",
    "WRITE_FAILED",
    "permission denied",
    ASSIGNEE_ID,
    CASE_ID,
  ]) {
    assert.equal(serialized.includes(forbidden), false, forbidden);
  }
}

async function runProducer(input: {
  query: string;
  intent?: SupportSemanticIntent;
  writeResult?: SupportWriteResult;
  lookupFound?: boolean;
  recordApproval?: (
    request: SupportAssignApprovalRequest,
  ) => Promise<Awaited<ReturnType<typeof import("@/lib/companion-runtime/support-approval-bridge").recordSupportAssignApprovalActionRequest>>>;
}) {
  let writeCalls = 0;
  let executeWriteCalls = 0;
  let capturedRequest: SupportWriteRequest | null = null;
  let capturedApprovalRequest: SupportAssignApprovalRequest | null = null;

  const result = await produceSupportProposalTurn(
    {
      supabase: supabaseStub,
      query: input.query,
      locale: "no",
      t,
      userRole: "owner",
    },
    {
      resolve_semantic_intent: () => input.intent ?? confirmedIntent(),
      load_read_context: async () => readContext,
      lookup_case: async () => ({
        found: input.lookupFound ?? true,
        case_summary: null,
      }),
      record_assign_approval:
        input.recordApproval ??
        (async (request) => {
          capturedApprovalRequest = request;
          return {
            success: true,
            outcome_code: "SUPPORT_ACTION_REQUESTED",
            action_request_id: ACTION_REQUEST_ID,
            payload_hash: "hash",
            idempotency_key: request.idempotency_key,
            expires_at: "2026-07-01T00:00:00.000Z",
            idempotent_replay: false,
          };
        }),
      execute_support_write: async (writeInput) => {
        writeCalls += 1;
        capturedRequest = writeInput.request;
        if (writeInput.execute_write) {
          executeWriteCalls += 1;
          await writeInput.execute_write();
        }
        if (writeInput.record_assign_approval && writeInput.request.confirmed) {
          const approvalRequest = {
            case_id: writeInput.request.case_id,
            assignee_user_id: writeInput.request.assignee_reference!.trim(),
            idempotency_key: writeInput.request.idempotency_key!.trim(),
          };
          capturedApprovalRequest = approvalRequest;
          await writeInput.record_assign_approval(approvalRequest);
        }
        return (
          input.writeResult ??
          writeResult("approval_required", { action_request_id: ACTION_REQUEST_ID })
        );
      },
    },
  );

  return {
    result,
    writeCalls,
    executeWriteCalls,
    capturedRequest,
    capturedApprovalRequest,
  };
}

async function runTests() {
  {
    const { result, writeCalls } = await runProducer({
      query: "How many open support tickets do we have?",
      intent: {
        capability_key: "support_queue.read",
        entity: "support_queue",
        operation: "count",
        metric: "open_cases",
        case_id: null,
        confirmed: false,
        confidence: "moderate",
        ambiguous: false,
      },
    });
    assert.equal(result.handled, false);
    assert.equal(writeCalls, 0);
  }

  {
    const { result, writeCalls } = await runProducer({
      query: "Tildel sak til bruker. Bekreft.",
      intent: confirmedIntent(),
    });
    assert.equal(result.handled, true);
    assert.equal(writeCalls, 0);
    if (result.handled) {
      assertProposalAnswer(result.answer);
      assert.match(result.answer.directAnswer, /Provide explicit support case/);
    }
  }

  {
    const { result, writeCalls } = await runProducer({
      query: `Tildel sak ${CASE_ID}. Bekreft.`,
      intent: confirmedIntent(),
    });
    assert.equal(result.handled, true);
    assert.equal(writeCalls, 0);
  }

  {
    const { result, writeCalls } = await runProducer({
      query: `Assign case ${CASE_ID} to user ${NIL_UUID}. Confirm.`,
      intent: confirmedIntent(),
    });
    assert.equal(result.handled, true);
    assert.equal(writeCalls, 0);
  }

  {
    const { result, writeCalls } = await runProducer({
      query: `Tildel sak ${CASE_ID} til bruker ${ASSIGNEE_ID}.`,
      intent: unconfirmedIntent(),
      writeResult: writeResult("confirmation_required"),
    });
    assert.equal(writeCalls, 1);
    assert.equal(result.handled, true);
    if (!result.handled) return;
    assert.equal(result.writeResult?.outcome, "confirmation_required");
    assert.equal(result.writeResult?.action_request_id, null);
    assert.equal(result.answer.directAnswer, TRANSLATIONS[`${OUTCOME_BASE}.confirmationRequired`]);
  }

  {
    const { result, writeCalls, capturedRequest, capturedApprovalRequest } = await runProducer({
      query: completeAssignQuery(true),
      intent: confirmedIntent(),
    });
    assert.equal(writeCalls, 1);
    assert.equal(result.handled, true);
    if (!result.handled) return;
    assert.ok(capturedRequest);
    assert.deepEqual(capturedRequest, {
      capability_key: "support_case.assign",
      case_id: CASE_ID,
      draft_text: null,
      assignee_reference: ASSIGNEE_ID,
      escalation_reason: null,
      grounded_sources: [],
      confirmed: true,
      approved: false,
      idempotency_key: buildSupportAssignIdempotencyKey(CASE_ID, ASSIGNEE_ID),
    });
    assert.ok(capturedApprovalRequest);
    assert.deepEqual(capturedApprovalRequest, {
      case_id: CASE_ID,
      assignee_user_id: ASSIGNEE_ID,
      idempotency_key: buildSupportAssignIdempotencyKey(CASE_ID, ASSIGNEE_ID),
    });
    assert.equal(result.writeResult?.outcome, "approval_required");
    assert.equal(result.writeResult?.action_request_id, ACTION_REQUEST_ID);
    assertNoSensitiveFields(result.answer);
  }

  {
    const parsed = parseExplicitSupportAssignCommand(completeAssignQuery(true), readIntent());
    assert.equal(isClearSupportAssignIntent({ query: completeAssignQuery(true), parsed }), true);
    assert.equal(parsed.caseId, CASE_ID);
    assert.equal(parsed.assigneeId, ASSIGNEE_ID);

    const { result, writeCalls } = await runProducer({
      query: completeAssignQuery(true),
      intent: readIntent(),
    });
    assert.equal(writeCalls, 1);
    assert.equal(result.handled, true);
  }

  {
    const { result } = await runProducer({
      query: completeAssignQuery(true),
      writeResult: writeResult("approval_required", { action_request_id: ACTION_REQUEST_ID }),
    });
    assert.equal(result.handled, true);
    if (!result.handled) return;
    assert.equal(result.writeResult?.action_request_id, ACTION_REQUEST_ID);
  }

  {
    const { result } = await runProducer({
      query: completeAssignQuery(true),
      recordApproval: async (request) => ({
        success: true,
        outcome_code: "IDEMPOTENT_REPLAY",
        action_request_id: ACTION_REQUEST_ID,
        payload_hash: "hash",
        idempotency_key: request.idempotency_key,
        expires_at: "2026-07-01T00:00:00.000Z",
        idempotent_replay: true,
      }),
    });
    assert.equal(result.handled, true);
    if (!result.handled) return;
    assert.equal(result.writeResult?.action_request_id, ACTION_REQUEST_ID);
  }

  {
    const { result } = await runProducer({
      query: completeAssignQuery(true),
      writeResult: writeResult("failed"),
    });
    assert.equal(result.handled, true);
    if (!result.handled) return;
    assert.equal(result.writeResult?.action_request_id, null);
    assert.equal(result.answer.directAnswer, TRANSLATIONS[`${OUTCOME_BASE}.failed`]);
  }

  {
    const { executeWriteCalls } = await runProducer({
      query: completeAssignQuery(true),
      writeResult: writeResult("approval_required", { action_request_id: ACTION_REQUEST_ID }),
    });
    assert.equal(executeWriteCalls, 0);
  }

  {
    const { result, writeCalls } = await runProducer({
      query: `Assign case ${CASE_ID} to user ${ASSIGNEE_ID}. Confirm.`,
      intent: readIntent(),
    });
    assert.equal(result.handled, true);
    assert.equal(writeCalls, 1);
  }
}

void runTests()
  .then(() => {
    console.log("support-proposal-turn-producer.test.ts: all assertions passed");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
