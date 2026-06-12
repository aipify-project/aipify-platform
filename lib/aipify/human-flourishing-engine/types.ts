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

export type ExecutiveFlourishingReview = {
  id: string;
  review_key?: string;
  review_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  readiness_signal?: string;
  captured_at?: string;
};

export type BelongingReflection = {
  id: string;
  reflection_key?: string;
  reflection_type?: string;
  title?: string;
  reflection_summary?: string;
  status?: string;
  created_at?: string;
};

export type StrengthsNote = {
  id: string;
  note_key?: string;
  note_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  created_at?: string;
};

export type LearningRecord = {
  id: string;
  record_key?: string;
  record_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  created_at?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
};

export type HumanFlourishingEngagementSummary = {
  human_flourishing_score?: number;
  enabled?: boolean;
  development_mode?: string;
  flourishing_readiness_level?: number;
  executive_reviews_count?: number;
  belonging_reflections_count?: number;
  strengths_notes_count?: number;
  learning_records_count?: number;
  active_learning_count?: number;
  era_phases_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
  not_worth_scoring?: boolean;
};

export type HumanFlourishingBlueprint = {
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
  human_flourishing_center?: Record<string, unknown>;
  human_potential_engine?: Record<string, unknown>;
  flourishing_framework?: Record<string, unknown>;
  executive_flourishing_reviews?: Record<string, unknown>;
  flourishing_companion?: Record<string, unknown>;
  belonging_engine?: Record<string, unknown>;
  strengths_development_engine?: Record<string, unknown>;
  lifelong_learning_framework?: Record<string, unknown>;
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  era_capstone_summary?: IntegrationLink[];
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: HumanFlourishingEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type HumanFlourishingCard = {
  has_customer: boolean;
  human_flourishing_score?: number;
  enabled?: boolean;
  development_mode?: string;
  flourishing_readiness_level?: number;
  learning_records_count?: number;
  philosophy?: string;
  belonging_reflection_enabled?: boolean;
  strengths_development_enabled?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  human_flourishing_mission?: string;
  human_flourishing_abos_principle?: string;
  human_flourishing_engagement_summary?: HumanFlourishingEngagementSummary;
  human_flourishing_note?: string;
  human_flourishing_vision_note?: string;
};

export type HumanFlourishingDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  development_mode?: string;
  flourishing_readiness_level?: number;
  belonging_reflection_enabled?: boolean;
  strengths_development_enabled?: boolean;
  lifelong_learning_enabled?: boolean;
  leadership_growth_enabled?: boolean;
  human_oversight_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  human_flourishing_score?: number;
  executive_reviews_count?: number;
  belonging_reflections_count?: number;
  strengths_notes_count?: number;
  learning_records_count?: number;
  active_learning_count?: number;
  era_phases_count?: number;
  executive_reviews: ExecutiveFlourishingReview[];
  belonging_reflections: BelongingReflection[];
  strengths_notes: StrengthsNote[];
  learning_records: LearningRecord[];
  integration_links: IntegrationLink[];
  era_capstone_summary?: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  human_flourishing_blueprint?: HumanFlourishingBlueprint;
  human_flourishing_mission?: string;
  human_flourishing_philosophy?: string;
  human_flourishing_abos_principle?: string;
  human_flourishing_objectives?: BlueprintObjective[];
  human_flourishing_center_meta?: Record<string, unknown>;
  human_potential_engine_meta?: Record<string, unknown>;
  flourishing_framework_meta?: Record<string, unknown>;
  executive_flourishing_reviews_meta?: Record<string, unknown>;
  flourishing_companion_meta?: Record<string, unknown>;
  belonging_engine_meta?: Record<string, unknown>;
  strengths_development_engine_meta?: Record<string, unknown>;
  lifelong_learning_framework_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  cfhpbp170_integration_links?: IntegrationLink[];
  cfhpbp170_era_capstone_summary?: IntegrationLink[];
  human_flourishing_engagement_summary?: HumanFlourishingEngagementSummary;
  human_flourishing_success_criteria?: AbosSuccessCriterion[];
  human_flourishing_vision?: string;
  human_flourishing_vision_phrases?: string[];
  human_flourishing_privacy_note?: string;
  human_flourishing_dogfooding?: string;
  human_flourishing_engine_note?: string;
  human_flourishing_distinction_note?: string;
};
