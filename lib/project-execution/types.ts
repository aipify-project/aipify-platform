export type ProjectRecord = {
  id: string;
  project_number?: string | null;
  name: string;
  description?: string | null;
  project_type: string;
  customer_name?: string | null;
  department_name?: string | null;
  project_manager_name?: string | null;
  domain_name?: string | null;
  business_pack_key?: string | null;
  status: string;
  start_date?: string | null;
  target_date?: string | null;
  budget_amount: number;
  budget_spent: number;
  budget_remaining?: number;
  completion_percent: number;
};

export type ProjectExecutionCenter = {
  found: boolean;
  principle?: string;
  overview?: Record<string, unknown>;
  active_projects?: ProjectRecord[];
  planning_projects?: ProjectRecord[];
  milestones?: Record<string, unknown>[];
  deliverables?: Record<string, unknown>[];
  resources?: Record<string, unknown>[];
  budgets?: Record<string, unknown>[];
  risks?: Record<string, unknown>[];
  approvals?: Record<string, unknown>[];
  templates?: Record<string, unknown>[];
  timeline?: Record<string, unknown>[];
  reports?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; created_at: string }[];
  routes?: Record<string, string>;
};
