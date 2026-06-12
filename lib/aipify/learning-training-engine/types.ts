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
