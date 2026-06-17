export type PartnerAcademyDashboard = {
  has_access: boolean;
  org_id: string;
  positioning: string;
  access: {
    team_role: string;
    full_access: boolean;
    assigned_learning: boolean;
    limited_access: boolean;
    can_take_exams: boolean;
    can_manage_team_learning: boolean;
  };
  academy_progress_pct: number;
  certifications_earned: number;
  courses_in_progress: number;
  courses_completed: number;
  partner_readiness_score: number;
  recommended_learning: Array<{
    course_key: string;
    title: string;
    reason: string;
    certification_level: string;
  }>;
  missing_certifications: Array<{
    certification_key: string;
    title: string;
    certification_level: string;
  }>;
  improvement_areas: string[];
  timeline: Array<{
    id: string;
    event_type: string;
    title: string;
    summary: string;
    created_at: string;
  }>;
  filters: {
    categories: string[];
    statuses: string[];
    certification_levels: string[];
    difficulties: string[];
    locales: string[];
  };
};

export type PartnerAcademyCourse = {
  id: string;
  course_key: string;
  module_number: number;
  title: string;
  summary: string;
  category: string;
  learning_type: string;
  certification_level: string;
  difficulty: string;
  locale: string;
  topic_tags: string[];
  lesson_count: number;
  progress_pct: number;
  status: string;
  lessons: Array<{
    id: string;
    lesson_key: string;
    title: string;
    learning_type: string;
    duration_minutes: number;
  }>;
};

export type PartnerAcademyCertification = {
  id: string;
  certification_key: string;
  title: string;
  summary: string;
  certification_level: string;
  passing_score: number;
  max_attempts: number;
  certification_status: string;
  attempts_used: number;
  score_pct: number;
  completion_date: string;
  exam: {
    exam_key: string;
    exam_type: string;
    passing_score: number;
  } | null;
};

export type PartnerAcademyProgress = {
  has_access: boolean;
  partner_readiness_score: number;
  course_progress: Array<{
    course_key: string;
    title: string;
    progress_pct: number;
    status: string;
    started_at: string;
    completed_at: string;
  }>;
  exam_attempts: Array<{
    exam_key: string;
    attempt_number: number;
    score_pct: number;
    passed: boolean;
    completed_at: string;
  }>;
};

export type PartnerAcademyFilters = {
  category?: string;
  status?: string;
  cert_level?: string;
  difficulty?: string;
  locale?: string;
  search?: string;
};
