import {
  AUDIENCES,
  COURSE_STATUSES,
  DIFFICULTY_LEVELS,
  LANGUAGES,
  MODULE_TYPES,
  QUESTION_TYPES,
  WORKFLOW_STEPS,
} from "./constants";
import type {
  AcademyAnalytics,
  AcademyAuditEntry,
  AcademyCourse,
  AcademyModule,
  AcademyOverview,
  AcademyQuestion,
  AcademyRecommendation,
  AcademyStudioCenter,
  WorkflowStepInfo,
} from "./types";

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
}

function asString(value: unknown, fallback = ""): string {
  return value == null ? fallback : String(value);
}

function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asBool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function parseEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  const str = asString(value, fallback);
  return (allowed.includes(str as T) ? str : fallback) as T;
}

function parseOverview(raw: unknown): AcademyOverview {
  const row = asRecord(raw) ?? {};
  return {
    active_courses: asNumber(row.active_courses),
    certified_users: asNumber(row.certified_users),
    expiring_certifications: asNumber(row.expiring_certifications),
    completion_rate: asNumber(row.completion_rate),
    courses_requiring_review: asNumber(row.courses_requiring_review),
    recommended_improvements: asNumber(row.recommended_improvements),
  };
}

function parseModule(raw: unknown): AcademyModule | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    module_order: asNumber(row.module_order, 1),
    module_type: parseEnum(row.module_type, MODULE_TYPES, "reading"),
    title: asString(row.title),
    content: asRecord(row.content) ?? {},
    estimated_minutes: asNumber(row.estimated_minutes, 15),
  };
}

function parseQuestion(raw: unknown): AcademyQuestion | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    question_type: parseEnum(row.question_type, QUESTION_TYPES, "multiple_choice"),
    prompt: asString(row.prompt),
    options: Array.isArray(row.options) ? row.options : [],
    difficulty_score: asNumber(row.difficulty_score, 50),
  };
}

function parseCourse(raw: unknown): AcademyCourse | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    title: asString(row.title),
    description: asString(row.description),
    audience: parseEnum(row.audience, AUDIENCES, "growth_partners"),
    difficulty: parseEnum(row.difficulty, DIFFICULTY_LEVELS, "beginner"),
    language: parseEnum(row.language, LANGUAGES, "en"),
    estimated_duration_minutes: asNumber(row.estimated_duration_minutes, 60),
    certification_required: asBool(row.certification_required, true),
    renewal_period_days: row.renewal_period_days == null ? null : asNumber(row.renewal_period_days),
    passing_threshold: asNumber(row.passing_threshold, 75),
    status: parseEnum(row.status, COURSE_STATUSES, "draft"),
    workflow_step: parseEnum(row.workflow_step, WORKFLOW_STEPS, "define_audience"),
    objective: asString(row.objective),
    outline: Array.isArray(row.outline) ? row.outline : [],
    content_types: Array.isArray(row.content_types) ? row.content_types : [],
    ai_generation_notes: asRecord(row.ai_generation_notes) ?? {},
    video_production_meta: asRecord(row.video_production_meta) ?? {},
    published_at: row.published_at ? asString(row.published_at) : null,
    modules: Array.isArray(row.modules)
      ? row.modules.map(parseModule).filter((m): m is AcademyModule => m != null)
      : [],
    questions: Array.isArray(row.questions)
      ? row.questions.map(parseQuestion).filter((q): q is AcademyQuestion => q != null)
      : [],
    created_at: asString(row.created_at),
    updated_at: asString(row.updated_at),
  };
}

function parseAnalytics(raw: unknown): AcademyAnalytics {
  const row = asRecord(raw) ?? {};
  return {
    completion_rate: asNumber(row.completion_rate),
    pass_rate: asNumber(row.pass_rate),
    average_score: asNumber(row.average_score),
    module_drop_off_rate: asNumber(row.module_drop_off_rate),
    most_difficult_questions: Array.isArray(row.most_difficult_questions)
      ? row.most_difficult_questions.map((item) => {
          const q = asRecord(item) ?? {};
          return { prompt: asString(q.prompt), difficulty_score: asNumber(q.difficulty_score) };
        })
      : [],
    retraining_opportunities: asNumber(row.retraining_opportunities),
  };
}

function parseRecommendation(raw: unknown): AcademyRecommendation | null {
  const row = asRecord(raw);
  if (!row || !row.key) return null;
  return {
    key: asString(row.key),
    message_key: asString(row.message_key, asString(row.key)),
    count: row.count == null ? undefined : asNumber(row.count),
  };
}

function parseAudit(raw: unknown): AcademyAuditEntry | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    event_type: asString(row.event_type),
    summary: asString(row.summary),
    created_at: asString(row.created_at),
  };
}

function parseWorkflow(raw: unknown): WorkflowStepInfo[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      const row = asRecord(item) ?? {};
      return {
        step: parseEnum(row.step, WORKFLOW_STEPS, "define_audience"),
        order: asNumber(row.order, 1),
      };
    })
    .sort((a, b) => a.order - b.order);
}

export function parseAcademyStudioCenter(raw: unknown): AcademyStudioCenter {
  const row = asRecord(raw) ?? {};
  if (!row.has_access) return { has_access: false };

  return {
    has_access: true,
    surface: asString(row.surface) as AcademyStudioCenter["surface"],
    overview: parseOverview(row.overview),
    courses: Array.isArray(row.courses)
      ? row.courses.map(parseCourse).filter((c): c is AcademyCourse => c != null)
      : [],
    analytics: parseAnalytics(row.analytics),
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map(parseRecommendation).filter((r): r is AcademyRecommendation => r != null)
      : [],
    audit: Array.isArray(row.audit)
      ? row.audit.map(parseAudit).filter((a): a is AcademyAuditEntry => a != null)
      : [],
    workflow: parseWorkflow(row.workflow),
    default_passing_threshold: asNumber(row.default_passing_threshold, 75),
    principle: asString(row.principle),
    supported_languages: Array.isArray(row.supported_languages)
      ? row.supported_languages.map((l) => asString(l))
      : [],
    video_production_readiness: asRecord(row.video_production_readiness) ?? undefined,
  };
}
