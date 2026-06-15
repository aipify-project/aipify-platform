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

export const TRIGGER_TYPES = ["manual", "scheduled", "event_based", "conditional"] as const;

export type TriggerType = (typeof TRIGGER_TYPES)[number];

export const PLAYBOOK_STATUSES = ["draft", "active", "paused", "archived"] as const;

export type PlaybookStatus = (typeof PLAYBOOK_STATUSES)[number];

export const STEP_ACTION_TYPES = [
  "send_notification",
  "create_task",
  "assign_user",
  "request_approval",
  "update_status",
  "generate_document",
  "escalate_issue",
  "trigger_workflow",
] as const;

export type StepActionType = (typeof STEP_ACTION_TYPES)[number];

export const EXECUTION_OUTCOMES = [
  "successful",
  "partially_successful",
  "failed",
  "cancelled",
] as const;

export type ExecutionOutcome = (typeof EXECUTION_OUTCOMES)[number];

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
