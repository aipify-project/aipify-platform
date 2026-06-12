export const LIFECYCLE_STAGES = [
  "discovery",
  "onboarding",
  "activation",
  "adoption",
  "expansion",
  "optimization",
  "advocacy",
] as const;

export const JOURNEY_STAGES = [
  "awareness",
  "interest",
  "evaluation",
  "purchase",
  "onboarding",
  "adoption",
  "expansion",
  "advocacy",
] as const;

export const HEALTH_BANDS = [
  "thriving",
  "healthy",
  "support_opportunity",
  "at_risk",
  "critical",
] as const;

export type CustomerMilestone = {
  id: string;
  milestone_type: string;
  description: string;
  is_quick_win?: boolean;
  achieved_at?: string;
};

export type CustomerRecommendation = {
  id: string;
  recommendation: string;
  category: string;
  rationale?: string | null;
  priority: string;
  status?: string;
  created_at?: string;
};

export type CustomerPlaybook = {
  id: string;
  playbook_name: string;
  audience: string;
  content?: Record<string, unknown>;
  active?: boolean;
};

export type BlueprintObjective = {
  key?: string;
  label?: string;
  emoji?: string;
  description?: string;
};

export type JourneyStage = {
  key?: string;
  label?: string;
  step?: number;
  purpose?: string;
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

export type PrivacyPrinciples = {
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

export type CustomerJourneyIntelligenceBlueprint = {
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
  customer_journey_stages?: JourneyStage[];
  journey_insights?: Record<string, unknown>;
  customer_experience_dashboard?: Record<string, unknown>;
  onboarding_intelligence?: Record<string, unknown>;
  adoption_intelligence?: Record<string, unknown>;
  customer_success_opportunities?: Record<string, unknown>;
  advocacy_identification?: Record<string, unknown>;
  companion_guidance?: CompanionGuidance;
  meeting_companion_connection?: Record<string, unknown>;
  growth_partner_connection?: Record<string, unknown>;
  self_love_connection?: SelfLoveConnection;
  leadership_connection?: Record<string, unknown>;
  trust_connection?: TrustConnection;
  privacy_principles?: PrivacyPrinciples;
  dogfooding?: Record<string, unknown>;
  success_criteria?: AbosSuccessCriterion[];
  vision?: string;
  vision_phrases?: string[];
  integration_links?: IntegrationLink[];
  engagement_summary?: Record<string, unknown>;
  privacy_note?: string;
};

export type CustomerJourneyEngagementSummary = {
  success_score?: number;
  health_band?: string;
  lifecycle_stage?: string;
  onboarding_completion?: number;
  adoption_strength?: number;
  value_realization?: number;
  expansion_readiness?: number;
  milestones_count?: number;
  quick_wins_count?: number;
  pending_recommendations?: number;
  briefings_count?: number;
  journey_stages_documented?: number;
  objectives_documented?: number;
  companion_examples?: number;
  integration_links?: number;
  privacy_note?: string;
};

export type CustomerLifecycleCard = {
  has_customer: boolean;
  success_score?: number;
  health_band?: string;
  health_band_label?: string;
  lifecycle_stage?: string;
  quick_wins_count?: number;
  philosophy?: string;
  no_pressure?: boolean;
  implementation_blueprint_phase108?: ImplementationBlueprintMeta;
  customer_journey_intelligence_mission?: string;
  customer_journey_intelligence_abos_principle?: string;
  customer_journey_intelligence_engagement_summary?: CustomerJourneyEngagementSummary;
  customer_journey_intelligence_note?: string;
  customer_journey_intelligence_vision_note?: string;
};

export type CustomerLifecycleDashboard = {
  has_customer: boolean;
  no_pressure?: boolean;
  expansion_follows_value?: boolean;
  orchestration_enabled?: boolean;
  philosophy?: string;
  safety_note?: string;
  success_score?: number;
  health_band?: string;
  health_band_label?: string;
  lifecycle_stage?: string;
  lifecycle_stage_label?: string;
  score_components?: Record<string, number>;
  milestones: CustomerMilestone[];
  quick_wins: CustomerMilestone[];
  recommendations: CustomerRecommendation[];
  playbooks: CustomerPlaybook[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  signals?: { positive?: string[]; risk?: string[] };
  lifecycle_stages?: Array<{ key: string; label: string; purpose: string }>;
  integrations?: Record<string, string>;
  implementation_blueprint_phase108?: ImplementationBlueprintMeta;
  customer_journey_intelligence_engine_note?: string;
  customer_journey_intelligence_blueprint?: CustomerJourneyIntelligenceBlueprint;
  customer_journey_intelligence_distinction_note?: string;
  customer_journey_intelligence_mission?: string;
  customer_journey_intelligence_philosophy?: string;
  customer_journey_intelligence_abos_principle?: string;
  customer_journey_intelligence_objectives?: BlueprintObjective[];
  customer_journey_stages?: JourneyStage[];
  journey_insights?: Record<string, unknown>;
  customer_experience_dashboard?: Record<string, unknown>;
  onboarding_intelligence?: Record<string, unknown>;
  adoption_intelligence?: Record<string, unknown>;
  customer_success_opportunities?: Record<string, unknown>;
  advocacy_identification?: Record<string, unknown>;
  customer_success_companion_guidance?: CompanionGuidance;
  meeting_companion_connection?: Record<string, unknown>;
  growth_partner_connection?: Record<string, unknown>;
  customer_journey_self_love_connection?: SelfLoveConnection;
  customer_journey_leadership_connection?: Record<string, unknown>;
  customer_journey_trust_connection?: TrustConnection;
  customer_journey_privacy_principles?: PrivacyPrinciples;
  customer_journey_intelligence_dogfooding?: Record<string, unknown>;
  cjibp108_integration_links?: IntegrationLink[];
  customer_journey_intelligence_engagement_summary?: CustomerJourneyEngagementSummary;
  customer_journey_intelligence_success_criteria?: AbosSuccessCriterion[];
  customer_journey_intelligence_vision?: string;
  customer_journey_intelligence_vision_phrases?: string[];
  customer_journey_intelligence_privacy_note?: string;
};

export type RecommendationActionResult = {
  status?: string;
  no_pressure?: boolean;
  error?: string;
};
