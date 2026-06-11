export const LEARNING_PILLARS = [
  "customer_learning",
  "professional_development",
  "partner_education",
  "executive_education",
] as const;

export type LearningPath = {
  id: string;
  path_key: string;
  title: string;
  description: string;
  pillar: string;
  pillar_label?: string;
  access_level: string;
  target_roles?: string[];
};

export type AcademyCourse = {
  id: string;
  course_key: string;
  title: string;
  description: string;
  format_type: string;
  content_type: string;
  duration_minutes: number;
  access_level: string;
  path_title?: string | null;
};

export type CourseProgress = {
  id: string;
  course_title: string;
  status: string;
  progress_pct: number;
  completed_at?: string | null;
};

export type DigitalBadge = {
  id: string;
  title: string;
  badge_type: string;
  earned_at?: string;
};

export type LearningRecommendation = {
  id: string;
  title: string;
  description: string;
  reason?: string | null;
  priority: string;
  target_role?: string | null;
  status: string;
};

export type OrganizationalReport = {
  id: string;
  report_type: string;
  title: string;
  summary?: string | null;
  metrics?: Record<string, unknown>;
};

export type AcademyEvent = {
  id: string;
  event_type: string;
  title: string;
  description: string;
  scheduled_at?: string | null;
  status: string;
};

export type CommunityResource = {
  id: string;
  title: string;
  description: string;
  resource_type: string;
  status: string;
};

export type AcademyCard = {
  has_customer: boolean;
  readiness_score?: number;
  completion_rate_pct?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
};

export type AcademyDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  academy_enabled?: boolean;
  microlearning_enabled?: boolean;
  role_based_recommendations?: boolean;
  certification_prep_enabled?: boolean;
  readiness_score?: number;
  participation_pct?: number;
  completion_rate_pct?: number;
  courses_completed?: number;
  courses_in_progress?: number;
  certification_progress_pct?: number;
  learning_pillars?: Array<{ pillar: string; label: string }>;
  access_levels?: string[];
  learning_formats?: string[];
  learning_paths: LearningPath[];
  courses: AcademyCourse[];
  course_progress: CourseProgress[];
  digital_badges: DigitalBadge[];
  recommendations: LearningRecommendation[];
  organizational_reports: OrganizationalReport[];
  academy_events: AcademyEvent[];
  community_resources: CommunityResource[];
  role_based_learning?: Array<{ role: string; topics: string[] }>;
  continuous_learning?: string[];
  ai_learning_assistant?: { capabilities?: string[]; note?: string };
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  integrations?: Record<string, string>;
};

export type AcademyActionResult = {
  status?: string;
  error?: string;
};

export type AcademyBriefingResult = {
  briefing_id?: string;
  summary?: string;
  error?: string;
};
