export const DATA_CLASSIFICATIONS = [
  "public",
  "internal",
  "confidential",
  "sensitive",
  "restricted",
  "never_store",
] as const;

export const POLICY_DECISIONS = [
  "allowed",
  "denied",
  "approval_required",
  "redaction_required",
] as const;

export const PRIVACY_REQUEST_TYPES = [
  "export",
  "delete",
  "anonymize",
  "correct",
  "restrict_processing",
  "consent_withdrawal",
] as const;

export const PRIVACY_REQUEST_STATUSES = [
  "received",
  "verifying_identity",
  "in_progress",
  "waiting_approval",
  "completed",
  "rejected",
  "cancelled",
] as const;

export const INCIDENT_SEVERITIES = ["info", "low", "medium", "high", "critical"] as const;

export const INCIDENT_STATUSES = [
  "open",
  "investigating",
  "contained",
  "resolved",
  "false_positive",
  "closed",
] as const;

export type PolicyEvaluationRequest = {
  action_key: string;
  resource_type?: string;
  resource_id?: string;
  data_classification?: string;
  actor_type?: string;
  external_use?: boolean;
  cloud_sync?: boolean;
  redacted?: boolean;
  context?: Record<string, unknown>;
};

export type PolicyEvaluationResult = {
  allow: boolean;
  requires_approval: boolean;
  blocked: boolean;
  reason: string;
  decision: string;
  policy_ids?: string[];
  audit_required?: boolean;
  redaction_required?: boolean;
  decision_id?: string;
};

export type SecurityComplianceCard = {
  has_customer: boolean;
  open_incidents?: number;
  critical_incidents?: number;
  privacy_pending?: number;
  secrets_expiring?: number;
  emergency_stop_active?: boolean;
  philosophy?: string;
  privacy_note?: string;
};

export type SecurityDashboard = {
  has_customer: boolean;
  emergency_stop_active?: boolean;
  open_incidents?: number;
  critical_incidents?: number;
  secrets_expiring?: number;
  recent_incidents: SecurityIncident[];
  recent_audit_events: SecurityAuditEvent[];
  recent_policy_decisions: PolicyDecisionRecord[];
};

export type ComplianceDashboard = {
  has_customer: boolean;
  privacy_pending?: number;
  retention_policies_count?: number;
  deployment_mode?: string | null;
  privacy_requests: PrivacyRequest[];
  retention_policies: RetentionPolicy[];
  compliance_reports: ComplianceReport[];
};

export type DataGovernanceOverview = {
  has_customer: boolean;
  classifications: DataClassificationPolicy[];
  residency_policies: Record<string, unknown>[];
  retention_policies: RetentionPolicy[];
};

export type DataClassificationPolicy = {
  id?: string;
  classification_key: string;
  description?: string | null;
  default_retention_days?: number | null;
  cloud_sync_allowed: boolean;
  requires_redaction: boolean;
  requires_audit: boolean;
  requires_approval_for_external_use: boolean;
};

export type AccessPolicy = {
  id?: string;
  policy_key: string;
  resource_type: string;
  action_key: string;
  allowed_roles: string[];
  denied_roles: string[];
  data_classification?: string | null;
  requires_approval: boolean;
  audit_required: boolean;
  enabled?: boolean;
};

export type PolicyDecisionRecord = {
  id: string;
  action_key: string;
  decision: string;
  reason?: string | null;
  created_at: string;
};

export type PrivacyRequest = {
  id?: string;
  request_type: string;
  subject_email?: string | null;
  status: string;
  summary?: string | null;
  created_at?: string;
};

export type RetentionPolicy = {
  id?: string;
  data_category: string;
  retention_days: number;
  action_on_expiry: string;
  legal_hold: boolean;
  enabled: boolean;
};

export type SecurityIncident = {
  id?: string;
  incident_type: string;
  severity: string;
  title: string;
  summary?: string;
  status: string;
  created_at?: string;
};

export type SecurityAuditEvent = {
  id: string;
  event_type: string;
  actor_type: string;
  result?: string | null;
  created_at: string;
};

export type ComplianceReport = {
  id?: string;
  report_type: string;
  title: string;
  summary?: string | null;
  status: string;
  created_at?: string;
};

export type SecretReference = {
  id: string;
  secret_key: string;
  provider: string;
  purpose: string;
  status: string;
  last_rotated_at?: string | null;
  expires_at?: string | null;
  revoked_at?: string | null;
  created_at?: string;
};
