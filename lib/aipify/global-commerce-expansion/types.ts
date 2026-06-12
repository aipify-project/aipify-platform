export type CommerceMarketProfile = {
  id: string;
  market_key: string;
  market_name: string;
  region: string;
  currency: string;
  status: string;
  readiness_score: number;
};

export type MarketReadinessAssessment = {
  id: string;
  market_id?: string | null;
  market_name?: string | null;
  assessment_type: string;
  title: string;
  summary: string;
  readiness_level: string;
  assessed_at?: string;
};

export type LocalizationGuidanceRecord = {
  id: string;
  market_id?: string | null;
  market_name?: string | null;
  guidance_type: string;
  language: string;
  title: string;
  summary: string;
  authenticity_note?: string;
};

export type CulturalIntelligenceInsight = {
  id: string;
  market_id?: string | null;
  market_name?: string | null;
  insight_type: string;
  title: string;
  summary: string;
  respect_note?: string;
};

export type MultiCurrencyVisibility = {
  id: string;
  market_id?: string | null;
  market_name?: string | null;
  currency_code: string;
  regional_pricing_note: string;
  performance_summary: string;
  exchange_consideration: string;
};

export type RegionalCommerceInsight = {
  id: string;
  region_key: string;
  insight_type: string;
  title: string;
  summary: string;
  trend_direction: string;
};

export type RegulatoryAwarenessNote = {
  id: string;
  market_id?: string | null;
  market_name?: string | null;
  note_type: string;
  title: string;
  summary: string;
  disclaimer: string;
};

export type ExpansionRecommendation = {
  id: string;
  market_id?: string | null;
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
  approvals_route?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  avoid?: Array<{ key?: string; label?: string; description?: string }>;
  boundary_note?: string;
};

export type GlobalCommerceExpansionEngagementSummary = {
  expansion_score?: number;
  readiness_classification?: string;
  active_markets?: number;
  preparing_markets?: number;
  emerging_opportunities?: number;
  objectives_documented?: number;
  regulatory_notes?: number;
  companion_examples?: number;
  integration_links?: number;
  privacy_note?: string;
};

export type GlobalCommerceExpansionBlueprint = {
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
  global_expansion_dashboard?: Record<string, unknown>;
  market_readiness_intelligence?: Record<string, unknown>;
  localization_support?: Record<string, unknown>;
  cultural_intelligence?: Record<string, unknown>;
  multi_currency_support?: Record<string, unknown>;
  regional_commerce_insights?: Record<string, unknown>;
  regulatory_awareness?: Record<string, unknown>;
  companion_guidance?: CompanionGuidance;
  growth_partner_connection?: Record<string, unknown>;
  self_love_connection?: SelfLoveConnection;
  leadership_connection?: Record<string, unknown>;
  trust_connection?: TrustConnection;
  limitation_principles?: LimitationPrinciples;
  dogfooding?: Record<string, unknown>;
  success_criteria?: AbosSuccessCriterion[];
  vision?: string;
  vision_phrases?: string[];
  integration_links?: IntegrationLink[];
  engagement_summary?: GlobalCommerceExpansionEngagementSummary;
  privacy_note?: string;
};

export type GlobalCommerceExpansionCard = {
  has_customer: boolean;
  expansion_score?: number;
  readiness_classification?: string;
  philosophy?: string;
  human_oversight_required?: boolean;
  implementation_blueprint_phase109?: ImplementationBlueprintMeta;
  global_commerce_expansion_mission?: string;
  global_commerce_expansion_abos_principle?: string;
  global_commerce_expansion_engagement_summary?: GlobalCommerceExpansionEngagementSummary;
  global_commerce_expansion_note?: string;
  global_commerce_expansion_vision_note?: string;
};

export type GlobalCommerceExpansionDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  auto_market_entry_disabled?: boolean;
  philosophy?: string;
  safety_note?: string;
  engine_enabled?: boolean;
  expansion_score?: number;
  readiness_classification?: string;
  active_markets?: number;
  preparing_markets?: number;
  emerging_opportunities?: number;
  localization_guidance_count?: number;
  regulatory_notes_count?: number;
  currency_visibility_count?: number;
  regional_insights_count?: number;
  recommendations_pending?: number;
  cultural_insights_count?: number;
  readiness_assessments_count?: number;
  market_profiles: CommerceMarketProfile[];
  readiness_assessments: MarketReadinessAssessment[];
  localization_guidance: LocalizationGuidanceRecord[];
  cultural_insights: CulturalIntelligenceInsight[];
  currency_visibility: MultiCurrencyVisibility[];
  regional_insights: RegionalCommerceInsight[];
  regulatory_notes: RegulatoryAwarenessNote[];
  recommendations: ExpansionRecommendation[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  integrations?: Record<string, string>;
  implementation_blueprint_phase109?: ImplementationBlueprintMeta;
  global_commerce_expansion_engine_note?: string;
  global_commerce_expansion_blueprint?: GlobalCommerceExpansionBlueprint;
  global_commerce_expansion_distinction_note?: string;
  global_commerce_expansion_mission?: string;
  global_commerce_expansion_philosophy?: string;
  global_commerce_expansion_abos_principle?: string;
  global_commerce_expansion_objectives?: BlueprintObjective[];
  global_expansion_dashboard?: Record<string, unknown>;
  market_readiness_intelligence?: Record<string, unknown>;
  localization_support?: Record<string, unknown>;
  cultural_intelligence?: Record<string, unknown>;
  multi_currency_support?: Record<string, unknown>;
  regional_commerce_insights?: Record<string, unknown>;
  regulatory_awareness?: Record<string, unknown>;
  expansion_companion_guidance?: CompanionGuidance;
  growth_partner_connection?: Record<string, unknown>;
  expansion_self_love_connection?: SelfLoveConnection;
  expansion_leadership_connection?: Record<string, unknown>;
  expansion_trust_connection?: TrustConnection;
  expansion_limitation_principles?: LimitationPrinciples;
  global_commerce_expansion_dogfooding?: Record<string, unknown>;
  gcebp109_integration_links?: IntegrationLink[];
  global_commerce_expansion_engagement_summary?: GlobalCommerceExpansionEngagementSummary;
  global_commerce_expansion_success_criteria?: AbosSuccessCriterion[];
  global_commerce_expansion_vision?: string;
  global_commerce_expansion_vision_phrases?: string[];
  global_commerce_expansion_privacy_note?: string;
};

export type GlobalCommerceExpansionActionResult = {
  status?: string;
  error?: string;
  [key: string]: unknown;
};

export type GlobalCommerceExpansionBriefingResult = {
  briefing_id?: string;
  summary?: string;
  error?: string;
};
