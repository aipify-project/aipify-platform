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

export type LearningProgram = {
  id: string;
  program_key?: string;
  program_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  adaptation_signal?: string;
  captured_at?: string;
};

export type AdaptationReview = {
  id: string;
  review_key?: string;
  review_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  adaptation_signal?: string;
  captured_at?: string;
};

export type LessonLearned = {
  id: string;
  lesson_key?: string;
  lesson_type?: string;
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

export type CivilizationalLearningEngagementSummary = {
  collective_adaptation_score?: number;
  adaptation_readiness_level?: number;
  learning_maturity_stage?: string;
  learning_programs_count?: number;
  adaptation_reviews_count?: number;
  lessons_learned_count?: number;
  cross_org_learning_opt_in?: boolean;
  era_phases_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
  not_centralized_authority?: boolean;
};

export type CivilizationalLearningBlueprint = {
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
  collective_adaptation_center?: Record<string, unknown>;
  collective_learning_engine?: Record<string, unknown>;
  adaptation_framework_engine?: Record<string, unknown>;
  executive_learning_reviews?: Record<string, unknown>;
  adaptation_companion?: Record<string, unknown>;
  collective_resilience_engine?: Record<string, unknown>;
  humility_innovation_framework?: Record<string, unknown>;
  adaptation_memory_engine?: Record<string, unknown>;
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: CivilizationalLearningEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type CivilizationalLearningCard = {
  has_customer: boolean;
  collective_adaptation_score?: number;
  adaptation_readiness_level?: number;
  adaptation_reviews_count?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  cross_org_learning_opt_in?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  civilizational_learning_mission?: string;
  civilizational_learning_abos_principle?: string;
  civilizational_learning_engagement_summary?: CivilizationalLearningEngagementSummary;
  civilizational_learning_note?: string;
  civilizational_learning_vision_note?: string;
};

export type CivilizationalLearningDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  adaptation_readiness_level?: number;
  learning_maturity_stage?: string;
  cross_org_learning_opt_in?: boolean;
  reflection_opt_in?: boolean;
  human_oversight_required?: boolean;
  governance_visibility?: string;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  collective_adaptation_score?: number;
  learning_programs_count?: number;
  adaptation_reviews_count?: number;
  lessons_learned_count?: number;
  learning_programs: LearningProgram[];
  adaptation_reviews: AdaptationReview[];
  lessons_learned: LessonLearned[];
  integration_links: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  civilizational_learning_blueprint?: CivilizationalLearningBlueprint;
  civilizational_learning_mission?: string;
  civilizational_learning_philosophy?: string;
  civilizational_learning_abos_principle?: string;
  civilizational_learning_objectives?: BlueprintObjective[];
  collective_adaptation_center_meta?: Record<string, unknown>;
  collective_learning_engine_meta?: Record<string, unknown>;
  adaptation_framework_engine_meta?: Record<string, unknown>;
  executive_learning_reviews_meta?: Record<string, unknown>;
  adaptation_companion_meta?: Record<string, unknown>;
  collective_resilience_engine_meta?: Record<string, unknown>;
  humility_innovation_framework_meta?: Record<string, unknown>;
  adaptation_memory_engine_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  claebp164_integration_links?: IntegrationLink[];
  civilizational_learning_engagement_summary?: CivilizationalLearningEngagementSummary;
  civilizational_learning_success_criteria?: AbosSuccessCriterion[];
  civilizational_learning_vision?: string;
  civilizational_learning_vision_phrases?: string[];
  civilizational_learning_privacy_note?: string;
  civilizational_learning_dogfooding?: string;
  civilizational_learning_engine_note?: string;
  civilizational_learning_distinction_note?: string;
};
