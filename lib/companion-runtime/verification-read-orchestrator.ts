import { verificationOutcomeKey } from "@/lib/integration-intelligence/verification/outcomes";
import {
  assertVerificationReadAllowed,
  assertVerificationTenantScope,
  canReadVerificationCase,
  canReadVerificationQueue,
  type VerificationPermissionContext,
} from "@/lib/integration-intelligence/verification/permissions";
import type {
  VerificationCaseReadResult,
  VerificationCaseSummary,
  VerificationQueueReadResult,
  VerificationQueueSummary,
} from "@/lib/integration-intelligence/verification/types";
import { createVerificationAuditEvent } from "./verification-audit";

export type VerificationProviderReader = {
  provider_key: string;
  active: boolean;
  read_queue: () => Promise<{
    queue: VerificationQueueSummary | null;
    cases: readonly VerificationCaseSummary[];
    limitations: readonly string[];
  }>;
  read_case: (caseId: string) => Promise<{
    case_summary: VerificationCaseSummary | null;
    limitations: readonly string[];
  }>;
};

function emptyQueueResult(outcome: VerificationQueueReadResult["outcome"], limitations: readonly string[] = []) {
  return {
    outcome,
    queue: null,
    cases: [],
    outcome_key: verificationOutcomeKey(outcome),
    audit_id: null,
    limitations,
  } satisfies VerificationQueueReadResult;
}

function emptyCaseResult(outcome: VerificationCaseReadResult["outcome"], limitations: readonly string[] = []) {
  return {
    outcome,
    case_summary: null,
    outcome_key: verificationOutcomeKey(outcome),
    audit_id: null,
    limitations,
  } satisfies VerificationCaseReadResult;
}

export async function executeVerificationQueueRead(input: {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  permission: VerificationPermissionContext;
  providers: readonly VerificationProviderReader[];
}): Promise<VerificationQueueReadResult> {
  if (
    !assertVerificationTenantScope({
      queryOrganizationId: input.organization_id,
      sessionOrganizationId: input.permission.organization_id,
    })
  ) {
    return emptyQueueResult("permission_denied", ["Cross-tenant verification reads are forbidden."]);
  }

  const block = assertVerificationReadAllowed(input.permission);
  if (block) {
    return emptyQueueResult(block);
  }

  if (!canReadVerificationQueue(input.permission)) {
    return emptyQueueResult("permission_denied");
  }

  const activeProviders = input.providers.filter((provider) => provider.active);
  if (activeProviders.length === 0) {
    return emptyQueueResult("provider_missing");
  }

  const limitations: string[] = [];
  let queue: VerificationQueueSummary | null = null;
  const cases: VerificationCaseSummary[] = [];
  let providerKey = activeProviders[0]!.provider_key;

  for (const provider of activeProviders) {
    providerKey = provider.provider_key;
    const payload = await provider.read_queue();
    limitations.push(...payload.limitations);
    if (payload.queue) queue = payload.queue;
    cases.push(...payload.cases);
  }

  const outcome: VerificationQueueReadResult["outcome"] =
    !queue || queue.total_pending === 0
      ? "empty_queue"
      : queue.completeness === "partial"
        ? "partial_result"
        : "exact_match";

  const audit = createVerificationAuditEvent({
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    user_role: input.user_role,
    capability_key: "verification_queue.read",
    outcome,
    provider_key: providerKey,
    queue,
  });

  return {
    outcome,
    queue,
    cases,
    outcome_key: verificationOutcomeKey(outcome),
    audit_id: audit.audit_id,
    limitations,
  };
}

export async function executeVerificationCaseRead(input: {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  case_id: string;
  permission: VerificationPermissionContext;
  providers: readonly VerificationProviderReader[];
}): Promise<VerificationCaseReadResult> {
  if (
    !assertVerificationTenantScope({
      queryOrganizationId: input.organization_id,
      sessionOrganizationId: input.permission.organization_id,
    })
  ) {
    return emptyCaseResult("permission_denied", ["Cross-tenant verification reads are forbidden."]);
  }

  const block = assertVerificationReadAllowed(input.permission);
  if (block) {
    return emptyCaseResult(block);
  }

  if (!canReadVerificationCase(input.permission)) {
    return emptyCaseResult("permission_denied");
  }

  const activeProviders = input.providers.filter((provider) => provider.active);
  if (activeProviders.length === 0) {
    return emptyCaseResult("provider_missing");
  }

  const limitations: string[] = [];
  let caseSummary: VerificationCaseSummary | null = null;
  let providerKey = activeProviders[0]!.provider_key;

  for (const provider of activeProviders) {
    providerKey = provider.provider_key;
    const payload = await provider.read_case(input.case_id);
    limitations.push(...payload.limitations);
    if (payload.case_summary) {
      caseSummary = payload.case_summary;
      break;
    }
  }

  const outcome: VerificationCaseReadResult["outcome"] = caseSummary
    ? caseSummary.completeness === "partial"
      ? "partial_result"
      : "exact_match"
    : "no_match";

  const audit = createVerificationAuditEvent({
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    user_role: input.user_role,
    capability_key: "verification_case.read",
    outcome,
    case_id: input.case_id,
    provider_key: providerKey,
    case_summary: caseSummary,
  });

  return {
    outcome,
    case_summary: caseSummary,
    outcome_key: verificationOutcomeKey(outcome),
    audit_id: audit.audit_id,
    limitations,
  };
}

export type VerificationCommandBriefSignal = {
  signal_key: string;
  count: number | null;
};

export function buildVerificationCommandBriefSignals(input: {
  queue: VerificationQueueSummary | null;
  source_exact: boolean;
}): VerificationCommandBriefSignal[] {
  if (!input.queue || !input.source_exact) return [];
  const signals: VerificationCommandBriefSignal[] = [];
  if (input.queue.total_pending > 0) {
    signals.push({ signal_key: "pending_verification", count: input.queue.total_pending });
  }
  if (input.queue.needs_information > 0) {
    signals.push({
      signal_key: "verification_needs_information",
      count: input.queue.needs_information,
    });
  }
  if (input.queue.high_priority > 0) {
    signals.push({
      signal_key: "verification_high_priority",
      count: input.queue.high_priority,
    });
  }
  if (input.queue.oldest_pending_at) {
    signals.push({ signal_key: "verification_oldest_pending", count: 1 });
  }
  return signals;
}
