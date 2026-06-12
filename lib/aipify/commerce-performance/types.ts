export type ProfitIntelligenceItem = {
  id: string;
  report_type: string;
  title: string;
  summary: string;
  observation: string;
  impact_level: string;
};

export type ProductProfitability = {
  id: string;
  product_key: string;
  product_name: string;
  category: string;
  revenue_contribution: number;
  gross_margin_percent: number;
  net_margin_percent?: number | null;
  profit_contribution_percent: number;
  profit_classification: string;
  seasonal_pattern?: string | null;
};

export type CustomerValueSignal = {
  id: string;
  observation_type: string;
  title: string;
  summary: string;
  trend_direction: string;
};

export type RevenueTrend = {
  id: string;
  period_label: string;
  revenue_amount: number;
  profit_amount: number;
  margin_percent: number;
  trend_signal: string;
  summary: string;
};

export type PerformanceOpportunity = {
  id: string;
  opportunity_type: string;
  title: string;
  summary: string;
  rationale: string;
  priority: string;
};

export type LossPreventionEvent = {
  id: string;
  event_type: string;
  title: string;
  summary: string;
  severity: string;
  resolved?: boolean;
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

export type ImplementationBlueprintMeta = {
  phase?: string | number;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
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

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
  required?: string[];
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

export type CommercePerformanceBlueprint = {
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
  performance_dashboard?: Record<string, unknown>;
  profit_intelligence?: Record<string, unknown>;
  product_performance_insights?: Record<string, unknown>;
  growth_quality_analysis?: Record<string, unknown>;
  cost_visibility?: Record<string, unknown>;
  companion_guidance?: CompanionGuidance;
  pricing_insights?: Record<string, unknown>;
  commerce_strategy_connection?: Record<string, unknown>;
  self_love_connection?: SelfLoveConnection;
  leadership_insights?: Record<string, unknown>;
  trust_connection?: TrustConnection;
  limitation_principles?: LimitationPrinciples;
  dogfooding?: Record<string, unknown>;
  success_criteria?: AbosSuccessCriterion[];
  vision?: string;
  vision_phrases?: string[];
  integration_links?: IntegrationLink[];
  engagement_summary?: Record<string, unknown>;
  privacy_note?: string;
};

export type CommercePerformanceEngagementSummary = {
  performance_score?: number;
  performance_classification?: string;
  total_revenue?: number;
  estimated_profit?: number;
  avg_net_margin_percent?: number;
  products_tracked?: number;
  profit_intelligence_reports?: number;
  open_risks?: number;
  opportunity_count?: number;
  profit_risk_products?: number;
  objectives_documented?: number;
  performance_dimensions?: number;
  companion_examples?: number;
  integration_links?: number;
  privacy_note?: string;
};

export type CommercePerformanceCard = {
  has_customer: boolean;
  performance_score?: number;
  performance_classification?: string;
  philosophy?: string;
  human_oversight_required?: boolean;
  implementation_blueprint_phase104?: ImplementationBlueprintMeta;
  commerce_performance_mission?: string;
  commerce_performance_abos_principle?: string;
  commerce_performance_engagement_summary?: CommercePerformanceEngagementSummary;
  commerce_performance_note?: string;
  commerce_performance_vision_note?: string;
};

export type CommercePerformanceDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  auto_actions_disabled?: boolean;
  philosophy?: string;
  safety_note?: string;
  engine_enabled?: boolean;
  margin_alert_threshold?: number;
  performance_score?: number;
  performance_classification?: string;
  total_revenue?: number;
  estimated_profit?: number;
  avg_net_margin_percent?: number;
  open_risks?: number;
  opportunity_count?: number;
  products_tracked?: number;
  profit_risk_products?: number;
  profit_intelligence: ProfitIntelligenceItem[];
  product_profitability: ProductProfitability[];
  customer_value_signals: CustomerValueSignal[];
  revenue_trends: RevenueTrend[];
  performance_opportunities: PerformanceOpportunity[];
  loss_prevention: LossPreventionEvent[];
  strategic_recommendations: StrategicRecommendation[];
  executive_reports: Array<{ id: string; summary: string; created_at?: string }>;
  integrations?: Record<string, string>;
  implementation_blueprint_phase104?: ImplementationBlueprintMeta;
  commerce_performance_engine_note?: string;
  commerce_performance_blueprint?: CommercePerformanceBlueprint;
  commerce_performance_distinction_note?: string;
  commerce_performance_mission?: string;
  commerce_performance_philosophy?: string;
  commerce_performance_abos_principle?: string;
  commerce_performance_objectives?: BlueprintObjective[];
  commerce_performance_dashboard_meta?: Record<string, unknown>;
  commerce_profit_intelligence_meta?: Record<string, unknown>;
  commerce_product_performance_insights?: Record<string, unknown>;
  commerce_growth_quality_analysis?: Record<string, unknown>;
  commerce_cost_visibility?: Record<string, unknown>;
  commerce_companion_guidance?: CompanionGuidance;
  commerce_pricing_insights?: Record<string, unknown>;
  commerce_strategy_connection?: Record<string, unknown>;
  commerce_self_love_connection?: SelfLoveConnection;
  commerce_leadership_insights?: Record<string, unknown>;
  commerce_trust_connection?: TrustConnection;
  commerce_limitation_principles?: LimitationPrinciples;
  commerce_performance_dogfooding?: Record<string, unknown>;
  cppbp104_integration_links?: IntegrationLink[];
  commerce_performance_engagement_summary?: CommercePerformanceEngagementSummary;
  commerce_performance_success_criteria?: AbosSuccessCriterion[];
  commerce_performance_vision?: string;
  commerce_performance_vision_phrases?: string[];
  commerce_performance_privacy_note?: string;
};

export type CommercePerformanceActionResult = {
  status?: string;
  error?: string;
  [key: string]: unknown;
};

export type CommercePerformanceBriefingResult = {
  report_id?: string;
  summary?: string;
  error?: string;
};
