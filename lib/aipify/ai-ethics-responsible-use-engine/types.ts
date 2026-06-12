export type AiUseCaseRecord = {
  id?: string;
  organization_id?: string;
  use_case_name?: string;
  category?: string;
  risk_level?: string;
  oversight_required?: boolean;
  explainability_required?: boolean;
  status?: string;
  review_notes?: string;
  next_review_at?: string;
  [key: string]: unknown;
};

export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
  emoji?: string;
};

export type BlueprintIntegrationLink = {
  key?: string;
  label?: string;
  route?: string;
  note?: string;
  phase?: string | number;
};

export type BlueprintSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type CompanionExample = {
  emoji?: string;
  key?: string;
  scenario?: string;
  example?: string;
  text?: string;
  question?: string;
};

export type AutonomyLevel = {
  key?: string;
  label?: string;
  trust_action_level?: number;
  autonomy_tier?: string;
  description?: string;
  examples?: string[];
};

export type AutonomyPrinciples = {
  principle?: string;
  levels?: AutonomyLevel[];
  trust_action_route?: string;
  trust_action_phase?: number;
  human_oversight_route?: string;
  human_oversight_phase?: string;
  workflow_orchestration_phase?: number;
  workflow_orchestration_route?: string;
  boundary?: string;
};

export type CompanionPrinciples = {
  principle?: string;
  qualities?: string[];
  companion_examples?: CompanionExample[];
  companion_identity_route?: string;
  companion_identity_phase?: string;
  proactive_companion_route?: string;
  proactive_companion_phase?: string;
};

export type EmotionalSafety = {
  principle?: string;
  must_avoid?: string[];
  must_encourage?: string[];
  self_love_route?: string;
  self_love_phase?: string;
  inclusion_humanity_note?: string;
};

export type DataEthics = {
  principle?: string;
  required_disclosure?: BlueprintObjective[];
  privacy_note?: string;
  security_trust_route?: string;
  security_trust_phase?: string;
  compliance_route?: string;
  compliance_phase?: string;
};

export type GovernanceSummary = {
  approved_use_cases?: number;
  proposed_use_cases?: number;
  restricted_use_cases?: number;
  high_risk_active?: number;
  overdue_reviews?: number;
  policy_exceptions?: number;
  explainability_required?: boolean;
  human_oversight_default?: boolean;
  review_frequency_days?: number;
  governance_health?: string;
  privacy_note?: string;
  summary_text?: string;
};

export type ImplementationBlueprintPhase54 = {
  phase?: number;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type ImplementationBlueprintPhase65 = {
  phase?: number;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type GuidingQuestion = {
  emoji?: string;
  key?: string;
  question?: string;
};

export type CouncilEngagementSummary = {
  approved_use_cases?: number;
  proposed_use_cases?: number;
  overdue_ethics_reviews?: number;
  recent_ethics_audit_events?: number;
  council_objectives_count?: number;
  guiding_questions_count?: number;
  governance_health?: string;
  privacy_note?: string;
  summary_text?: string;
};

export type AiEthicsResponsibleUseEngineCard = {
  has_organization: boolean;
  approved_use_cases?: number;
  proposed_reviews?: number;
  restricted_count?: number;
  philosophy?: string;
  implementation_blueprint_phase54?: ImplementationBlueprintPhase54;
  implementation_blueprint_phase65?: ImplementationBlueprintPhase65;
  companion_governance_phase?: number;
  companion_evolution_council_phase?: number;
  escgbp_abos_principle?: string;
  cecbp_abos_principle?: string;
  governance_summary?: GovernanceSummary;
  council_engagement_summary?: CouncilEngagementSummary;
  governance_health?: string;
  critical_prohibition_note?: string;
  blueprint_note?: string;
  council_vision_phrase?: string;
  [key: string]: unknown;
};

export type AiEthicsResponsibleUseEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  ethics_policy?: Record<string, unknown>;
  prohibited_examples?: Array<Record<string, unknown>>;
  explainability_requirements?: Record<string, unknown>;
  approved_use_cases?: AiUseCaseRecord[];
  restricted_use_cases?: AiUseCaseRecord[];
  proposed_use_cases?: AiUseCaseRecord[];
  review_schedules?: Array<Record<string, unknown>>;
  policy_exceptions?: Array<Record<string, unknown>>;
  oversight_trends?: Record<string, unknown>;
  integration_notes?: Record<string, unknown>;
  implementation_blueprint_phase54?: ImplementationBlueprintPhase54;
  companion_governance_phase?: number;
  escgbp_mission?: string;
  escgbp_philosophy?: string;
  escgbp_abos_principle?: string;
  escgbp_objectives?: BlueprintObjective[];
  companion_principles?: CompanionPrinciples;
  autonomy_principles?: AutonomyPrinciples;
  emotional_safety?: EmotionalSafety;
  data_ethics?: DataEthics;
  escgbp_self_love_connection?: Record<string, unknown>;
  organizational_governance?: Record<string, unknown>;
  companion_evolution_reviews?: Record<string, unknown>;
  escgbp_trust_connection?: Record<string, unknown>;
  escgbp_dogfooding?: Record<string, unknown>;
  escgbp_integration_links?: BlueprintIntegrationLink[];
  governance_summary?: GovernanceSummary;
  escgbp_success_criteria?: BlueprintSuccessCriterion[];
  escgbp_distinction_note?: string;
  escgbp_vision_phrases?: string[];
  critical_prohibition_note?: string;
  human_agency_note?: string;
  implementation_blueprint_phase65?: ImplementationBlueprintPhase65;
  companion_evolution_council_phase?: number;
  cecbp_mission?: string;
  cecbp_philosophy?: string;
  cecbp_abos_principle?: string;
  cecbp_objectives?: BlueprintObjective[];
  council_responsibilities?: Record<string, unknown>;
  guiding_questions?: Record<string, unknown>;
  representation_principles?: Record<string, unknown>;
  companion_philosophy_reviews?: Record<string, unknown>;
  cecbp_community_feedback?: Record<string, unknown>;
  cecbp_self_love_connection?: Record<string, unknown>;
  cecbp_trust_connection?: Record<string, unknown>;
  cecbp_dogfooding?: Record<string, unknown>;
  cecbp_integration_links?: BlueprintIntegrationLink[];
  council_engagement_summary?: CouncilEngagementSummary;
  cecbp_success_criteria?: BlueprintSuccessCriterion[];
  cecbp_distinction_note?: string;
  cecbp_vision_phrases?: string[];
  [key: string]: unknown;
};
