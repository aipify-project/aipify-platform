export type OrganizationObjective = {
  id?: string;
  parent_objective_id?: string;
  hierarchy_level?: string;
  objective_name?: string;
  description?: string;
  owner_user_id?: string;
  priority?: string;
  status?: string;
  target_date?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type OrganizationKeyResult = {
  id?: string;
  objective_id?: string;
  key_result_name?: string;
  description?: string;
  starting_value?: number;
  target_value?: number;
  current_value?: number;
  progress_percentage?: number;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type OkrIntervention = {
  type?: string;
  confidence?: string;
  summary?: string;
  [key: string]: unknown;
};

export type GoalsOkrEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  active_objectives?: number;
  at_risk_key_results?: number;
  avg_progress_pct?: number;
  strategic_objectives?: number;
  [key: string]: unknown;
};

export type GoalsOkrEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  sections?: {
    active_objectives?: OrganizationObjective[];
    progress_by_department?: Record<string, unknown>[];
    at_risk_key_results?: OrganizationKeyResult[];
    completion_forecasts?: Record<string, unknown>[];
    strategic_focus_areas?: OrganizationObjective[];
  };
  hierarchy?: Record<string, unknown>[];
  key_results?: OrganizationKeyResult[];
  settings?: Record<string, unknown>;
  executive_summary?: Record<string, unknown>;
  interventions?: OkrIntervention[];
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};

export type GoalsOkrExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  objectives?: OrganizationObjective[];
  key_results?: OrganizationKeyResult[];
  summary?: Record<string, unknown>;
  interventions?: OkrIntervention[];
  [key: string]: unknown;
};
