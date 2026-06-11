export type OrganizationalHealthScore = {
  id?: string;
  health_category?: string;
  health_score?: number;
  health_status?: string;
  measured_at?: string;
  indicators?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type OrganizationalHealthIntervention = {
  id?: string;
  category?: string;
  recommendation?: string;
  status?: string;
  approved_at?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type OrganizationalHealthEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  overall_score?: number;
  overall_status?: string;
  categories_measured?: number;
  pending_interventions?: number;
  [key: string]: unknown;
};

export type OrganizationalHealthEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  scores?: OrganizationalHealthScore[];
  interventions?: OrganizationalHealthIntervention[];
  executive_summary?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  [key: string]: unknown;
};

export type OrganizationalHealthReportExport = {
  has_organization?: boolean;
  exported_at?: string;
  report_type?: string;
  scores?: OrganizationalHealthScore[];
  interventions?: OrganizationalHealthIntervention[];
  summary?: Record<string, unknown>;
  [key: string]: unknown;
};
