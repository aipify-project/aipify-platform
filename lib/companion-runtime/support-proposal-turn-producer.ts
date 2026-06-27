import type { SupabaseClient } from "@supabase/supabase-js";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import type { UserRole } from "@/lib/tenant/types";
import { parseIdentityPermissionsDashboard } from "@/lib/aipify/identity-permissions/parse";
import { isSupportWriteSourceConnected } from "@/lib/integration-intelligence/providers/support-operations/support-source-map";
import {
  canProposeSupportWrite,
  type SupportPermissionContext,
} from "@/lib/integration-intelligence/support/permissions";
import type { SupportWriteOutcome } from "@/lib/integration-intelligence/support/types";
import { resolveAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import {
  recordSupportAssignApprovalActionRequest,
  SUPPORT_ASSIGN_PROVIDER_KEY,
  type SupportAssignApprovalRequest,
} from "@/lib/companion-runtime/support-approval-bridge";
import {
  executeSupportWrite,
  type SupportCaseLookupResult,
  type SupportWriteRequest,
  type SupportWriteResult,
} from "@/lib/companion-runtime/support-write-orchestrator";
import { createSupportWriteProviderBridge } from "@/lib/companion-runtime/support-write-provider-bridge";
import {
  resolveSupportSemanticIntent,
  type SupportSemanticIntent,
} from "@/lib/companion-runtime/support-semantic-intent";

const OUTCOME_BASE = "customerApp.companionPlatformKnowledge.support.outcomes";
const SOURCE_LABEL_KEY = "customerApp.companionPlatformKnowledge.support.sourceLabel";
const SUPPORT_PROPOSAL_SOURCE_ID = "support-proposal";

const UUID_PATTERN =
  "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const NIL_UUID = "00000000-0000-0000-0000-000000000000";
const CASE_LABEL_PATTERN =
  /\b(?:sak|case|ticket|ärende|sag|caso|sprawa|sprava)\b\s*[:#]?\s*([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
const ASSIGNEE_LABEL_PATTERN =
  /\b(?:bruker|user|employee|agent|ansatt|medarbetare|mitarbeiter|staff)\b\s*[:#]?\s*([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
const ASSIGN_VERB_PATTERN =
  /\b(tildele|assign|tilldela|tildel|asignar|przypisz|признач)\b/i;

export type ProduceSupportProposalTurnInput = {
  supabase: SupabaseClient;
  query: string;
  locale: CustomerActiveLocale;
  t: Translator;
  userRole: UserRole;
  conversationId?: string;
  messages?: readonly import("@/lib/app/companion/types").CompanionChatMessage[];
};

export type SupportProposalReadContext = {
  permission: SupportPermissionContext;
  organization_id: string;
};

export type ProduceSupportProposalTurnDeps = {
  resolve_semantic_intent?: (query: string, locale: CustomerActiveLocale) => SupportSemanticIntent;
  translate?: Translator;
  load_read_context?: (input: ProduceSupportProposalTurnInput) => Promise<SupportProposalReadContext | null>;
  execute_support_write?: (input: Parameters<typeof executeSupportWrite>[0]) => Promise<SupportWriteResult>;
  lookup_case?: (caseId: string) => Promise<SupportCaseLookupResult>;
  record_assign_approval?: (
    request: SupportAssignApprovalRequest,
  ) => Promise<Awaited<ReturnType<typeof recordSupportAssignApprovalActionRequest>>>;
};

export type ProduceSupportProposalTurnResult =
  | { handled: false }
  | {
      handled: true;
      answer: PlatformKnowledgeAnswer;
      writeResult?: Pick<SupportWriteResult, "outcome" | "action_request_id">;
    };

export type ParsedSupportAssignCommand = {
  caseId: string | null;
  assigneeId: string | null;
  confirmed: boolean;
};

function isAppSuspended(subscriptionStatus: string | null): boolean {
  if (!subscriptionStatus) return false;
  return ["paused", "cancelled", "suspended", "inactive"].includes(subscriptionStatus.toLowerCase());
}

export function normalizeSupportAssignUuid(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  if (!trimmed || !new RegExp(`^${UUID_PATTERN}$`, "i").test(trimmed)) {
    return null;
  }
  if (trimmed.toLowerCase() === NIL_UUID) {
    return null;
  }
  return trimmed;
}

export function hasSupportAssignVerb(query: string): boolean {
  return ASSIGN_VERB_PATTERN.test(query);
}

export function parseExplicitSupportAssignCommand(
  query: string,
  intent: SupportSemanticIntent,
): ParsedSupportAssignCommand {
  const caseMatch = query.match(CASE_LABEL_PATTERN);
  const assigneeMatch = query.match(ASSIGNEE_LABEL_PATTERN);

  return {
    caseId: normalizeSupportAssignUuid(caseMatch?.[1] ?? null),
    assigneeId: normalizeSupportAssignUuid(assigneeMatch?.[1] ?? null),
    confirmed: intent.confirmed,
  };
}

export function isClearSupportAssignIntent(input: {
  query: string;
  parsed: ParsedSupportAssignCommand;
}): boolean {
  if (!hasSupportAssignVerb(input.query)) {
    return false;
  }

  return Boolean(input.parsed.caseId && input.parsed.assigneeId);
}

export function hasSupportAssignIntent(query: string, intent: SupportSemanticIntent): boolean {
  if (hasSupportAssignVerb(query)) {
    return true;
  }

  return (
    intent.capability_key === "support_case.assign" &&
    intent.operation === "assign" &&
    intent.confidence !== "low"
  );
}

export function buildSupportAssignIdempotencyKey(caseId: string, assigneeUserId: string): string {
  return `support-assign:${caseId}:${assigneeUserId}`;
}

function buildAssignClarificationMessage(t: Translator): string {
  return [t(`${OUTCOME_BASE}.multipleMatches`), t(`${OUTCOME_BASE}.confirmationRequired`)]
    .filter(Boolean)
    .join(" ");
}

function buildSupportProposalAnswer(input: {
  t: Translator;
  directAnswer: string;
}): PlatformKnowledgeAnswer {
  return {
    directAnswer: input.directAnswer,
    steps: [],
    actions: [],
    sources: [
      {
        id: SUPPORT_PROPOSAL_SOURCE_ID,
        label: input.t(SOURCE_LABEL_KEY),
        kind: "customer_context",
      },
    ],
    sourceId: SUPPORT_PROPOSAL_SOURCE_ID,
    source: "customer_context",
    confidence: "high",
    orgConfirmEligible: false,
    showSupportEscalation: false,
  };
}

function mapSupportProposalWriteResult(input: {
  result: SupportWriteResult;
  t: Translator;
}): PlatformKnowledgeAnswer {
  const { result, t } = input;
  const outcome = result.outcome as SupportWriteOutcome;

  if (outcome === "confirmation_required") {
    return buildSupportProposalAnswer({
      t,
      directAnswer: t(`${OUTCOME_BASE}.confirmationRequired`),
    });
  }

  if (outcome === "approval_required") {
    return buildSupportProposalAnswer({
      t,
      directAnswer: t(`${OUTCOME_BASE}.approvalRequired`),
    });
  }

  if (outcome === "permission_denied") {
    return buildSupportProposalAnswer({
      t,
      directAnswer: t(`${OUTCOME_BASE}.permissionDenied`),
    });
  }

  if (outcome === "provider_missing" || outcome === "activation_pending") {
    return buildSupportProposalAnswer({
      t,
      directAnswer: t(`${OUTCOME_BASE}.providerMissing`),
    });
  }

  if (outcome === "execution_source_missing") {
    return buildSupportProposalAnswer({
      t,
      directAnswer: t(`${OUTCOME_BASE}.executionSourceMissing`),
    });
  }

  if (outcome === "blocked_by_policy") {
    return buildSupportProposalAnswer({
      t,
      directAnswer: t(`${OUTCOME_BASE}.blockedByPolicy`),
    });
  }

  return buildSupportProposalAnswer({
    t,
    directAnswer: t(`${OUTCOME_BASE}.failed`),
  });
}

export async function loadSupportProposalReadContext(
  input: ProduceSupportProposalTurnInput,
): Promise<SupportProposalReadContext | null> {
  const [orgContext, permissionsResult] = await Promise.all([
    resolveAppOrganizationContext(input.supabase),
    input.supabase.rpc("get_identity_permissions_dashboard"),
  ]);

  const organizationId = orgContext.organization_id?.trim() || null;
  const tenantId = orgContext.company_id?.trim() || organizationId;
  if (!organizationId || !tenantId || orgContext.state !== "ready") {
    return null;
  }

  const effectivePermissions = permissionsResult.error
    ? []
    : (parseIdentityPermissionsDashboard(permissionsResult.data)?.user_permissions ?? []);

  const permission: SupportPermissionContext = {
    organization_id: organizationId,
    tenant_id: tenantId,
    user_role: input.userRole,
    app_suspended: isAppSuspended(orgContext.license_status),
    provider_active: true,
    can_read_queue: effectivePermissions.includes("support.view"),
    can_read_cases: effectivePermissions.includes("support.view"),
    can_read_sla: effectivePermissions.includes("support.view"),
    can_draft_response: effectivePermissions.includes("support.reply"),
    can_assign_case: effectivePermissions.includes("support.assign"),
    can_escalate_case: effectivePermissions.includes("support.escalate"),
    rate_limit_ok: true,
  };

  return { permission, organization_id: organizationId };
}

export async function produceSupportProposalTurn(
  input: ProduceSupportProposalTurnInput,
  deps: ProduceSupportProposalTurnDeps = {},
): Promise<ProduceSupportProposalTurnResult> {
  const resolveIntent =
    deps.resolve_semantic_intent ??
    ((query: string, locale: CustomerActiveLocale) =>
      resolveSupportSemanticIntent({ query, locale }));

  const intent = resolveIntent(input.query, input.locale);
  if (!hasSupportAssignIntent(input.query, intent)) {
    return { handled: false };
  }

  const t = deps.translate ?? input.t;
  const parsed = parseExplicitSupportAssignCommand(input.query, intent);

  if (!isClearSupportAssignIntent({ query: input.query, parsed })) {
    return {
      handled: true,
      answer: buildSupportProposalAnswer({
        t,
        directAnswer: buildAssignClarificationMessage(t),
      }),
    };
  }

  const readContext = deps.load_read_context
    ? await deps.load_read_context(input)
    : await loadSupportProposalReadContext(input);

  if (!readContext || !canProposeSupportWrite(readContext.permission)) {
    return {
      handled: true,
      answer: buildSupportProposalAnswer({
        t,
        directAnswer: t(`${OUTCOME_BASE}.permissionDenied`),
      }),
    };
  }

  if (!readContext.permission.can_assign_case) {
    return {
      handled: true,
      answer: buildSupportProposalAnswer({
        t,
        directAnswer: t(`${OUTCOME_BASE}.permissionDenied`),
      }),
    };
  }

  const request: SupportWriteRequest = {
    capability_key: "support_case.assign",
    case_id: parsed.caseId!,
    draft_text: null,
    assignee_reference: parsed.assigneeId!,
    escalation_reason: null,
    grounded_sources: [],
    confirmed: parsed.confirmed,
    approved: false,
    idempotency_key: buildSupportAssignIdempotencyKey(parsed.caseId!, parsed.assigneeId!),
  };

  const lookupCase =
    deps.lookup_case ??
    ((caseId: string) => createSupportWriteProviderBridge(input.supabase).lookupCase(caseId));
  const recordApproval =
    deps.record_assign_approval ??
    ((approvalRequest: SupportAssignApprovalRequest) =>
      recordSupportAssignApprovalActionRequest(input.supabase, approvalRequest));

  const executeWrite = deps.execute_support_write ?? executeSupportWrite;
  const writeResult = await executeWrite({
    organization_id: readContext.organization_id,
    tenant_id: readContext.permission.tenant_id,
    user_role: readContext.permission.user_role,
    permission: readContext.permission,
    provider_key: SUPPORT_ASSIGN_PROVIDER_KEY,
    provider_write: {
      write_source_available: isSupportWriteSourceConnected("support_case.assign"),
      requires_approval_before_execution: true,
    },
    lookup_case: lookupCase,
    record_assign_approval: recordApproval,
    request,
  });

  return {
    handled: true,
    answer: mapSupportProposalWriteResult({ result: writeResult, t }),
    writeResult: {
      outcome: writeResult.outcome,
      action_request_id: writeResult.action_request_id,
    },
  };
}
