import {
  ALERT_TYPES,
  GOVERNANCE_MODULES,
  POLICY_CATEGORIES,
  POLICY_STATUSES,
  RETENTION_DATA_TYPES,
  RISK_LEVELS,
  ACCESS_RECORD_TYPES,
} from "./constants";
import type {
  AlertType,
  GovernanceModule,
  PolicyCategory,
  PolicyStatus,
  RetentionDataType,
  RiskLevel,
  AccessRecordType,
} from "./constants";
import type {
  AccessRecord,
  ComplianceAuditEntry,
  ComplianceFilters,
  ComplianceGovernanceCenter,
  ComplianceOverview,
  ComplianceReports,
  GovernanceAlert,
  GovernanceApproval,
  GovernanceException,
  GovernancePolicy,
  RetentionControl,
} from "./types";

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
}

function asString(value: unknown, fallback = ""): string {
  return value == null ? fallback : String(value);
}

function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asBool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function parseEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  const str = asString(value, fallback);
  return (allowed.includes(str as T) ? str : fallback) as T;
}

function parseOverview(raw: unknown): ComplianceOverview {
  const row = asRecord(raw) ?? {};
  return {
    compliance_alerts: asNumber(row.compliance_alerts),
    policies_requiring_review: asNumber(row.policies_requiring_review),
    pending_approvals: asNumber(row.pending_approvals),
    governance_exceptions: asNumber(row.governance_exceptions),
    audit_findings: asNumber(row.audit_findings),
    high_risk_activities: asNumber(row.high_risk_activities),
  };
}

function parsePolicy(raw: unknown): GovernancePolicy | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    policy_name: asString(row.policy_name),
    category: parseEnum(row.category, POLICY_CATEGORIES, "operational_standards"),
    owner: asString(row.owner),
    effective_date: asString(row.effective_date),
    review_date: asString(row.review_date),
    status: parseEnum(row.status, POLICY_STATUSES, "draft"),
    risk_level: parseEnum(row.risk_level, RISK_LEVELS, "medium"),
    summary: asString(row.summary),
    updated_at: asString(row.updated_at),
  };
}

function parseApproval(raw: unknown): GovernanceApproval | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    request_title: asString(row.request_title),
    category: parseEnum(row.category, POLICY_CATEGORIES, "operational_standards"),
    submitted_by: asString(row.submitted_by),
    priority: parseEnum(row.priority, RISK_LEVELS, "medium") as GovernanceApproval["priority"],
    due_date: asString(row.due_date),
    approver: asString(row.approver),
    status: parseEnum(row.status, ["pending", "approved", "rejected", "changes_requested", "escalated"], "pending") as GovernanceApproval["status"],
    risk_level: parseEnum(row.risk_level, RISK_LEVELS, "medium"),
  };
}

function parseRetention(raw: unknown): RetentionControl | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    data_type: parseEnum(row.data_type, RETENTION_DATA_TYPES, "audit_logs"),
    retention_days: asNumber(row.retention_days, 365),
    updated_at: asString(row.updated_at),
  };
}

function parseAccess(raw: unknown): AccessRecord | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    record_type: parseEnum(row.record_type, ACCESS_RECORD_TYPES, "role_assignment"),
    subject: asString(row.subject),
    detail: asString(row.detail),
    risk_level: parseEnum(row.risk_level, RISK_LEVELS, "medium"),
    active: asBool(row.active, true),
    reviewed_at: row.reviewed_at ? asString(row.reviewed_at) : null,
  };
}

function parseAlert(raw: unknown): GovernanceAlert | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    alert_type: parseEnum(row.alert_type, ALERT_TYPES, "governance_violation"),
    message: asString(row.message),
    severity: parseEnum(row.severity, RISK_LEVELS, "medium"),
    created_at: asString(row.created_at),
  };
}

function parseException(raw: unknown): GovernanceException | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    title: asString(row.title),
    category: asString(row.category),
    owner: asString(row.owner),
    risk_level: parseEnum(row.risk_level, RISK_LEVELS, "high"),
    status: asString(row.status),
    summary: asString(row.summary),
    expires_at: row.expires_at ? asString(row.expires_at) : null,
  };
}

function parseReports(raw: unknown): ComplianceReports {
  const row = asRecord(raw) ?? {};
  return {
    governance_activities: asNumber(row.governance_activities),
    approval_histories: asNumber(row.approval_histories),
    policy_compliance: asNumber(row.policy_compliance),
    audit_summaries: asNumber(row.audit_summaries),
  };
}

function parseAudit(raw: unknown): ComplianceAuditEntry | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    event_type: asString(row.event_type),
    summary: asString(row.summary),
    created_at: asString(row.created_at),
  };
}

function parseArray<T>(raw: unknown, parser: (item: unknown) => T | null): T[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parser).filter((item): item is T => item != null);
}

export function buildComplianceFilterQuery(filters: ComplianceFilters): string {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.status) params.set("status", filters.status);
  if (filters.risk_level) params.set("risk_level", filters.risk_level);
  if (filters.owner) params.set("owner", filters.owner);
  if (filters.review_from) params.set("review_from", filters.review_from);
  if (filters.review_to) params.set("review_to", filters.review_to);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function parseComplianceGovernanceCenter(raw: unknown): ComplianceGovernanceCenter | null {
  const row = asRecord(raw);
  if (!row || !row.overview) return null;
  const filters = asRecord(row.filters) ?? {};

  return {
    principle: asString(
      row.principle,
      "Trust is built through accountability. Governance should enable responsible growth, not unnecessary complexity."
    ),
    filters: {
      category: filters.category ? parseEnum(filters.category, POLICY_CATEGORIES, "operational_standards") : undefined,
      status: filters.status ? parseEnum(filters.status, POLICY_STATUSES, "draft") : undefined,
      risk_level: filters.risk_level ? parseEnum(filters.risk_level, RISK_LEVELS, "medium") : undefined,
      owner: filters.owner ? asString(filters.owner) : undefined,
      review_from: filters.review_from ? asString(filters.review_from) : undefined,
      review_to: filters.review_to ? asString(filters.review_to) : undefined,
    },
    overview: parseOverview(row.overview),
    modules: Array.isArray(row.modules)
      ? row.modules
          .map((m) => parseEnum(m, GOVERNANCE_MODULES, "policy_management"))
          .filter((m): m is GovernanceModule => GOVERNANCE_MODULES.includes(m))
      : [],
    policies: parseArray(row.policies, parsePolicy),
    approvals: parseArray(row.approvals, parseApproval),
    retention: parseArray(row.retention, parseRetention),
    access: parseArray(row.access, parseAccess),
    alerts: parseArray(row.alerts, parseAlert),
    exceptions: parseArray(row.exceptions, parseException),
    reports: parseReports(row.reports),
    audit: parseArray(row.audit, parseAudit),
  };
}

export function buildComplianceGovernanceCsv(center: ComplianceGovernanceCenter): string {
  const lines: string[] = [
    "Compliance & Governance Report",
    `Generated,${new Date().toISOString()}`,
    "",
    "Overview",
    `Compliance Alerts,${center.overview.compliance_alerts}`,
    `Policies Requiring Review,${center.overview.policies_requiring_review}`,
    `Pending Approvals,${center.overview.pending_approvals}`,
    `Governance Exceptions,${center.overview.governance_exceptions}`,
    `Audit Findings,${center.overview.audit_findings}`,
    `High-Risk Activities,${center.overview.high_risk_activities}`,
    "",
    "Policies",
    "Name,Category,Owner,Status,Risk Level,Review Date",
    ...center.policies.map(
      (p) =>
        `"${p.policy_name.replace(/"/g, '""')}",${p.category},${p.owner},${p.status},${p.risk_level},${p.review_date}`
    ),
    "",
    "Pending Approvals",
    "Request,Category,Submitted By,Priority,Due Date,Approver,Risk",
    ...center.approvals.map(
      (a) =>
        `"${a.request_title.replace(/"/g, '""')}",${a.category},${a.submitted_by},${a.priority},${a.due_date},${a.approver},${a.risk_level}`
    ),
  ];
  return lines.join("\n");
}

export function buildComplianceGovernancePdfText(center: ComplianceGovernanceCenter): string {
  return [
    "Aipify — Compliance & Governance Report",
    `Generated: ${new Date().toISOString()}`,
    "",
    "Overview",
    `- Compliance alerts: ${center.overview.compliance_alerts}`,
    `- Policies requiring review: ${center.overview.policies_requiring_review}`,
    `- Pending approvals: ${center.overview.pending_approvals}`,
    `- Governance exceptions: ${center.overview.governance_exceptions}`,
    `- High-risk activities: ${center.overview.high_risk_activities}`,
    "",
    "Active policies:",
    ...center.policies.map((p) => `  • ${p.policy_name} (${p.status}, ${p.risk_level})`),
    "",
    "Pending approvals:",
    ...center.approvals.map((a) => `  • ${a.request_title} — due ${a.due_date}`),
  ].join("\n");
}
