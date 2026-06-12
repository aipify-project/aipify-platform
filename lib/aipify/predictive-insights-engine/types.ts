export type OrganizationPredictiveInsight = {
  id?: string;
  prediction_type?: string;
  confidence?: string;
  risk_level?: string;
  status?: string;
  summary?: string;
  recommended_action?: string;
  source_engine?: string;
  metadata?: Record<string, unknown>;
  dismissed_at?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type PredictiveInsightsEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  active_insights?: number;
  high_risk_insights?: number;
  critical_insights?: number;
  prediction_type_count?: number;
  [key: string]: unknown;
};

export type PredictiveInsightsEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  sections?: {
    active_insights?: OrganizationPredictiveInsight[];
    by_prediction_type?: Record<string, unknown>[];
    by_risk_level?: Record<string, unknown>[];
  };
  settings?: Record<string, unknown>;
  executive_summary?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};

export type PredictiveInsightsExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  insights?: OrganizationPredictiveInsight[];
  summary?: Record<string, unknown>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};
