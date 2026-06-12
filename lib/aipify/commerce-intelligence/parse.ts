import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  CommerceActionResult,
  CommerceBriefingResult,
  CommerceIntelligenceBlueprint,
  CommerceIntelligenceCard,
  CommerceIntelligenceDashboard,
  CommerceIntelligenceEngagementSummary,
  CompanionGuidance,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
  SelfLoveConnection,
  TrustConnection,
} from "./types";

function parseBlueprintMeta(data: unknown): ImplementationBlueprintMeta | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImplementationBlueprintMeta;
}

function parseObjectives(data: unknown): BlueprintObjective[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as BlueprintObjective[];
}

function parseSuccessCriteria(data: unknown): AbosSuccessCriterion[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as AbosSuccessCriterion[];
}

function parseIntegrationLinks(data: unknown): IntegrationLink[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as IntegrationLink[];
}

function parseCompanionGuidance(data: unknown): CompanionGuidance | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CompanionGuidance;
}

function parseLimitationPrinciples(data: unknown): LimitationPrinciples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as LimitationPrinciples;
}

function parseSelfLoveConnection(data: unknown): SelfLoveConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SelfLoveConnection;
}

function parseTrustConnection(data: unknown): TrustConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as TrustConnection;
}

function parseEngagementSummary(data: unknown): CommerceIntelligenceEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CommerceIntelligenceEngagementSummary;
}

function parseBlueprintBlock(data: unknown): CommerceIntelligenceBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CommerceIntelligenceBlueprint;
}

function parseRecord(data: unknown): Record<string, unknown> | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as Record<string, unknown>;
}

function parseStringList(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item): item is string => typeof item === "string");
}

export function parseCommerceIntelligenceCard(data: unknown): CommerceIntelligenceCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    intelligence_score: Number(d.intelligence_score ?? 0),
    opportunities_count: Number(d.opportunities_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    implementation_blueprint_phase101: parseBlueprintMeta(d.implementation_blueprint_phase101),
    commerce_intelligence_mission:
      typeof d.commerce_intelligence_mission === "string" ? d.commerce_intelligence_mission : undefined,
    commerce_intelligence_abos_principle:
      typeof d.commerce_intelligence_abos_principle === "string"
        ? d.commerce_intelligence_abos_principle
        : undefined,
    commerce_intelligence_engagement_summary: parseEngagementSummary(
      d.commerce_intelligence_engagement_summary,
    ),
    commerce_intelligence_note:
      typeof d.commerce_intelligence_note === "string" ? d.commerce_intelligence_note : undefined,
    commerce_intelligence_vision_note:
      typeof d.commerce_intelligence_vision_note === "string" ? d.commerce_intelligence_vision_note : undefined,
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
    implementation_blueprint_phase101: parseBlueprintMeta(d.implementation_blueprint_phase101),
    commerce_intelligence_engine_note:
      typeof d.commerce_intelligence_engine_note === "string" ? d.commerce_intelligence_engine_note : undefined,
    commerce_intelligence_blueprint: parseBlueprintBlock(d.commerce_intelligence_blueprint),
    commerce_intelligence_distinction_note:
      typeof d.commerce_intelligence_distinction_note === "string"
        ? d.commerce_intelligence_distinction_note
        : undefined,
    commerce_intelligence_mission:
      typeof d.commerce_intelligence_mission === "string" ? d.commerce_intelligence_mission : undefined,
    commerce_intelligence_philosophy:
      typeof d.commerce_intelligence_philosophy === "string" ? d.commerce_intelligence_philosophy : undefined,
    commerce_intelligence_abos_principle:
      typeof d.commerce_intelligence_abos_principle === "string"
        ? d.commerce_intelligence_abos_principle
        : undefined,
    commerce_intelligence_objectives: parseObjectives(d.commerce_intelligence_objectives),
    commerce_insight_sources: parseRecord(d.commerce_insight_sources),
    commerce_trend_intelligence: parseRecord(d.commerce_trend_intelligence),
    commerce_product_opportunity_discovery: parseRecord(d.commerce_product_opportunity_discovery),
    commerce_margin_intelligence: parseRecord(d.commerce_margin_intelligence),
    commerce_supplier_insights: parseRecord(d.commerce_supplier_insights),
    commerce_companion_guidance: parseCompanionGuidance(d.commerce_companion_guidance),
    commerce_strategy_connection: parseRecord(d.commerce_strategy_connection),
    commerce_self_love_connection: parseSelfLoveConnection(d.commerce_self_love_connection),
    commerce_trust_connection: parseTrustConnection(d.commerce_trust_connection),
    commerce_limitation_principles: parseLimitationPrinciples(d.commerce_limitation_principles),
    commerce_intelligence_dogfooding: parseRecord(d.commerce_intelligence_dogfooding),
    cibp101_integration_links: parseIntegrationLinks(d.cibp101_integration_links),
    commerce_intelligence_engagement_summary: parseEngagementSummary(
      d.commerce_intelligence_engagement_summary,
    ),
    commerce_intelligence_success_criteria: parseSuccessCriteria(d.commerce_intelligence_success_criteria),
    commerce_intelligence_vision:
      typeof d.commerce_intelligence_vision === "string" ? d.commerce_intelligence_vision : undefined,
    commerce_intelligence_vision_phrases: parseStringList(d.commerce_intelligence_vision_phrases),
    commerce_intelligence_privacy_note:
      typeof d.commerce_intelligence_privacy_note === "string"
        ? d.commerce_intelligence_privacy_note
        : undefined,
  };
}

export function parseCommerceActionResult(data: unknown): CommerceActionResult {
  return (data ?? {}) as CommerceActionResult;
}

export function parseCommerceBriefingResult(data: unknown): CommerceBriefingResult {
  return (data ?? {}) as CommerceBriefingResult;
}
