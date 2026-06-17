import type {
  EnterpriseReadinessOverview,
  ReadinessActionResult,
  ReadinessAssessment,
  ReadinessDetail,
  ReadinessGap,
  ReadinessRecommendation,
  ReadinessReview,
} from "./types";

function str(v: unknown, fb = ""): string { return typeof v === "string" ? v : fb; }
function num(v: unknown): number | undefined { return typeof v === "number" ? v : undefined; }
function bool(v: unknown): boolean { return v === true; }

function parseAssessment(raw: unknown): ReadinessAssessment | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  if (!str(d.id)) return undefined;
  return {
    id: str(d.id),
    assessment_key: str(d.assessment_key),
    title: str(d.title),
    description: str(d.description),
    category: str(d.category),
    readiness_level: str(d.readiness_level),
    current_score: typeof d.current_score === "number" ? d.current_score : 0,
    target_score: typeof d.target_score === "number" ? d.target_score : 80,
    trend: str(d.trend),
    priority: str(d.priority),
    leadership_owner: str(d.leadership_owner),
    review_status: str(d.review_status),
    recommended_action: str(d.recommended_action),
    department: str(d.department),
    review_date: str(d.review_date) || null,
    last_reviewed_at: str(d.last_reviewed_at) || null,
    updated_at: str(d.updated_at) || undefined,
  };
}

function parseGaps(raw: unknown): ReadinessGap[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string, unknown>;
    return {
      id: str(d.id), gap_key: str(d.gap_key), title: str(d.title),
      description: str(d.description), impact_level: str(d.impact_level),
      recommended_action: str(d.recommended_action),
      suggested_owner: str(d.suggested_owner), review_timeline: str(d.review_timeline),
      status: str(d.status),
    };
  });
}

function parseRecommendations(raw: unknown): ReadinessRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string, unknown>;
    return { id: str(d.id), key: str(d.key) };
  });
}

function parseReviews(raw: unknown): ReadinessReview[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string, unknown>;
    return {
      id: str(d.id), review_notes: str(d.review_notes),
      new_score: typeof d.new_score === "number" ? d.new_score : null,
      reviewed_at: str(d.reviewed_at) || undefined,
    };
  });
}

export function parseEnterpriseReadinessOverview(data: unknown): EnterpriseReadinessOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: bool(d.found),
    can_full: bool(d.can_full),
    can_view: bool(d.can_view),
    can_review: bool(d.can_review),
    can_assess: bool(d.can_assess),
    has_assessment_data: bool(d.has_assessment_data),
    enterprise_readiness_score: num(d.enterprise_readiness_score),
    readiness_level: str(d.readiness_level),
    executive_summary: str(d.executive_summary),
    operational_readiness: parseAssessment(d.operational_readiness),
    leadership_readiness: parseAssessment(d.leadership_readiness),
    workforce_readiness: parseAssessment(d.workforce_readiness),
    technology_readiness: parseAssessment(d.technology_readiness),
    security_readiness: parseAssessment(d.security_readiness),
    compliance_readiness: parseAssessment(d.compliance_readiness),
    growth_readiness: parseAssessment(d.growth_readiness),
    gaps: parseGaps(d.gaps),
    assessments: Array.isArray(d.assessments)
      ? d.assessments.map((x) => parseAssessment(x)).filter(Boolean) as ReadinessAssessment[]
      : [],
    recommendations: parseRecommendations(d.recommendations),
    advisory_note: str(d.advisory_note),
    principle: str(d.principle),
  };
}

export function parseReadinessDetail(data: unknown): ReadinessDetail {
  if (!data || typeof data !== "object") {
    return { found: false, id: "", assessment_key: "", title: "", description: "",
      category: "", readiness_level: "developing", current_score: 0, target_score: 80,
      trend: "stable", priority: "moderate", leadership_owner: "",
      review_status: "pending", recommended_action: "", department: "" };
  }
  const d = data as Record<string, unknown>;
  const a = parseAssessment(d);
  return {
    found: bool(d.found),
    ...(a ?? {
      id: str(d.id), assessment_key: str(d.assessment_key), title: str(d.title),
      description: str(d.description), category: str(d.category),
      readiness_level: str(d.readiness_level),
      current_score: typeof d.current_score === "number" ? d.current_score : 0,
      target_score: typeof d.target_score === "number" ? d.target_score : 80,
      trend: str(d.trend), priority: str(d.priority), leadership_owner: str(d.leadership_owner),
      review_status: str(d.review_status), recommended_action: str(d.recommended_action),
      department: str(d.department),
    }),
    can_review: bool(d.can_review),
    can_assess: bool(d.can_assess),
    reviews: parseReviews(d.reviews),
    advisory_note: str(d.advisory_note),
  };
}

export function parseReadinessActionResult(data: unknown): ReadinessActionResult {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return { found: bool(d.found), message: str(d.message) || undefined,
    review_id: str(d.review_id) || undefined };
}
