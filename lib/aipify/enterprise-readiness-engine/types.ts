export type EnterpriseReadinessEngineCard = {
  has_organization: boolean;
  overall_readiness_score?: number;
  health_status?: string;
  philosophy?: string;
  [key: string]: unknown;
};

export type EnterpriseReadinessSummary = {
  overall_readiness_score?: number;
  health_status?: string;
  delegated_admin_count?: number;
  active_approval_chains?: number;
  pending_milestones?: number;
  integration_connected_count?: number;
};

export type EnterpriseReadinessEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: EnterpriseReadinessSummary;
  health_overview?: Record<string, unknown>;
  approval_bottlenecks: Array<Record<string, unknown>>;
  security_posture?: Record<string, unknown>;
  integration_landscape?: Record<string, unknown>;
  operational_risks: Array<Record<string, unknown>>;
  delegated_admins: Array<Record<string, unknown>>;
  approval_chains: Array<Record<string, unknown>>;
  onboarding_milestones: Array<Record<string, unknown>>;
  enterprise_settings?: Record<string, unknown>;
  deployment_readiness?: Record<string, unknown>;
  reports_available?: string[];
  [key: string]: unknown;
};

export type EnterpriseReport = {
  report_type?: string;
  generated_at?: string;
  privacy_note?: string;
  [key: string]: unknown;
};
