export type CrossTenantGlobalInsight = {
  id?: string;
  insight_category?: string;
  industry?: string;
  summary?: string;
  recommendation?: string;
  confidence_level?: string;
  metadata?: Record<string, unknown>;
  status?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type CrossTenantParticipationSettings = {
  organization_id?: string;
  participation_status?: string;
  allowed_categories?: string[];
  anonymization_level?: string;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type CrossTenantPendingRecommendation = {
  outcome_id?: string;
  status?: string;
  insight?: CrossTenantGlobalInsight;
  [key: string]: unknown;
};

export type CrossTenantIntelligenceEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  participation_status?: string;
  visible_insights?: number;
  pending_recommendations?: number;
  global_active_insights?: number;
  [key: string]: unknown;
};

export type CrossTenantIntelligenceEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  settings?: CrossTenantParticipationSettings;
  sections?: {
    industry_trends?: CrossTenantGlobalInsight[];
    opportunities?: CrossTenantGlobalInsight[];
    improvement_areas?: CrossTenantGlobalInsight[];
    pending_recommendations?: CrossTenantPendingRecommendation[];
  };
  executive_summary?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};

export type CrossTenantIntelligenceExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  participation?: CrossTenantParticipationSettings;
  summary?: Record<string, unknown>;
  insights?: Record<string, unknown>[];
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};
