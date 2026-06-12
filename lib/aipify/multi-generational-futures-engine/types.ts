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

export type ExecutiveFuturesReview = {
  id: string;
  review_key?: string;
  review_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  readiness_signal?: string;
  captured_at?: string;
};

export type LongHorizonReflection = {
  id: string;
  reflection_key?: string;
  reflection_type?: string;
  title?: string;
  reflection_summary?: string;
  status?: string;
  created_at?: string;
};

export type LegacyContinuityEntry = {
  id: string;
  entry_key?: string;
  entry_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  created_at?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
};

export type EraOpenerNote = {
  era?: string;
  title?: string;
  opener_phase?: number;
  opener_route?: string;
  description?: string;
  prior_era?: Record<string, unknown>;
};

export type MultiGenerationalFuturesEngagementSummary = {
  multi_generational_futures_score?: number;
  enabled?: boolean;
  stewardship_mode?: string;
  stewardship_readiness_level?: number;
  executive_reviews_count?: number;
  reflections_count?: number;
  legacy_entries_count?: number;
  active_reflections_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
  not_prediction?: boolean;
};

export type MultiGenerationalFuturesBlueprint = {
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
  multi_generational_futures_center?: Record<string, unknown>;
  future_generations_engine?: Record<string, unknown>;
  long_horizon_responsibility_framework?: Record<string, unknown>;
  executive_futures_reviews?: Record<string, unknown>;
  futures_companion?: Record<string, unknown>;
  intergenerational_stewardship_engine?: Record<string, unknown>;
  legacy_continuity_engine?: Record<string, unknown>;
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  era_opener_note?: EraOpenerNote;
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: MultiGenerationalFuturesEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type MultiGenerationalFuturesCard = {
  has_customer: boolean;
  multi_generational_futures_score?: number;
  enabled?: boolean;
  stewardship_mode?: string;
  stewardship_readiness_level?: number;
  reflections_count?: number;
  philosophy?: string;
  long_horizon_reflection_enabled?: boolean;
  legacy_continuity_enabled?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  multi_generational_futures_mission?: string;
  multi_generational_futures_abos_principle?: string;
  multi_generational_futures_engagement_summary?: MultiGenerationalFuturesEngagementSummary;
  multi_generational_futures_note?: string;
  multi_generational_futures_vision_note?: string;
};

export type MultiGenerationalFuturesDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  stewardship_mode?: string;
  stewardship_readiness_level?: number;
  long_horizon_reflection_enabled?: boolean;
  legacy_continuity_enabled?: boolean;
  intergenerational_stewardship_enabled?: boolean;
  executive_futures_reviews_enabled?: boolean;
  human_oversight_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  multi_generational_futures_score?: number;
  executive_reviews_count?: number;
  reflections_count?: number;
  legacy_entries_count?: number;
  active_reflections_count?: number;
  executive_reviews: ExecutiveFuturesReview[];
  long_horizon_reflections: LongHorizonReflection[];
  legacy_entries: LegacyContinuityEntry[];
  integration_links: IntegrationLink[];
  era_opener_note?: EraOpenerNote;
  implementation_blueprint?: ImplementationBlueprintMeta;
  multi_generational_futures_blueprint?: MultiGenerationalFuturesBlueprint;
  multi_generational_futures_mission?: string;
  multi_generational_futures_philosophy?: string;
  multi_generational_futures_abos_principle?: string;
  multi_generational_futures_objectives?: BlueprintObjective[];
  multi_generational_futures_center_meta?: Record<string, unknown>;
  future_generations_engine_meta?: Record<string, unknown>;
  long_horizon_responsibility_framework_meta?: Record<string, unknown>;
  executive_futures_reviews_meta?: Record<string, unknown>;
  futures_companion_meta?: Record<string, unknown>;
  intergenerational_stewardship_engine_meta?: Record<string, unknown>;
  legacy_continuity_engine_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  mgfebp171_integration_links?: IntegrationLink[];
  mgfebp171_era_opener_note?: EraOpenerNote;
  multi_generational_futures_engagement_summary?: MultiGenerationalFuturesEngagementSummary;
  multi_generational_futures_success_criteria?: AbosSuccessCriterion[];
  multi_generational_futures_vision?: string;
  multi_generational_futures_vision_phrases?: string[];
  multi_generational_futures_privacy_note?: string;
  multi_generational_futures_dogfooding?: string;
  multi_generational_futures_engine_note?: string;
  multi_generational_futures_distinction_note?: string;
};
