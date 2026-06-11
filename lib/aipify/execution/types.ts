export type ExecutionLevel = "observer" | "assistant" | "operator" | "autonomous";

export type ActionStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "scheduled"
  | "executing"
  | "executed"
  | "failed"
  | "cancelled"
  | "blocked";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type AefSettings = {
  autonomous_enabled: boolean;
  multi_admin_approval: boolean;
  allow_critical_review: boolean;
};

export type AipifyAction = {
  id: string;
  action_type: string;
  title: string;
  description?: string;
  preview_text?: string;
  payload_json?: Record<string, unknown>;
  risk_level: RiskLevel;
  execution_level: ExecutionLevel;
  status: ActionStatus;
  requires_approval?: boolean;
  required_approvals?: number;
  approval_count?: number;
  estimated_impact?: string;
  created_by_module?: string;
  scheduled_for?: string;
  executed_at?: string;
  failure_reason?: string;
  rollback_available?: boolean;
  created_at?: string;
};

export type ActionCenter = {
  has_customer: boolean;
  has_access?: boolean;
  plan?: string;
  upgrade_required?: boolean;
  user_role?: string;
  settings?: AefSettings;
  counts?: Record<string, number>;
  pending_actions?: AipifyAction[];
  recent_executed?: AipifyAction[];
  rules?: Array<Record<string, unknown>>;
  audit_log?: Array<Record<string, unknown>>;
  permissions?: Array<Record<string, unknown>>;
  ethical_principles?: string[];
  privacy_note?: string;
};

export type SafetyResult = {
  safe: boolean;
  blocked: boolean;
  reason: string | null;
};

export type AdapterResult = {
  preview: string;
  valid: boolean;
  executed?: boolean;
  message?: string;
  rollback?: boolean;
};
