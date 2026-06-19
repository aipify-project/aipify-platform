import type {
  Audit,
  ComplianceItem,
  CorrectiveAction,
  Finding,
  Improvement,
  Incident,
  QualityOperationsCenter,
  QualityScore,
  Standard,
} from "./types";

function parseStandard(row: Record<string, unknown>): Standard {
  return {
    id: String(row.id ?? ""),
    standard_number: row.standard_number ? String(row.standard_number) : undefined,
    title: String(row.title ?? ""),
    description: row.description ? String(row.description) : undefined,
    status: String(row.status ?? "draft"),
    version_number: typeof row.version_number === "number" ? row.version_number : undefined,
    review_date: row.review_date ? String(row.review_date) : undefined,
    business_pack_key: row.business_pack_key ? String(row.business_pack_key) : undefined,
  };
}

function parseComplianceItem(row: Record<string, unknown>): ComplianceItem {
  return {
    id: String(row.id ?? ""),
    item_number: row.item_number ? String(row.item_number) : undefined,
    title: String(row.title ?? ""),
    compliance_type: String(row.compliance_type ?? "policy"),
    status: String(row.status ?? "compliant"),
    review_date: row.review_date ? String(row.review_date) : undefined,
  };
}

function parseAudit(row: Record<string, unknown>): Audit {
  return {
    id: String(row.id ?? ""),
    audit_number: row.audit_number ? String(row.audit_number) : undefined,
    title: String(row.title ?? ""),
    audit_type: String(row.audit_type ?? "internal"),
    status: String(row.status ?? "scheduled"),
    scheduled_date: row.scheduled_date ? String(row.scheduled_date) : undefined,
    findings_count: typeof row.findings_count === "number" ? row.findings_count : undefined,
  };
}

function parseFinding(row: Record<string, unknown>): Finding {
  return {
    id: String(row.id ?? ""),
    finding_number: row.finding_number ? String(row.finding_number) : undefined,
    title: String(row.title ?? ""),
    severity: String(row.severity ?? "medium"),
    status: String(row.status ?? "open"),
    due_date: row.due_date ? String(row.due_date) : undefined,
    audit_id: row.audit_id ? String(row.audit_id) : undefined,
  };
}

function parseIncident(row: Record<string, unknown>): Incident {
  return {
    id: String(row.id ?? ""),
    incident_number: row.incident_number ? String(row.incident_number) : undefined,
    title: String(row.title ?? ""),
    category: String(row.category ?? "process_failure"),
    impact: String(row.impact ?? "medium"),
    status: String(row.status ?? "reported"),
    occurred_at: row.occurred_at ? String(row.occurred_at) : undefined,
  };
}

function parseCorrectiveAction(row: Record<string, unknown>): CorrectiveAction {
  return {
    id: String(row.id ?? ""),
    action_number: row.action_number ? String(row.action_number) : undefined,
    title: String(row.title ?? ""),
    priority: String(row.priority ?? "normal"),
    status: String(row.status ?? "open"),
    due_date: row.due_date ? String(row.due_date) : undefined,
    incident_id: row.incident_id ? String(row.incident_id) : undefined,
    audit_finding_id: row.audit_finding_id ? String(row.audit_finding_id) : undefined,
  };
}

function parseImprovement(row: Record<string, unknown>): Improvement {
  return {
    id: String(row.id ?? ""),
    improvement_number: row.improvement_number ? String(row.improvement_number) : undefined,
    title: String(row.title ?? ""),
    category: String(row.category ?? "process_improvement"),
    status: String(row.status ?? "submitted"),
    expected_value: row.expected_value ? String(row.expected_value) : undefined,
  };
}

function parseList<T>(value: unknown, parser: (row: Record<string, unknown>) => T): T[] {
  if (!Array.isArray(value)) return [];
  return value.map((row) => parser(row as Record<string, unknown>));
}

export function parseQualityOperationsCenter(row: Record<string, unknown>): QualityOperationsCenter {
  const qualityScore = row.quality_score as Record<string, unknown> | undefined;
  return {
    found: row.found === true,
    principle: row.principle ? String(row.principle) : undefined,
    philosophy: row.philosophy ? String(row.philosophy) : undefined,
    quality_score: qualityScore
      ? ({
          quality_score: typeof qualityScore.quality_score === "number" ? qualityScore.quality_score : undefined,
          quality_status: qualityScore.quality_status ? String(qualityScore.quality_status) : undefined,
          open_audits: typeof qualityScore.open_audits === "number" ? qualityScore.open_audits : undefined,
          critical_findings:
            typeof qualityScore.critical_findings === "number" ? qualityScore.critical_findings : undefined,
          non_compliant_items:
            typeof qualityScore.non_compliant_items === "number" ? qualityScore.non_compliant_items : undefined,
          open_incidents: typeof qualityScore.open_incidents === "number" ? qualityScore.open_incidents : undefined,
          overdue_corrective_actions:
            typeof qualityScore.overdue_corrective_actions === "number"
              ? qualityScore.overdue_corrective_actions
              : undefined,
        } satisfies QualityScore)
      : undefined,
    overview: row.overview as Record<string, string | number | undefined> | undefined,
    standards: parseList(row.standards, parseStandard),
    compliance_items: parseList(row.compliance_items, parseComplianceItem),
    audits: parseList(row.audits, parseAudit),
    findings: parseList(row.findings, parseFinding),
    incidents: parseList(row.incidents, parseIncident),
    corrective_actions: parseList(row.corrective_actions, parseCorrectiveAction),
    improvements: parseList(row.improvements, parseImprovement),
    reports: row.reports as Record<string, unknown> | undefined,
    integrations: row.integrations as Record<string, string> | undefined,
    companion_insights: row.companion_insights as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? row.audit_recent.map((entry) => {
          const e = entry as Record<string, unknown>;
          return {
            action: String(e.action ?? ""),
            summary: String(e.summary ?? ""),
            created_at: e.created_at ? String(e.created_at) : undefined,
          };
        })
      : undefined,
    error: row.error ? String(row.error) : undefined,
  };
}
