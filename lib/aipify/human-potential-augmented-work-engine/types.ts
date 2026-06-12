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
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
};

export type LearningRecommendation = {
  id: string;
  recommendation_key?: string;
  recommendation_type?: string;
  title?: string;
  summary?: string;
  cross_link_route?: string | null;
  status?: string;
  priority?: string;
};

export type ReflectionEntry = {
  id: string;
  entry_key?: string;
  prompt_type?: string;
  reflection_summary?: string;
  status?: string;
  created_at?: string;
};

export type RecognitionMoment = {
  id: string;
  moment_key?: string;
  moment_type?: string;
  title?: string;
  summary?: string;
  visibility?: string;
  status?: string;
};

export type GrowthCompanionMeta = {
  principle?: string;
  supports?: Record<string, unknown>[];
  examples?: { emoji?: string; prompt?: string; consideration?: string }[];
};

export type HumanPotentialBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  objectives?: BlueprintObjective[];
  human_potential_center?: Record<string, unknown>[];
  augmented_work_framework?: Record<string, unknown>[];
  strengths_intelligence_engine?: Record<string, unknown>[];
  growth_companion?: GrowthCompanionMeta;
  meaningful_work_engine?: Record<string, unknown>[];
  career_development_framework?: Record<string, unknown>[];
  recognition_engine?: Record<string, unknown>[];
  reflection_practice_engine?: Record<string, unknown>[];
  companion_limitations?: Record<string, unknown>[];
  augmentation_principles?: Record<string, unknown>[];
  self_love_connection?: Record<string, unknown>[];
  security_requirements?: Record<string, unknown>[];
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: HumanPotentialEngagementSummary;
  vision?: string;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type HumanPotentialEngagementSummary = {
  augmentation_engagement_score?: number;
  learning_recommendations_pending?: number;
  reflection_entries_active?: number;
  recognition_moments_active?: number;
  growth_profiles_count?: number;
  objectives_count?: number;
  integration_links_count?: number;
  privacy_note?: string;
  not_human_value_ranking?: boolean;
};

export type HumanPotentialCard = {
  has_customer: boolean;
  augmentation_engagement_score?: number;
  learning_recommendations_pending?: number;
  reflection_entries_active?: number;
  recognition_moments_active?: number;
  philosophy?: string;
  no_ranking_mode?: boolean;
  user_owned_reflections?: boolean;
  human_potential_center_enabled?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  human_potential_mission?: string;
  human_potential_abos_principle?: string;
  human_potential_engagement_summary?: HumanPotentialEngagementSummary;
  human_potential_note?: string;
  human_potential_vision_note?: string;
};

export type HumanPotentialDashboard = {
  has_customer: boolean;
  human_potential_center_enabled?: boolean;
  growth_companion_enabled?: boolean;
  strengths_reflection_enabled?: boolean;
  meaningful_work_enabled?: boolean;
  recognition_scaffolds_enabled?: boolean;
  no_ranking_mode?: boolean;
  user_owned_reflections?: boolean;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  augmentation_engagement_score?: number;
  learning_recommendations_pending?: number;
  reflection_entries_active?: number;
  recognition_moments_active?: number;
  growth_profiles_count?: number;
  learning_recommendations: LearningRecommendation[];
  reflection_entries: ReflectionEntry[];
  recognition_moments: RecognitionMoment[];
  human_potential_center: Record<string, unknown>[];
  augmented_work_framework: Record<string, unknown>[];
  strengths_intelligence_engine: Record<string, unknown>[];
  growth_companion?: GrowthCompanionMeta;
  meaningful_work_engine: Record<string, unknown>[];
  career_development_framework: Record<string, unknown>[];
  recognition_engine: Record<string, unknown>[];
  reflection_practice_engine: Record<string, unknown>[];
  companion_limitations: Record<string, unknown>[];
  augmentation_principles: Record<string, unknown>[];
  self_love_connection: Record<string, unknown>[];
  security_requirements: Record<string, unknown>[];
  integration_links: IntegrationLink[];
  implementation_blueprint?: HumanPotentialBlueprint;
  human_potential_blueprint?: HumanPotentialBlueprint;
  human_potential_mission?: string;
  human_potential_philosophy?: string;
  human_potential_abos_principle?: string;
  human_potential_objectives?: BlueprintObjective[];
  human_potential_engagement_summary?: HumanPotentialEngagementSummary;
  human_potential_success_criteria?: AbosSuccessCriterion[];
  hpawbp139_cross_links?: IntegrationLink[];
  human_potential_vision?: string;
  human_potential_vision_phrases?: string[];
  human_potential_privacy_note?: string;
  human_potential_engine_note?: string;
};
