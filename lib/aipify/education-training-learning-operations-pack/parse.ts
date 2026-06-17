import type {
  EducationAdvisorSignal,
  EducationCourse,
  EducationProgram,
  EducationStudent,
  EducationTrainingLearningOperationsCenter,
} from "./types";

function parseStudent(raw: unknown): EducationStudent {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    student_key: typeof d.student_key === "string" ? d.student_key : undefined,
    full_name: typeof d.full_name === "string" ? d.full_name : undefined,
    student_status: typeof d.student_status === "string" ? d.student_status : undefined,
    progress_percent: Number(d.progress_percent ?? 0),
    engagement_score: Number(d.engagement_score ?? 0),
    certification_count: Number(d.certification_count ?? 0),
  };
}

function parseCourse(raw: unknown): EducationCourse {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    course_key: typeof d.course_key === "string" ? d.course_key : undefined,
    course_name: typeof d.course_name === "string" ? d.course_name : undefined,
    course_status: typeof d.course_status === "string" ? d.course_status : undefined,
    completion_rate: Number(d.completion_rate ?? 0),
    lesson_count: Number(d.lesson_count ?? 0),
    program_id: typeof d.program_id === "string" ? d.program_id : null,
    instructor_id: typeof d.instructor_id === "string" ? d.instructor_id : null,
  };
}

function parseProgram(raw: unknown): EducationProgram {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    program_key: typeof d.program_key === "string" ? d.program_key : undefined,
    program_name: typeof d.program_name === "string" ? d.program_name : undefined,
    program_type: typeof d.program_type === "string" ? d.program_type : undefined,
    program_status: typeof d.program_status === "string" ? d.program_status : undefined,
    duration_weeks: Number(d.duration_weeks ?? 0),
  };
}

function parseSignal(raw: unknown): EducationAdvisorSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    impact: typeof d.impact === "string" ? d.impact : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    effort: typeof d.effort === "string" ? d.effort : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

export function parseEducationTrainingLearningOperationsCenter(
  raw: unknown
): EducationTrainingLearningOperationsCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    industry_packs_route: typeof d.industry_packs_route === "string" ? d.industry_packs_route : undefined,
    academy_route: typeof d.academy_route === "string" ? d.academy_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: typeof d.overview === "object" && d.overview ? (d.overview as Record<string, unknown>) : undefined,
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    students: Array.isArray(d.students) ? d.students.map(parseStudent) : [],
    courses: Array.isArray(d.courses) ? d.courses.map(parseCourse) : [],
    programs: Array.isArray(d.programs) ? d.programs.map(parseProgram) : [],
    instructors: Array.isArray(d.instructors) ? (d.instructors as Array<Record<string, unknown>>) : [],
    assessments: Array.isArray(d.assessments) ? (d.assessments as Array<Record<string, unknown>>) : [],
    certifications: Array.isArray(d.certifications) ? (d.certifications as Array<Record<string, unknown>>) : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseSignal) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    operations: typeof d.operations === "object" && d.operations ? (d.operations as Record<string, string>) : undefined,
    executive_dashboard: typeof d.executive_dashboard === "object" && d.executive_dashboard
      ? (d.executive_dashboard as Record<string, unknown>)
      : undefined,
  };
}
