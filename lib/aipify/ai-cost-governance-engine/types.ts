export type AiUsageEvent = {
  id?: string;
  module_key?: string;
  workflow_id?: string;
  task_tier?: string;
  input_tokens?: number;
  output_tokens?: number;
  total_tokens?: number;
  estimated_cost?: number;
  request_type?: string;
  status?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type AiBudget = {
  id?: string;
  budget_name?: string;
  scope_type?: string;
  scope_id?: string;
  period?: string;
  soft_limit_amount?: number;
  hard_limit_amount?: number;
  currency?: string;
  status?: string;
  spent?: number;
  pct_of_hard_limit?: number;
  [key: string]: unknown;
};

export type AiBudgetAlert = {
  id?: string;
  budget_id?: string;
  alert_level?: string;
  message?: string;
  acknowledged?: boolean;
  created_at?: string;
  [key: string]: unknown;
};

export type AiCostOptimizationRecommendation = {
  id?: string;
  recommendation_type?: string;
  summary?: string;
  estimated_savings?: number;
  status?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type AiCostGovernanceSettings = {
  organization_id?: string;
  default_soft_limit?: number;
  default_hard_limit?: number;
  currency?: string;
  routing_rules?: Record<string, unknown>[];
  context_limits?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type AiCostGovernanceEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  total_cost_mtd?: number;
  budget_pct?: number;
  blocked_count_mtd?: number;
  unacknowledged_alerts?: number;
  [key: string]: unknown;
};

export type AiCostGovernanceEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  settings?: AiCostGovernanceSettings;
  sections?: {
    by_module?: Record<string, unknown>[];
    by_user?: Record<string, unknown>[];
    by_task_tier?: Record<string, unknown>[];
    budgets?: AiBudget[];
    alerts?: AiBudgetAlert[];
    blocked_requests?: AiUsageEvent[];
    optimization_recommendations?: AiCostOptimizationRecommendation[];
  };
  recent_usage?: AiUsageEvent[];
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};

export type AiCostGovernanceExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  settings?: AiCostGovernanceSettings;
  summary?: Record<string, unknown>;
  budgets?: AiBudget[];
  usage_events?: AiUsageEvent[];
  alerts?: AiBudgetAlert[];
  recommendations?: AiCostOptimizationRecommendation[];
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};
