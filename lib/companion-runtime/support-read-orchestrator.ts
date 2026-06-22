import { supportReadOutcomeKey } from "@/lib/integration-intelligence/support/outcomes";
import {
  assertSupportReadAllowed,
  assertSupportTenantScope,
  canReadSupportCase,
  canReadSupportQueue,
  type SupportPermissionContext,
} from "@/lib/integration-intelligence/support/permissions";
import type {
  SupportCaseDetail,
  SupportCaseReadResult,
  SupportCaseSummary,
  SupportQueueReadResult,
  SupportQueueSummary,
  SupportReadOutcome,
} from "@/lib/integration-intelligence/support/types";
import {
  buildSupportCaseDetail,
  prioritizeSupportCases,
} from "@/lib/integration-intelligence/providers/support-operations/support-operations-contract";
import { createSupportAuditEvent } from "./support-audit";

export type SupportProviderReader = {
  provider_key: string;
  active: boolean;
  read_queue: () => Promise<{
    queue: SupportQueueSummary | null;
    cases: readonly SupportCaseSummary[];
    source_exact: boolean;
    limitations: readonly string[];
  }>;
  read_case: (caseId: string) => Promise<{
    case_detail: SupportCaseDetail | null;
    limitations: readonly string[];
  }>;
};

function emptyQueueResult(
  outcome: SupportReadOutcome,
  limitations: readonly string[] = [],
): SupportQueueReadResult {
  return {
    outcome,
    queue: null,
    cases: [],
    outcome_key: supportReadOutcomeKey(outcome),
    audit_id: null,
    limitations,
  };
}

function emptyCaseResult(
  outcome: SupportReadOutcome,
  limitations: readonly string[] = [],
): SupportCaseReadResult {
  return {
    outcome,
    case_detail: null,
    outcome_key: supportReadOutcomeKey(outcome),
    audit_id: null,
    limitations,
  };
}

export async function executeSupportQueueRead(input: {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  permission: SupportPermissionContext;
  providers: readonly SupportProviderReader[];
}): Promise<SupportQueueReadResult> {
  if (
    !assertSupportTenantScope({
      queryOrganizationId: input.organization_id,
      sessionOrganizationId: input.permission.organization_id,
    })
  ) {
    return emptyQueueResult("permission_denied", ["Cross-tenant support reads are forbidden."]);
  }

  const block = assertSupportReadAllowed(input.permission);
  if (block) return emptyQueueResult(block);

  if (!canReadSupportQueue(input.permission)) {
    return emptyQueueResult("permission_denied");
  }

  const activeProviders = input.providers.filter((provider) => provider.active);
  if (activeProviders.length === 0) {
    return emptyQueueResult("provider_missing");
  }

  const limitations: string[] = [];
  let queue: SupportQueueSummary | null = null;
  const cases: SupportCaseSummary[] = [];
  let sourceExact = false;
  let providerKey = activeProviders[0]!.provider_key;

  for (const provider of activeProviders) {
    providerKey = provider.provider_key;
    const payload = await provider.read_queue();
    limitations.push(...payload.limitations);
    sourceExact = sourceExact || payload.source_exact;
    if (payload.queue) queue = payload.queue;
    cases.push(...payload.cases);
  }

  const prioritizedCases = prioritizeSupportCases(cases);

  let outcome: SupportReadOutcome = "source_missing";
  if (!queue || queue.total_open === 0) {
    outcome = sourceExact ? "empty_queue" : "source_missing";
  } else if (queue.completeness === "partial") {
    outcome = "partial_result";
  } else {
    outcome = "exact_match";
  }

  const audit = createSupportAuditEvent({
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    user_role: input.user_role,
    capability_key: "support_queue.read",
    outcome,
    provider_key: providerKey,
    queue,
  });

  return {
    outcome,
    queue,
    cases: prioritizedCases,
    outcome_key: supportReadOutcomeKey(outcome),
    audit_id: audit.audit_id,
    limitations,
  };
}

export async function executeSupportCaseRead(input: {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  case_id: string;
  permission: SupportPermissionContext;
  providers: readonly SupportProviderReader[];
}): Promise<SupportCaseReadResult> {
  if (
    !assertSupportTenantScope({
      queryOrganizationId: input.organization_id,
      sessionOrganizationId: input.permission.organization_id,
    })
  ) {
    return emptyCaseResult("permission_denied", ["Cross-tenant support reads are forbidden."]);
  }

  const block = assertSupportReadAllowed(input.permission);
  if (block) return emptyCaseResult(block);

  if (!canReadSupportCase(input.permission)) {
    return emptyCaseResult("permission_denied");
  }

  const activeProviders = input.providers.filter((provider) => provider.active);
  if (activeProviders.length === 0) {
    return emptyCaseResult("provider_missing");
  }

  const limitations: string[] = [];
  let caseDetail: SupportCaseDetail | null = null;
  let providerKey = activeProviders[0]!.provider_key;

  for (const provider of activeProviders) {
    providerKey = provider.provider_key;
    const payload = await provider.read_case(input.case_id);
    limitations.push(...payload.limitations);
    if (payload.case_detail) {
      caseDetail = payload.case_detail;
      break;
    }
  }

  const outcome: SupportReadOutcome = caseDetail
    ? caseDetail.case_summary.completeness === "partial"
      ? "partial_result"
      : "exact_match"
    : "no_match";

  const audit = createSupportAuditEvent({
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    user_role: input.user_role,
    capability_key: "support_case.read",
    outcome,
    case_id: input.case_id,
    provider_key: providerKey,
    case_summary: caseDetail?.case_summary ?? null,
  });

  return {
    outcome,
    case_detail: caseDetail,
    outcome_key: supportReadOutcomeKey(outcome),
    audit_id: audit.audit_id,
    limitations,
  };
}

export type SupportCommandBriefSignalCandidate = {
  signal_key: string;
  count: number | null;
  source_exact: boolean;
};

export function buildSupportCommandBriefSignals(input: {
  queue: SupportQueueSummary | null;
  cases: readonly SupportCaseSummary[];
  pending_drafts_count: number | null;
  source_exact: boolean;
}): Array<{ signal_key: string; count: number | null }> {
  if (!input.source_exact || !input.queue) return [];

  const signals: Array<{ signal_key: string; count: number | null }> = [];

  if (input.queue.total_open > 0) {
    signals.push({ signal_key: "unresolved_support_case", count: input.queue.total_open });
  }
  if (input.queue.unassigned > 0) {
    signals.push({ signal_key: "unassigned_support_case", count: input.queue.unassigned });
  }
  if (input.queue.urgent > 0) {
    signals.push({ signal_key: "urgent_support_case", count: input.queue.urgent });
  }
  if (input.queue.sla_at_risk > 0) {
    signals.push({ signal_key: "support_sla_warning", count: input.queue.sla_at_risk });
  }
  if (input.queue.overdue > 0) {
    signals.push({ signal_key: "support_sla_breached", count: input.queue.overdue });
  }

  const escalationRequired = input.cases.filter(
    (supportCase) => supportCase.escalation_status === "required",
  ).length;
  if (escalationRequired > 0) {
    signals.push({ signal_key: "support_escalation_required", count: escalationRequired });
  } else if (input.cases.some((supportCase) => supportCase.escalation_status === "escalated")) {
    signals.push({ signal_key: "escalation_required", count: 1 });
  }

  if (input.queue.waiting_for_customer > 0) {
    signals.push({
      signal_key: "support_waiting_for_customer",
      count: input.queue.waiting_for_customer,
    });
  }
  if (input.queue.waiting_for_support > 0) {
    signals.push({
      signal_key: "support_waiting_for_agent",
      count: input.queue.waiting_for_support,
    });
  }

  const reopened = input.cases.filter((supportCase) => supportCase.status === "reopened").length;
  if (reopened > 0) {
    signals.push({ signal_key: "reopened_support_case", count: reopened });
  }

  if (input.queue.oldest_open_at) {
    signals.push({ signal_key: "oldest_support_case", count: 1 });
  }

  if (input.pending_drafts_count && input.pending_drafts_count > 0) {
    signals.push({
      signal_key: "support_response_draft_ready",
      count: input.pending_drafts_count,
    });
  }

  const legacySlaRisk =
    input.cases.filter(
      (supportCase) =>
        supportCase.sla_status === "at_risk" || supportCase.sla_status === "warning",
    ).length;
  if (legacySlaRisk > 0) {
    signals.push({ signal_key: "sla_risk", count: legacySlaRisk });
  }

  return signals;
}

export function buildSupportCommandBriefCandidates(input: {
  queue: SupportQueueSummary | null;
  cases: readonly SupportCaseSummary[];
  pending_drafts_count: number | null;
  source_exact: boolean;
}): SupportCommandBriefSignalCandidate[] {
  return buildSupportCommandBriefSignals(input).map((signal) => ({
    ...signal,
    source_exact: input.source_exact,
  }));
}

export { buildSupportCaseDetail };
