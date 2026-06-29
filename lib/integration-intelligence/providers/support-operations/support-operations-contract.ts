import {
  inferSlaStatusFromCase,
  normalizeSupportPriority,
  normalizeSupportStatus,
} from "@/lib/integration-intelligence/support/status-normalization";
import { maskSupportCustomerReference } from "@/lib/integration-intelligence/support/masking";
import type {
  SupportCaseDetail,
  SupportCaseSummary,
  SupportCompleteness,
  SupportFreshness,
  SupportQueueSummary,
} from "@/lib/integration-intelligence/support/types";

type RawSupportCaseRow = Record<string, unknown>;

function asArray(value: unknown): RawSupportCaseRow[] {
  return Array.isArray(value) ? (value as RawSupportCaseRow[]) : [];
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && Number.isFinite(value);
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0 && Number.isFinite(value);
}

function parseSupportAiQueueSummary(
  record: Record<string, unknown>,
  previewCaseCount: number,
): { total_open: number; unassigned: number; preview_limit: number } | null {
  const queueSummary = record.queue_summary;
  if (!queueSummary || typeof queueSummary !== "object" || Array.isArray(queueSummary)) {
    return null;
  }

  const summary = queueSummary as Record<string, unknown>;
  const totalOpen = summary.total_open;
  const unassigned = summary.unassigned;
  const previewLimit = summary.preview_limit;

  if (!isNonNegativeInteger(totalOpen)) return null;
  if (!isNonNegativeInteger(unassigned)) return null;
  if (!isPositiveInteger(previewLimit)) return null;
  if (unassigned > totalOpen) return null;
  if (previewCaseCount > previewLimit) return null;

  return {
    total_open: totalOpen,
    unassigned,
    preview_limit: previewLimit,
  };
}

function parseSlaBlock(data: Record<string, unknown>): {
  sla_source_exact: boolean;
  policy_configured: boolean;
  sla_at_risk: number;
  breached: number;
} {
  const sla =
    data.sla && typeof data.sla === "object" ? (data.sla as Record<string, unknown>) : null;

  if (!sla) {
    return {
      sla_source_exact: false,
      policy_configured: false,
      sla_at_risk: 0,
      breached: 0,
    };
  }

  const policyConfigured = sla.policy_configured === true || sla.source_exact === true;
  const sourceExact = sla.source_exact === true;

  return {
    sla_source_exact: sourceExact,
    policy_configured: policyConfigured,
    sla_at_risk: sourceExact && typeof sla.sla_at_risk === "number" ? sla.sla_at_risk : 0,
    breached: sourceExact && typeof sla.breached === "number" ? sla.breached : 0,
  };
}

function mapAsoCaseRow(
  row: RawSupportCaseRow,
  sourceReference: string,
  slaSourceExact: boolean,
): SupportCaseSummary {
  const caseId = String(row.id ?? row.case_number ?? "").trim();
  const status = normalizeSupportStatus(String(row.status ?? "open"));
  const riskLevel = String(row.risk_level ?? row.priority ?? "").toLowerCase();
  const priority = normalizeSupportPriority(riskLevel || String(row.priority ?? ""));

  const slaStatus = slaSourceExact
    ? inferSlaStatusFromCase({ sla_status: row.sla_status ? String(row.sla_status) : null })
    : "unavailable";

  return {
    case_id: caseId,
    subject: String(row.subject ?? "").trim() || `[case:${caseId}]`,
    category: row.category ? String(row.category) : null,
    priority,
    status,
    customer_reference: maskSupportCustomerReference(
      row.customer_identifier ? String(row.customer_identifier) : null,
    ),
    assigned_role: null,
    assigned_user_reference: null,
    created_at: row.created_at ? String(row.created_at) : null,
    updated_at: row.updated_at ? String(row.updated_at) : null,
    first_response_due_at:
      slaSourceExact && row.first_response_due_at ? String(row.first_response_due_at) : null,
    resolution_due_at:
      slaSourceExact && row.resolution_due_at ? String(row.resolution_due_at) : null,
    sla_status: slaStatus,
    escalation_status:
      status === "escalated" || row.escalated_at
        ? "escalated"
        : riskLevel === "critical" || riskLevel === "high"
          ? "required"
          : "none",
    source_reference: sourceReference,
    freshness: "fresh",
    completeness: slaSourceExact ? "complete" : "partial",
    warnings: slaSourceExact
      ? ["customerApp.companionPlatformKnowledge.support.warnings.casePartialSource"]
      : [
          "customerApp.companionPlatformKnowledge.support.warnings.casePartialSource",
          "customerApp.companionPlatformKnowledge.support.warnings.slaUnavailable",
        ],
  };
}

export function mapAsoDashboardToSupportBundle(data: unknown): {
  queue: SupportQueueSummary | null;
  cases: SupportCaseSummary[];
  source_exact: boolean;
  sla_source_exact: boolean;
  sla_policy_configured: boolean;
  limitations: readonly string[];
} {
  if (!data || typeof data !== "object") {
    return {
      queue: null,
      cases: [],
      source_exact: false,
      sla_source_exact: false,
      sla_policy_configured: false,
      limitations: ["ASO dashboard payload missing."],
    };
  }

  const record = data as Record<string, unknown>;
  if (record.has_customer === false) {
    return {
      queue: null,
      cases: [],
      source_exact: false,
      sla_source_exact: false,
      sla_policy_configured: false,
      limitations: ["Organization has no ASO customer context."],
    };
  }

  const slaMeta = parseSlaBlock(record);
  const performance =
    record.performance && typeof record.performance === "object"
      ? (record.performance as Record<string, unknown>)
      : {};
  const openCases = asArray(record.open_cases);
  const highRiskCases = asArray(record.high_risk_cases);
  const approvalQueue = asArray(record.approval_queue);

  const cases = openCases.map((row) =>
    mapAsoCaseRow(
      row,
      "autonomous_support_operations:get_customer_support_operations_center",
      slaMeta.sla_source_exact,
    ),
  );

  for (const row of highRiskCases) {
    const mapped = mapAsoCaseRow(row, "autonomous_support_operations:high_risk_cases", slaMeta.sla_source_exact);
    if (!cases.some((entry) => entry.case_id === mapped.case_id)) {
      cases.push(mapped);
    }
  }

  const totalOpen =
    typeof performance.open_cases === "number" ? performance.open_cases : openCases.length;

  let urgent = highRiskCases.length;
  let waitingForCustomer = 0;
  let waitingForSupport = approvalQueue.length;
  let oldestOpenAt: string | null = null;

  for (const supportCase of cases) {
    if (supportCase.priority === "urgent") urgent += 1;
    if (supportCase.status === "waiting_for_customer") waitingForCustomer += 1;
    if (
      supportCase.status === "waiting_for_support" ||
      supportCase.status === "in_progress"
    ) {
      waitingForSupport += supportCase.status === "waiting_for_support" ? 1 : 0;
    }
    if (supportCase.created_at) {
      if (!oldestOpenAt || supportCase.created_at < oldestOpenAt) {
        oldestOpenAt = supportCase.created_at;
      }
    }
  }

  const slaAtRisk = slaMeta.sla_source_exact
    ? slaMeta.sla_at_risk ||
      (typeof performance.sla_at_risk === "number" ? performance.sla_at_risk : 0)
    : 0;
  const slaBreached = slaMeta.sla_source_exact
    ? slaMeta.breached ||
      (typeof performance.sla_breached === "number" ? performance.sla_breached : 0)
    : 0;

  const queue: SupportQueueSummary = {
    total_open: totalOpen,
    unassigned: 0,
    urgent,
    overdue: slaBreached,
    sla_at_risk: slaAtRisk,
    waiting_for_customer: waitingForCustomer,
    waiting_for_support: waitingForSupport,
    oldest_open_at: oldestOpenAt,
    generated_at: new Date().toISOString(),
    source_reference: "autonomous_support_operations:get_customer_support_operations_center",
    freshness: "fresh" as SupportFreshness,
    completeness: slaMeta.sla_source_exact ? ("complete" as SupportCompleteness) : ("partial" as SupportCompleteness),
  };

  const limitations: string[] = [
    "customerApp.companionPlatformKnowledge.support.warnings.queuePartialSource",
  ];

  if (!slaMeta.policy_configured) {
    limitations.push(
      "customerApp.companionPlatformKnowledge.support.warnings.slaPolicyMissing",
    );
  } else if (!slaMeta.sla_source_exact) {
    limitations.push(
      "customerApp.companionPlatformKnowledge.support.warnings.slaSourcePartial",
    );
  }

  if (!slaMeta.sla_source_exact) {
    limitations.push("Assignment fields remain unavailable from the current ASO read source.");
  }

  return {
    queue,
    cases,
    source_exact: totalOpen > 0 || openCases.length > 0 || record.has_customer === true,
    sla_source_exact: slaMeta.sla_source_exact,
    sla_policy_configured: slaMeta.policy_configured,
    limitations,
  };
}

export const SUPPORT_AI_QUEUE_SOURCE_REFERENCE =
  "support_ai_engine:get_support_ai_engine_dashboard" as const;

function mapSupportAiCaseRow(row: RawSupportCaseRow): SupportCaseSummary {
  const mapped = mapAsoCaseRow(row, SUPPORT_AI_QUEUE_SOURCE_REFERENCE, false);
  mapped.completeness = "partial";
  mapped.warnings = [
    "customerApp.companionPlatformKnowledge.support.warnings.casePartialSource",
  ];

  if (row.channel && !mapped.category) {
    mapped.category = String(row.channel);
  }

  const assignedTo = row.assigned_to ?? row.assigned_user_id ?? null;
  mapped.assigned_user_reference = assignedTo ? String(assignedTo) : null;

  return mapped;
}

export function mapSupportAiDashboardCases(data: unknown): SupportCaseSummary[] {
  if (!data || typeof data !== "object") return [];
  const record = data as Record<string, unknown>;
  if (record.has_organization === false) return [];

  return asArray(record.open_cases).map((row) => mapSupportAiCaseRow(row));
}

export function mapSupportAiDashboardToSupportBundle(data: unknown): {
  queue: SupportQueueSummary | null;
  cases: SupportCaseSummary[];
  source_exact: boolean;
  sla_source_exact: boolean;
  sla_policy_configured: boolean;
  limitations: readonly string[];
} {
  if (!data || typeof data !== "object") {
    return {
      queue: null,
      cases: [],
      source_exact: false,
      sla_source_exact: false,
      sla_policy_configured: false,
      limitations: ["Support AI dashboard payload missing."],
    };
  }

  const record = data as Record<string, unknown>;
  if (record.has_organization === false) {
    return {
      queue: null,
      cases: [],
      source_exact: false,
      sla_source_exact: false,
      sla_policy_configured: false,
      limitations: ["Organization has no Support AI context."],
    };
  }

  const openCases = asArray(record.open_cases);
  const cases = openCases.map((row) => mapSupportAiCaseRow(row));
  const queueSummary = parseSupportAiQueueSummary(record, cases.length);

  if (!queueSummary) {
    return {
      queue: null,
      cases: [],
      source_exact: false,
      sla_source_exact: false,
      sla_policy_configured: false,
      limitations: ["Support AI dashboard queue_summary missing or invalid."],
    };
  }

  const { total_open: totalOpen, unassigned } = queueSummary;

  let urgent = 0;
  let waitingForCustomer = 0;
  let waitingForSupport = 0;
  let oldestOpenAt: string | null = null;

  for (const supportCase of cases) {
    if (supportCase.priority === "urgent") urgent += 1;
    if (supportCase.status === "waiting_for_customer") waitingForCustomer += 1;
    if (
      supportCase.status === "waiting_for_support" ||
      supportCase.status === "in_progress"
    ) {
      waitingForSupport += supportCase.status === "waiting_for_support" ? 1 : 0;
    }
    if (supportCase.created_at) {
      if (!oldestOpenAt || supportCase.created_at < oldestOpenAt) {
        oldestOpenAt = supportCase.created_at;
      }
    }
  }

  const queue: SupportQueueSummary = {
    total_open: totalOpen,
    unassigned,
    urgent,
    overdue: 0,
    sla_at_risk: 0,
    waiting_for_customer: waitingForCustomer,
    waiting_for_support: waitingForSupport,
    oldest_open_at: oldestOpenAt,
    generated_at: new Date().toISOString(),
    source_reference: SUPPORT_AI_QUEUE_SOURCE_REFERENCE,
    freshness: "fresh" as SupportFreshness,
    completeness: "partial" as SupportCompleteness,
  };

  return {
    queue,
    cases,
    source_exact: true,
    sla_source_exact: false,
    sla_policy_configured: false,
    limitations: [
      "customerApp.companionPlatformKnowledge.support.warnings.queuePartialSource",
    ],
  };
}

export function buildSupportCaseDetail(caseSummary: SupportCaseSummary): SupportCaseDetail {
  return {
    case_summary: caseSummary,
    latest_public_message_summary: null,
    internal_status_summary: null,
    related_customer_reference: caseSummary.customer_reference,
    related_organization_reference: null,
    suggested_knowledge_sources: ["business_dna_knowledge", "support_ai_engine"],
    available_actions: ["support_response.draft", "support_case.assign", "support_case.escalate"],
  };
}

export function prioritizeSupportCases(cases: readonly SupportCaseSummary[]): SupportCaseSummary[] {
  const weight = (supportCase: SupportCaseSummary): number => {
    let score = 0;
    if (supportCase.sla_status === "breached") score += 1000;
    else if (supportCase.sla_status === "at_risk") score += 800;
    else if (supportCase.sla_status === "warning") score += 600;
    if (supportCase.priority === "urgent") score += 500;
    if (!supportCase.assigned_user_reference) score += 300;
    if (supportCase.escalation_status === "required") score += 400;
    if (supportCase.escalation_status === "escalated") score += 350;
    if (supportCase.status === "reopened") score += 250;
    if (supportCase.status === "waiting_for_support") score += 200;
    if (supportCase.created_at) score += Math.min(100, Date.now() - Date.parse(supportCase.created_at) / 86400000);
    return score;
  };

  return [...cases].sort((a, b) => weight(b) - weight(a));
}
