export type CompanionRiskLevel = "low" | "medium" | "high" | "critical";

export type CompanionActionCategory =
  | "documents"
  | "communication"
  | "scheduling"
  | "reporting"
  | "knowledge"
  | "integrations"
  | "commerce"
  | "operations"
  | "external_services"
  | "companion_actions";

export type CompanionActionRequest = {
  id: string;
  title: string;
  description: string;
  reason: string;
  risk_level: CompanionRiskLevel | string;
  category: string;
  requested_for: string;
  approval_status: string;
  lifecycle_status: string;
  expires_at: string;
  expected_outcome: string;
};

export type CompanionActionPolicy = {
  id: string;
  policy_key: string;
  policy_label: string;
  category: string;
  allowed: boolean;
  requires_approval: boolean;
  prohibited: boolean;
  auto_approve_low_risk: boolean;
  workflow_type: string;
};

export type CompanionActionQueueItem = {
  id: string;
  action_request_id: string;
  queue_status: string;
  title: string;
  queued_at: string;
};

export type CompanionActionReceipt = {
  id: string;
  action_request_id: string;
  result_summary: string;
  duration_ms: number;
  audit_reference: string;
  created_at: string;
  title: string;
};

export type CompanionActionAuditEntry = {
  id: string;
  event_type: string;
  summary: string;
  created_at: string;
};

export type CompanionActionCenter = {
  has_access: boolean;
  positioning: string;
  execution_enabled: boolean;
  emergency_stop_active: boolean;
  automation_disabled: boolean;
  limits: {
    daily_action_limit: number;
    max_risk_level: string;
    business_hours_only: boolean;
    approval_threshold: string;
  };
  pending_actions: CompanionActionRequest[];
  execution_queue: CompanionActionQueueItem[];
  action_history: Array<{
    id: string;
    title: string;
    risk_level: string;
    category: string;
    lifecycle_status: string;
    execution_status: string;
    created_at: string;
  }>;
  policies: CompanionActionPolicy[];
  safety_center: {
    blocked_actions: Array<{ title: string; reason: string }>;
    failed_actions: Array<{ id: string; title: string }>;
    risk_alerts: Array<{ title: string; risk_level: string }>;
  };
  receipts: CompanionActionReceipt[];
  audit_logs: CompanionActionAuditEntry[];
  cross_link_trust_approvals: string;
  confirmation_examples: string[];
};
