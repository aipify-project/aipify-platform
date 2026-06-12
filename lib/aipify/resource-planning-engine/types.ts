export type OrganizationResourcePlan = {
  id?: string;
  plan_name?: string;
  planning_period?: string;
  owner_user_id?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type OrganizationResourceAllocation = {
  id?: string;
  plan_id?: string;
  resource_type?: string;
  allocated_amount?: number;
  utilized_amount?: number;
  variance?: number;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type OrganizationResourceScenario = {
  id?: string;
  plan_id?: string;
  scenario_name?: string;
  status?: string;
  allocation_snapshot?: unknown[];
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type ResourcePlanningRecommendation = {
  type?: string;
  confidence?: string;
  summary?: string;
  [key: string]: unknown;
};

export type ResourcePlanningEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  active_plans?: number;
  over_utilized_allocations?: number;
  planning_gaps?: number;
  avg_utilization_pct?: number;
  [key: string]: unknown;
};

export type ResourcePlanningEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  sections?: {
    resource_availability?: Record<string, unknown>[];
    allocation_summaries?: OrganizationResourceAllocation[];
    utilization_trends?: Record<string, unknown>[];
    planning_gaps?: OrganizationResourceAllocation[];
    optimization_opportunities?: ResourcePlanningRecommendation[];
  };
  plans?: OrganizationResourcePlan[];
  scenarios?: OrganizationResourceScenario[];
  settings?: Record<string, unknown>;
  executive_summary?: Record<string, unknown>;
  recommendations?: ResourcePlanningRecommendation[];
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};

export type ResourcePlanningExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  plans?: OrganizationResourcePlan[];
  allocations?: OrganizationResourceAllocation[];
  scenarios?: OrganizationResourceScenario[];
  summary?: Record<string, unknown>;
  [key: string]: unknown;
};
