export type EducationStudent = {
  id?: string;
  student_key?: string;
  full_name?: string;
  student_status?: string;
  progress_percent?: number;
  engagement_score?: number;
  certification_count?: number;
  [key: string]: unknown;
};

export type EducationCourse = {
  id?: string;
  course_key?: string;
  course_name?: string;
  course_status?: string;
  completion_rate?: number;
  lesson_count?: number;
  program_id?: string | null;
  instructor_id?: string | null;
  [key: string]: unknown;
};

export type EducationProgram = {
  id?: string;
  program_key?: string;
  program_name?: string;
  program_type?: string;
  program_status?: string;
  duration_weeks?: number;
  [key: string]: unknown;
};

export type EducationAdvisorSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  effort?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type EducationTrainingLearningOperationsCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  industry_packs_route?: string;
  academy_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  students?: EducationStudent[];
  courses?: EducationCourse[];
  programs?: EducationProgram[];
  instructors?: Array<Record<string, unknown>>;
  assessments?: Array<Record<string, unknown>>;
  certifications?: Array<Record<string, unknown>>;
  advisor_signals?: EducationAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  operations?: Record<string, string>;
  executive_dashboard?: Record<string, unknown>;
  [key: string]: unknown;
};
