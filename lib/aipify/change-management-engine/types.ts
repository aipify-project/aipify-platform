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
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
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
  [key: string]: unknown;
};
