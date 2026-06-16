import type {
  CapabilityCategoriesResponse,
  CapabilityCategory,
  CapabilityCenterResponse,
  CapabilityDashboard,
  CapabilityProgress,
  CapabilityRecommendation,
  HistoryPoint,
  MaturityLevelKey,
  ProgressTrend,
} from "./types";

const LEVEL_KEYS: Set<MaturityLevelKey> = new Set(["emerging", "developing", "established", "optimized", "exemplary"]);
const TRENDS: Set<ProgressTrend> = new Set(["improving", "stable", "declining"]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" ? v : fb;
}

function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => str(x)) : [];
}

function parseCategory(row: unknown): CapabilityCategory {
  const r = (row ?? {}) as Record<string, unknown>;
  const levelKey = str(r.level_key, "emerging") as MaturityLevelKey;
  return {
    key: str(r.key),
    score: num(r.score),
    system_level: num(r.system_level),
    level: num(r.level, 1),
    level_key: LEVEL_KEYS.has(levelKey) ? levelKey : "emerging",
    has_self_assessment: r.has_self_assessment === true,
    self_level: typeof r.self_level === "number" ? r.self_level : null,
    strengths: strArray(r.strengths),
    improvements: strArray(r.improvements),
    recommended_actions: strArray(r.recommended_actions),
    aipify_capabilities: strArray(r.aipify_capabilities),
    knowledge_resources: strArray(r.knowledge_resources),
  };
}

function parseRecommendation(row: unknown): CapabilityRecommendation {
  const r = (row ?? {}) as Record<string, unknown>;
  return { id: str(r.id), key: str(r.key), priority: str(r.priority), category: str(r.category) || undefined };
}

function parseDashboard(d: unknown): CapabilityDashboard {
  const o = (d ?? {}) as Record<string, unknown>;
  const trend = str(o.trend, "stable") as ProgressTrend;
  return {
    overall_score: num(o.overall_score),
    overall_level: num(o.overall_level, 1),
    overall_level_key: (str(o.overall_level_key, "emerging") as MaturityLevelKey),
    trend: TRENDS.has(trend) ? trend : "stable",
    highest_categories: Array.isArray(o.highest_categories) ? o.highest_categories.map(parseCategory) : [],
    lowest_categories: Array.isArray(o.lowest_categories) ? o.lowest_categories.map(parseCategory) : [],
    focus_areas: Array.isArray(o.focus_areas)
      ? o.focus_areas.map((f) => {
          const row = f as Record<string, unknown>;
          return { key: str(row.key), level: str(row.level) };
        })
      : [],
  };
}

function parseHistory(row: unknown): HistoryPoint {
  const r = (row ?? {}) as Record<string, unknown>;
  const scores = (r.category_scores ?? {}) as Record<string, unknown>;
  const category_scores: Record<string, number> = {};
  for (const [k, v] of Object.entries(scores)) {
    category_scores[k] = num(v);
  }
  return { recorded_at: str(r.recorded_at), overall_score: num(r.overall_score), category_scores };
}

function parseProgress(p: unknown): CapabilityProgress {
  const o = (p ?? {}) as Record<string, unknown>;
  const trend = str(o.trend, "stable") as ProgressTrend;
  return {
    history: Array.isArray(o.history) ? o.history.map(parseHistory) : [],
    trend: TRENDS.has(trend) ? trend : "stable",
    recent_milestones: Array.isArray(o.recent_milestones)
      ? o.recent_milestones.map((m) => {
          const row = m as Record<string, unknown>;
          return { key: str(row.key), level: str(row.level), completed_at: str(row.completed_at) || undefined };
        })
      : [],
    continued_focus: Array.isArray(o.continued_focus)
      ? o.continued_focus.map((f) => {
          const row = f as Record<string, unknown>;
          return { key: str(row.key), level: str(row.level) };
        })
      : [],
  };
}

export function parseCapabilityCenter(data: unknown): CapabilityCenterResponse {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    has_activity: d.has_activity === true,
    dashboard: parseDashboard(d.dashboard),
    categories: Array.isArray(d.categories) ? d.categories.map(parseCategory) : [],
    recommendations: Array.isArray(d.recommendations) ? d.recommendations.map(parseRecommendation) : [],
    progress: parseProgress(d.progress),
    principle: str(d.principle),
  };
}

export function parseCapabilityCategories(data: unknown): CapabilityCategoriesResponse {
  if (!data || typeof data !== "object") return { found: false, categories: [] };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    categories: Array.isArray(d.categories) ? d.categories.map(parseCategory) : [],
  };
}
