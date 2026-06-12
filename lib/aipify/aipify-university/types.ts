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
  key?: string;
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

export type CompanionExample = {
  emoji?: string;
  key?: string;
  example?: string;
  prompt?: string;
  consideration?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
  required?: string[];
  boundary_note?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  route?: string;
  boundary_note?: string;
};

export type UniversityPathway = {
  id?: string;
  pathway_key?: string;
  title?: string;
  description?: string;
  pathway_type?: string;
  experience_type?: string;
  target_role?: string;
  estimated_minutes?: number;
  cross_link_route?: string;
  status?: string;
};

export type MicroLearningEvent = {
  id?: string;
  event_type?: string;
  title?: string;
  summary?: string;
  delivered_at?: string;
  acknowledged?: boolean;
};

export type AnalyticsSnapshot = {
  participation_rate?: number;
  completion_rate?: number;
  knowledge_confidence_avg?: number;
  learning_frequency_score?: number;
  role_preparedness_score?: number;
  companion_utilization_score?: number;
  knowledge_retention_score?: number;
  training_effectiveness_score?: number;
  leadership_engagement_score?: number;
  aggregate_learning_score?: number;
  captured_at?: string;
};

export type EngagementSummary = {
  active_pathways?: number;
  total_enrollments?: number;
  completed_enrollments?: number;
  micro_learning_events?: number;
  certification_progress_records?: number;
  aggregate_learning_score?: number;
  participation_rate?: number;
  completion_rate?: number;
  privacy_note?: string;
};

export type AipifyUniversityBlueprint = {
  phase?: string;
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
  learning_experiences?: Array<Record<string, unknown>>;
  learning_pathways?: Array<Record<string, unknown>>;
  micro_learning_engine?: Record<string, unknown>;
  companion_coaching?: Record<string, unknown>;
  onboarding_acceleration?: Record<string, unknown>;
  knowledge_retention?: Record<string, unknown>;
  executive_education?: Record<string, unknown>;
  learning_analytics?: Record<string, unknown>;
  certification_framework?: Record<string, unknown>;
  self_love_in_learning?: SelfLoveConnection;
  wellbeing_aware_learning?: Record<string, unknown>;
  knowledge_center_integration?: Record<string, unknown>;
  security_training?: Record<string, unknown>;
  companion_adaptation?: Record<string, unknown>;
  limitation_principles?: LimitationPrinciples;
  cross_links?: IntegrationLink[];
  success_metrics?: Array<Record<string, unknown>>;
  engagement_summary?: EngagementSummary;
  success_criteria?: AbosSuccessCriterion[];
};

export type AipifyUniversityCard = {
  has_customer: boolean;
  aggregate_learning_score?: number;
  active_pathways?: number;
  participation_rate?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  wellbeing_aware_enabled?: boolean;
  healthy_pacing_default?: boolean;
  implementation_blueprint_phase115?: ImplementationBlueprintMeta;
  aipify_university_mission?: string;
  aipify_university_abos_principle?: string;
  aipify_university_engagement_summary?: EngagementSummary;
  aipify_university_vision_note?: string;
  [key: string]: unknown;
};

export type AipifyUniversityDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  philosophy?: string;
  distinction_note?: string;
  safety_note?: string;
  continuous_learning_enabled?: boolean;
  wellbeing_aware_enabled?: boolean;
  healthy_pacing_default?: boolean;
  micro_learning_enabled?: boolean;
  companion_coaching_enabled?: boolean;
  default_pacing?: string;
  active_pathways?: number;
  total_enrollments?: number;
  completed_enrollments?: number;
  in_progress_enrollments?: number;
  micro_learning_events?: number;
  aggregate_learning_score?: number;
  participation_rate?: number;
  completion_rate?: number;
  pathways: UniversityPathway[];
  micro_learning_recent: MicroLearningEvent[];
  analytics_snapshot?: AnalyticsSnapshot;
  integration_links?: IntegrationLink[];
  implementation_blueprint?: AipifyUniversityBlueprint;
  implementation_blueprint_phase115?: ImplementationBlueprintMeta;
  aipify_university_mission?: string;
  aipify_university_philosophy?: string;
  aipify_university_abos_principle?: string;
  aipify_university_objectives?: BlueprintObjective[];
  learning_experiences?: Array<Record<string, unknown>>;
  learning_pathways_blueprint?: Array<Record<string, unknown>>;
  micro_learning_engine?: Record<string, unknown>;
  companion_coaching?: Record<string, unknown>;
  onboarding_acceleration?: Record<string, unknown>;
  knowledge_retention?: Record<string, unknown>;
  executive_education?: Record<string, unknown>;
  learning_analytics_meta?: Record<string, unknown>;
  certification_framework?: Record<string, unknown>;
  self_love_in_learning?: SelfLoveConnection;
  wellbeing_aware_learning?: Record<string, unknown>;
  knowledge_center_integration?: Record<string, unknown>;
  security_training?: Record<string, unknown>;
  companion_adaptation?: Record<string, unknown>;
  limitation_principles?: LimitationPrinciples;
  aubp115_cross_links?: IntegrationLink[];
  success_metrics?: Array<Record<string, unknown>>;
  engagement_summary?: EngagementSummary;
  success_criteria?: AbosSuccessCriterion[];
  aipify_university_vision?: string;
  privacy_note?: string;
  [key: string]: unknown;
};
