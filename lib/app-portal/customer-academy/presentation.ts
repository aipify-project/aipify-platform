import type {
  AcademyAssignment,
  AcademyCertification,
  AcademyCourse,
  AcademyOverviewMetrics,
  AcademyProgress,
  AcademySection,
  CourseDisplayState,
} from "./types";
import {
  ACADEMY_SECTION_ORDER,
  ACADEMY_SORT_OPTIONS,
  type AcademySortOption,
  resolveCourseHref,
} from "./config";

export type RecommendedCourse = AcademyCourse & {
  reason_key?: string;
  presentation_context?: "recommended";
};

export function resolveCourseState(
  course: AcademyCourse,
  assignment?: AcademyAssignment
): CourseDisplayState {
  if (course.locked) return "locked";
  if (course.completed) return "completed";
  if (assignment?.status === "overdue") return "overdue";
  if (assignment?.status === "in_progress") return "in_progress";
  if (course.assigned || assignment) return "assigned";
  if (course.progress_status === "in_progress") return "in_progress";
  return "not_started";
}

export function indexAssignmentsBySlug(assignments: AcademyAssignment[]): Map<string, AcademyAssignment> {
  const map = new Map<string, AcademyAssignment>();
  for (const a of assignments) {
    if (!map.has(a.course_slug)) map.set(a.course_slug, a);
  }
  return map;
}

export function dedupeCourses(courses: AcademyCourse[]): AcademyCourse[] {
  const seen = new Map<string, AcademyCourse>();
  for (const course of courses) {
    if (!seen.has(course.slug)) seen.set(course.slug, course);
  }
  return [...seen.values()];
}

export function mergeCourseCatalog(
  courses: AcademyCourse[],
  recommended: AcademyCourse[],
  assignments: AcademyAssignment[]
): AcademyCourse[] {
  const assignmentMap = indexAssignmentsBySlug(assignments);
  const merged = dedupeCourses([...courses, ...recommended]);
  return merged.map((course) => {
    const assignment = assignmentMap.get(course.slug);
    return {
      ...course,
      assigned: course.assigned || Boolean(assignment),
      assignment_status: assignment?.status ?? course.assignment_status,
      href: course.href ?? resolveCourseHref(course.slug, course.content_type),
    };
  });
}

export function computeOverviewMetrics(
  progress: AcademyProgress | undefined,
  courses: AcademyCourse[],
  assignments: AcademyAssignment[]
): AcademyOverviewMetrics {
  const courseItems = courses.filter((c) => c.content_type === "course");
  const available = progress?.courses_available ?? courseItems.length;
  const completed = progress?.courses_completed ?? courseItems.filter((c) => c.completed).length;
  const assignmentMap = indexAssignmentsBySlug(assignments);
  let inProgress = 0;
  let assigned = 0;
  let overdue = 0;
  for (const course of courseItems) {
    const assignment = assignmentMap.get(course.slug);
    const state = resolveCourseState(course, assignment);
    if (state === "in_progress") inProgress += 1;
    if (state === "assigned" || state === "in_progress" || state === "overdue") assigned += 1;
    if (state === "overdue") overdue += 1;
  }
  const started = progress?.courses_started ?? completed + inProgress;
  return {
    available,
    assigned,
    started,
    in_progress: progress?.courses_in_progress ?? inProgress,
    completed,
    overdue: progress?.courses_overdue ?? overdue,
    completion_percent: progress?.completion_percent ?? 0,
    outstanding_assignments: progress?.outstanding_assignments ?? overdue,
  };
}

export function continueLearningCourses(
  courses: AcademyCourse[],
  assignments: AcademyAssignment[]
): AcademyCourse[] {
  const assignmentMap = indexAssignmentsBySlug(assignments);
  return courses
    .filter((c) => c.content_type === "course" && !c.completed)
    .filter((c) => resolveCourseState(c, assignmentMap.get(c.slug)) === "in_progress")
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function recommendedCoursesWithContext(
  recommended: AcademyCourse[],
  allCourses: AcademyCourse[]
): RecommendedCourse[] {
  const catalog = new Map(allCourses.map((c) => [c.slug, c]));
  return recommended.map((rec) => ({
    ...(catalog.get(rec.slug) ?? rec),
    presentation_context: "recommended" as const,
    reason_key: rec.recommendation_reason ?? inferRecommendationReason(rec.slug),
  }));
}

function inferRecommendationReason(slug: string): string {
  if (slug.includes("welcome") || slug.includes("setting")) return "onboarding";
  if (slug.includes("security") || slug.includes("2fa")) return "security";
  if (slug.includes("business")) return "businessPacks";
  return "adoption";
}

export function coursesForSection(
  courses: AcademyCourse[],
  section: AcademySection | string,
  excludeSlugs: Set<string> = new Set()
): AcademyCourse[] {
  return courses
    .filter((c) => c.section === section && c.content_type === "course" && !excludeSlugs.has(c.slug))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function knowledgeResources(courses: AcademyCourse[]): AcademyCourse[] {
  return courses
    .filter((c) => c.section === "knowledge_center")
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function sortCourses(courses: AcademyCourse[], sortBy: AcademySortOption): AcademyCourse[] {
  const sorted = [...courses];
  switch (sortBy) {
    case "duration":
      return sorted.sort((a, b) => a.duration_minutes - b.duration_minutes || a.title.localeCompare(b.title));
    case "difficulty":
      return sorted.sort((a, b) => a.difficulty.localeCompare(b.difficulty) || a.title.localeCompare(b.title));
    case "section":
      return sorted.sort((a, b) => {
        const sa = ACADEMY_SECTION_ORDER.indexOf(a.section as typeof ACADEMY_SECTION_ORDER[number]);
        const sb = ACADEMY_SECTION_ORDER.indexOf(b.section as typeof ACADEMY_SECTION_ORDER[number]);
        if (sa !== sb) return sa - sb;
        return a.title.localeCompare(b.title);
      });
    case "progress":
      return sorted.sort((a, b) => {
        const rank = (c: AcademyCourse) => (c.completed ? 2 : c.assigned ? 1 : 0);
        return rank(a) - rank(b) || a.title.localeCompare(b.title);
      });
    default:
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
}

export function certificationProgress(
  cert: AcademyCertification | undefined,
  requiredCount: number,
  completedCount: number
): number {
  if (!cert || requiredCount <= 0) return 0;
  if (cert.status === "earned") return 100;
  return Math.round((completedCount / requiredCount) * 100);
}

export function teamHasAssignments(metrics: AcademyOverviewMetrics, teamReportingCount: number): boolean {
  return metrics.assigned > 0 || teamReportingCount > 0;
}

export function isValidSortOption(value: string): value is AcademySortOption {
  return (ACADEMY_SORT_OPTIONS as readonly string[]).includes(value);
}

export function mapCertificationWorkflowState(status: string): string {
  const normalized = status.trim().toLowerCase();
  if (normalized === "earned") return "completed";
  if (normalized === "in_progress") return "in_progress";
  if (normalized === "expired") return "blocked";
  return "not_started";
}
