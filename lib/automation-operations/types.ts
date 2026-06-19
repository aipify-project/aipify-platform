export type AutomationOperationsTab =
  | "overview"
  | "workflows"
  | "triggers"
  | "actions"
  | "approvals"
  | "conditions"
  | "templates"
  | "history"
  | "reports";

export type AutomationWorkflow = {
  id: string;
  workflow_number?: string;
  name: string;
  description?: string;
  status: string;
  trigger_type: string;
  trigger_config?: Record<string, unknown>;
  conditions?: unknown[];
  actions?: unknown[];
  approvals_required?: boolean;
  business_pack_key?: string;
  execution_count?: number;
  success_count?: number;
  failure_count?: number;
};

export type AutomationTemplate = {
  id: string;
  template_key: string;
  title: string;
  description?: string;
  category: string;
  trigger_type: string;
  business_pack_key?: string;
  reusable?: boolean;
};

export type AutomationExecution = {
  id: string;
  execution_number?: string;
  workflow_id?: string;
  status: string;
  result_summary?: string;
  error_message?: string;
  duration_ms?: number;
  retry_count?: number;
  started_at?: string;
  completed_at?: string;
};

export type AutomationOperationsCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  safety_controls?: Record<string, unknown>;
  overview?: Record<string, string | number | undefined>;
  workflows?: AutomationWorkflow[];
  triggers?: { key: string; label: string }[];
  actions?: { key: string; label: string }[];
  conditions?: Record<string, unknown>;
  approvals?: Record<string, unknown>[];
  templates?: AutomationTemplate[];
  history?: AutomationExecution[];
  monitoring?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  companion_integration?: Record<string, unknown>;
  companion_insights?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; created_at?: string }[];
  routes?: Record<string, string>;
  error?: string;
};
