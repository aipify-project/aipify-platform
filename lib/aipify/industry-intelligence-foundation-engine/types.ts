export type IndustryProfileRecord = {
  id?: string;
  industry_key: string;
  industry_name: string;
  description?: string;
  status?: string;
  knowledge_metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

export type IndustryInsightRecord = {
  id?: string;
  organization_id?: string;
  industry_profile_id?: string;
  category?: string;
  title?: string;
  recommendation?: string;
  impact_level?: string;
  status?: string;
  override_recommendation?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

export type IndustryIntelligenceFoundationEngineCard = {
  has_organization: boolean;
  industry_name?: string;
  active_insights?: number;
  philosophy?: string;
  [key: string]: unknown;
};

export type IndustryIntelligenceFoundationEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  assigned_profile?: IndustryProfileRecord;
  settings?: Record<string, unknown>;
  benchmarks?: Array<Record<string, unknown>>;
  recommended_improvements?: IndustryInsightRecord[];
  common_risks?: Array<Record<string, unknown>>;
  strategic_opportunities?: IndustryInsightRecord[];
  insights?: IndustryInsightRecord[];
  terminology?: Array<Record<string, unknown>>;
  workflow_recommendations?: Array<Record<string, unknown>>;
  kpi_suggestions?: Array<Record<string, unknown>>;
  best_practices?: Array<Record<string, unknown>>;
  business_pack_alignment?: Array<Record<string, unknown>>;
  integration_summaries?: Record<string, unknown>;
  future_hooks?: Record<string, unknown>;
  available_profiles?: Array<Record<string, unknown>>;
  [key: string]: unknown;
};
