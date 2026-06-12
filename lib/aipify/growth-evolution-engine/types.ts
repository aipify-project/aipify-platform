export type GrowthEvolutionDimensionKey =
  | "operational"
  | "knowledge"
  | "human"
  | "customer"
  | "strategic";

export type GrowthEvolutionSignal = {
  id?: string;
  dimension?: GrowthEvolutionDimensionKey | string;
  signal_type?: string;
  summary?: string;
  trend_direction?: string;
  confidence?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type GrowthEvolutionRecommendation = {
  id?: string;
  dimension?: GrowthEvolutionDimensionKey | string;
  title?: string;
  summary?: string;
  evidence_summary?: string;
  trade_offs?: string;
  risk_level?: string;
  status?: string;
  requires_review?: boolean;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type GrowthEvolutionSettings = {
  organization_id?: string;
  enabled?: boolean;
  focus_dimensions?: string[];
  learning_cycle_cadence?: string;
  celebrate_progress?: boolean;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type CompanionGrowthAdaptiveSettings = {
  id?: string;
  organization_id?: string;
  user_id?: string;
  feedback_prompts_enabled?: boolean;
  helpfulness_prompt_frequency?: string;
  adaptive_preferences_enabled?: boolean;
  celebrate_progress_enabled?: boolean;
  companion_refinement_opt_in?: boolean;
  identity_cross_link_enabled?: boolean;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type CompanionGrowthFeedbackEvent = {
  id?: string;
  feedback_type?: string;
  helpfulness_rating?: string;
  summary?: string;
  context_category?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type BlueprintObjective = {
  key?: string;
  label?: string;
  emoji?: string;
  description?: string;
  [key: string]: unknown;
};

export type BlueprintIntegrationLink = {
  label?: string;
  route?: string;
  note?: string;
  [key: string]: unknown;
};

export type BlueprintSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
  [key: string]: unknown;
};

export type CompanionExample = {
  emoji?: string;
  key?: string;
  example?: string;
  scenario?: string;
  text?: string;
  [key: string]: unknown;
};

export type BlueprintSection = {
  principle?: string;
  qualities?: string[];
  should_avoid?: string[];
  domains?: Record<string, unknown>[];
  balances?: Record<string, unknown>[];
  practices?: string[];
  users_should_know?: string[];
  operators_should_understand?: string[];
  prompt_types?: Record<string, unknown>[];
  preference_examples?: CompanionExample[];
  companion_examples?: CompanionExample[];
  [key: string]: unknown;
};

export type GrowthDimension = {
  key?: string;
  label?: string;
  description?: string;
  examples?: string[];
  [key: string]: unknown;
};

export type LearningCycleStep = {
  step?: number;
  key?: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
};

export type EvolutionCapability = {
  key?: string;
  label?: string;
  description?: string;
  example_phrases?: string[];
  [key: string]: unknown;
};

export type GrowthEvolutionEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  pending_recommendations?: number;
  recent_signals?: number;
  enabled?: boolean;
  implementation_blueprint?: Record<string, unknown>;
  mission?: string;
  abos_principle?: string;
  adaptive_summary?: Record<string, unknown>;
  blueprint_note?: string;
  [key: string]: unknown;
};

export type GrowthEvolutionEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  distinction_note?: string;
  self_love_note?: string;
  proactive_companion_note?: string;
  trust_engine_note?: string;
  growth_dimensions?: GrowthDimension[];
  learning_cycle_steps?: LearningCycleStep[];
  evolution_capabilities?: EvolutionCapability[];
  settings?: GrowthEvolutionSettings;
  recent_signals?: GrowthEvolutionSignal[];
  pending_recommendations?: GrowthEvolutionRecommendation[];
  summary?: Record<string, unknown>;
  integration_links?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  implementation_blueprint?: Record<string, unknown>;
  blueprint_philosophy?: string;
  blueprint_mission?: string;
  blueprint_abos_principle?: string;
  cgadbp_distinction_note?: string;
  cgadbp_objectives?: BlueprintObjective[];
  cgadbp_feedback_collection?: BlueprintSection;
  cgadbp_companion_evolution_principles?: BlueprintSection;
  cgadbp_organizational_learning?: BlueprintSection;
  cgadbp_individual_adaptation?: BlueprintSection;
  cgadbp_self_love_connection?: BlueprintSection;
  cgadbp_innovation_balance?: BlueprintSection;
  cgadbp_trust_connection?: BlueprintSection;
  cgadbp_dogfooding?: Record<string, unknown>;
  cgadbp_vision_phrases?: string[];
  cgadbp_integration_links?: BlueprintIntegrationLink[];
  cgadbp_adaptive_summary?: Record<string, unknown>;
  cgadbp_success_criteria?: BlueprintSuccessCriterion[];
  adaptive_settings?: CompanionGrowthAdaptiveSettings;
  recent_feedback?: CompanionGrowthFeedbackEvent[];
  privacy_note?: string;
  [key: string]: unknown;
};

export type GrowthEvolutionExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  philosophy?: string;
  mission?: string;
  settings?: GrowthEvolutionSettings;
  growth_dimensions?: GrowthDimension[];
  learning_cycle_steps?: LearningCycleStep[];
  evolution_capabilities?: EvolutionCapability[];
  recent_signals?: GrowthEvolutionSignal[];
  recommendations?: GrowthEvolutionRecommendation[];
  summary?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};
