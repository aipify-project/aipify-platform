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
