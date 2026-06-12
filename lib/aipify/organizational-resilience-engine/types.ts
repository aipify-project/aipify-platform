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

export type ContinuityCompanionEngagementSummary = RecoveryEngagementSummary & {
  objectives_count?: number;
  resilience_center_capabilities?: number;
  business_continuity_includes?: number;
  resilience_assessment_areas?: number;
  dependency_protection_examples?: number;
  recovery_orchestration_capabilities?: number;
  resilience_companion_supports?: number;
  leadership_continuity_supports?: number;
  resilience_exercise_types?: number;
  companion_limitations_count?: number;
  continuity_library_assets?: number;
  cross_links_count?: number;
  success_metrics_count?: number;
  phase128_active_plans?: number;
  phase128_open_vulnerabilities?: number;
  phase128_completed_simulations?: number;
  phase128_completed_reviews?: number;
};

export type SelfHealingEngagementSummary = ContinuityCompanionEngagementSummary & {
  operations_center_capabilities?: number;
  operational_health_areas?: number;
  recovery_detection_signals?: number;
  self_healing_framework_includes?: number;
  incident_learning_areas?: number;
  organizational_healing_principles_count?: number;
  security_requirements_count?: number;
  phase136_open_events?: number;
  phase136_recovering_events?: number;
  phase136_pending_recommendations?: number;
  phase136_draft_learnings?: number;
};

export type SelfHealingRecoveryEventRecord = {
  id?: string;
  event_type?: string;
  event_title?: string;
  severity?: string;
  status?: string;
  summary_metadata?: Record<string, unknown>;
  detected_at?: string;
  [key: string]: unknown;
};

export type SelfHealingIncidentLearningRecord = {
  id?: string;
  learning_title?: string;
  summary_metadata?: Record<string, unknown>;
  governance_note?: string;
  status?: string;
  [key: string]: unknown;
};

export type SelfHealingRecoveryRecommendationRecord = {
  id?: string;
  recommendation_title?: string;
  recommendation_type?: string;
  status?: string;
  risk_level?: number;
  summary_metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

export type SelfHealingOperationsOrganizationalRecoveryBlueprint = {
  phase?: string;
  doc?: string;
  spec_doc?: string;
  engine_phase?: string;
  era?: string;
  route?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  objectives?: BlueprintObjective[];
  self_healing_operations_center?: BlueprintObjective[];
  operational_health_engine?: BlueprintObjective[];
  recovery_detection_engine?: BlueprintObjective[];
  self_healing_framework?: BlueprintGuidanceBlock & { includes?: Array<Record<string, unknown>> };
  recovery_companion?: BlueprintObjective[];
  incident_learning_engine?: BlueprintObjective[];
  recovery_orchestration_engine?: BlueprintObjective[];
  organizational_healing_principles?: BlueprintObjective[];
  companion_limitations?: Array<Record<string, unknown>>;
  self_love_connection?: SelfLoveConnection;
  security_requirements?: BlueprintObjective[];
  integration_links?: IntegrationLink[];
  limitation_principles?: BlueprintPrincipleBlock;
  companion_adaptation?: BlueprintGuidanceBlock;
  success_metrics?: Array<Record<string, unknown>>;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: SelfHealingEngagementSummary;
  dogfooding?: string;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type ResilienceContinuityCompanionBlueprint = {
  phase?: string;
  doc?: string;
  spec_doc?: string;
  engine_phase?: string;
  era?: string;
  route?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  objectives?: BlueprintObjective[];
  resilience_center?: BlueprintObjective[];
  business_continuity_engine?: BlueprintObjective[];
  resilience_assessment?: BlueprintObjective[];
  dependency_protection?: BlueprintGuidanceBlock & { digital_twin_route?: string; examples?: Array<Record<string, unknown>> };
  recovery_orchestration?: BlueprintObjective[];
  resilience_companion?: BlueprintObjective[];
  leadership_continuity?: BlueprintGuidanceBlock & { org_memory_route?: string; supports?: Array<Record<string, unknown>> };
  resilience_exercise_framework?: BlueprintGuidanceBlock & { simulations_route?: string; exercise_types?: Array<Record<string, unknown>> };
  companion_limitations?: Array<Record<string, unknown>>;
  self_love_connection?: SelfLoveConnection;
  continuity_knowledge_library?: BlueprintObjective[];
  cross_links?: IntegrationLink[];
  limitation_principles?: BlueprintPrincipleBlock;
  companion_adaptation?: BlueprintGuidanceBlock;
  success_metrics?: Array<Record<string, unknown>>;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: ContinuityCompanionEngagementSummary;
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
  implementation_blueprint_phase128?: ImplementationBlueprint & { spec_doc?: string; era?: string };
  continuity_companion_mission?: string;
  continuity_companion_abos_principle?: string;
  continuity_companion_engagement_summary?: ContinuityCompanionEngagementSummary;
  continuity_companion_note?: string;
  continuity_companion_vision_note?: string;
  implementation_blueprint_phase136?: ImplementationBlueprint & { spec_doc?: string; era?: string };
  self_healing_mission?: string;
  self_healing_abos_principle?: string;
  self_healing_engagement_summary?: SelfHealingEngagementSummary;
  self_healing_note?: string;
  self_healing_vision_note?: string;
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
  implementation_blueprint_phase128?: ImplementationBlueprint & { spec_doc?: string; era?: string };
  continuity_companion_engine_note?: string;
  resilience_continuity_companion_blueprint?: ResilienceContinuityCompanionBlueprint;
  continuity_companion_distinction_note?: string;
  continuity_companion_mission?: string;
  continuity_companion_philosophy?: string;
  continuity_companion_abos_principle?: string;
  continuity_companion_vision?: string;
  continuity_companion_objectives?: BlueprintObjective[];
  resilience_center?: BlueprintObjective[];
  business_continuity_engine?: BlueprintObjective[];
  resilience_assessment?: BlueprintObjective[];
  dependency_protection?: ResilienceContinuityCompanionBlueprint["dependency_protection"];
  recovery_orchestration?: BlueprintObjective[];
  resilience_companion_supports?: BlueprintObjective[];
  leadership_continuity_supports?: ResilienceContinuityCompanionBlueprint["leadership_continuity"];
  resilience_exercise_framework?: ResilienceContinuityCompanionBlueprint["resilience_exercise_framework"];
  continuity_companion_limitations?: Array<Record<string, unknown>>;
  continuity_self_love_connection?: SelfLoveConnection;
  continuity_knowledge_library?: BlueprintObjective[];
  continuity_companion_cross_links?: IntegrationLink[];
  continuity_companion_limitation_principles?: BlueprintPrincipleBlock;
  continuity_companion_adaptation?: BlueprintGuidanceBlock;
  continuity_companion_engagement_summary?: ContinuityCompanionEngagementSummary;
  continuity_companion_success_criteria?: AbosSuccessCriterion[];
  continuity_companion_success_metrics?: Array<Record<string, unknown>>;
  continuity_companion_privacy_note?: string;
  implementation_blueprint_phase136?: ImplementationBlueprint & { spec_doc?: string; era?: string };
  self_healing_operations_engine_note?: string;
  self_healing_operations_organizational_recovery_blueprint?: SelfHealingOperationsOrganizationalRecoveryBlueprint;
  self_healing_distinction_note?: string;
  self_healing_mission?: string;
  self_healing_philosophy?: string;
  self_healing_abos_principle?: string;
  self_healing_vision?: string;
  self_healing_objectives?: BlueprintObjective[];
  self_healing_operations_center?: BlueprintObjective[];
  operational_health_engine?: BlueprintObjective[];
  recovery_detection_engine?: BlueprintObjective[];
  self_healing_framework?: SelfHealingOperationsOrganizationalRecoveryBlueprint["self_healing_framework"];
  recovery_companion_supports?: BlueprintObjective[];
  incident_learning_engine?: BlueprintObjective[];
  recovery_orchestration_engine?: BlueprintObjective[];
  organizational_healing_principles?: BlueprintObjective[];
  self_healing_companion_limitations?: Array<Record<string, unknown>>;
  self_healing_self_love_connection?: SelfLoveConnection;
  self_healing_security_requirements?: BlueprintObjective[];
  self_healing_integration_links?: IntegrationLink[];
  self_healing_limitation_principles?: BlueprintPrincipleBlock;
  self_healing_companion_adaptation?: BlueprintGuidanceBlock;
  self_healing_engagement_summary?: SelfHealingEngagementSummary;
  self_healing_success_criteria?: AbosSuccessCriterion[];
  self_healing_success_metrics?: Array<Record<string, unknown>>;
  self_healing_vision_phrases?: string[];
  self_healing_dogfooding?: string;
  self_healing_recovery_events?: SelfHealingRecoveryEventRecord[];
  self_healing_incident_learnings?: SelfHealingIncidentLearningRecord[];
  self_healing_recovery_recommendations?: SelfHealingRecoveryRecommendationRecord[];
  self_healing_privacy_note?: string;
  [key: string]: unknown;
};
