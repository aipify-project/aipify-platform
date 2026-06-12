import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  CommercePerformanceActionResult,
  CommercePerformanceBlueprint,
  CommercePerformanceBriefingResult,
  CommercePerformanceCard,
  CommercePerformanceDashboard,
  CommercePerformanceEngagementSummary,
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

function parseEngagementSummary(data: unknown): CommercePerformanceEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CommercePerformanceEngagementSummary;
}

function parseBlueprintBlock(data: unknown): CommercePerformanceBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CommercePerformanceBlueprint;
}

function parseRecord(data: unknown): Record<string, unknown> | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as Record<string, unknown>;
}

function parseStringList(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item): item is string => typeof item === "string");
}

export function parseCommercePerformanceCard(data: unknown): CommercePerformanceCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    performance_score: Number(d.performance_score ?? 0),
    performance_classification: typeof d.performance_classification === "string" ? d.performance_classification : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    implementation_blueprint_phase104: parseBlueprintMeta(d.implementation_blueprint_phase104),
    commerce_performance_mission:
      typeof d.commerce_performance_mission === "string" ? d.commerce_performance_mission : undefined,
    commerce_performance_abos_principle:
      typeof d.commerce_performance_abos_principle === "string"
        ? d.commerce_performance_abos_principle
        : undefined,
    commerce_performance_engagement_summary: parseEngagementSummary(d.commerce_performance_engagement_summary),
    commerce_performance_note:
      typeof d.commerce_performance_note === "string" ? d.commerce_performance_note : undefined,
    commerce_performance_vision_note:
      typeof d.commerce_performance_vision_note === "string" ? d.commerce_performance_vision_note : undefined,
  };
}

export function parseCommercePerformanceDashboard(data: unknown): CommercePerformanceDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    auto_actions_disabled: Boolean(d.auto_actions_disabled ?? true),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    engine_enabled: Boolean(d.engine_enabled ?? true),
    margin_alert_threshold: Number(d.margin_alert_threshold ?? 20),
    performance_score: Number(d.performance_score ?? 0),
    performance_classification: typeof d.performance_classification === "string" ? d.performance_classification : undefined,
    total_revenue: Number(d.total_revenue ?? 0),
    estimated_profit: Number(d.estimated_profit ?? 0),
    avg_net_margin_percent: Number(d.avg_net_margin_percent ?? 0),
    open_risks: Number(d.open_risks ?? 0),
    opportunity_count: Number(d.opportunity_count ?? 0),
    products_tracked: Number(d.products_tracked ?? 0),
    profit_risk_products: Number(d.profit_risk_products ?? 0),
    profit_intelligence: Array.isArray(d.profit_intelligence)
      ? (d.profit_intelligence as CommercePerformanceDashboard["profit_intelligence"])
      : [],
    product_profitability: Array.isArray(d.product_profitability)
      ? (d.product_profitability as CommercePerformanceDashboard["product_profitability"])
      : [],
    customer_value_signals: Array.isArray(d.customer_value_signals)
      ? (d.customer_value_signals as CommercePerformanceDashboard["customer_value_signals"])
      : [],
    revenue_trends: Array.isArray(d.revenue_trends)
      ? (d.revenue_trends as CommercePerformanceDashboard["revenue_trends"])
      : [],
    performance_opportunities: Array.isArray(d.performance_opportunities)
      ? (d.performance_opportunities as CommercePerformanceDashboard["performance_opportunities"])
      : [],
    loss_prevention: Array.isArray(d.loss_prevention)
      ? (d.loss_prevention as CommercePerformanceDashboard["loss_prevention"])
      : [],
    strategic_recommendations: Array.isArray(d.strategic_recommendations)
      ? (d.strategic_recommendations as CommercePerformanceDashboard["strategic_recommendations"])
      : [],
    executive_reports: Array.isArray(d.executive_reports)
      ? (d.executive_reports as CommercePerformanceDashboard["executive_reports"])
      : [],
    integrations:
      typeof d.integrations === "object" && d.integrations ? (d.integrations as Record<string, string>) : undefined,
    implementation_blueprint_phase104: parseBlueprintMeta(d.implementation_blueprint_phase104),
    commerce_performance_engine_note:
      typeof d.commerce_performance_engine_note === "string" ? d.commerce_performance_engine_note : undefined,
    commerce_performance_blueprint: parseBlueprintBlock(d.commerce_performance_blueprint),
    commerce_performance_distinction_note:
      typeof d.commerce_performance_distinction_note === "string" ? d.commerce_performance_distinction_note : undefined,
    commerce_performance_mission:
      typeof d.commerce_performance_mission === "string" ? d.commerce_performance_mission : undefined,
    commerce_performance_philosophy:
      typeof d.commerce_performance_philosophy === "string" ? d.commerce_performance_philosophy : undefined,
    commerce_performance_abos_principle:
      typeof d.commerce_performance_abos_principle === "string" ? d.commerce_performance_abos_principle : undefined,
    commerce_performance_objectives: parseObjectives(d.commerce_performance_objectives),
    commerce_performance_dashboard_meta: parseRecord(d.commerce_performance_dashboard_meta),
    commerce_profit_intelligence_meta: parseRecord(d.commerce_profit_intelligence_meta),
    commerce_product_performance_insights: parseRecord(d.commerce_product_performance_insights),
    commerce_growth_quality_analysis: parseRecord(d.commerce_growth_quality_analysis),
    commerce_cost_visibility: parseRecord(d.commerce_cost_visibility),
    commerce_companion_guidance: parseCompanionGuidance(d.commerce_companion_guidance),
    commerce_pricing_insights: parseRecord(d.commerce_pricing_insights),
    commerce_strategy_connection: parseRecord(d.commerce_strategy_connection),
    commerce_self_love_connection: parseSelfLoveConnection(d.commerce_self_love_connection),
    commerce_leadership_insights: parseRecord(d.commerce_leadership_insights),
    commerce_trust_connection: parseTrustConnection(d.commerce_trust_connection),
    commerce_limitation_principles: parseLimitationPrinciples(d.commerce_limitation_principles),
    commerce_performance_dogfooding: parseRecord(d.commerce_performance_dogfooding),
    cppbp104_integration_links: parseIntegrationLinks(d.cppbp104_integration_links),
    commerce_performance_engagement_summary: parseEngagementSummary(d.commerce_performance_engagement_summary),
    commerce_performance_success_criteria: parseSuccessCriteria(d.commerce_performance_success_criteria),
    commerce_performance_vision:
      typeof d.commerce_performance_vision === "string" ? d.commerce_performance_vision : undefined,
    commerce_performance_vision_phrases: parseStringList(d.commerce_performance_vision_phrases),
    commerce_performance_privacy_note:
      typeof d.commerce_performance_privacy_note === "string" ? d.commerce_performance_privacy_note : undefined,
  };
}

export function parseCommercePerformanceActionResult(data: unknown): CommercePerformanceActionResult {
  return (data ?? {}) as CommercePerformanceActionResult;
}

export function parseCommercePerformanceBriefingResult(data: unknown): CommercePerformanceBriefingResult {
  return (data ?? {}) as CommercePerformanceBriefingResult;
}
