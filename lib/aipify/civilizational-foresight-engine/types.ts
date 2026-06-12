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
  phase?: number;
  key?: string;
  label?: string;
  route?: string;
  note?: string;
  relationship?: string;
  description?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type ForesightScenario = {
  id: string;
  scenario_key?: string;
  scenario_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  horizon_years?: number;
  preparedness_signal?: string;
  captured_at?: string;
};

export type ExecutiveForesightReview = {
  id: string;
  review_key?: string;
  review_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  reflection_signal?: string;
  captured_at?: string;
};

export type ForesightMemoryEntry = {
  id: string;
  memory_key?: string;
  memory_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  captured_at?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
  must_not?: string[];
};

export type CivilizationalForesightEngagementSummary = {
  civilizational_foresight_score?: number;
  foresight_readiness_level?: number;
  horizon_focus?: string;
  scenarios_count?: number;
  executive_reviews_count?: number;
  foresight_memory_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
  not_predictive_certainty?: boolean;
};

export type CivilizationalForesightBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  objectives?: BlueprintObjective[];
  long_horizon_center?: Record<string, unknown>;
  foresight_engine?: Record<string, unknown>;
  long_horizon_framework?: Record<string, unknown>;
  executive_foresight_reviews?: Record<string, unknown>;
  foresight_companion?: Record<string, unknown>;
  scenario_exploration_engine?: Record<string, unknown>;
  intergenerational_responsibility_framework?: Record<string, unknown>;
  foresight_memory_engine?: Record<string, unknown>;
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  era_cross_links?: IntegrationLink[];
  extended_cross_links?: IntegrationLink[];
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: CivilizationalForesightEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type CivilizationalForesightCard = {
  has_customer: boolean;
  civilizational_foresight_score?: number;
  foresight_readiness_level?: number;
  scenarios_count?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  scenario_exploration_enabled?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  civilizational_foresight_mission?: string;
  civilizational_foresight_abos_principle?: string;
  civilizational_foresight_engagement_summary?: CivilizationalForesightEngagementSummary;
  civilizational_foresight_note?: string;
  civilizational_foresight_vision_note?: string;
};

export type CivilizationalForesightDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  foresight_readiness_level?: number;
  horizon_focus?: string;
  scenario_exploration_enabled?: boolean;
  executive_review_enabled?: boolean;
  foresight_memory_enabled?: boolean;
  human_oversight_required?: boolean;
  governance_visibility?: string;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  civilizational_foresight_score?: number;
  scenarios_count?: number;
  executive_reviews_count?: number;
  foresight_memory_count?: number;
  scenarios: ForesightScenario[];
  executive_foresight_reviews: ExecutiveForesightReview[];
  foresight_memory_entries: ForesightMemoryEntry[];
  integration_links: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  civilizational_foresight_blueprint?: CivilizationalForesightBlueprint;
  civilizational_foresight_mission?: string;
  civilizational_foresight_philosophy?: string;
  civilizational_foresight_abos_principle?: string;
  civilizational_foresight_objectives?: BlueprintObjective[];
  long_horizon_center_meta?: Record<string, unknown>;
  foresight_engine_meta?: Record<string, unknown>;
  long_horizon_framework_meta?: Record<string, unknown>;
  executive_foresight_reviews_meta?: Record<string, unknown>;
  foresight_companion_meta?: Record<string, unknown>;
  scenario_exploration_engine_meta?: Record<string, unknown>;
  intergenerational_responsibility_framework_meta?: Record<string, unknown>;
  foresight_memory_engine_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  cfiebp165_era_cross_links?: IntegrationLink[];
  cfiebp165_extended_cross_links?: IntegrationLink[];
  cfiebp165_integration_links?: IntegrationLink[];
  civilizational_foresight_engagement_summary?: CivilizationalForesightEngagementSummary;
  civilizational_foresight_success_criteria?: AbosSuccessCriterion[];
  civilizational_foresight_vision?: string;
  civilizational_foresight_vision_phrases?: string[];
  civilizational_foresight_privacy_note?: string;
  civilizational_foresight_dogfooding?: string;
  civilizational_foresight_engine_note?: string;
  civilizational_foresight_distinction_note?: string;
};
