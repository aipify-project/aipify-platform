import type {
  PackComparisonItem,
  PackRecommendation,
  PackRecommendationHighlight,
  PackRecommendationOverview,
} from "./types";

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" ? v : fb;
}

function parseStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => String(x));
}

function parseRecommendations(raw: unknown): PackRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id || d.pack_key),
      pack_key: str(d.pack_key),
      name: str(d.name),
      category: str(d.category),
      industry: str(d.industry) || undefined,
      confidence_level: str(d.confidence_level),
      confidence_score: num(d.confidence_score),
      complexity: str(d.complexity),
      business_impact: str(d.business_impact),
      reason_key: str(d.reason_key),
      benefits_key: str(d.benefits_key),
      suggested_users: str(d.suggested_users) || undefined,
      related_packs: parseStringArray(d.related_packs),
      installed: d.installed === true,
      saved: d.saved === true,
      features: parseStringArray(d.features),
      recommended_audience: str(d.recommended_audience) || undefined,
      can_save: d.can_save === true,
    };
  });
}

function parseHighlights(raw: unknown): PackRecommendationHighlight[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      pack_key: str(d.pack_key),
      name: str(d.name) || undefined,
      saved_at: str(d.saved_at) || undefined,
      viewed_at: str(d.viewed_at) || undefined,
      status: str(d.status) || undefined,
    };
  });
}

export function parsePackRecommendationOverview(data: unknown): PackRecommendationOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_full: d.can_full === true,
    can_manage: d.can_manage === true,
    can_view: d.can_view === true,
    has_recommendations: d.has_recommendations === true,
    recommendations: parseRecommendations(d.recommendations),
    installed_packs: parseHighlights(d.installed_packs),
    saved_recommendations: parseHighlights(d.saved_recommendations),
    recently_viewed: parseHighlights(d.recently_viewed),
    operational_categories: parseStringArray(d.operational_categories),
    principle: str(d.principle),
  };
}

export function parsePackRecommendationDetail(data: unknown): PackRecommendation {
  if (!data || typeof data !== "object") {
    return {
      id: "", pack_key: "", name: "", category: "", confidence_level: "", complexity: "",
      business_impact: "", reason_key: "", benefits_key: "",
    };
  }
  return parseRecommendations([data])[0];
}

export function parsePackComparison(data: unknown): PackComparisonItem[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.comparison)) return [];
  return d.comparison.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      pack_key: str(row.pack_key),
      name: str(row.name),
      features: parseStringArray(row.features),
      benefits_key: str(row.benefits_key),
      complexity: str(row.complexity),
      business_impact: str(row.business_impact),
      recommended_audience: str(row.recommended_audience),
      related_packs: parseStringArray(row.related_packs),
    };
  });
}
