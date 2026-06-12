import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  CommerceBriefingResult,
  CommerceCompanionBlueprint,
  CommerceCompanionCard,
  CommerceCompanionDashboard,
  CommerceCompanionEngagementSummary,
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

function parseIntegrationLinks(data: unknown): IntegrationLink[] {
  if (!Array.isArray(data)) return [];
  return data as IntegrationLink[];
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

function parseEngagementSummary(data: unknown): CommerceCompanionEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CommerceCompanionEngagementSummary;
}

function parseBlueprintBlock(data: unknown): CommerceCompanionBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CommerceCompanionBlueprint;
}

function parseRecord(data: unknown): Record<string, unknown> | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as Record<string, unknown>;
}

export function parseCommerceCompanionCard(data: unknown): CommerceCompanionCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    companion_score: Number(d.companion_score ?? 0),
    operational_alerts_count: Number(d.operational_alerts_count ?? 0),
    growth_opportunities_count: Number(d.growth_opportunities_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    pressure_free_mode: Boolean(d.pressure_free_mode ?? true),
    implementation_blueprint_phase110: parseBlueprintMeta(d.implementation_blueprint_phase110),
    commerce_companion_mission:
      typeof d.commerce_companion_mission === "string" ? d.commerce_companion_mission : undefined,
    commerce_companion_abos_principle:
      typeof d.commerce_companion_abos_principle === "string"
        ? d.commerce_companion_abos_principle
        : undefined,
    commerce_companion_engagement_summary: parseEngagementSummary(d.commerce_companion_engagement_summary),
    commerce_companion_note:
      typeof d.commerce_companion_note === "string" ? d.commerce_companion_note : undefined,
    commerce_companion_vision_note:
      typeof d.commerce_companion_vision_note === "string" ? d.commerce_companion_vision_note : undefined,
  };
}

export function parseCommerceCompanionDashboard(data: unknown): CommerceCompanionDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    pressure_free_mode: Boolean(d.pressure_free_mode ?? true),
    companion_enabled: Boolean(d.companion_enabled ?? true),
    morning_briefing_enabled: Boolean(d.morning_briefing_enabled ?? true),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    companion_score: Number(d.companion_score ?? 0),
    operational_alerts_count: Number(d.operational_alerts_count ?? 0),
    growth_opportunities_count: Number(d.growth_opportunities_count ?? 0),
    profitability_coaching_count: Number(d.profitability_coaching_count ?? 0),
    guidance_items_count: Number(d.guidance_items_count ?? 0),
    integration_modules_count: Number(d.integration_modules_count ?? 0),
    revenue_performance: typeof d.revenue_performance === "string" ? d.revenue_performance : undefined,
    profit_performance: typeof d.profit_performance === "string" ? d.profit_performance : undefined,
    top_products_summary: typeof d.top_products_summary === "string" ? d.top_products_summary : undefined,
    supplier_health_summary:
      typeof d.supplier_health_summary === "string" ? d.supplier_health_summary : undefined,
    journey_indicators_summary:
      typeof d.journey_indicators_summary === "string" ? d.journey_indicators_summary : undefined,
    expansion_readiness_summary:
      typeof d.expansion_readiness_summary === "string" ? d.expansion_readiness_summary : undefined,
    morning_briefing_guidance: Array.isArray(d.morning_briefing_guidance)
      ? (d.morning_briefing_guidance as CommerceCompanionDashboard["morning_briefing_guidance"])
      : [],
    companion_personality: Array.isArray(d.companion_personality)
      ? (d.companion_personality as CommerceCompanionDashboard["companion_personality"])
      : [],
    operational_alerts: Array.isArray(d.operational_alerts)
      ? (d.operational_alerts as CommerceCompanionDashboard["operational_alerts"])
      : [],
    opportunity_signals: Array.isArray(d.opportunity_signals)
      ? (d.opportunity_signals as CommerceCompanionDashboard["opportunity_signals"])
      : [],
    profitability_coaching: Array.isArray(d.profitability_coaching)
      ? (d.profitability_coaching as CommerceCompanionDashboard["profitability_coaching"])
      : [],
    integration_health: Array.isArray(d.integration_health)
      ? (d.integration_health as CommerceCompanionDashboard["integration_health"])
      : [],
    daily_briefings: Array.isArray(d.daily_briefings)
      ? (d.daily_briefings as CommerceCompanionDashboard["daily_briefings"])
      : [],
    integration_links: parseIntegrationLinks(d.integration_links ?? d.ccombp110_integration_links),
    implementation_blueprint_phase110: parseBlueprintMeta(d.implementation_blueprint_phase110),
    commerce_companion_engine_note:
      typeof d.commerce_companion_engine_note === "string" ? d.commerce_companion_engine_note : undefined,
    commerce_companion_blueprint: parseBlueprintBlock(d.commerce_companion_blueprint),
    commerce_companion_distinction_note:
      typeof d.commerce_companion_distinction_note === "string"
        ? d.commerce_companion_distinction_note
        : undefined,
    commerce_companion_mission:
      typeof d.commerce_companion_mission === "string" ? d.commerce_companion_mission : undefined,
    commerce_companion_philosophy:
      typeof d.commerce_companion_philosophy === "string" ? d.commerce_companion_philosophy : undefined,
    commerce_companion_abos_principle:
      typeof d.commerce_companion_abos_principle === "string"
        ? d.commerce_companion_abos_principle
        : undefined,
    commerce_companion_objectives: parseObjectives(d.commerce_companion_objectives),
    commerce_companion_dashboard_meta: parseRecord(d.commerce_companion_dashboard_meta),
    morning_commerce_briefings: parseRecord(d.morning_commerce_briefings),
    commercial_opportunity_guidance: parseRecord(d.commercial_opportunity_guidance),
    operational_awareness: parseRecord(d.operational_awareness),
    profitability_coaching_meta: parseRecord(d.profitability_coaching_meta),
    customer_success_connection: parseRecord(d.customer_success_connection),
    growth_partner_connection: parseRecord(d.growth_partner_connection),
    meeting_companion_connection: parseRecord(d.meeting_companion_connection),
    knowledge_center_connection: parseRecord(d.knowledge_center_connection),
    companion_personality_meta: parseRecord(d.companion_personality_meta),
    commerce_self_love_connection: parseSelfLoveConnection(d.commerce_self_love_connection),
    commerce_leadership_connection: parseRecord(d.commerce_leadership_connection),
    commerce_trust_connection: parseTrustConnection(d.commerce_trust_connection),
    commerce_limitation_principles: parseLimitationPrinciples(d.commerce_limitation_principles),
    commerce_companion_dogfooding: parseRecord(d.commerce_companion_dogfooding),
    ccombp110_integration_links: parseIntegrationLinks(d.ccombp110_integration_links),
    commerce_companion_engagement_summary: parseEngagementSummary(d.commerce_companion_engagement_summary),
    commerce_companion_success_criteria: parseSuccessCriteria(d.commerce_companion_success_criteria),
    commerce_companion_vision:
      typeof d.commerce_companion_vision === "string" ? d.commerce_companion_vision : undefined,
    commerce_companion_privacy_note:
      typeof d.commerce_companion_privacy_note === "string" ? d.commerce_companion_privacy_note : undefined,
  };
}

export function parseCommerceBriefingResult(data: unknown): CommerceBriefingResult {
  return (data ?? {}) as CommerceBriefingResult;
}
