import type {
  ProactiveInsightRecord,
  ProactiveInsightsDashboard,
  InsightTimelineEvent,
} from "./types";

function str(v: unknown, fb = ""): string { return typeof v === "string" ? v : fb; }
function num(v: unknown, fb = 0): number { return typeof v === "number" ? v : fb; }
function bool(v: unknown): boolean { return v === true; }

function parseInsight(raw: unknown): ProactiveInsightRecord | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  if (!str(d.id)) return undefined;
  return {
    id: str(d.id),
    title: str(d.title),
    observation: str(d.observation),
    why_it_matters: str(d.why_it_matters),
    why_generated: str(d.why_generated) || undefined,
    data_sources: str(d.data_sources) || undefined,
    suggested_review: str(d.suggested_review),
    category: str(d.category),
    source_key: str(d.source_key),
    insight_scope: str(d.insight_scope) || undefined,
    department: str(d.department) || undefined,
    priority: str(d.priority),
    confidence: str(d.confidence),
    impact_level: str(d.impact_level),
    impact_score: num(d.impact_score),
    pattern_type: str(d.pattern_type) || undefined,
    status: str(d.status),
    created_at: str(d.created_at),
    updated_at: str(d.updated_at) || undefined,
  };
}

export function parseProactiveInsightsDashboard(data: unknown): ProactiveInsightsDashboard {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const timeline = Array.isArray(d.timeline)
    ? d.timeline.map((i) => {
        const e = i as Record<string, unknown>;
        return {
          id: str(e.id),
          event_type: str(e.event_type),
          description: str(e.description),
          insight_id: str(e.insight_id) || null,
          created_at: str(e.created_at),
        } satisfies InsightTimelineEvent;
      })
    : [];
  return {
    found: bool(d.found),
    can_personal: bool(d.can_personal),
    can_team: bool(d.can_team),
    can_organization: bool(d.can_organization),
    has_insights: bool(d.has_insights),
    insight_health_score: num(d.insight_health_score),
    active_insights_count: num(d.active_insights_count),
    high_priority_count: num(d.high_priority_count),
    new_insights_count: num(d.new_insights_count),
    reviewed_count: num(d.reviewed_count),
    impact_score: num(d.impact_score),
    insights: Array.isArray(d.insights)
      ? d.insights.map(parseInsight).filter(Boolean) as ProactiveInsightRecord[]
      : [],
    timeline,
    usage_examples: Array.isArray(d.usage_examples) ? d.usage_examples.map(String) : [],
    privacy_note: str(d.privacy_note),
    principle: str(d.principle),
  };
}

export function parseProactiveInsightDetail(data: unknown): {
  found: boolean;
  insight?: ProactiveInsightRecord;
  error?: string;
} {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (!bool(d.found)) return { found: false, error: str(d.error) };
  const insight = parseInsight(d.insight);
  return insight ? { found: true, insight } : { found: false };
}

export function parseHighPriorityInsights(data: unknown): {
  found: boolean;
  insights: ProactiveInsightRecord[];
} {
  if (!data || typeof data !== "object") return { found: false, insights: [] };
  const d = data as Record<string, unknown>;
  return {
    found: bool(d.found),
    insights: Array.isArray(d.insights)
      ? d.insights.map(parseInsight).filter(Boolean) as ProactiveInsightRecord[]
      : [],
  };
}

export function parseProactiveInsightAction(data: unknown): {
  ok: boolean;
  insight_id?: string;
  status?: string;
  feedback_type?: string;
  error?: string;
} {
  if (!data || typeof data !== "object") return { ok: false };
  const d = data as Record<string, unknown>;
  return {
    ok: bool(d.ok),
    insight_id: str(d.insight_id) || undefined,
    status: str(d.status) || undefined,
    feedback_type: str(d.feedback_type) || undefined,
    error: str(d.error) || undefined,
  };
}
