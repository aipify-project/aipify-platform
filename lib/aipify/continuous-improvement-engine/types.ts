export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type BlueprintCompanionExample = {
  emoji?: string;
  key?: string;
  scenario?: string;
  question?: string;
  prompt?: string;
  example?: string;
};

export type BlueprintIntegrationLink = {
  key?: string;
  label?: string;
  route?: string;
  note?: string;
};

export type BlueprintSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type ContinuousImprovementOrganizationalEvolutionBlueprint = {
  phase?: number;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  objectives?: BlueprintObjective[];
  improvement_questions?: BlueprintCompanionExample[];
  improvement_sources?: BlueprintIntegrationLink[];
  companion_guidance?: BlueprintCompanionExample[];
  experimentation_principles?: Record<string, unknown>;
  organizational_evolution?: Record<string, unknown>;
  learning_cycles?: Record<string, unknown>;
  self_love_connection?: Record<string, unknown>;
  leadership_insights?: Record<string, unknown>;
  trust_connection?: Record<string, unknown>;
  limitation_principles?: Record<string, unknown>;
  dogfooding?: Record<string, unknown>;
  integration_links?: BlueprintIntegrationLink[];
  success_criteria?: BlueprintSuccessCriterion[];
  engagement_summary?: Record<string, unknown>;
  blueprint_note?: string;
};

export type ContinuousImprovementEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  active_improvements?: number;
  initiatives_active?: number;
  continuous_improvement_organizational_evolution_blueprint?: ContinuousImprovementOrganizationalEvolutionBlueprint;
  [key: string]: unknown;
};

export type ImprovementInitiativeRecord = {
  id?: string;
  initiative_title?: string;
  source?: string;
  priority?: string;
  status?: string;
  description?: string;
  [key: string]: unknown;
};

export type ImprovementReviewCycleRecord = {
  id?: string;
  initiative_id?: string;
  cycle_number?: number;
  review_status?: string;
  findings_summary?: string;
  [key: string]: unknown;
};

export type ImprovementSuccessMeasurementRecord = {
  id?: string;
  initiative_id?: string;
  metric_key?: string;
  baseline_value?: number;
  current_value?: number;
  improvement_percentage?: number;
  [key: string]: unknown;
};

export type ImprovementSuggestion = {
  initiative_title?: string;
  source?: string;
  priority?: string;
  confidence?: string;
  rationale?: string;
};

export type ContinuousImprovementEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  items?: Record<string, unknown>[];
  initiatives?: ImprovementInitiativeRecord[];
  review_cycles?: ImprovementReviewCycleRecord[];
  success_measurements?: ImprovementSuccessMeasurementRecord[];
  trends?: Record<string, unknown>;
  memory_integration?: Record<string, unknown>;
  recent_feedback?: Record<string, unknown>[];
  outcomes?: Record<string, unknown>[];
  continuous_improvement_organizational_evolution_blueprint?: ContinuousImprovementOrganizationalEvolutionBlueprint;
};
