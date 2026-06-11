export type AnalyticsCategory =
  | "support_performance"
  | "admin_assistant"
  | "knowledge_center"
  | "approval_workflows"
  | "integration_reliability"
  | "ai_recommendations"
  | "onboarding_effectiveness";

export type AnalyticsMetric = {
  metric_key: string;
  metric_type?: string;
  period_date?: string;
  metric_value?: number;
};

export type AnalyticsInsight = {
  id: string;
  insight_key?: string;
  category?: string;
  title: string;
  description?: string | null;
  severity?: string;
  confidence?: string;
  suggested_action?: string | null;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
};

export type AnalyticsReport = {
  id: string;
  report_type?: string;
  status?: string;
  period_start?: string;
  period_end?: string;
  generated_at?: string | null;
  export_format?: string;
  created_at?: string;
};

export type OrganizationAnalyticsHealth = {
  score?: number;
  status?: string;
  factors?: Record<string, number>;
};

export type AnalyticsInsightsEngineCard = {
  has_organization: boolean;
  health_score?: number;
  health_status?: string;
  active_insights?: number;
  metrics_tracked?: number;
  philosophy?: string;
};

export type AnalyticsInsightsEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  safety_note?: string;
  principles?: string[];
  user_role?: string;
  visible_categories?: string[];
  settings?: Record<string, unknown>;
  last_refresh?: Record<string, unknown>;
  organization_health?: OrganizationAnalyticsHealth;
  kpi_overview?: Record<string, { value?: number; type?: string; period_date?: string }>;
  trends?: AnalyticsMetric[];
  insights?: AnalyticsInsight[];
  reports?: AnalyticsReport[];
  improvement_opportunities?: Array<{
    insight_key?: string;
    title?: string;
    severity?: string;
    confidence?: string;
    suggested_action?: string | null;
  }>;
};
