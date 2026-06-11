export type ExecutiveReportingPeriod = "daily" | "weekly" | "monthly" | "quarterly";

export type ExecutiveInsightItem = {
  source?: string;
  source_label?: string;
  title?: string;
  severity?: string;
  confidence?: string;
  summary?: string;
  [key: string]: unknown;
};

export type ExecutiveRecommendedAction = {
  action_key?: string;
  title?: string;
  rationale?: string;
  urgency?: string;
  expected_outcome?: string;
  estimated_effort?: string;
  source?: string;
  route?: string;
  [key: string]: unknown;
};

export type ExecutiveReportSummary = {
  id?: string;
  reporting_period?: string;
  summary?: string;
  risk_count?: number;
  opportunity_count?: number;
  action_count?: number;
  created_at?: string;
};

export type ExecutiveReportSchedule = {
  id?: string;
  reporting_period?: string;
  enabled?: boolean;
  delivery_channels?: string[];
  [key: string]: unknown;
};

export type ExecutiveInsightsEngineCard = {
  has_organization: boolean;
  health_score?: number;
  health_status?: string;
  risk_count?: number;
  action_count?: number;
  philosophy?: string;
};

export type ExecutiveInsightsEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  safety_note?: string;
  principles?: string[];
  summary?: {
    health_score?: number;
    health_status?: string;
    risk_count?: number;
    opportunity_count?: number;
    action_count?: number;
    reports_generated?: number;
  };
  organization_health?: {
    score?: number;
    status?: string;
    factors?: Record<string, string>;
  };
  major_achievements: ExecutiveInsightItem[];
  operational_risks: ExecutiveInsightItem[];
  strategic_opportunities: ExecutiveInsightItem[];
  customer_trends: Array<Record<string, unknown>>;
  ai_recommendations: ExecutiveRecommendedAction[];
  recommended_actions: ExecutiveRecommendedAction[];
  recent_reports: ExecutiveReportSummary[];
  schedules: ExecutiveReportSchedule[];
  settings?: Record<string, unknown>;
  source_modules?: Array<Record<string, unknown>>;
  [key: string]: unknown;
};

export type ExecutiveReportExport = {
  export_format?: string;
  exported_at?: string;
  privacy_note?: string;
  report?: Record<string, unknown>;
};
