import type {
  ExplainabilityRecord,
  GovernanceApproval,
  GovernanceAuditEntry,
  GovernanceCenter,
  GovernancePermission,
  GovernanceSettings,
  GovernanceTrustScore,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && !Number.isNaN(value) ? value : fallback;
}

function asBool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function parseGovernanceCenter(raw: unknown): GovernanceCenter {
  const data = asRecord(raw);
  const metrics = asRecord(data.metrics);
  const emergency = asRecord(data.emergency);

  return {
    has_customer: asBool(data.has_customer),
    has_access: asBool(data.has_access),
    upgrade_required: asBool(data.upgrade_required),
    enabled: asBool(data.enabled),
    governance_mode: asString(data.governance_mode, "safe") as GovernanceCenter["governance_mode"],
    privacy_note: asString(data.privacy_note),
    emergency: {
      enabled: asBool(emergency.enabled),
      reason: emergency.reason ? asString(emergency.reason) : null,
      activated_at: emergency.activated_at ? asString(emergency.activated_at) : null,
      state: asString(emergency.state, "normal"),
    },
    metrics: {
      pending_approvals: asNumber(metrics.pending_approvals),
      blocked_actions: asNumber(metrics.blocked_actions),
      avg_trust_score: asNumber(metrics.avg_trust_score),
      audit_events_24h: asNumber(metrics.audit_events_24h),
    },
    pending_approvals: Array.isArray(data.pending_approvals)
      ? data.pending_approvals.map(parseGovernanceApproval)
      : [],
    recent_audit: Array.isArray(data.recent_audit)
      ? data.recent_audit.map(parseGovernanceAuditEntry)
      : [],
    trust_scores: Array.isArray(data.trust_scores)
      ? data.trust_scores.map(parseGovernanceTrustScore)
      : [],
  };
}

export function parseGovernanceApproval(raw: unknown): GovernanceApproval {
  const data = asRecord(raw);
  return {
    id: asString(data.id),
    action_type: asString(data.action_type),
    title: asString(data.title),
    summary: asString(data.summary),
    risk_level: asString(data.risk_level, "medium") as GovernanceApproval["risk_level"],
    explanation: data.explanation ? asString(data.explanation) : null,
    approval_scope: data.approval_scope ? asString(data.approval_scope) : null,
    status: asString(data.status, "pending") as GovernanceApproval["status"],
    requested_by_ai: asBool(data.requested_by_ai),
    source_type: asString(data.source_type, "governance"),
    source_id: data.source_id ? asString(data.source_id) : null,
    expires_at: data.expires_at ? asString(data.expires_at) : null,
    created_at: asString(data.created_at),
  };
}

export function parseGovernanceAuditEntry(raw: unknown): GovernanceAuditEntry {
  const data = asRecord(raw);
  return {
    id: asString(data.id),
    actor_type: asString(data.actor_type),
    action: asString(data.action),
    action_category: data.action_category ? asString(data.action_category) : null,
    result: data.result ? asString(data.result) : null,
    explanation_reference: data.explanation_reference
      ? asString(data.explanation_reference)
      : null,
    metadata: asRecord(data.metadata),
    created_at: asString(data.created_at),
  };
}

export function parseGovernanceTrustScore(raw: unknown): GovernanceTrustScore {
  const data = asRecord(raw);
  return {
    id: asString(data.id),
    automation_id: data.automation_id ? asString(data.automation_id) : null,
    action_key: asString(data.action_key),
    success_count: asNumber(data.success_count),
    failure_count: asNumber(data.failure_count),
    approval_count: asNumber(data.approval_count),
    trust_score: asNumber(data.trust_score),
    last_calculated_at: asString(data.last_calculated_at),
  };
}

export function parseGovernancePermission(raw: unknown): GovernancePermission {
  const data = asRecord(raw);
  return {
    id: asString(data.id),
    action_key: asString(data.action_key),
    permission_level: asString(data.permission_level, "approval_required") as GovernancePermission["permission_level"],
    risk_level: asString(data.risk_level, "medium") as GovernancePermission["risk_level"],
    requires_approval: asBool(data.requires_approval, true),
    enabled: asBool(data.enabled, true),
  };
}

export function parseGovernanceSettings(raw: unknown): {
  has_customer: boolean;
  has_access: boolean;
  upgrade_required: boolean;
  settings: GovernanceSettings | null;
} {
  const data = asRecord(raw);
  const settings = data.settings ? asRecord(data.settings) : null;
  return {
    has_customer: asBool(data.has_customer),
    has_access: asBool(data.has_access),
    upgrade_required: asBool(data.upgrade_required),
    settings: settings
      ? {
          governance_mode: asString(settings.governance_mode, "safe") as GovernanceSettings["governance_mode"],
          approval_defaults: asRecord(settings.approval_defaults),
          emergency_controls_enabled: asBool(settings.emergency_controls_enabled, true),
          explainability_enabled: asBool(settings.explainability_enabled, true),
          trust_scoring_enabled: asBool(settings.trust_scoring_enabled, true),
          audit_retention_days: asNumber(settings.audit_retention_days, 365),
        }
      : null,
  };
}

export function parseExplainabilityRecord(raw: unknown): ExplainabilityRecord {
  const data = asRecord(raw);
  return {
    id: asString(data.id),
    action_reference: asString(data.action_reference),
    explanation: asString(data.explanation),
    evidence: asRecord(data.evidence),
    confidence_score: asNumber(data.confidence_score),
    generated_at: asString(data.generated_at),
  };
}
