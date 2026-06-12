export type OrganizationCapacityProfile = {
  id?: string;
  user_id?: string;
  team_id?: string;
  available_hours_per_week?: number;
  workload_limit?: number;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type OrganizationWorkloadItem = {
  id?: string;
  user_id?: string;
  source_type?: string;
  source_id?: string;
  estimated_effort?: number;
  priority?: string;
  due_date?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type OrganizationWorkloadWarning = {
  id?: string;
  user_id?: string;
  warning_type?: string;
  severity?: string;
  status?: string;
  summary?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type CapacityRebalancingRecommendation = {
  type?: string;
  confidence?: string;
  summary?: string;
  [key: string]: unknown;
};

export type CapacityWorkloadManagementEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  overloaded_users?: number;
  open_warnings?: number;
  unassigned_work?: number;
  upcoming_risks_7d?: number;
  [key: string]: unknown;
};

export type CapacityWorkloadManagementEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  sections?: {
    user_workload?: Record<string, unknown>[];
    team_workload?: Record<string, unknown>[];
    overloaded_users?: OrganizationCapacityProfile[];
    upcoming_capacity_risks?: OrganizationWorkloadItem[];
    unassigned_work?: OrganizationWorkloadItem[];
    workload_trends?: Record<string, unknown>[];
  };
  my_workload_items?: OrganizationWorkloadItem[];
  warnings?: OrganizationWorkloadWarning[];
  recommendations?: CapacityRebalancingRecommendation[];
  settings?: Record<string, unknown>;
  executive_summary?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};

export type CapacityWorkloadExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  profiles?: OrganizationCapacityProfile[];
  workload_items?: OrganizationWorkloadItem[];
  warnings?: OrganizationWorkloadWarning[];
  summary?: Record<string, unknown>;
  recommendations?: CapacityRebalancingRecommendation[];
  [key: string]: unknown;
};
