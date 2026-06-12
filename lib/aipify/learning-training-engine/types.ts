export type TrainingCategory =
  | "onboarding"
  | "administrator"
  | "support_ai"
  | "governance"
  | "security_awareness"
  | "integration_setup"
  | "module_specific";

export type TrainingContentType = "article" | "checklist" | "video" | "walkthrough" | "assessment";

export type TrainingProgressStatus = "not_started" | "in_progress" | "completed" | "expired";

export type LearningTrainingEngineCard = {
  has_organization: boolean;
  assigned_paths?: number;
  completed_paths?: number;
  overdue_paths?: number;
  philosophy?: string;
  [key: string]: unknown;
};

export type LearningTrainingSummary = {
  assigned_paths?: number;
  completed_paths?: number;
  in_progress_paths?: number;
  overdue_paths?: number;
  available_paths?: number;
};

export type LearningTrainingEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: LearningTrainingSummary;
  assigned_paths: Array<Record<string, unknown>>;
  recommended_paths: Array<Record<string, unknown>>;
  overdue_training: Array<Record<string, unknown>>;
  recommended_modules: Array<Record<string, unknown>>;
  learning_paths: Array<Record<string, unknown>>;
  team_readiness?: Record<string, unknown>;
  onboarding_integration?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  distinction_note?: string;
  mission?: string;
  blueprint_philosophy?: string;
  abos_principle?: string;
  vision?: string;
  training_objectives?: TrainingObjective[];
  blueprint_learning_paths?: BlueprintLearningPath[];
  learning_experiences?: string[];
  certification_principles?: CertificationPrinciples;
  companion_examples?: CompanionExample[];
  self_love_connection?: SelfLoveConnection;
  trust_connection_blueprint?: TrustConnectionBlueprint;
  knowledge_center_connection?: KnowledgeCenterConnection;
  dogfooding_blueprint?: Record<string, unknown>;
  blueprint_integration_links?: IntegrationLink[];
  blueprint_vision_phrases?: string[];
  engagement_summary?: TrainingEngagementSummary;
  blueprint_success_criteria?: AbosSuccessCriterion[];
  implementation_blueprint?: Record<string, unknown>;
  implementation_blueprint_phase92?: Record<string, unknown>;
  human_potential_engine_note?: string;
  human_potential_talent_development_blueprint?: HumanPotentialTalentDevelopmentBlueprint;
  human_potential_distinction_note?: string;
  human_potential_mission?: string;
  human_potential_philosophy?: string;
  human_potential_abos_principle?: string;
  human_potential_objectives?: HumanPotentialObjective[];
  human_potential_development_questions?: DevelopmentQuestionsBlock;
  human_potential_strength_based_development?: StrengthBasedDevelopment;
  human_potential_learning_pathways?: HumanPotentialLearningPathway[];
  human_potential_career_companion_support?: CareerCompanionSupport;
  human_potential_talent_mobility?: TalentMobility;
  human_potential_self_love_connection?: HumanPotentialSelfLoveConnection;
  human_potential_recognition_connection?: RecognitionConnection;
  human_potential_trust_connection?: HumanPotentialTrustConnection;
  human_potential_privacy_principles?: PrivacyPrinciples;
  human_potential_dogfooding?: Record<string, unknown>;
  human_potential_integration_links?: IntegrationLink[];
  human_potential_engagement_summary?: HumanPotentialEngagementSummary;
  human_potential_success_criteria?: AbosSuccessCriterion[];
  human_potential_vision?: string;
  human_potential_vision_phrases?: string[];
  human_potential_privacy_note?: string;
  [key: string]: unknown;
};

export type TrainingPath = {
  id?: string;
  path_key?: string;
  title?: string;
  description?: string;
  category?: TrainingCategory;
  target_role?: string;
  content_ref?: string;
  status?: string;
  [key: string]: unknown;
};

export type TrainingAssessment = {
  id?: string;
  assessment_key?: string;
  title?: string;
  training_module_id?: string;
  question_count?: number;
  passing_score?: number;
  content_ref?: string;
  [key: string]: unknown;
};

export type BlueprintLearningPath = {
  key?: string;
  title?: string;
  designed_for?: string[];
  topics?: string[];
  mapped_path_keys?: string[];
  kc_route?: string;
  certification_route?: string;
};

export type CompanionExample = {
  emoji?: string;
  key?: string;
  example?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  route?: string;
  phase?: string;
  boundary?: string;
};

export type TrustConnectionBlueprint = {
  principle?: string;
  organizations_should_understand?: string[];
  metadata_only?: boolean;
  transparency_note?: string;
};

export type IntegrationLink = {
  key?: string;
  label?: string;
  route?: string;
  note?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type TrainingEngagementSummary = {
  user_assigned_paths?: number;
  user_completed_paths?: number;
  user_in_progress_paths?: number;
  user_overdue_paths?: number;
  active_learning_paths?: number;
  training_assessments?: number;
  org_completed_progress_records?: number;
  org_total_progress_records?: number;
  active_certification_programs?: number;
  org_active_certificates?: number;
  user_active_certificates?: number;
  user_badges_awarded?: number;
  privacy_note?: string;
};

export type TrainingObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type CertificationPrinciples = {
  principle?: string;
  requirements?: string[];
  certification_engine_route?: string;
};

export type KnowledgeCenterConnection = {
  principle?: string;
  integrations?: string[];
  kc_route?: string;
};

export type HumanPotentialObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type DevelopmentQuestion = {
  emoji?: string;
  key?: string;
  question?: string;
  description?: string;
};

export type DevelopmentQuestionsBlock = {
  principle?: string;
  questions?: DevelopmentQuestion[];
  reflection_note?: string;
};

export type StrengthBasedDevelopment = {
  principle?: string;
  practices?: string[];
  boundary_note?: string;
};

export type HumanPotentialLearningPathway = {
  key?: string;
  title?: string;
  designed_for?: string[];
  topics?: string[];
  mapped_path_keys?: string[];
  cross_link?: string;
  cross_link_note?: string;
  certification_route?: string;
};

export type CareerCompanionExample = {
  emoji?: string;
  key?: string;
  prompt?: string;
  consideration?: string;
};

export type CareerCompanionSupport = {
  principle?: string;
  companion_name?: string;
  not_label?: string;
  examples?: CareerCompanionExample[];
  boundary_note?: string;
};

export type TalentMobilityDimension = {
  key?: string;
  label?: string;
  description?: string;
};

export type TalentMobility = {
  principle?: string;
  dimensions?: TalentMobilityDimension[];
  privacy_note?: string;
};

export type HumanPotentialSelfLoveConnection = {
  principle?: string;
  practices?: string[];
  journey_phrase?: string;
  self_love_route?: string;
  boundary_note?: string;
};

export type RecognitionType = {
  emoji?: string;
  key?: string;
  label?: string;
  description?: string;
};

export type RecognitionConnection = {
  principle?: string;
  recognition_types?: RecognitionType[];
  gratitude_route?: string;
  boundary_note?: string;
};

export type HumanPotentialTrustConnection = {
  principle?: string;
  organizations_should_understand?: string[];
  leaders_should_know?: string[];
  audit_note?: string;
};

export type PrivacyPrinciples = {
  principle?: string;
  forbidden?: string[];
  required?: string[];
  boundary_note?: string;
};

export type HumanPotentialEngagementSummary = {
  active_learning_paths?: number;
  user_assigned_paths?: number;
  user_completed_paths?: number;
  learning_pathways?: number;
  development_questions?: number;
  career_companion_examples?: number;
  talent_mobility_dimensions?: number;
  recognition_types?: number;
  privacy_forbidden_count?: number;
  training_engagement?: TrainingEngagementSummary;
  privacy_note?: string;
};

export type HumanPotentialTalentDevelopmentBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  objectives?: HumanPotentialObjective[];
  development_questions?: DevelopmentQuestionsBlock;
  strength_based_development?: StrengthBasedDevelopment;
  learning_pathways?: HumanPotentialLearningPathway[];
  career_companion_support?: CareerCompanionSupport;
  talent_mobility?: TalentMobility;
  self_love_connection?: HumanPotentialSelfLoveConnection;
  recognition_connection?: RecognitionConnection;
  trust_connection?: HumanPotentialTrustConnection;
  privacy_principles?: PrivacyPrinciples;
  dogfooding?: Record<string, unknown>;
  success_criteria?: AbosSuccessCriterion[];
  vision?: string;
  vision_phrases?: string[];
  integration_links?: IntegrationLink[];
  engagement_summary?: HumanPotentialEngagementSummary;
  privacy_note?: string;
};
