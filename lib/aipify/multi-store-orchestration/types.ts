export type ImplementationBlueprintMeta = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type BlueprintObjective = {
  key?: string;
  label?: string;
  emoji?: string;
  description?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type IntegrationLink = {
  key?: string;
  label?: string;
  route?: string;
  note?: string;
};

export type CompanionGuidanceExample = {
  emoji?: string;
  key?: string;
  prompt?: string;
  consideration?: string;
};

export type CompanionGuidance = {
  principle?: string;
  companion_name?: string;
  not_label?: string;
  examples?: CompanionGuidanceExample[];
  boundary_note?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  quotes?: string[];
  practices?: string[];
  route?: string;
  boundary_note?: string;
};

export type TrustConnection = {
  principle?: string;
  users_should_see?: string[];
  operators_should_understand?: string[];
  audit_note?: string;
};

export type MultiStoreOrchestrationBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  objectives?: BlueprintObjective[];
  supported_environments?: Record<string, unknown>;
  executive_commerce_dashboard?: Record<string, unknown>;
  store_performance_comparison?: Record<string, unknown>;
  cross_store_intelligence?: Record<string, unknown>;
  unified_product_management?: Record<string, unknown>;
  global_commerce_insights?: Record<string, unknown>;
  automation_connection?: Record<string, unknown>;
  companion_guidance?: CompanionGuidance;
  leadership_connection?: Record<string, unknown>;
  self_love_connection?: SelfLoveConnection;
  trust_connection?: TrustConnection;
  permission_principles?: Record<string, unknown>;
  dogfooding?: Record<string, unknown>;
  success_criteria?: AbosSuccessCriterion[];
  vision?: string;
  vision_phrases?: string[];
  integration_links?: IntegrationLink[];
  engagement_summary?: Record<string, unknown>;
  privacy_note?: string;
};

export type MultiStoreOrchestrationEngagementSummary = {
  portfolio_score?: number;
  stores_connected?: number;
  portfolio_revenue?: number;
  stores_needing_attention?: number;
  governance_gaps?: number;
  regions_tracked?: number;
  store_count?: number;
  cross_store_insights_count?: number;
  product_sync_recommendations?: number;
  opportunity_distributions?: number;
  objectives_documented?: number;
  supported_platforms?: number;
  companion_examples?: number;
  integration_links?: number;
  auto_sync_disabled?: boolean;
  privacy_note?: string;
};

export type StoreSummary = {
  id: string;
  store_key: string;
  store_name: string;
  platform_type: string;
  brand_group?: string | null;
  region: string;
  ownership_label?: string | null;
  status_level: string;
  revenue_amount: number;
  profit_margin_percent?: number | null;
  performance_score?: number | null;
};

export type CrossStoreInsight = {
  id: string;
  insight_type: string;
  title: string;
  summary: string;
  affected_stores?: string[];
  trend_direction: string;
};

export type ProductSyncGuidance = {
  id: string;
  product_key: string;
  product_name: string;
  source_store_key: string;
  target_store_keys?: string[];
  recommendation_summary: string;
  rationale: string;
  requires_approval?: boolean;
};

export type OpportunityDistribution = {
  id: string;
  opportunity_type: string;
  title: string;
  summary: string;
  applicable_stores?: string[];
  rationale: string;
  priority: string;
};

export type GovernanceCoordination = {
  id: string;
  coordination_type: string;
  title: string;
  summary: string;
  consistency_level: string;
  affected_stores?: string[];
  recommendation: string;
};

export type RegionalExpansion = {
  id: string;
  region_key: string;
  region_name: string;
  readiness_score: number;
  readiness_status: string;
  localization_notes?: string | null;
  market_observation: string;
};

export type StrategicRecommendation = {
  id: string;
  section: string;
  title: string;
  summary: string;
  recommendation_type: string;
  priority: string;
  rationale: string;
};

export type PortfolioNotification = {
  id: string;
  title: string;
  message: string;
  priority: string;
};

export type MultiStoreOrchestrationCard = {
  has_customer: boolean;
  portfolio_score?: number;
  portfolio_classification?: string;
  stores_connected?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  implementation_blueprint_phase105?: ImplementationBlueprintMeta;
  multi_store_orchestration_mission?: string;
  multi_store_orchestration_abos_principle?: string;
  multi_store_orchestration_engagement_summary?: MultiStoreOrchestrationEngagementSummary;
  multi_store_orchestration_note?: string;
  multi_store_orchestration_vision_note?: string;
};

export type MultiStoreOrchestrationDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  auto_sync_disabled?: boolean;
  philosophy?: string;
  safety_note?: string;
  orchestration_enabled?: boolean;
  portfolio_score?: number;
  portfolio_classification?: string;
  stores_connected?: number;
  portfolio_revenue?: number;
  avg_profit_margin_percent?: number;
  stores_needing_attention?: number;
  opportunity_count?: number;
  governance_gaps?: number;
  regions_tracked?: number;
  store_summaries: StoreSummary[];
  cross_store_insights: CrossStoreInsight[];
  product_sync_guidance: ProductSyncGuidance[];
  opportunity_distributions: OpportunityDistribution[];
  governance_coordination: GovernanceCoordination[];
  regional_expansion: RegionalExpansion[];
  strategic_recommendations: StrategicRecommendation[];
  portfolio_notifications: PortfolioNotification[];
  executive_reports: Array<{ id: string; summary: string; created_at?: string }>;
  integrations?: Record<string, string>;
  implementation_blueprint_phase105?: ImplementationBlueprintMeta;
  multi_store_orchestration_engine_note?: string;
  multi_store_orchestration_blueprint?: MultiStoreOrchestrationBlueprint;
  multi_store_orchestration_distinction_note?: string;
  multi_store_orchestration_mission?: string;
  multi_store_orchestration_philosophy?: string;
  multi_store_orchestration_abos_principle?: string;
  multi_store_orchestration_objectives?: BlueprintObjective[];
  multi_store_supported_environments?: Record<string, unknown>;
  multi_store_executive_commerce_dashboard?: Record<string, unknown>;
  multi_store_performance_comparison?: Record<string, unknown>;
  multi_store_cross_store_intelligence?: Record<string, unknown>;
  multi_store_unified_product_management?: Record<string, unknown>;
  multi_store_global_commerce_insights?: Record<string, unknown>;
  multi_store_automation_connection?: Record<string, unknown>;
  multi_store_companion_guidance?: CompanionGuidance;
  multi_store_leadership_connection?: Record<string, unknown>;
  multi_store_self_love_connection?: SelfLoveConnection;
  multi_store_trust_connection?: TrustConnection;
  multi_store_permission_principles?: Record<string, unknown>;
  multi_store_orchestration_dogfooding?: Record<string, unknown>;
  msobp105_integration_links?: IntegrationLink[];
  multi_store_orchestration_engagement_summary?: MultiStoreOrchestrationEngagementSummary;
  multi_store_orchestration_success_criteria?: AbosSuccessCriterion[];
  multi_store_orchestration_vision?: string;
  multi_store_orchestration_vision_phrases?: string[];
  multi_store_orchestration_privacy_note?: string;
};

export type MultiStoreActionResult = {
  status?: string;
  error?: string;
  requires_approval?: boolean;
  [key: string]: unknown;
};

export type MultiStoreBriefingResult = {
  report_id?: string;
  summary?: string;
  error?: string;
};
