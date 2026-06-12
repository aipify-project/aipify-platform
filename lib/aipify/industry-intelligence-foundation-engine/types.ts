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

export type IndustryInsightsExportPayload = {
  exported_at?: string;
  industry_key?: string | null;
  insights?: IndustryInsightRecord[];
  metadata_only?: boolean;
  privacy_note?: string;
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
  mission?: string;
  blueprint_philosophy?: string;
  abos_principle?: string;
  vision?: string;
  industry_objectives?: IndustryObjective[];
  industry_pack_examples?: IndustryPackExample[];
  companion_specialization?: CompanionExample[];
  self_love_connection?: SelfLoveConnection;
  trust_connection_blueprint?: TrustConnectionBlueprint;
  knowledge_center_connection?: KnowledgeCenterConnection;
  dogfooding_blueprint?: Record<string, unknown>;
  blueprint_integration_links?: IntegrationLink[];
  blueprint_vision_phrases?: string[];
  engagement_summary?: IndustryEngagementSummary;
  blueprint_success_criteria?: AbosSuccessCriterion[];
  implementation_blueprint?: Record<string, unknown>;
  [key: string]: unknown;
};

export type IndustryObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type IndustryPackExample = {
  key?: string;
  title?: string;
  examples?: string[];
  mapped_industry_keys?: string[];
  business_packs_route?: string;
  status?: string;
};

export type CompanionExample = {
  emoji?: string;
  key?: string;
  example?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  route?: string;
  phase?: string;
  boundary?: string;
};

export type TrustConnectionBlueprint = {
  principle?: string;
  organizations_should_understand?: string[];
  metadata_only?: boolean;
  override_note?: string;
};

export type KnowledgeCenterConnection = {
  principle?: string;
  contributions?: string[];
  kc_route?: string;
  training_route?: string;
};

export type IntegrationLink = {
  key?: string;
  label?: string;
  route?: string;
  note?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type IndustryEngagementSummary = {
  profile_assigned?: boolean;
  industry_key?: string | null;
  insights_enabled?: boolean;
  active_insights?: number;
  overridden_insights?: number;
  high_impact_insights?: number;
  available_industry_profiles?: number;
  activated_business_packs?: number;
  custom_terminology_count?: number;
  priorities_count?: number;
  privacy_note?: string;
};
