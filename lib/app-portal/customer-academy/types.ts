export type AcademySection =
  | "getting_started"
  | "product_training"
  | "team_training"
  | "certifications"
  | "knowledge_center";

export type AcademyDifficulty = "beginner" | "intermediate" | "advanced";

export type CertificationType =
  | "aipify_certified_user"
  | "aipify_operations_user"
  | "aipify_support_user"
  | "aipify_executive_user";

export type CourseDisplayState =
  | "not_started"
  | "in_progress"
  | "completed"
  | "locked"
  | "assigned"
  | "overdue";

export type AcademyCourse = {
  slug: string;
  title: string;
  section: AcademySection | string;
  category: string;
  difficulty: AcademyDifficulty | string;
  duration_minutes: number;
  content_type: string;
  description: string;
  completed?: boolean;
  assigned?: boolean;
  locked?: boolean;
  assignment_status?: string;
  progress_status?: CourseDisplayState | string;
  recommendation_reason?: string;
  href?: string;
};

export type AcademyAssignment = {
  id: string;
  course_slug: string;
  course_title: string;
  section: string;
  required: boolean;
  due_date?: string | null;
  status: string;
  department?: string;
};

export type AcademyCertification = {
  id?: string;
  certification_type: CertificationType | string;
  title: string;
  status: string;
  earned_at?: string | null;
  required_courses?: string[];
};

export type AcademyProgress = {
  courses_available?: number;
  courses_total: number;
  courses_assigned?: number;
  courses_completed: number;
  courses_started: number;
  courses_in_progress?: number;
  courses_overdue?: number;
  completion_percent: number;
  outstanding_assignments: number;
};

export type AcademyOverviewMetrics = {
  available: number;
  assigned: number;
  started: number;
  in_progress: number;
  completed: number;
  overdue: number;
  completion_percent: number;
  outstanding_assignments: number;
};

export type TeamReport = {
  team: string;
  department: string;
  completion_rate: number;
  assigned_count: number;
  overdue_count: number;
};

export type AcademySuggestedPath = {
  id: string;
  title: string;
  section: string;
  href?: string;
};

export type AcademyOverviewResponse = {
  found: boolean;
  can_manage?: boolean;
  can_admin?: boolean;
  progress?: AcademyProgress;
  courses: AcademyCourse[];
  recommended_courses: AcademyCourse[];
  assigned_training: AcademyAssignment[];
  certifications: AcademyCertification[];
  recently_released: AcademyCourse[];
  suggested_paths: AcademySuggestedPath[];
  team_reporting: TeamReport[];
  team_completion_rate: number;
};

export type AcademyProgressResponse = {
  found: boolean;
  progress?: AcademyProgress;
  completions: Array<{ course_slug: string; section: string; completed_at: string }>;
  outstanding_assignments: AcademyAssignment[];
  certifications_earned: number;
};

export type CustomerAcademyLabels = {
  eyebrow: string;
  title: string;
  subtitle: string;
  loading: string;
  breadcrumbSupport: string;
  breadcrumbAcademy: string;
  backToSupport: string;
  accessDenied: string;
  filters: {
    search: string;
    sortBy: string;
    sortTitle: string;
    sortDuration: string;
    sortDifficulty: string;
    sortSection: string;
    sortProgress: string;
    category: string;
    completionStatus: string;
    difficulty: string;
    all: string;
    notStarted: string;
    inProgress: string;
    completed: string;
  };
  overview: {
    available: string;
    assigned: string;
    started: string;
    inProgress: string;
    completed: string;
    overdue: string;
    personalCompletion: string;
  };
  sections: {
    continueLearning: string;
    recommended: string;
    gettingStarted: string;
    productTraining: string;
    certifications: string;
    teamLearning: string;
    suggestedPaths: string;
    knowledgeCenter: string;
    understanding: string;
  };
  courseStates: Record<CourseDisplayState, string>;
  courseActions: {
    start: string;
    continue: string;
    review: string;
    complete: string;
  };
  certificationStates: Record<string, string>;
  assign: {
    title: string;
    course: string;
    department: string;
    required: string;
    dueDate: string;
    submit: string;
    cancel: string;
    supportTeam: string;
    operationsTeam: string;
    leadershipTeam: string;
    action: string;
  };
  team: {
    noAssignments: string;
    assigned: string;
    completionRate: string;
    overdue: string;
  };
  recommendations: {
    onboarding: string;
    security: string;
    businessPacks: string;
    adoption: string;
  };
  difficulties: Record<string, string>;
  contentTypes: Record<string, string>;
  certifications: Record<string, string>;
  understanding: {
    whatIs: string;
    whatIsAnswer: string;
    managersAssign: string;
    managersAssignAnswer: string;
    partnerAcademy: string;
    partnerAcademyAnswer: string;
  };
  empty: {
    continueLearning: string;
    teamLearning: string;
  };
  error: {
    title: string;
    body: string;
    retry: string;
  };
};

export const ACADEMY_SECTIONS: AcademySection[] = [
  "getting_started",
  "product_training",
  "team_training",
  "certifications",
  "knowledge_center",
];

export const CERTIFICATION_TYPES: CertificationType[] = [
  "aipify_certified_user",
  "aipify_operations_user",
  "aipify_support_user",
  "aipify_executive_user",
];
