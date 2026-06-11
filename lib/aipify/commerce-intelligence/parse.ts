import type {
  CommerceActionResult,
  CommerceBriefingResult,
  CommerceIntelligenceCard,
  CommerceIntelligenceDashboard,
} from "./types";

export function parseCommerceIntelligenceCard(data: unknown): CommerceIntelligenceCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    intelligence_score: Number(d.intelligence_score ?? 0),
    opportunities_count: Number(d.opportunities_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
  };
}

export function parseCommerceIntelligenceDashboard(data: unknown): CommerceIntelligenceDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    auto_import_disabled: Boolean(d.auto_import_disabled ?? true),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    engine_enabled: Boolean(d.engine_enabled ?? true),
    margin_threshold_percent: Number(d.margin_threshold_percent ?? 25),
    discovery_mode: typeof d.discovery_mode === "string" ? d.discovery_mode : undefined,
    intelligence_score: Number(d.intelligence_score ?? 0),
    opportunities_count: Number(d.opportunities_count ?? 0),
    avg_opportunity_score: Number(d.avg_opportunity_score ?? 0),
    trending_signals: Number(d.trending_signals ?? 0),
    products_to_avoid: Number(d.products_to_avoid_count ?? d.products_to_avoid ?? 0),
    watchlist_count: Number(d.watchlist_count ?? 0),
    best_opportunities: Array.isArray(d.best_opportunities)
      ? (d.best_opportunities as CommerceIntelligenceDashboard["best_opportunities"])
      : [],
    trending_now: Array.isArray(d.trending_now)
      ? (d.trending_now as CommerceIntelligenceDashboard["trending_now"])
      : [],
    high_margin_candidates: Array.isArray(d.high_margin_candidates)
      ? (d.high_margin_candidates as CommerceIntelligenceDashboard["high_margin_candidates"])
      : [],
    supplier_watchlist: Array.isArray(d.supplier_watchlist)
      ? (d.supplier_watchlist as CommerceIntelligenceDashboard["supplier_watchlist"])
      : [],
    products_to_avoid_list: Array.isArray(d.products_to_avoid)
      ? (d.products_to_avoid as CommerceIntelligenceDashboard["products_to_avoid_list"])
      : [],
    seasonal_opportunities: Array.isArray(d.seasonal_opportunities)
      ? (d.seasonal_opportunities as CommerceIntelligenceDashboard["seasonal_opportunities"])
      : [],
    store_fit_recommendations: Array.isArray(d.store_fit_recommendations)
      ? (d.store_fit_recommendations as CommerceIntelligenceDashboard["store_fit_recommendations"])
      : [],
    commerce_recommendations: Array.isArray(d.commerce_recommendations)
      ? (d.commerce_recommendations as CommerceIntelligenceDashboard["commerce_recommendations"])
      : [],
    discovery_runs: Array.isArray(d.discovery_runs)
      ? (d.discovery_runs as CommerceIntelligenceDashboard["discovery_runs"])
      : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as CommerceIntelligenceDashboard["briefings"]) : [],
    integrations: typeof d.integrations === "object" && d.integrations
      ? (d.integrations as Record<string, string>)
      : undefined,
  };
}

export function parseCommerceActionResult(data: unknown): CommerceActionResult {
  return (data ?? {}) as CommerceActionResult;
}

export function parseCommerceBriefingResult(data: unknown): CommerceBriefingResult {
  return (data ?? {}) as CommerceBriefingResult;
}
