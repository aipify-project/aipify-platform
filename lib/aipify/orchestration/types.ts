export const EVENT_SEVERITIES = ["info", "low", "medium", "high", "critical"] as const;

export const EVENT_STATUSES = [
  "received",
  "processing",
  "processed",
  "failed",
  "ignored",
  "blocked",
] as const;

export const FLOW_STATUSES = [
  "pending",
  "running",
  "waiting_approval",
  "completed",
  "failed",
  "blocked",
  "cancelled",
] as const;

export const STEP_STATUSES = [
  "pending",
  "running",
  "completed",
  "failed",
  "skipped",
  "blocked",
  "waiting_approval",
] as const;

export const DISPATCH_STATUSES = ["queued", "sent", "acknowledged", "failed", "blocked"] as const;

export const RISK_LEVELS = ["low", "medium", "high"] as const;

export type OrchestrationEventPayload = {
  source_module: string;
  source_type?: string;
  source_id?: string;
  event_type: string;
  severity?: string;
  event_key?: string;
  payload?: Record<string, unknown>;
  context?: Record<string, unknown>;
  occurred_at?: string;
};

export type OrchestrationCard = {
  has_customer: boolean;
  events_today?: number;
  active_flows?: number;
  blocked_flows?: number;
  failed_flows?: number;
  waiting_approvals?: number;
  emergency_stop_active?: boolean;
  enabled?: boolean;
  philosophy?: string;
};

export type OrchestrationEvent = {
  id: string;
  event_key: string;
  source_module: string;
  source_type: string;
  source_id?: string | null;
  event_type: string;
  severity: string;
  priority_score: number;
  status: string;
  duplicate_count?: number;
  occurred_at?: string;
  created_at?: string;
};

export type OrchestrationFlow = {
  id: string;
  flow_key: string;
  name: string;
  status: string;
  current_step?: string | null;
  result_summary?: string | null;
  trigger_event_id?: string | null;
  started_at?: string;
  completed_at?: string | null;
};

export type OrchestrationStep = {
  id: string;
  step_order: number;
  step_key: string;
  module_key: string;
  action_key: string;
  status: string;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error_message?: string | null;
};

export type OrchestrationRule = {
  id: string;
  tenant_id?: string | null;
  rule_key: string;
  name: string;
  description?: string | null;
  enabled: boolean;
  source_module?: string | null;
  event_type: string;
  conditions?: Record<string, unknown>;
  actions?: Record<string, unknown>[];
  risk_level: string;
  requires_policy_check: boolean;
};

export type OrchestrationSettings = {
  enabled: boolean;
  auto_route_events: boolean;
  require_policy_engine: boolean;
  allow_cross_module_dispatch: boolean;
  max_flow_steps: number;
  max_parallel_flows: number;
  notify_on_critical: boolean;
  create_actions_for_high: boolean;
  create_actions_for_medium: boolean;
  suppress_duplicate_events: boolean;
  duplicate_window_minutes: number;
};

export type OrchestrationAuditEntry = {
  id: string;
  action: string;
  result?: string | null;
  created_at: string;
};

export type OrchestrationDashboard = {
  has_customer: boolean;
  events_today?: number;
  active_flows?: number;
  failed_flows?: number;
  blocked_flows?: number;
  waiting_approvals?: number;
  duplicates_suppressed?: number;
  emergency_stop_active?: boolean;
  recent_events: OrchestrationEvent[];
  recent_flows: OrchestrationFlow[];
  top_modules: { source_module: string; count: number }[];
  recent_audit: OrchestrationAuditEntry[];
};

export type OrchestrationFlowDetail = {
  flow: OrchestrationFlow;
  steps: OrchestrationStep[];
  dispatches: Record<string, unknown>[];
  audit: OrchestrationAuditEntry[];
};
