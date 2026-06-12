export type ResiliencePlanRecord = {
  id?: string;
  plan_name?: string;
  scenario_type?: string;
  owner_user_id?: string;
  status?: string;
  review_frequency?: string;
  continuity_requirements?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type ResilienceSimulationRecord = {
  id?: string;
  plan_id?: string;
  simulation_type?: string;
  status?: string;
  completed_at?: string;
  outcomes_metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

export type ResilienceVulnerabilityRecord = {
  id?: string;
  title?: string;
  severity?: string;
  status?: string;
  linked_plan_id?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

export type ResilienceReviewRecord = {
  id?: string;
  plan_id?: string;
  review_date?: string;
  findings_metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

export type ResilienceDimension = {
  key?: string;
  label?: string;
  examples?: string[];
};

export type IntegrationLink = {
  label?: string;
  route?: string;
  description?: string;
  note?: string;
};

export type ImplementationBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type BlueprintPrincipleBlock = {
  principle?: string;
  forbidden?: string[];
  required?: string[];
  boundary_note?: string;
};

export type BlueprintGuidanceBlock = {
  principle?: string;
  examples?: Array<Record<string, unknown>>;
  questions?: Array<Record<string, unknown>>;
  guidance?: Array<Record<string, unknown>>;
  categories?: Array<Record<string, unknown>>;
  domains?: Array<Record<string, unknown>>;
  dimensions?: Array<Record<string, unknown>>;
  insight_types?: Array<Record<string, unknown>>;
};

export type RiskNavigationEngagementSummary = {
  total_plans?: number;
  active_plans?: number;
  open_vulnerabilities?: number;
  completed_simulations?: number;
  pending_reviews?: number;
  risk_categories?: number;
  risk_questions?: number;
  companion_examples?: number;
  privacy_note?: string;
};

export type RecoveryEngagementSummary = {
  total_plans?: number;
  active_plans?: number;
  completed_reviews?: number;
  completed_simulations?: number;
  open_vulnerabilities?: number;
  resilience_domains?: number;
  resilience_questions?: number;
  recovery_reflection_dimensions?: number;
  companion_examples?: number;
  privacy_note?: string;
};

export type OrganizationalResilienceRecoveryBlueprint = {
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
  resilience_questions?: BlueprintGuidanceBlock;
  resilience_domains?: BlueprintGuidanceBlock;
  companion_guidance?: BlueprintGuidanceBlock;
  recovery_reflection?: BlueprintGuidanceBlock;
  learning_through_adversity?: Record<string, unknown>;
  self_love_connection?: SelfLoveConnection;
  leadership_insights?: BlueprintGuidanceBlock;
  trust_connection?: TrustConnection;
  limitation_principles?: BlueprintPrincipleBlock;
  dogfooding?: Record<string, unknown>;
  success_criteria?: AbosSuccessCriterion[];
  vision?: string;
  vision_phrases?: string[];
  integration_links?: IntegrationLink[];
  engagement_summary?: RecoveryEngagementSummary;
  privacy_note?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  journey_phrase?: string;
  self_love_route?: string;
  boundary_note?: string;
};

export type TrustConnection = {
  principle?: string;
  leaders_should_know?: string[];
  organizations_should_understand?: string[];
  audit_note?: string;
};

export type OrganizationalResilienceEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  active_plans?: number;
  open_vulnerabilities?: number;
  implementation_blueprint_phase81?: ImplementationBlueprint;
  blueprint_mission?: string;
  blueprint_abos_principle?: string;
  engagement_summary?: RiskNavigationEngagementSummary;
  blueprint_note?: string;
  preparedness_note?: string;
  implementation_blueprint_phase91?: ImplementationBlueprint;
  recovery_mission?: string;
  recovery_abos_principle?: string;
  recovery_engagement_summary?: RecoveryEngagementSummary;
  recovery_note?: string;
  recovery_vision_note?: string;
  [key: string]: unknown;
};

export type OrganizationalResilienceEngineDashboard = {
  has_organization: boolean;
  purpose?: string;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  principles?: string[];
  resilience_dimensions?: ResilienceDimension[];
  crisis_support_guidance?: string;
  crisis_examples?: string[];
  self_love_note?: string;
  growth_evolution_note?: string;
  trust_engine_note?: string;
  continuity_phase80_note?: string;
  distinction_note?: string;
  integration_links?: IntegrationLink[];
  summary?: Record<string, unknown>;
  plans?: ResiliencePlanRecord[];
  simulations?: ResilienceSimulationRecord[];
  vulnerabilities?: ResilienceVulnerabilityRecord[];
  reviews?: ResilienceReviewRecord[];
  executive_summary?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  implementation_blueprint_phase81?: ImplementationBlueprint;
  risk_navigation_engine_note?: string;
  blueprint_distinction_note?: string;
  blueprint_mission?: string;
  blueprint_philosophy?: string;
  blueprint_abos_principle?: string;
  blueprint_objectives?: BlueprintObjective[];
  risk_categories?: BlueprintGuidanceBlock;
  risk_questions?: BlueprintGuidanceBlock;
  companion_guidance?: BlueprintGuidanceBlock;
  risk_preparedness?: BlueprintGuidanceBlock;
  risk_opportunity_balance?: BlueprintGuidanceBlock;
  leadership_insights?: BlueprintGuidanceBlock;
  blueprint_self_love_connection?: SelfLoveConnection;
  blueprint_trust_connection?: TrustConnection;
  limitation_principles?: BlueprintPrincipleBlock;
  blueprint_dogfooding?: Record<string, unknown>;
  blueprint_integration_links?: IntegrationLink[];
  engagement_summary?: RiskNavigationEngagementSummary;
  blueprint_success_criteria?: AbosSuccessCriterion[];
  blueprint_vision_phrases?: string[];
  blueprint_privacy_note?: string;
  implementation_blueprint_phase91?: ImplementationBlueprint;
  recovery_engine_note?: string;
  organizational_resilience_recovery_blueprint?: OrganizationalResilienceRecoveryBlueprint;
  recovery_distinction_note?: string;
  recovery_mission?: string;
  recovery_philosophy?: string;
  recovery_abos_principle?: string;
  recovery_objectives?: BlueprintObjective[];
  recovery_resilience_questions?: BlueprintGuidanceBlock;
  recovery_resilience_domains?: BlueprintGuidanceBlock;
  recovery_companion_guidance?: BlueprintGuidanceBlock;
  recovery_reflection?: BlueprintGuidanceBlock;
  recovery_learning_through_adversity?: Record<string, unknown>;
  recovery_leadership_insights?: BlueprintGuidanceBlock;
  recovery_self_love_connection?: SelfLoveConnection;
  recovery_trust_connection?: TrustConnection;
  recovery_limitation_principles?: BlueprintPrincipleBlock;
  recovery_dogfooding?: Record<string, unknown>;
  recovery_integration_links?: IntegrationLink[];
  recovery_engagement_summary?: RecoveryEngagementSummary;
  recovery_success_criteria?: AbosSuccessCriterion[];
  recovery_vision?: string;
  recovery_vision_phrases?: string[];
  recovery_privacy_note?: string;
  [key: string]: unknown;
};
