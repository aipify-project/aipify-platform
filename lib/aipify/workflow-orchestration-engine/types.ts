export const WORKFLOW_STATUSES = ["draft", "active", "paused", "archived"] as const;
export const WORKFLOW_TRUST_LEVELS = ["advisory", "standard", "elevated", "delegated"] as const;
export const WORKFLOW_TRIGGER_TYPES = [
  "support_case_created",
  "approval_requested",
  "incident_detected",
  "kc_article_updated",
  "customer_health_decline",
  "overdue_task",
  "manual",
] as const;
export const WORKFLOW_ACTION_TYPES = [
  "create_task",
  "send_notification",
  "generate_draft",
  "request_approval",
  "escalate",
  "update_status",
] as const;
export const WORKFLOW_EXECUTION_OUTCOMES = [
  "completed",
  "failed",
  "partial",
  "awaiting_approval",
  "cancelled",
] as const;

export type WorkflowOrchestrationEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  active_workflows?: number;
  approval_bottlenecks?: number;
  [key: string]: unknown;
};

export type WorkflowOrchestrationEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  safety_note?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  workflows?: unknown[];
  templates?: unknown[];
  recent_executions?: unknown[];
  integration_links?: Record<string, string>;
  [key: string]: unknown;
};
