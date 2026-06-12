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

export type CollectiveWisdomSharedLearningEngineEngagementSummary = {
  humanity_collective_wisdom_shared_learning_score?: number;
  enabled?: boolean;
  learning_mode?: string;
  wisdom_readiness_level?: number;
  executive_reviews_count?: number;
  reflections_count?: number;
  learning_notes_count?: number;
  active_reflections_count?: number;
  era_phases_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
};

export type CollectiveWisdomSharedLearningEngineBlueprint = {
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
  engagement_summary?: CollectiveWisdomSharedLearningEngineEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type CollectiveWisdomSharedLearningEngineCard = {
  has_customer: boolean;
  humanity_collective_wisdom_shared_learning_score?: number;
  enabled?: boolean;
  learning_mode?: string;
  wisdom_readiness_level?: number;
  reflections_count?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  humanity_collective_wisdom_shared_learning_mission?: string;
  humanity_collective_wisdom_shared_learning_abos_principle?: string;
  humanity_collective_wisdom_shared_learning_engagement_summary?: CollectiveWisdomSharedLearningEngineEngagementSummary;
  humanity_collective_wisdom_shared_learning_note?: string;
  humanity_collective_wisdom_shared_learning_vision_note?: string;
};

export type CollectiveWisdomSharedLearningEngineDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  learning_mode?: string;
  wisdom_readiness_level?: number;
  human_oversight_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  humanity_collective_wisdom_shared_learning_score?: number;
  executive_reviews_count?: number;
  reflections_count?: number;
  learning_notes_count?: number;
  active_reflections_count?: number;
  era_phases_count?: number;
  executive_reviews: ExecutiveReview[];
  reflections: ReflectionEntry[];
  scaffold_notes: ScaffoldNote[];
  integration_links: IntegrationLink[];
  era_opener_summary?: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  humanity_collective_wisdom_shared_learning_blueprint?: CollectiveWisdomSharedLearningEngineBlueprint;
  humanity_collective_wisdom_shared_learning_mission?: string;
  humanity_collective_wisdom_shared_learning_philosophy?: string;
  humanity_collective_wisdom_shared_learning_abos_principle?: string;
  humanity_collective_wisdom_shared_learning_objectives?: BlueprintObjective[];
  center_meta?: Record<string, unknown>;
  engine_meta?: Record<string, unknown>;
  framework_meta?: Record<string, unknown>;
  executive_reviews_meta?: Record<string, unknown>;
  companion_meta?: Record<string, unknown>;
  sub_engine_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  hcwslbp182_integration_links?: IntegrationLink[];
  hcwslbp182_era_opener_summary?: IntegrationLink[];
  humanity_collective_wisdom_shared_learning_engagement_summary?: CollectiveWisdomSharedLearningEngineEngagementSummary;
  humanity_collective_wisdom_shared_learning_success_criteria?: AbosSuccessCriterion[];
  humanity_collective_wisdom_shared_learning_vision?: string;
  humanity_collective_wisdom_shared_learning_vision_phrases?: string[];
  humanity_collective_wisdom_shared_learning_privacy_note?: string;
  humanity_collective_wisdom_shared_learning_dogfooding?: string;
  humanity_collective_wisdom_shared_learning_engine_note?: string;
  humanity_collective_wisdom_shared_learning_distinction_note?: string;
};
