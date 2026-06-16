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
  courses_total: number;
  courses_completed: number;
  courses_started: number;
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
  suggested_paths: Array<{ id: string; title: string; section: string }>;
  team_reporting: TeamReport[];
  team_completion_rate: number;
  principle?: string;
};

export type AcademyProgressResponse = {
  found: boolean;
  progress?: AcademyProgress;
  completions: Array<{ course_slug: string; section: string; completed_at: string }>;
  outstanding_assignments: AcademyAssignment[];
  certifications_earned: number;
};

export type CustomerAcademyLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  accessDenied: string;
  filters: {
    search: string;
    category: string;
    completionStatus: string;
    certificationType: string;
    department: string;
    difficulty: string;
    all: string;
    notStarted: string;
    completed: string;
  };
  dashboard: {
    progress: string;
    completionRate: string;
    recommended: string;
    assigned: string;
    certifications: string;
    teamRate: string;
    recentlyReleased: string;
    suggestedPaths: string;
    coursesStarted: string;
    coursesCompleted: string;
    outstanding: string;
  };
  sections: {
    gettingStarted: string;
    productTraining: string;
    teamTraining: string;
    certifications: string;
    knowledgeCenter: string;
    teamReporting: string;
  };
  assign: {
    title: string;
    course: string;
    department: string;
    required: string;
    dueDate: string;
    notes: string;
    submit: string;
    cancel: string;
    supportTeam: string;
    operationsTeam: string;
    leadershipTeam: string;
  };
  course: {
    complete: string;
    completed: string;
    minutes: string;
    required: string;
    optional: string;
    overdue: string;
  };
  team: {
    assigned: string;
    completionRate: string;
    overdue: string;
    recommendedActions: string;
  };
  certifications: Record<string, string>;
  difficulties: Record<string, string>;
  contentTypes: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    managersAssign: string;
    managersAssignAnswer: string;
    partnerAcademy: string;
    partnerAcademyAnswer: string;
  };
};

export const ACADEMY_SECTIONS: AcademySection[] = [
  "getting_started", "product_training", "team_training", "certifications", "knowledge_center",
];

export const CERTIFICATION_TYPES: CertificationType[] = [
  "aipify_certified_user", "aipify_operations_user", "aipify_support_user", "aipify_executive_user",
];
