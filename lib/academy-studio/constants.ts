export const AUDIENCES = [
  "growth_partners",
  "customers",
  "enterprise_administrators",
  "internal_employees",
  "support_teams",
  "growth_partner_managers",
] as const;
export type Audience = (typeof AUDIENCES)[number];

export const DIFFICULTY_LEVELS = ["beginner", "intermediate", "advanced", "expert"] as const;
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

export const CONTENT_TYPES = [
  "training_video",
  "course_module",
  "quiz",
  "presentation",
  "pdf_guide",
  "checklist",
  "certification_program",
  "onboarding_program",
] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

export const MODULE_TYPES = [
  "video_lesson",
  "reading",
  "interactive_question",
  "scenario_exercise",
  "assessment",
  "practical_task",
] as const;
export type ModuleType = (typeof MODULE_TYPES)[number];

export const QUESTION_TYPES = [
  "multiple_choice",
  "true_false",
  "scenario_based",
  "practical_validation",
] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];

export const CERTIFICATION_STATUSES = [
  "not_started",
  "in_progress",
  "certified",
  "expired",
  "suspended",
] as const;
export type CertificationStatus = (typeof CERTIFICATION_STATUSES)[number];

export const COURSE_STATUSES = ["draft", "published", "archived"] as const;
export type CourseStatus = (typeof COURSE_STATUSES)[number];

export const WORKFLOW_STEPS = [
  "define_audience",
  "define_objective",
  "generate_outline",
  "generate_materials",
  "publish_certification",
] as const;
export type WorkflowStep = (typeof WORKFLOW_STEPS)[number];

export const LANGUAGES = ["en", "no", "sv", "da"] as const;
export type AcademyLanguage = (typeof LANGUAGES)[number];

export const ACADEMY_SURFACES = ["super", "platform", "partner"] as const;
export type AcademySurface = (typeof ACADEMY_SURFACES)[number];

export const DEFAULT_PASSING_THRESHOLD = 75;

export const STATUS_BADGES: Record<CourseStatus, string> = {
  draft: "bg-amber-50 text-amber-900 ring-amber-200",
  published: "bg-green-50 text-green-800 ring-green-200",
  archived: "bg-slate-100 text-slate-700 ring-slate-200",
};

export const DIFFICULTY_BADGES: Record<DifficultyLevel, string> = {
  beginner: "bg-blue-50 text-blue-800 ring-blue-200",
  intermediate: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  advanced: "bg-violet-50 text-violet-800 ring-violet-200",
  expert: "bg-fuchsia-50 text-fuchsia-900 ring-fuchsia-200",
};
