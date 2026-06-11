import type {
  AccessPolicy,
  ComplianceDashboard,
  ComplianceReport,
  DataClassificationPolicy,
  DataGovernanceOverview,
  PolicyDecisionRecord,
  PolicyEvaluationResult,
  PrivacyRequest,
  RetentionPolicy,
  SecretReference,
  SecurityAuditEvent,
  SecurityComplianceCard,
  SecurityDashboard,
  SecurityIncident,
} from "./types";

export function parsePolicyEvaluationResult(data: unknown): PolicyEvaluationResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    allow: Boolean(d.allow),
    requires_approval: Boolean(d.requires_approval),
    blocked: Boolean(d.blocked),
    reason: String(d.reason ?? ""),
    decision: String(d.decision ?? ""),
    policy_ids: Array.isArray(d.policy_ids) ? (d.policy_ids as string[]) : [],
    audit_required: d.audit_required as boolean | undefined,
    redaction_required: d.redaction_required as boolean | undefined,
    decision_id: d.decision_id as string | undefined,
  };
}

export function parseSecurityComplianceCard(data: unknown): SecurityComplianceCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    open_incidents: d.open_incidents as number | undefined,
    critical_incidents: d.critical_incidents as number | undefined,
    privacy_pending: d.privacy_pending as number | undefined,
    secrets_expiring: d.secrets_expiring as number | undefined,
    emergency_stop_active: d.emergency_stop_active as boolean | undefined,
    philosophy: d.philosophy as string | undefined,
    privacy_note: d.privacy_note as string | undefined,
  };
}

export function parseSecurityDashboard(data: unknown): SecurityDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  const list = (key: string, parser: (r: unknown) => unknown) =>
    Array.isArray(d[key]) ? (d[key] as unknown[]).map(parser) : [];
  return {
    has_customer: Boolean(d.has_customer),
    emergency_stop_active: d.emergency_stop_active as boolean | undefined,
    open_incidents: d.open_incidents as number | undefined,
    critical_incidents: d.critical_incidents as number | undefined,
    secrets_expiring: d.secrets_expiring as number | undefined,
    recent_incidents: list("recent_incidents", parseIncident) as SecurityIncident[],
    recent_audit_events: list("recent_audit_events", parseAuditEvent) as SecurityAuditEvent[],
    recent_policy_decisions: list("recent_policy_decisions", parsePolicyDecision) as PolicyDecisionRecord[],
  };
}

function parseIncident(row: unknown): SecurityIncident {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: s.id as string | undefined,
    incident_type: String(s.incident_type ?? ""),
    severity: String(s.severity ?? ""),
    title: String(s.title ?? ""),
    summary: s.summary as string | undefined,
    status: String(s.status ?? ""),
    created_at: s.created_at as string | undefined,
  };
}

function parseAuditEvent(row: unknown): SecurityAuditEvent {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: String(s.id ?? ""),
    event_type: String(s.event_type ?? ""),
    actor_type: String(s.actor_type ?? ""),
    result: s.result as string | null | undefined,
    created_at: String(s.created_at ?? ""),
  };
}

function parsePolicyDecision(row: unknown): PolicyDecisionRecord {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: String(s.id ?? ""),
    action_key: String(s.action_key ?? ""),
    decision: String(s.decision ?? ""),
    reason: s.reason as string | null | undefined,
    created_at: String(s.created_at ?? ""),
  };
}

export function parseComplianceDashboard(data: unknown): ComplianceDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    privacy_pending: d.privacy_pending as number | undefined,
    retention_policies_count: d.retention_policies_count as number | undefined,
    deployment_mode: d.deployment_mode as string | null | undefined,
    privacy_requests: parsePrivacyRequests(d.privacy_requests),
    retention_policies: parseRetentionPolicies(d.retention_policies),
    compliance_reports: parseComplianceReports(d.compliance_reports),
  };
}

export function parsePrivacyRequests(data: unknown): PrivacyRequest[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const s = (row ?? {}) as Record<string, unknown>;
    return {
      id: s.id as string | undefined,
      request_type: String(s.request_type ?? ""),
      subject_email: s.subject_email as string | null | undefined,
      status: String(s.status ?? ""),
      summary: s.summary as string | null | undefined,
      created_at: s.created_at as string | undefined,
    };
  });
}

export function parseRetentionPolicies(data: unknown): RetentionPolicy[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const s = (row ?? {}) as Record<string, unknown>;
    return {
      id: s.id as string | undefined,
      data_category: String(s.data_category ?? ""),
      retention_days: Number(s.retention_days ?? 0),
      action_on_expiry: String(s.action_on_expiry ?? "delete"),
      legal_hold: Boolean(s.legal_hold),
      enabled: Boolean(s.enabled ?? true),
    };
  });
}

export function parseComplianceReports(data: unknown): ComplianceReport[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const s = (row ?? {}) as Record<string, unknown>;
    return {
      id: s.id as string | undefined,
      report_type: String(s.report_type ?? ""),
      title: String(s.title ?? ""),
      summary: s.summary as string | null | undefined,
      status: String(s.status ?? ""),
      created_at: s.created_at as string | undefined,
    };
  });
}

export function parseDataGovernanceOverview(data: unknown): DataGovernanceOverview {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    classifications: parseClassifications(d.classifications),
    residency_policies: Array.isArray(d.residency_policies) ? (d.residency_policies as Record<string, unknown>[]) : [],
    retention_policies: parseRetentionPolicies(d.retention_policies),
  };
}

function parseClassifications(data: unknown): DataClassificationPolicy[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const s = (row ?? {}) as Record<string, unknown>;
    return {
      id: s.id as string | undefined,
      classification_key: String(s.classification_key ?? ""),
      description: s.description as string | null | undefined,
      default_retention_days: s.default_retention_days as number | null | undefined,
      cloud_sync_allowed: Boolean(s.cloud_sync_allowed),
      requires_redaction: Boolean(s.requires_redaction),
      requires_audit: Boolean(s.requires_audit),
      requires_approval_for_external_use: Boolean(s.requires_approval_for_external_use),
    };
  });
}

export function parseAccessPolicies(data: unknown): AccessPolicy[] {
  const d = (data ?? {}) as Record<string, unknown>;
  const policies = d.policies ?? data;
  if (!Array.isArray(policies)) return [];
  return policies.map((row) => {
    const s = (row ?? {}) as Record<string, unknown>;
    return {
      id: s.id as string | undefined,
      policy_key: String(s.policy_key ?? ""),
      resource_type: String(s.resource_type ?? ""),
      action_key: String(s.action_key ?? ""),
      allowed_roles: Array.isArray(s.allowed_roles) ? (s.allowed_roles as string[]) : [],
      denied_roles: Array.isArray(s.denied_roles) ? (s.denied_roles as string[]) : [],
      data_classification: s.data_classification as string | null | undefined,
      requires_approval: Boolean(s.requires_approval),
      audit_required: Boolean(s.audit_required),
      enabled: s.enabled as boolean | undefined,
    };
  });
}

export function parseSecurityIncidents(data: unknown): SecurityIncident[] {
  const d = (data ?? {}) as Record<string, unknown>;
  const incidents = d.incidents ?? data;
  if (!Array.isArray(incidents)) return [];
  return incidents.map(parseIncident);
}

export function parseSecretReferences(data: unknown): SecretReference[] {
  const d = (data ?? {}) as Record<string, unknown>;
  const secrets = d.secrets ?? data;
  if (!Array.isArray(secrets)) return [];
  return secrets.map((row) => {
    const s = (row ?? {}) as Record<string, unknown>;
    return {
      id: String(s.id ?? ""),
      secret_key: String(s.secret_key ?? ""),
      provider: String(s.provider ?? ""),
      purpose: String(s.purpose ?? ""),
      status: String(s.status ?? ""),
      last_rotated_at: s.last_rotated_at as string | null | undefined,
      expires_at: s.expires_at as string | null | undefined,
      revoked_at: s.revoked_at as string | null | undefined,
      created_at: s.created_at as string | undefined,
    };
  });
}
