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

export type CompanionGuidanceItem = {
  id?: string;
  emoji?: string;
  title?: string;
  summary?: string;
  priority?: string;
};

export type OperationalAlert = {
  id: string;
  alert_type: string;
  title: string;
  summary: string;
  severity: string;
  resolved?: boolean;
};

export type OpportunitySignal = {
  id: string;
  signal_type: string;
  title: string;
  summary: string;
  intention_note?: string;
};

export type ProfitabilityCoaching = {
  id: string;
  coaching_type: string;
  title: string;
  summary: string;
  margin_note?: string | null;
};

export type IntegrationHealth = {
  id: string;
  module_key: string;
  route: string;
  status: string;
  last_summary: string;
};

export type DailyBriefing = {
  id: string;
  briefing_date?: string;
  summary: string;
  revenue_note?: string | null;
  profit_note?: string | null;
  highlights?: Array<{ emoji?: string; label?: string; text?: string }>;
  created_at?: string;
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
  route?: string;
  boundary_note?: string;
};

export type TrustConnection = {
  principle?: string;
  users_should_see?: string[];
  operators_should_understand?: string[];
  audit_note?: string;
};

export type CommerceCompanionBlueprint = {
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
  commerce_companion_dashboard?: Record<string, unknown>;
  morning_commerce_briefings?: Record<string, unknown>;
  commercial_opportunity_guidance?: Record<string, unknown>;
  operational_awareness?: Record<string, unknown>;
  profitability_coaching?: Record<string, unknown>;
  customer_success_connection?: Record<string, unknown>;
  growth_partner_connection?: Record<string, unknown>;
  meeting_companion_connection?: Record<string, unknown>;
  knowledge_center_connection?: Record<string, unknown>;
  companion_personality?: Record<string, unknown>;
  self_love_connection?: SelfLoveConnection;
  leadership_connection?: Record<string, unknown>;
  trust_connection?: TrustConnection;
  limitation_principles?: LimitationPrinciples;
  dogfooding?: Record<string, unknown>;
  success_criteria?: AbosSuccessCriterion[];
  vision?: string;
  integration_links?: IntegrationLink[];
  engagement_summary?: Record<string, unknown>;
  privacy_note?: string;
};

export type CommerceCompanionEngagementSummary = {
  companion_score?: number;
  operational_alerts_count?: number;
  growth_opportunities_count?: number;
  profitability_coaching_count?: number;
  integration_modules_count?: number;
  objectives_documented?: number;
  personality_traits?: number;
  morning_briefing_examples?: number;
  integration_links?: number;
  privacy_note?: string;
};

export type CommerceCompanionCard = {
  has_customer: boolean;
  companion_score?: number;
  operational_alerts_count?: number;
  growth_opportunities_count?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  pressure_free_mode?: boolean;
  implementation_blueprint_phase110?: ImplementationBlueprintMeta;
  commerce_companion_mission?: string;
  commerce_companion_abos_principle?: string;
  commerce_companion_engagement_summary?: CommerceCompanionEngagementSummary;
  commerce_companion_note?: string;
  commerce_companion_vision_note?: string;
};

export type CommerceCompanionDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  pressure_free_mode?: boolean;
  companion_enabled?: boolean;
  morning_briefing_enabled?: boolean;
  philosophy?: string;
  safety_note?: string;
  companion_score?: number;
  operational_alerts_count?: number;
  growth_opportunities_count?: number;
  profitability_coaching_count?: number;
  guidance_items_count?: number;
  integration_modules_count?: number;
  revenue_performance?: string;
  profit_performance?: string;
  top_products_summary?: string;
  supplier_health_summary?: string;
  journey_indicators_summary?: string;
  expansion_readiness_summary?: string;
  morning_briefing_guidance: CompanionGuidanceItem[];
  companion_personality: CompanionGuidanceItem[];
  operational_alerts: OperationalAlert[];
  opportunity_signals: OpportunitySignal[];
  profitability_coaching: ProfitabilityCoaching[];
  integration_health: IntegrationHealth[];
  daily_briefings: DailyBriefing[];
  integration_links: IntegrationLink[];
  implementation_blueprint_phase110?: ImplementationBlueprintMeta;
  commerce_companion_engine_note?: string;
  commerce_companion_blueprint?: CommerceCompanionBlueprint;
  commerce_companion_distinction_note?: string;
  commerce_companion_mission?: string;
  commerce_companion_philosophy?: string;
  commerce_companion_abos_principle?: string;
  commerce_companion_objectives?: BlueprintObjective[];
  commerce_companion_dashboard_meta?: Record<string, unknown>;
  morning_commerce_briefings?: Record<string, unknown>;
  commercial_opportunity_guidance?: Record<string, unknown>;
  operational_awareness?: Record<string, unknown>;
  profitability_coaching_meta?: Record<string, unknown>;
  customer_success_connection?: Record<string, unknown>;
  growth_partner_connection?: Record<string, unknown>;
  meeting_companion_connection?: Record<string, unknown>;
  knowledge_center_connection?: Record<string, unknown>;
  companion_personality_meta?: Record<string, unknown>;
  commerce_self_love_connection?: SelfLoveConnection;
  commerce_leadership_connection?: Record<string, unknown>;
  commerce_trust_connection?: TrustConnection;
  commerce_limitation_principles?: LimitationPrinciples;
  commerce_companion_dogfooding?: Record<string, unknown>;
  ccombp110_integration_links?: IntegrationLink[];
  commerce_companion_engagement_summary?: CommerceCompanionEngagementSummary;
  commerce_companion_success_criteria?: AbosSuccessCriterion[];
  commerce_companion_vision?: string;
  commerce_companion_privacy_note?: string;
};

export type CommerceBriefingResult = {
  briefing_id?: string;
  summary?: string;
  pressure_free_mode?: boolean;
  error?: string;
};
