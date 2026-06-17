import type {
  CompanionContextDashboard,
  ContextRecommendation,
  ContextSource,
  ContextRecord,
  ContextTimelineEvent,
} from "./types";

function str(v: unknown, fb = ""): string { return typeof v === "string" ? v : fb; }
function num(v: unknown, fb = 0): number { return typeof v === "number" ? v : fb; }
function bool(v: unknown): boolean { return v === true; }

function parseSource(raw: unknown): ContextSource | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  if (!str(d.source_key) && !str(d.id)) return undefined;
  return {
    id: str(d.id),
    source_key: str(d.source_key),
    title: str(d.title),
    description: str(d.description) || undefined,
    category: str(d.category),
    status: str(d.status),
    signal_count: num(d.signal_count),
    coverage_pct: num(d.coverage_pct),
    department: str(d.department),
    priority: str(d.priority),
    last_updated_at: str(d.last_updated_at) || null,
  };
}

function parseRecords(raw: unknown): ContextRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string, unknown>;
    return {
      id: str(d.id),
      title: str(d.title),
      summary: str(d.summary),
      source_key: str(d.source_key),
      priority: str(d.priority),
      confidence: str(d.confidence),
    };
  });
}

function parseRecommendations(raw: unknown): ContextRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string, unknown>;
    return {
      id: str(d.id),
      rec_key: str(d.rec_key) || undefined,
      title: str(d.title),
      summary: str(d.summary),
      recommendation: str(d.recommendation),
      effort: str(d.effort) || undefined,
      value_hint: str(d.value_hint) || undefined,
      priority: str(d.priority),
      department: str(d.department) || undefined,
    };
  });
}

export function parseCompanionContextDashboard(data: unknown): CompanionContextDashboard {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const cv = d.companion_view as Record<string, unknown> | undefined;
  return {
    found: bool(d.found),
    can_self: bool(d.can_self),
    can_team: bool(d.can_team),
    can_org: bool(d.can_org),
    has_context_data: bool(d.has_context_data),
    context_health_score: num(d.context_health_score),
    companion_readiness_score: num(d.companion_readiness_score),
    available_signals: num(d.available_signals),
    context_coverage_pct: num(d.context_coverage_pct),
    active_sources_count: num(d.active_sources_count),
    context_confidence: str(d.context_confidence),
    active_sources: Array.isArray(d.active_sources)
      ? d.active_sources.map((x) => parseSource(x)).filter(Boolean) as ContextSource[]
      : [],
    recently_updated_sources: Array.isArray(d.recently_updated_sources)
      ? d.recently_updated_sources as { source_key: string; title: string }[]
      : [],
    user_context: parseRecords(d.user_context),
    organization_context: parseRecords(d.organization_context),
    work_context: parseRecords(d.work_context),
    companion_view: cv ? {
      current_focus: str(cv.current_focus) || undefined,
      recent_activity: str(cv.recent_activity) || undefined,
      pending_actions: Array.isArray(cv.pending_actions)
        ? cv.pending_actions as { title: string; summary?: string }[]
        : [],
      upcoming_events: str(cv.upcoming_events) || undefined,
      recommended_attention: Array.isArray(cv.recommended_attention)
        ? cv.recommended_attention as { title: string; recommendation?: string }[]
        : [],
      context_confidence: str(cv.context_confidence) || undefined,
    } : undefined,
    usage_example: str(d.usage_example),
    privacy_note: str(d.privacy_note),
    principle: str(d.principle),
  };
}

export function parseCompanionContextSources(data: unknown): { found: boolean; sources: ContextSource[] } {
  if (!data || typeof data !== "object") return { found: false, sources: [] };
  const d = data as Record<string, unknown>;
  return {
    found: bool(d.found),
    sources: Array.isArray(d.sources)
      ? d.sources.map((x) => parseSource(x)).filter(Boolean) as ContextSource[]
      : [],
  };
}

export function parseCompanionContextTimeline(data: unknown): { found: boolean; timeline: ContextTimelineEvent[] } {
  if (!data || typeof data !== "object") return { found: false, timeline: [] };
  const d = data as Record<string, unknown>;
  const timeline = Array.isArray(d.timeline)
    ? d.timeline.map((i) => {
        const e = i as Record<string, unknown>;
        return {
          id: str(e.id),
          event_type: str(e.event_type),
          description: str(e.description),
          source_key: str(e.source_key) || undefined,
          created_at: str(e.created_at),
        };
      })
    : [];
  return { found: bool(d.found), timeline };
}

export function parseCompanionContextRecommendations(data: unknown): {
  found: boolean;
  recommendations: ContextRecommendation[];
} {
  if (!data || typeof data !== "object") return { found: false, recommendations: [] };
  const d = data as Record<string, unknown>;
  return {
    found: bool(d.found),
    recommendations: parseRecommendations(d.recommendations),
  };
}
