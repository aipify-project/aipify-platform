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

export type ExecutiveReview = {
  id: string;
  review_key?: string;
  review_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  readiness_signal?: string;
  captured_at?: string;
};

export type ReflectionEntry = {
  id: string;
  reflection_key?: string;
  reflection_type?: string;
  title?: string;
  reflection_summary?: string;
  status?: string;
  created_at?: string;
};

export type ScaffoldNote = {
  id: string;
  note_key?: string;
  note_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  created_at?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
};

export type SharedGratitudeAppreciativeStewardshipEngineEngagementSummary = {
  humanity_shared_gratitude_appreciative_stewardship_score?: number;
  enabled?: boolean;
  gratitude_mode?: string;
  appreciation_readiness_level?: number;
  executive_reviews_count?: number;
  reflections_count?: number;
  recognition_notes_count?: number;
  active_reflections_count?: number;
  era_phases_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
};

export type SharedGratitudeAppreciativeStewardshipEngineBlueprint = {
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
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  era_opener_summary?: IntegrationLink[];
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: SharedGratitudeAppreciativeStewardshipEngineEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type SharedGratitudeAppreciativeStewardshipEngineCard = {
  has_customer: boolean;
  humanity_shared_gratitude_appreciative_stewardship_score?: number;
  enabled?: boolean;
  gratitude_mode?: string;
  appreciation_readiness_level?: number;
  reflections_count?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  humanity_shared_gratitude_appreciative_stewardship_mission?: string;
  humanity_shared_gratitude_appreciative_stewardship_abos_principle?: string;
  humanity_shared_gratitude_appreciative_stewardship_engagement_summary?: SharedGratitudeAppreciativeStewardshipEngineEngagementSummary;
  humanity_shared_gratitude_appreciative_stewardship_note?: string;
  humanity_shared_gratitude_appreciative_stewardship_vision_note?: string;
};

export type SharedGratitudeAppreciativeStewardshipEngineDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  gratitude_mode?: string;
  appreciation_readiness_level?: number;
  human_oversight_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  humanity_shared_gratitude_appreciative_stewardship_score?: number;
  executive_reviews_count?: number;
  reflections_count?: number;
  recognition_notes_count?: number;
  active_reflections_count?: number;
  era_phases_count?: number;
  executive_reviews: ExecutiveReview[];
  reflections: ReflectionEntry[];
  scaffold_notes: ScaffoldNote[];
  integration_links: IntegrationLink[];
  era_opener_summary?: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  humanity_shared_gratitude_appreciative_stewardship_blueprint?: SharedGratitudeAppreciativeStewardshipEngineBlueprint;
  humanity_shared_gratitude_appreciative_stewardship_mission?: string;
  humanity_shared_gratitude_appreciative_stewardship_philosophy?: string;
  humanity_shared_gratitude_appreciative_stewardship_abos_principle?: string;
  humanity_shared_gratitude_appreciative_stewardship_objectives?: BlueprintObjective[];
  center_meta?: Record<string, unknown>;
  engine_meta?: Record<string, unknown>;
  framework_meta?: Record<string, unknown>;
  executive_reviews_meta?: Record<string, unknown>;
  companion_meta?: Record<string, unknown>;
  sub_engine_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  hsgasbp188_integration_links?: IntegrationLink[];
  hsgasbp188_era_opener_summary?: IntegrationLink[];
  humanity_shared_gratitude_appreciative_stewardship_engagement_summary?: SharedGratitudeAppreciativeStewardshipEngineEngagementSummary;
  humanity_shared_gratitude_appreciative_stewardship_success_criteria?: AbosSuccessCriterion[];
  humanity_shared_gratitude_appreciative_stewardship_vision?: string;
  humanity_shared_gratitude_appreciative_stewardship_vision_phrases?: string[];
  humanity_shared_gratitude_appreciative_stewardship_privacy_note?: string;
  humanity_shared_gratitude_appreciative_stewardship_dogfooding?: string;
  humanity_shared_gratitude_appreciative_stewardship_engine_note?: string;
  humanity_shared_gratitude_appreciative_stewardship_distinction_note?: string;
};
