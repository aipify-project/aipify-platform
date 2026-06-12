export type ChangeInitiativeRecord = {
  id?: string;
  initiative_name?: string;
  description?: string;
  change_type?: string;
  status?: string;
  target_date?: string;
  owner_user_id?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type ChangeImpactAssessmentRecord = {
  id?: string;
  initiative_id?: string;
  affected_users?: unknown[];
  affected_teams?: unknown[];
  training_requirements?: unknown[];
  communication_needs?: unknown[];
  operational_risks?: unknown[];
  [key: string]: unknown;
};

export type ChangeCommunicationPlanRecord = {
  id?: string;
  initiative_id?: string;
  communication_type?: string;
  subject?: string;
  message_summary?: string;
  status?: string;
  [key: string]: unknown;
};

export type ChangeAdoptionMetricRecord = {
  id?: string;
  initiative_id?: string;
  metric_type?: string;
  metric_value?: number;
  metric_metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

export type ChangeMilestoneRecord = {
  id?: string;
  initiative_id?: string;
  milestone_name?: string;
  status?: string;
  milestone_order?: number;
  [key: string]: unknown;
};

export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
  examples?: string[];
};

export type CompanionGuidanceExample = {
  emoji?: string;
  key?: string;
  scenario?: string;
  example?: string;
};

export type BlueprintSection = {
  principle?: string;
  dimensions?: BlueprintObjective[];
  resources?: BlueprintObjective[];
  supports?: BlueprintObjective[];
  common_concerns?: BlueprintObjective[];
  insight_types?: BlueprintObjective[];
  users_should_see?: string[];
  practices?: string[];
  response_tone?: string;
  boundary_note?: string;
  stakeholder_communication_route?: string;
  learning_route?: string;
  self_love_route?: string;
  license_route?: string;
  audit_note?: string;
  a47_note?: string;
  dialogue_note?: string;
};

export type DogfoodingBlueprint = {
  principle?: string;
  aipify_group?: Record<string, unknown>;
  unonight?: Record<string, unknown>;
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

export type ChangeEngagementSummary = {
  total_initiatives?: number;
  active_initiatives?: number;
  completed_initiatives?: number;
  pending_milestones?: number;
  completed_milestones?: number;
  pending_communications?: number;
  adoption_metrics_90d?: number;
  privacy_note?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  doc?: string;
  spec_doc?: string;
  engine_phase?: string;
  era?: string;
  route?: string;
  mapping_note?: string;
};

export type CompanionAdaptationExample = {
  emoji?: string;
  key?: string;
  prompt?: string;
  consideration?: string;
};

export type CompanionAdaptation = {
  principle?: string;
  examples?: CompanionAdaptationExample[];
};

export type LimitationPrinciples = {
  principle?: string;
  must_never?: BlueprintObjective[];
  required?: string[];
  boundary_note?: string;
};

export type SelfLoveTransformation = {
  principle?: string;
  patterns?: BlueprintObjective[];
  transformation_phrase?: string;
  self_love_route?: string;
  boundary_note?: string;
};

export type AdoptionIntelligence = {
  principle?: string;
  indicators?: BlueprintObjective[];
  privacy_note?: string;
};

export type TransformationMemoryEngine = {
  principle?: string;
  captures?: BlueprintObjective[];
  org_memory_route?: string;
  boundary_note?: string;
};

export type CommunicationOrchestration = {
  principle?: string;
  types?: BlueprintObjective[];
  stakeholder_communication_route?: string;
  boundary_note?: string;
};

export type TransformationOrchestrationPhase127Blueprint = {
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
  orchestration_center?: BlueprintObjective[];
  roadmap_engine?: BlueprintObjective[];
  readiness_engine?: BlueprintObjective[];
  stakeholder_engagement?: BlueprintObjective[];
  change_companion?: BlueprintObjective[];
  communication_orchestration?: CommunicationOrchestration;
  transformation_risk_engine?: BlueprintObjective[];
  adoption_intelligence?: AdoptionIntelligence;
  transformation_memory_engine?: TransformationMemoryEngine;
  companion_limitations?: BlueprintObjective[];
  self_love_transformation?: SelfLoveTransformation;
  knowledge_library?: BlueprintObjective[];
  cross_links?: IntegrationLink[];
  limitation_principles?: LimitationPrinciples;
  companion_adaptation?: CompanionAdaptation;
  success_metrics?: BlueprintObjective[];
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: ChangeEngagementSummary;
  privacy_note?: string;
};

export type ChangeManagementEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  active_initiatives?: number;
  pending_milestones?: number;
  implementation_blueprint_phase62?: ImplementationBlueprintMeta;
  mission?: string;
  abos_principle?: string;
  engagement_summary?: ChangeEngagementSummary;
  blueprint_note?: string;
  change_note?: string;
  implementation_blueprint_phase127?: ImplementationBlueprintMeta;
  phase127_mission?: string;
  phase127_abos_principle?: string;
  phase127_engagement_summary?: ChangeEngagementSummary;
  phase127_note?: string;
  [key: string]: unknown;
};

export type ChangeManagementEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  initiatives?: ChangeInitiativeRecord[];
  impact_assessments?: ChangeImpactAssessmentRecord[];
  communication_plans?: ChangeCommunicationPlanRecord[];
  adoption_metrics?: ChangeAdoptionMetricRecord[];
  milestones?: ChangeMilestoneRecord[];
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  implementation_blueprint_phase62?: ImplementationBlueprintMeta;
  change_management_note?: string;
  blueprint_distinction_note?: string;
  blueprint_mission?: string;
  blueprint_philosophy?: string;
  blueprint_abos_principle?: string;
  vision?: string;
  blueprint_objectives?: BlueprintObjective[];
  blueprint_change_types?: BlueprintObjective[];
  readiness_assessment?: BlueprintSection;
  companion_guidance?: CompanionGuidanceExample[];
  communication_support?: BlueprintSection;
  adoption_support?: BlueprintSection;
  resistance_awareness?: BlueprintSection;
  self_love_connection?: BlueprintSection;
  leadership_insights?: BlueprintSection;
  trust_connection?: BlueprintSection;
  dogfooding?: DogfoodingBlueprint;
  blueprint_integration_links?: IntegrationLink[];
  engagement_summary?: ChangeEngagementSummary;
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  privacy_note?: string;
  implementation_blueprint_phase127?: TransformationOrchestrationPhase127Blueprint;
  transformation_orchestration_phase127_note?: string;
  [key: string]: unknown;
};
