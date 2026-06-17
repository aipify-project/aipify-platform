import type {
  ExecutiveBriefing,
  ICCActionResult,
  ICCTimelineEvent,
  IntelligenceCommandCenterOverview,
  IntelligencePriority,
  IntelligenceSource,
  ModuleScores,
} from "./types";

function str(v: unknown, fb = ""): string { return typeof v === "string" ? v : fb; }
function num(v: unknown): number | undefined {
  if (typeof v === "number") return v;
  if (typeof v === "string") { const n = parseInt(v, 10); return isNaN(n) ? undefined : n; }
  return undefined;
}
function bool(v: unknown): boolean { return v === true; }
function strArr(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => String(x));
}

function parsePriorities(raw: unknown): IntelligencePriority[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string, unknown>;
    return {
      id: str(d.id), priority_key: str(d.priority_key), title: str(d.title),
      source_module: str(d.source_module), priority_level: str(d.priority_level),
      category: str(d.category), time_horizon: str(d.time_horizon) || undefined,
      recommended_action: str(d.recommended_action), review_status: str(d.review_status),
    };
  });
}

function parseSources(raw: unknown): IntelligenceSource[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string, unknown>;
    return {
      key: str(d.key), label: str(d.label),
      score: num(d.score) ?? str(d.score) ?? 0,
      route: str(d.route),
    };
  });
}

function parseModuleScores(raw: unknown): ModuleScores | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    benchmarking: num(d.benchmarking), predictive: num(d.predictive),
    scenario: num(d.scenario), foresight: num(d.foresight),
    opportunities: num(d.opportunities), forecasting: num(d.forecasting),
    readiness: num(d.readiness), cfi: num(d.cfi), overall: num(d.overall),
  };
}

function parseOutlook(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object") return {};
  const d = raw as Record<string, unknown>;
  return Object.fromEntries(
    Object.entries(d).map(([k, v]) => [k, str(v)])
  );
}

export function parseICCOverview(data: unknown): IntelligenceCommandCenterOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: bool(d.found),
    can_full: bool(d.can_full),
    can_view: bool(d.can_view),
    can_review: bool(d.can_review),
    has_intelligence_data: bool(d.has_intelligence_data),
    enterprise_intelligence_score: num(d.enterprise_intelligence_score),
    executive_health_score: num(d.executive_health_score),
    organizational_readiness_score: num(d.organizational_readiness_score),
    strategic_opportunity_score: num(d.strategic_opportunity_score),
    forecast_confidence_score: num(d.forecast_confidence_score),
    collaboration_health_score: num(d.collaboration_health_score),
    future_preparedness_score: num(d.future_preparedness_score),
    module_scores: parseModuleScores(d.module_scores),
    executive_summary: str(d.executive_summary),
    key_observations: strArr(d.key_observations),
    priorities: parsePriorities(d.priorities),
    outlook: parseOutlook(d.outlook),
    intelligence_sources: parseSources(d.intelligence_sources),
    advisory_note: str(d.advisory_note),
    principle: str(d.principle),
  };
}

export function parseICCBriefing(data: unknown): ExecutiveBriefing | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  const b = d.briefing as Record<string, unknown> | undefined;
  if (!b) return null;
  return {
    period: str(b.period),
    summary: str(b.summary),
    key_observations: strArr(b.key_observations),
    suggested_actions: strArr(b.suggested_actions),
    review_items: strArr(b.review_items),
  };
}

export function parseICCTimeline(data: unknown): ICCTimelineEvent[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.events)) return [];
  return d.events.map((i) => {
    const e = i as Record<string, unknown>;
    return { id: str(e.id), event_type: str(e.event_type),
      source_module: str(e.source_module), description: str(e.description),
      created_at: str(e.created_at) };
  });
}

export function parseICCActionResult(data: unknown): ICCActionResult {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return { found: bool(d.found), message: str(d.message) || undefined };
}
