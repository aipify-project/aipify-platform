import type {
  AcademyLanguage,
  AcademySurface,
  Audience,
  CertificationStatus,
  CourseStatus,
  DifficultyLevel,
  ModuleType,
  QuestionType,
  WorkflowStep,
} from "./constants";

export type AcademyOverview = {
  active_courses: number;
  certified_users: number;
  expiring_certifications: number;
  completion_rate: number;
  courses_requiring_review: number;
  recommended_improvements: number;
};

export type AcademyModule = {
  id: string;
  module_order: number;
  module_type: ModuleType;
  title: string;
  content: Record<string, unknown>;
  estimated_minutes: number;
};

export type AcademyQuestion = {
  id: string;
  question_type: QuestionType;
  prompt: string;
  options: unknown[];
  difficulty_score: number;
};

export type AcademyCourse = {
  id: string;
  title: string;
  description: string;
  audience: Audience;
  difficulty: DifficultyLevel;
  language: AcademyLanguage;
  estimated_duration_minutes: number;
  certification_required: boolean;
  renewal_period_days: number | null;
  passing_threshold: number;
  status: CourseStatus;
  workflow_step: WorkflowStep;
  objective: string;
  outline: unknown[];
  content_types: unknown[];
  ai_generation_notes: Record<string, unknown>;
  video_production_meta: Record<string, unknown>;
  published_at: string | null;
  modules: AcademyModule[];
  questions: AcademyQuestion[];
  created_at: string;
  updated_at: string;
};

export type AcademyAnalytics = {
  completion_rate: number;
  pass_rate: number;
  average_score: number;
  module_drop_off_rate: number;
  most_difficult_questions: Array<{ prompt: string; difficulty_score: number }>;
  retraining_opportunities: number;
};

export type AcademyRecommendation = {
  key: string;
  message_key: string;
  count?: number;
};

export type AcademyAuditEntry = {
  id: string;
  event_type: string;
  summary: string;
  created_at: string;
};

export type WorkflowStepInfo = {
  step: WorkflowStep;
  order: number;
};

export type AcademyStudioCenter = {
  has_access: boolean;
  surface?: AcademySurface;
  overview?: AcademyOverview;
  courses?: AcademyCourse[];
  analytics?: AcademyAnalytics;
  recommendations?: AcademyRecommendation[];
  audit?: AcademyAuditEntry[];
  workflow?: WorkflowStepInfo[];
  default_passing_threshold?: number;
  principle?: string;
  supported_languages?: string[];
  video_production_readiness?: Record<string, string>;
};

export type AcademyStudioLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  createFirstProgram?: string;
  viewDocumentation?: string;
  overview: Record<string, string>;
  sections: Record<string, string>;
  table: Record<string, string>;
  audiences: Record<string, string>;
  difficulties: Record<string, string>;
  moduleTypes: Record<string, string>;
  questionTypes: Record<string, string>;
  certStatuses: Record<string, string>;
  courseStatuses: Record<string, string>;
  workflowSteps: Record<string, string>;
  languages: Record<string, string>;
  recommendations: Record<string, string>;
  analytics: Record<string, string>;
  quickActions: Record<string, string>;
  workflow: Record<string, string>;
  export: Record<string, string>;
  youDecide: string;
};
