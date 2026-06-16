import type {
  AcademyAssignment,
  AcademyCertification,
  AcademyCourse,
  AcademyOverviewResponse,
  AcademyProgress,
  AcademyProgressResponse,
  TeamReport,
} from "./types";

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" ? v : fb;
}

function parseCourse(raw: unknown): AcademyCourse {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    slug: str(d.slug),
    title: str(d.title),
    section: str(d.section),
    category: str(d.category),
    difficulty: str(d.difficulty, "beginner"),
    duration_minutes: num(d.duration_minutes),
    content_type: str(d.content_type, "course"),
    description: str(d.description),
    completed: d.completed === true,
    assigned: d.assigned === true,
  };
}

function parseAssignment(raw: unknown): AcademyAssignment {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: str(d.id),
    course_slug: str(d.course_slug),
    course_title: str(d.course_title),
    section: str(d.section),
    required: d.required !== false,
    due_date: str(d.due_date) || null,
    status: str(d.status, "assigned"),
    department: str(d.department) || undefined,
  };
}

function parseCert(raw: unknown): AcademyCertification {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: str(d.id) || undefined,
    certification_type: str(d.certification_type),
    title: str(d.title),
    status: str(d.status, "not_started"),
    earned_at: str(d.earned_at) || null,
    required_courses: Array.isArray(d.required_courses) ? d.required_courses.map(String) : undefined,
  };
}

function parseProgress(raw: unknown): AcademyProgress | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    courses_total: num(d.courses_total),
    courses_completed: num(d.courses_completed),
    courses_started: num(d.courses_started),
    completion_percent: num(d.completion_percent),
    outstanding_assignments: num(d.outstanding_assignments),
  };
}

function parseTeam(raw: unknown): TeamReport[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((t) => {
    const d = t as Record<string, unknown>;
    return {
      team: str(d.team),
      department: str(d.department),
      completion_rate: num(d.completion_rate),
      assigned_count: num(d.assigned_count),
      overdue_count: num(d.overdue_count),
    };
  });
}

export function parseAcademyOverview(data: unknown): AcademyOverviewResponse {
  if (!data || typeof data !== "object") return { found: false, courses: [], team_reporting: [], team_completion_rate: 0, recommended_courses: [], assigned_training: [], certifications: [], recently_released: [], suggested_paths: [] };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_manage: d.can_manage === true,
    can_admin: d.can_admin === true,
    progress: parseProgress(d.progress),
    courses: Array.isArray(d.courses) ? d.courses.map(parseCourse) : [],
    recommended_courses: Array.isArray(d.recommended_courses) ? d.recommended_courses.map(parseCourse) : [],
    assigned_training: Array.isArray(d.assigned_training) ? d.assigned_training.map(parseAssignment) : [],
    certifications: Array.isArray(d.certifications) ? d.certifications.map(parseCert) : [],
    recently_released: Array.isArray(d.recently_released) ? d.recently_released.map(parseCourse) : [],
    suggested_paths: Array.isArray(d.suggested_paths)
      ? d.suggested_paths.map((p) => {
          const row = p as Record<string, unknown>;
          return { id: str(row.id), title: str(row.title), section: str(row.section) };
        })
      : [],
    team_reporting: parseTeam(d.team_reporting),
    team_completion_rate: num(d.team_completion_rate),
    principle: str(d.principle),
  };
}

export function parseAcademyProgress(data: unknown): AcademyProgressResponse {
  if (!data || typeof data !== "object") return { found: false, completions: [], outstanding_assignments: [], certifications_earned: 0 };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    progress: parseProgress(d.progress),
    completions: Array.isArray(d.completions)
      ? d.completions.map((c) => {
          const row = c as Record<string, unknown>;
          return { course_slug: str(row.course_slug), section: str(row.section), completed_at: str(row.completed_at) };
        })
      : [],
    outstanding_assignments: Array.isArray(d.outstanding_assignments) ? d.outstanding_assignments.map(parseAssignment) : [],
    certifications_earned: num(d.certifications_earned),
  };
}

export function parseAcademyCertifications(data: unknown): AcademyCertification[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  return Array.isArray(d.certifications) ? d.certifications.map(parseCert) : [];
}
