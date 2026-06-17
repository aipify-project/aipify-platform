import type {
  PartnerAcademyCertification,
  PartnerAcademyCourse,
  PartnerAcademyDashboard,
  PartnerAcademyProgress,
} from "./types";

function asRecord(data: unknown): Record<string, unknown> {
  return data && typeof data === "object" ? (data as Record<string, unknown>) : {};
}

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function asStringArray(data: unknown): string[] {
  return asArray<unknown>(data).map(String);
}

export function parsePartnerAcademyDashboard(data: unknown): PartnerAcademyDashboard | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  const access = asRecord(d.access);
  const filters = asRecord(d.filters);
  return {
    has_access: true,
    org_id: String(d.org_id ?? ""),
    positioning: String(d.positioning ?? ""),
    access: {
      team_role: String(access.team_role ?? ""),
      full_access: Boolean(access.full_access),
      assigned_learning: Boolean(access.assigned_learning),
      limited_access: Boolean(access.limited_access),
      can_take_exams: Boolean(access.can_take_exams),
      can_manage_team_learning: Boolean(access.can_manage_team_learning),
    },
    academy_progress_pct: Number(d.academy_progress_pct ?? 0),
    certifications_earned: Number(d.certifications_earned ?? 0),
    courses_in_progress: Number(d.courses_in_progress ?? 0),
    courses_completed: Number(d.courses_completed ?? 0),
    partner_readiness_score: Number(d.partner_readiness_score ?? 0),
    recommended_learning: asArray<unknown>(d.recommended_learning).map((row) => {
      const r = asRecord(row);
      return {
        course_key: String(r.course_key ?? ""),
        title: String(r.title ?? ""),
        reason: String(r.reason ?? ""),
        certification_level: String(r.certification_level ?? ""),
      };
    }),
    missing_certifications: asArray<unknown>(d.missing_certifications).map((row) => {
      const r = asRecord(row);
      return {
        certification_key: String(r.certification_key ?? ""),
        title: String(r.title ?? ""),
        certification_level: String(r.certification_level ?? ""),
      };
    }),
    improvement_areas: asStringArray(d.improvement_areas),
    timeline: asArray<unknown>(d.timeline).map((row) => {
      const t = asRecord(row);
      return {
        id: String(t.id ?? ""),
        event_type: String(t.event_type ?? ""),
        title: String(t.title ?? ""),
        summary: String(t.summary ?? ""),
        created_at: String(t.created_at ?? ""),
      };
    }),
    filters: {
      categories: asStringArray(filters.categories),
      statuses: asStringArray(filters.statuses),
      certification_levels: asStringArray(filters.certification_levels),
      difficulties: asStringArray(filters.difficulties),
      locales: asStringArray(filters.locales),
    },
  };
}

export function parsePartnerAcademyCourses(data: unknown): PartnerAcademyCourse[] {
  const d = asRecord(data);
  if (!d.has_access) return [];
  return asArray<unknown>(d.courses).map((row) => {
    const c = asRecord(row);
    return {
      id: String(c.id ?? ""),
      course_key: String(c.course_key ?? ""),
      module_number: Number(c.module_number ?? 0),
      title: String(c.title ?? ""),
      summary: String(c.summary ?? ""),
      category: String(c.category ?? ""),
      learning_type: String(c.learning_type ?? ""),
      certification_level: String(c.certification_level ?? ""),
      difficulty: String(c.difficulty ?? ""),
      locale: String(c.locale ?? "en"),
      topic_tags: asStringArray(c.topic_tags),
      lesson_count: Number(c.lesson_count ?? 0),
      progress_pct: Number(c.progress_pct ?? 0),
      status: String(c.status ?? "not_started"),
      lessons: asArray<unknown>(c.lessons).map((lesson) => {
        const l = asRecord(lesson);
        return {
          id: String(l.id ?? ""),
          lesson_key: String(l.lesson_key ?? ""),
          title: String(l.title ?? ""),
          learning_type: String(l.learning_type ?? ""),
          duration_minutes: Number(l.duration_minutes ?? 0),
        };
      }),
    };
  });
}

export function parsePartnerAcademyCertifications(data: unknown): PartnerAcademyCertification[] {
  const d = asRecord(data);
  if (!d.has_access) return [];
  return asArray<unknown>(d.certifications).map((row) => {
    const c = asRecord(row);
    const exam = c.exam ? asRecord(c.exam) : null;
    return {
      id: String(c.id ?? ""),
      certification_key: String(c.certification_key ?? ""),
      title: String(c.title ?? ""),
      summary: String(c.summary ?? ""),
      certification_level: String(c.certification_level ?? ""),
      passing_score: Number(c.passing_score ?? 80),
      max_attempts: Number(c.max_attempts ?? 3),
      certification_status: String(c.certification_status ?? "not_started"),
      attempts_used: Number(c.attempts_used ?? 0),
      score_pct: Number(c.score_pct ?? 0),
      completion_date: String(c.completion_date ?? ""),
      exam: exam
        ? {
            exam_key: String(exam.exam_key ?? ""),
            exam_type: String(exam.exam_type ?? ""),
            passing_score: Number(exam.passing_score ?? 80),
          }
        : null,
    };
  });
}

export function parsePartnerAcademyProgress(data: unknown): PartnerAcademyProgress | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  return {
    has_access: true,
    partner_readiness_score: Number(d.partner_readiness_score ?? 0),
    course_progress: asArray<unknown>(d.course_progress).map((row) => {
      const p = asRecord(row);
      return {
        course_key: String(p.course_key ?? ""),
        title: String(p.title ?? ""),
        progress_pct: Number(p.progress_pct ?? 0),
        status: String(p.status ?? ""),
        started_at: String(p.started_at ?? ""),
        completed_at: String(p.completed_at ?? ""),
      };
    }),
    exam_attempts: asArray<unknown>(d.exam_attempts).map((row) => {
      const a = asRecord(row);
      return {
        exam_key: String(a.exam_key ?? ""),
        attempt_number: Number(a.attempt_number ?? 0),
        score_pct: Number(a.score_pct ?? 0),
        passed: Boolean(a.passed),
        completed_at: String(a.completed_at ?? ""),
      };
    }),
  };
}
