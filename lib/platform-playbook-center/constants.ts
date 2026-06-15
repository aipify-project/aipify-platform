export const PLAYBOOK_CATEGORIES = [
  "customer_onboarding",
  "customer_success",
  "billing_operations",
  "support_operations",
  "security_procedures",
  "employee_onboarding",
  "incident_response",
  "executive_workflows",
] as const;

export type PlaybookCategory = (typeof PLAYBOOK_CATEGORIES)[number];

/** Phase 291 designer trigger types */
export const DESIGNER_TRIGGER_TYPES = [
  "manual_start",
  "scheduled_execution",
  "customer_event",
  "user_event",
  "billing_event",
  "support_event",
  "growth_partner_event",
  "compliance_event",
] as const;

export type DesignerTriggerType = (typeof DESIGNER_TRIGGER_TYPES)[number];

/** Legacy + designer — parse accepts both */
export const TRIGGER_TYPES = DESIGNER_TRIGGER_TYPES;

export type TriggerType = DesignerTriggerType;

export const PLAYBOOK_STATUSES = ["draft", "active", "paused", "archived"] as const;

export type PlaybookStatus = (typeof PLAYBOOK_STATUSES)[number];

export const PLAYBOOK_PRIORITIES = ["low", "normal", "high", "critical"] as const;

export type PlaybookPriority = (typeof PLAYBOOK_PRIORITIES)[number];

export const STEP_ACTION_TYPES = [
  "send_notification",
  "create_task",
  "assign_user",
  "assign_owner",
  "request_approval",
  "update_status",
  "generate_document",
  "generate_report",
  "escalate_issue",
  "escalate_case",
  "trigger_workflow",
  "trigger_follow_up",
  "schedule_reminder",
] as const;

export type StepActionType = (typeof STEP_ACTION_TYPES)[number];

export const STEP_KINDS = ["action", "approval", "notification", "completion"] as const;

export type StepKind = (typeof STEP_KINDS)[number];

export const CONDITION_KEYS = [
  "customer_plan_enterprise",
  "customer_satisfaction_low",
  "subscription_renewal_soon",
  "partner_certification_expiring",
  "invoice_overdue",
] as const;

export type ConditionKey = (typeof CONDITION_KEYS)[number];

export const APPROVAL_ROLES = [
  "platform_admin",
  "department_manager",
  "super_admin",
  "executive_user",
] as const;

export type ApprovalRole = (typeof APPROVAL_ROLES)[number];

export const EXECUTION_OUTCOMES = [
  "successful",
  "partially_successful",
  "failed",
  "cancelled",
] as const;

export type ExecutionOutcome = (typeof EXECUTION_OUTCOMES)[number];

export const EXECUTION_STATUSES = ["running", "paused", "completed", "failed", "test"] as const;

export type ExecutionStatus = (typeof EXECUTION_STATUSES)[number];

export const DESIGNER_SURFACES = ["platform", "super"] as const;

export type DesignerSurface = (typeof DESIGNER_SURFACES)[number];

export const FLOW_NODES = [
  "trigger",
  "conditions",
  "tasks",
  "approval",
  "notifications",
  "completed",
] as const;

export type FlowNode = (typeof FLOW_NODES)[number];

export const STATUS_BADGES: Record<PlaybookStatus, string> = {
  draft: "bg-gray-100 text-gray-800 ring-gray-200",
  active: "bg-green-50 text-green-800 ring-green-200",
  paused: "bg-amber-50 text-amber-900 ring-amber-200",
  archived: "bg-slate-100 text-slate-700 ring-slate-200",
};

export const OUTCOME_BADGES: Record<ExecutionOutcome, string> = {
  successful: "bg-green-50 text-green-800 ring-green-200",
  partially_successful: "bg-amber-50 text-amber-900 ring-amber-200",
  failed: "bg-red-50 text-red-800 ring-red-200",
  cancelled: "bg-slate-100 text-slate-700 ring-slate-200",
};

export const PRIORITY_BADGES: Record<PlaybookPriority, string> = {
  low: "bg-slate-50 text-slate-700 ring-slate-200",
  normal: "bg-blue-50 text-blue-800 ring-blue-200",
  high: "bg-amber-50 text-amber-900 ring-amber-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};

/** Map legacy trigger values from older RPC responses */
export const LEGACY_TRIGGER_MAP: Record<string, DesignerTriggerType> = {
  manual: "manual_start",
  scheduled: "scheduled_execution",
  event_based: "customer_event",
  conditional: "billing_event",
};
