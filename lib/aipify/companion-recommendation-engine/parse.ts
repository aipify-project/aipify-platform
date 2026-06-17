import type {
  CompanionRecommendationsDashboard,
  RecommendationRecord,
  RecommendationTimelineEvent,
} from "./types";

function str(v: unknown, fb = ""): string { return typeof v === "string" ? v : fb; }
function num(v: unknown, fb = 0): number { return typeof v === "number" ? v : fb; }
function bool(v: unknown): boolean { return v === true; }

function parseRec(raw: unknown): RecommendationRecord | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  if (!str(d.id)) return undefined;
  return {
    id: str(d.id),
    title: str(d.title),
    description: str(d.description),
    reason: str(d.reason),
    suggested_action: str(d.suggested_action),
    category: str(d.category),
    source_key: str(d.source_key),
    rec_scope: str(d.rec_scope) || undefined,
    department: str(d.department) || undefined,
    priority: str(d.priority),
    confidence: str(d.confidence),
    status: str(d.status),
    accuracy_score: num(d.accuracy_score),
    created_at: str(d.created_at),
    updated_at: str(d.updated_at) || undefined,
  };
}

export function parseCompanionRecommendationsDashboard(data: unknown): CompanionRecommendationsDashboard {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const timeline = Array.isArray(d.timeline)
    ? d.timeline.map((i) => {
        const e = i as Record<string, unknown>;
        return {
          id: str(e.id),
          event_type: str(e.event_type),
          description: str(e.description),
          recommendation_id: str(e.recommendation_id) || null,
          created_at: str(e.created_at),
        } satisfies RecommendationTimelineEvent;
      })
    : [];
  return {
    found: bool(d.found),
    can_personal: bool(d.can_personal),
    can_team: bool(d.can_team),
    can_organization: bool(d.can_organization),
    has_recommendations: bool(d.has_recommendations),
    recommendation_health_score: num(d.recommendation_health_score),
    active_recommendations_count: num(d.active_recommendations_count),
    high_priority_count: num(d.high_priority_count),
    accepted_count: num(d.accepted_count),
    dismissed_count: num(d.dismissed_count),
    accuracy_score: num(d.accuracy_score),
    recommendations: Array.isArray(d.recommendations)
      ? d.recommendations.map(parseRec).filter(Boolean) as RecommendationRecord[]
      : [],
    timeline,
    usage_examples: Array.isArray(d.usage_examples) ? d.usage_examples.map(String) : [],
    privacy_note: str(d.privacy_note),
    principle: str(d.principle),
  };
}

export function parseCompanionRecommendationDetail(data: unknown): {
  found: boolean;
  recommendation?: RecommendationRecord;
  error?: string;
} {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (!bool(d.found)) return { found: false, error: str(d.error) };
  const rec = parseRec(d.recommendation);
  return rec ? { found: true, recommendation: rec } : { found: false };
}

export function parseCompanionPriorityRecommendations(data: unknown): {
  found: boolean;
  recommendations: RecommendationRecord[];
} {
  if (!data || typeof data !== "object") return { found: false, recommendations: [] };
  const d = data as Record<string, unknown>;
  return {
    found: bool(d.found),
    recommendations: Array.isArray(d.recommendations)
      ? d.recommendations.map(parseRec).filter(Boolean) as RecommendationRecord[]
      : [],
  };
}

export function parseCompanionRecommendationAction(data: unknown): {
  ok: boolean;
  recommendation_id?: string;
  status?: string;
  feedback_type?: string;
  error?: string;
} {
  if (!data || typeof data !== "object") return { ok: false };
  const d = data as Record<string, unknown>;
  return {
    ok: bool(d.ok),
    recommendation_id: str(d.recommendation_id) || undefined,
    status: str(d.status) || undefined,
    feedback_type: str(d.feedback_type) || undefined,
    error: str(d.error) || undefined,
  };
}
