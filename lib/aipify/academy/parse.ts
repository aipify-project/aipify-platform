import type {
  AcademyActionResult,
  AcademyBriefingResult,
  AcademyCard,
  AcademyDashboard,
} from "./types";

export function parseAcademyCard(data: unknown): AcademyCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    readiness_score: Number(d.readiness_score ?? 0),
    completion_rate_pct: Number(d.completion_rate_pct ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
  };
}

export function parseAcademyDashboard(data: unknown): AcademyDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    academy_enabled: Boolean(d.academy_enabled ?? true),
    microlearning_enabled: Boolean(d.microlearning_enabled ?? true),
    role_based_recommendations: Boolean(d.role_based_recommendations ?? true),
    certification_prep_enabled: Boolean(d.certification_prep_enabled ?? true),
    readiness_score: Number(d.readiness_score ?? 0),
    participation_pct: Number(d.participation_pct ?? 0),
    completion_rate_pct: Number(d.completion_rate_pct ?? 0),
    courses_completed: Number(d.courses_completed ?? 0),
    courses_in_progress: Number(d.courses_in_progress ?? 0),
    certification_progress_pct: Number(d.certification_progress_pct ?? 0),
    learning_pillars: Array.isArray(d.learning_pillars)
      ? (d.learning_pillars as AcademyDashboard["learning_pillars"])
      : [],
    access_levels: Array.isArray(d.access_levels) ? (d.access_levels as string[]) : [],
    learning_formats: Array.isArray(d.learning_formats) ? (d.learning_formats as string[]) : [],
    learning_paths: Array.isArray(d.learning_paths) ? (d.learning_paths as AcademyDashboard["learning_paths"]) : [],
    courses: Array.isArray(d.courses) ? (d.courses as AcademyDashboard["courses"]) : [],
    course_progress: Array.isArray(d.course_progress) ? (d.course_progress as AcademyDashboard["course_progress"]) : [],
    digital_badges: Array.isArray(d.digital_badges) ? (d.digital_badges as AcademyDashboard["digital_badges"]) : [],
    recommendations: Array.isArray(d.recommendations) ? (d.recommendations as AcademyDashboard["recommendations"]) : [],
    organizational_reports: Array.isArray(d.organizational_reports)
      ? (d.organizational_reports as AcademyDashboard["organizational_reports"])
      : [],
    academy_events: Array.isArray(d.academy_events) ? (d.academy_events as AcademyDashboard["academy_events"]) : [],
    community_resources: Array.isArray(d.community_resources)
      ? (d.community_resources as AcademyDashboard["community_resources"])
      : [],
    role_based_learning: Array.isArray(d.role_based_learning)
      ? (d.role_based_learning as AcademyDashboard["role_based_learning"])
      : [],
    continuous_learning: Array.isArray(d.continuous_learning) ? (d.continuous_learning as string[]) : [],
    ai_learning_assistant: typeof d.ai_learning_assistant === "object" && d.ai_learning_assistant
      ? (d.ai_learning_assistant as AcademyDashboard["ai_learning_assistant"])
      : undefined,
    briefings: Array.isArray(d.briefings) ? (d.briefings as AcademyDashboard["briefings"]) : [],
    integrations: typeof d.integrations === "object" && d.integrations
      ? (d.integrations as Record<string, string>)
      : undefined,
  };
}

export function parseAcademyActionResult(data: unknown): AcademyActionResult {
  return (data ?? {}) as AcademyActionResult;
}

export function parseAcademyBriefingResult(data: unknown): AcademyBriefingResult {
  return (data ?? {}) as AcademyBriefingResult;
}
