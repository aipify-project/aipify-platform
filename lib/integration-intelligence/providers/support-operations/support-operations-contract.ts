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

function mapAsoCaseRow(row: RawSupportCaseRow, sourceReference: string): SupportCaseSummary {
  const caseId = String(row.id ?? row.case_number ?? "").trim();
  const status = normalizeSupportStatus(String(row.status ?? "open"));
  const riskLevel = String(row.risk_level ?? row.priority ?? "").toLowerCase();
  const priority = normalizeSupportPriority(riskLevel || String(row.priority ?? ""));

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
    first_response_due_at: null,
    resolution_due_at: null,
    sla_status: inferSlaStatusFromCase({ sla_status: row.sla_status ? String(row.sla_status) : null }),
    escalation_status:
      status === "escalated" || row.escalated_at
        ? "escalated"
        : riskLevel === "critical" || riskLevel === "high"
          ? "required"
          : "none",
    source_reference: sourceReference,
    freshness: "fresh",
    completeness: "partial",
    warnings: ["customerApp.companionPlatformKnowledge.support.warnings.casePartialSource"],
  };
}

export function mapAsoDashboardToSupportBundle(data: unknown): {
  queue: SupportQueueSummary | null;
  cases: SupportCaseSummary[];
  source_exact: boolean;
  limitations: readonly string[];
} {
  if (!data || typeof data !== "object") {
    return {
      queue: null,
      cases: [],
      source_exact: false,
      limitations: ["ASO dashboard payload missing."],
    };
  }

  const record = data as Record<string, unknown>;
  if (record.has_customer === false) {
    return {
      queue: null,
      cases: [],
      source_exact: false,
      limitations: ["Organization has no ASO customer context."],
    };
  }

  const performance =
    record.performance && typeof record.performance === "object"
      ? (record.performance as Record<string, unknown>)
      : {};
  const openCases = asArray(record.open_cases);
  const highRiskCases = asArray(record.high_risk_cases);
  const approvalQueue = asArray(record.approval_queue);

  const cases = openCases.map((row) =>
    mapAsoCaseRow(row, "autonomous_support_operations:get_customer_support_operations_center"),
  );

  for (const row of highRiskCases) {
    const mapped = mapAsoCaseRow(row, "autonomous_support_operations:high_risk_cases");
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

  const queue: SupportQueueSummary = {
    total_open: totalOpen,
    unassigned: 0,
    urgent,
    overdue: 0,
    sla_at_risk: 0,
    waiting_for_customer: waitingForCustomer,
    waiting_for_support: waitingForSupport,
    oldest_open_at: oldestOpenAt,
    generated_at: new Date().toISOString(),
    source_reference: "autonomous_support_operations:get_customer_support_operations_center",
    freshness: "fresh" as SupportFreshness,
    completeness: "partial" as SupportCompleteness,
  };

  return {
    queue,
    cases,
    source_exact: totalOpen > 0 || openCases.length > 0,
    limitations: [
      "customerApp.companionPlatformKnowledge.support.warnings.queuePartialSource",
      "Assignment and SLA fields are unavailable from the current ASO read source.",
    ],
  };
}

export function mapSupportAiDashboardCases(data: unknown): SupportCaseSummary[] {
  if (!data || typeof data !== "object") return [];
  const record = data as Record<string, unknown>;
  if (record.has_organization === false) return [];

  const openCases = asArray(record.open_cases);
  return openCases.map((row) => {
    const mapped = mapAsoCaseRow(row, "support_ai_engine:get_support_ai_engine_dashboard");
    mapped.completeness = "partial";
    mapped.warnings = [
      "customerApp.companionPlatformKnowledge.support.warnings.casePartialSource",
    ];
    return mapped;
  });
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
