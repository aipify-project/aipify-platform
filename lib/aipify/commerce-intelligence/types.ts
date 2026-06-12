export type ProductOpportunity = {
  id: string;
  product_id: string;
  product_name: string;
  category: string;
  opportunity_score: number;
  recommendation_type: string;
  recommendation_summary: string;
  trend_confidence: string;
  competition_level: string;
  margin_classification: string;
  store_fit_score?: number | null;
  on_watchlist?: boolean;
};

export type TrendSignal = {
  id: string;
  product_name?: string | null;
  signal_type: string;
  signal_strength: string;
  summary: string;
};

export type MarginCandidate = {
  id: string;
  product_id: string;
  product_name: string;
  estimated_net_margin_percent: number;
  margin_classification: string;
  recommended_price_min: number;
  recommended_price_max: number;
  risk_note?: string | null;
};

export type SupplierInsight = {
  id: string;
  supplier_name: string;
  insight_score: number;
  risk_level: string;
  strengths: string;
  risks?: string | null;
  recommendation: string;
};

export type ProductToAvoid = {
  id: string;
  product_id: string;
  product_name: string;
  opportunity_score: number;
  recommendation_summary: string;
  risk_flags?: Array<{ title: string; explanation: string; severity: string }>;
};

export type SeasonalOpportunity = {
  id: string;
  season_label: string;
  title: string;
  summary: string;
  product_name?: string | null;
};

export type StoreFitRecommendation = {
  id: string;
  product_id: string;
  product_name: string;
  fit_score: number;
  fit_summary: string;
  audience_match?: string | null;
  category_alignment?: string | null;
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

export type CommerceIntelligenceBlueprint = {
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
  commerce_insight_sources?: Record<string, unknown>;
  trend_intelligence?: Record<string, unknown>;
  product_opportunity_discovery?: Record<string, unknown>;
  margin_intelligence?: Record<string, unknown>;
  supplier_insights?: Record<string, unknown>;
  companion_guidance?: CompanionGuidance;
  commerce_strategy_connection?: Record<string, unknown>;
  self_love_connection?: SelfLoveConnection;
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

export type CommerceIntelligenceEngagementSummary = {
  intelligence_score?: number;
  opportunities_count?: number;
  trending_signals?: number;
  products_tracked?: number;
  suppliers_tracked?: number;
  active_opportunities?: number;
  watchlist_count?: number;
  objectives_documented?: number;
  insight_sources?: number;
  companion_examples?: number;
  integration_links?: number;
  privacy_note?: string;
};

export type CommerceIntelligenceCard = {
  has_customer: boolean;
  intelligence_score?: number;
  opportunities_count?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  implementation_blueprint_phase101?: ImplementationBlueprintMeta;
  commerce_intelligence_mission?: string;
  commerce_intelligence_abos_principle?: string;
  commerce_intelligence_engagement_summary?: CommerceIntelligenceEngagementSummary;
  commerce_intelligence_note?: string;
  commerce_intelligence_vision_note?: string;
};

export type CommerceIntelligenceDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  auto_import_disabled?: boolean;
  philosophy?: string;
  safety_note?: string;
  engine_enabled?: boolean;
  margin_threshold_percent?: number;
  discovery_mode?: string;
  intelligence_score?: number;
  opportunities_count?: number;
  avg_opportunity_score?: number;
  trending_signals?: number;
  products_to_avoid?: number;
  watchlist_count?: number;
  best_opportunities: ProductOpportunity[];
  trending_now: TrendSignal[];
  high_margin_candidates: MarginCandidate[];
  supplier_watchlist: SupplierInsight[];
  products_to_avoid_list: ProductToAvoid[];
  seasonal_opportunities: SeasonalOpportunity[];
  store_fit_recommendations: StoreFitRecommendation[];
  commerce_recommendations: Array<{ id: string; section: string; title: string; summary: string; action_type: string }>;
  discovery_runs: Array<{ id: string; discovery_mode: string; products_found: number; summary?: string; completed_at?: string }>;
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  integrations?: Record<string, string>;
  implementation_blueprint_phase101?: ImplementationBlueprintMeta;
  commerce_intelligence_engine_note?: string;
  commerce_intelligence_blueprint?: CommerceIntelligenceBlueprint;
  commerce_intelligence_distinction_note?: string;
  commerce_intelligence_mission?: string;
  commerce_intelligence_philosophy?: string;
  commerce_intelligence_abos_principle?: string;
  commerce_intelligence_objectives?: BlueprintObjective[];
  commerce_insight_sources?: Record<string, unknown>;
  commerce_trend_intelligence?: Record<string, unknown>;
  commerce_product_opportunity_discovery?: Record<string, unknown>;
  commerce_margin_intelligence?: Record<string, unknown>;
  commerce_supplier_insights?: Record<string, unknown>;
  commerce_companion_guidance?: CompanionGuidance;
  commerce_strategy_connection?: Record<string, unknown>;
  commerce_self_love_connection?: SelfLoveConnection;
  commerce_trust_connection?: TrustConnection;
  commerce_limitation_principles?: LimitationPrinciples;
  commerce_intelligence_dogfooding?: Record<string, unknown>;
  cibp101_integration_links?: IntegrationLink[];
  commerce_intelligence_engagement_summary?: CommerceIntelligenceEngagementSummary;
  commerce_intelligence_success_criteria?: AbosSuccessCriterion[];
  commerce_intelligence_vision?: string;
  commerce_intelligence_vision_phrases?: string[];
  commerce_intelligence_privacy_note?: string;
};

export type CommerceActionResult = {
  status?: string;
  error?: string;
  [key: string]: unknown;
};

export type CommerceBriefingResult = {
  briefing_id?: string;
  summary?: string;
  error?: string;
};
