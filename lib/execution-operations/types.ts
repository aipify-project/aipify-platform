export type ExecutionOperationsTab =
  | "overview"
  | "pending_actions"
  | "approved_actions"
  | "execution_history"
  | "integrations"
  | "permissions"
  | "approvals"
  | "reports"
  | "executive";

export type ExecutionActionCatalogItem = {
  id: string;
  action_key?: string;
  action_type: string;
  action_category?: string;
  title: string;
  description?: string;
  risk_level?: string;
  requires_approval?: boolean;
  business_pack_key?: string;
  domain_scope?: string;
  is_active?: boolean;
};

export type ExecutionRequest = {
  id: string;
  action_type: string;
  action_category?: string;
  title: string;
  summary?: string;
  status?: string;
  risk_level?: string;
  approval_status?: string;
  domain_scope?: string;
  business_pack_key?: string;
  payload?: unknown;
  result?: unknown;
  created_at?: string;
  executed_at?: string;
};

export type ExecutionQueueItem = {
  id: string;
  request_id?: string;
  queue_status?: string;
  step_label?: string;
  execution_time_ms?: number;
  retry_count?: number;
  error_summary?: string;
  request_title?: string;
  started_at?: string;
  completed_at?: string;
};

export type ExecutionTemplate = {
  id: string;
  template_key?: string;
  title: string;
  description?: string;
  template_category?: string;
  steps?: unknown;
  approval_chain?: unknown;
};

export type ExecutionOperationsCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  overview?: Record<string, string | number | undefined>;
  execution_workflow?: string[];
  action_catalog?: ExecutionActionCatalogItem[];
  pending_actions?: ExecutionRequest[];
  approved_actions?: ExecutionRequest[];
  execution_history?: ExecutionRequest[];
  execution_queue?: ExecutionQueueItem[];
  execution_templates?: ExecutionTemplate[];
  permission_engine?: Record<string, unknown>;
  approval_escalation?: Record<string, unknown>;
  meeting_orchestration?: Record<string, unknown>;
  communication_actions?: Record<string, unknown>;
  document_actions?: Record<string, unknown>;
  task_orchestration?: Record<string, unknown>;
  multi_step_execution?: Record<string, unknown>;
  external_action_framework?: Record<string, unknown>;
  domain_awareness?: Record<string, unknown>;
  business_pack_integration?: Record<string, unknown>;
  execution_monitoring?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  companion_assistant?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  integrations?: Record<string, unknown>;
  mobile_access?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; section?: string; created_at?: string }[];
  routes?: Record<string, string>;
  error?: string;
};
