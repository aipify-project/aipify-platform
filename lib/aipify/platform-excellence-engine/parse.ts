import type {
  ExcellenceAdvisorSignal,
  ExcellenceConsistencyCheck,
  ExcellenceIntelligenceSignal,
  ExcellencePlatformStandard,
  ExcellenceQualityReview,
  ExcellenceQualityScore,
  ExcellenceReviewSchedule,
  PlatformExcellenceCenter,
} from "./types";

function parseReview(raw: unknown): ExcellenceQualityReview {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    review_key: typeof d.review_key === "string" ? d.review_key : undefined,
    review_title: typeof d.review_title === "string" ? d.review_title : undefined,
    review_type: typeof d.review_type === "string" ? d.review_type : undefined,
    target_scope: typeof d.target_scope === "string" ? d.target_scope : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    score: Number(d.score ?? 0),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseConsistency(raw: unknown): ExcellenceConsistencyCheck {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    check_key: typeof d.check_key === "string" ? d.check_key : undefined,
    check_title: typeof d.check_title === "string" ? d.check_title : undefined,
    check_category: typeof d.check_category === "string" ? d.check_category : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    severity: typeof d.severity === "string" ? d.severity : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseStandard(raw: unknown): ExcellencePlatformStandard {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    standard_key: typeof d.standard_key === "string" ? d.standard_key : undefined,
    standard_title: typeof d.standard_title === "string" ? d.standard_title : undefined,
    standard_type: typeof d.standard_type === "string" ? d.standard_type : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    version: typeof d.version === "string" ? d.version : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseSchedule(raw: unknown): ExcellenceReviewSchedule {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    schedule_key: typeof d.schedule_key === "string" ? d.schedule_key : undefined,
    schedule_title: typeof d.schedule_title === "string" ? d.schedule_title : undefined,
    schedule_type: typeof d.schedule_type === "string" ? d.schedule_type : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    next_review_at: typeof d.next_review_at === "string" ? d.next_review_at : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseScore(raw: unknown): ExcellenceQualityScore {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    score_key: typeof d.score_key === "string" ? d.score_key : undefined,
    score_title: typeof d.score_title === "string" ? d.score_title : undefined,
    score_dimension: typeof d.score_dimension === "string" ? d.score_dimension : undefined,
    score_value: Number(d.score_value ?? 0),
    trend: typeof d.trend === "string" ? d.trend : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseIntelligence(raw: unknown): ExcellenceIntelligenceSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    impact: typeof d.impact === "string" ? d.impact : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

function parseAdvisor(raw: unknown): ExcellenceAdvisorSignal {
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

function parseArray<T>(raw: unknown, parser: (item: unknown) => T): T[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parser);
}

export function parsePlatformExcellenceCenter(raw: unknown): PlatformExcellenceCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: d.found === true,
    has_access: d.has_access === true,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    quality_guardian_route: typeof d.quality_guardian_route === "string" ? d.quality_guardian_route : undefined,
    customer_experience_route: typeof d.customer_experience_route === "string" ? d.customer_experience_route : undefined,
    observability_route: typeof d.observability_route === "string" ? d.observability_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: typeof d.overview === "object" && d.overview !== null ? (d.overview as Record<string, unknown>) : undefined,
    settings: typeof d.settings === "object" && d.settings !== null ? (d.settings as Record<string, unknown>) : undefined,
    modules: parseArray(d.modules, (m) => m as { key?: string; route?: string }),
    core_languages: Array.isArray(d.core_languages) ? d.core_languages.filter((l): l is string => typeof l === "string") : undefined,
    quality_guardian_targets: Array.isArray(d.quality_guardian_targets)
      ? d.quality_guardian_targets.filter((l): l is string => typeof l === "string")
      : undefined,
    quality_reviews: parseArray(d.quality_reviews, parseReview),
    consistency_checks: parseArray(d.consistency_checks, parseConsistency),
    platform_standards: parseArray(d.platform_standards, parseStandard),
    review_schedules: parseArray(d.review_schedules, parseSchedule),
    quality_scores: parseArray(d.quality_scores, parseScore),
    intelligence_signals: parseArray(d.intelligence_signals, parseIntelligence),
    advisor_signals: parseArray(d.advisor_signals, parseAdvisor),
    audit_logs: parseArray(d.audit_logs, (l) => l as Record<string, unknown>),
    executive_dashboard:
      typeof d.executive_dashboard === "object" && d.executive_dashboard !== null
        ? (d.executive_dashboard as Record<string, unknown>)
        : undefined,
    governance:
      typeof d.governance === "object" && d.governance !== null ? (d.governance as Record<string, unknown>) : undefined,
  };
}
