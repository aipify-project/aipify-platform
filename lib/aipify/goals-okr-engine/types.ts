export type OrganizationObjective = {
  id?: string;
  parent_objective_id?: string;
  hierarchy_level?: string;
  objective_name?: string;
  description?: string;
  owner_user_id?: string;
  priority?: string;
  status?: string;
  target_date?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type OrganizationKeyResult = {
  id?: string;
  objective_id?: string;
  key_result_name?: string;
  description?: string;
  starting_value?: number;
  target_value?: number;
  current_value?: number;
  progress_percentage?: number;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type OkrIntervention = {
  type?: string;
  confidence?: string;
  summary?: string;
  [key: string]: unknown;
};

export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type CompanionGuidanceExample = {
  emoji?: string;
  key?: string;
  prompt?: string;
  consideration?: string;
};

export type CompanionGuidance = {
  principle?: string;
  examples?: CompanionGuidanceExample[];
};

export type StrategicInitiatives = {
  principle?: string;
  initiative_types?: BlueprintObjective[];
  metadata_note?: string;
};

export type CascadeLevel = {
  key?: string;
  label?: string;
  description?: string;
};

export type ExecutionCascade = {
  principle?: string;
  levels?: CascadeLevel[];
  task_cross_link?: string;
  value_cross_link?: string;
  alignment_cross_link?: string;
};

export type ProgressVisibility = {
  principle?: string;
  dimensions?: BlueprintObjective[];
  visibility_note?: string;
};

export type AdaptiveSignal = {
  emoji?: string;
  key?: string;
  signal?: string;
  description?: string;
};

export type AdaptiveExecution = {
  principle?: string;
  signals?: AdaptiveSignal[];
  boundary_note?: string;
};

export type CrossFunctionalCoordination = {
  principle?: string;
  dimensions?: BlueprintObjective[];
  metadata_note?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  self_love_route?: string;
  journey_phrase?: string;
  boundary_note?: string;
};

export type LeadershipInsights = {
  principle?: string;
  insight_types?: BlueprintObjective[];
  dialogue_note?: string;
};

export type TrustConnection = {
  principle?: string;
  users_should_see?: string[];
  operators_should_understand?: string[];
  audit_note?: string;
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

export type ImplementationBlueprintMeta = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type StrategicExecutionEngagementSummary = {
  total_objectives?: number;
  active_objectives?: number;
  total_key_results?: number;
  at_risk_key_results?: number;
  completed_objectives?: number;
  avg_progress_pct?: number;
  cascade_levels?: number;
  companion_examples?: number;
  privacy_note?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type GoalsOkrEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  active_objectives?: number;
  at_risk_key_results?: number;
  avg_progress_pct?: number;
  strategic_objectives?: number;
  implementation_blueprint_phase69?: ImplementationBlueprintMeta;
  mission?: string;
  abos_principle?: string;
  engagement_summary?: StrategicExecutionEngagementSummary;
  blueprint_note?: string;
  execution_note?: string;
  [key: string]: unknown;
};

export type GoalsOkrEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  sections?: {
    active_objectives?: OrganizationObjective[];
    progress_by_department?: Record<string, unknown>[];
    at_risk_key_results?: OrganizationKeyResult[];
    completion_forecasts?: Record<string, unknown>[];
    strategic_focus_areas?: OrganizationObjective[];
  };
  hierarchy?: Record<string, unknown>[];
  key_results?: OrganizationKeyResult[];
  settings?: Record<string, unknown>;
  executive_summary?: Record<string, unknown>;
  interventions?: OkrIntervention[];
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  implementation_blueprint_phase69?: ImplementationBlueprintMeta;
  strategic_execution_note?: string;
  blueprint_distinction_note?: string;
  blueprint_mission?: string;
  blueprint_philosophy?: string;
  blueprint_abos_principle?: string;
  blueprint_objectives?: BlueprintObjective[];
  strategic_initiatives?: StrategicInitiatives;
  execution_cascade?: ExecutionCascade;
  companion_guidance?: CompanionGuidance;
  progress_visibility?: ProgressVisibility;
  adaptive_execution?: AdaptiveExecution;
  cross_functional_coordination?: CrossFunctionalCoordination;
  self_love_connection?: SelfLoveConnection;
  leadership_insights?: LeadershipInsights;
  trust_connection?: TrustConnection;
  dogfooding?: DogfoodingBlueprint;
  blueprint_integration_links?: IntegrationLink[];
  engagement_summary?: StrategicExecutionEngagementSummary;
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  privacy_note?: string;
  [key: string]: unknown;
};

export type GoalsOkrExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  objectives?: OrganizationObjective[];
  key_results?: OrganizationKeyResult[];
  summary?: Record<string, unknown>;
  interventions?: OkrIntervention[];
  [key: string]: unknown;
};
