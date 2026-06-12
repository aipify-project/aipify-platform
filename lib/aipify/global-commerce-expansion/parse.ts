import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  CompanionGuidance,
  GlobalCommerceExpansionActionResult,
  GlobalCommerceExpansionBlueprint,
  GlobalCommerceExpansionBriefingResult,
  GlobalCommerceExpansionCard,
  GlobalCommerceExpansionDashboard,
  GlobalCommerceExpansionEngagementSummary,
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

function parseSelfLoveConnection(data: unknown): SelfLoveConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SelfLoveConnection;
}

function parseTrustConnection(data: unknown): TrustConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as TrustConnection;
}

function parseLimitationPrinciples(data: unknown): LimitationPrinciples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as LimitationPrinciples;
}

function parseEngagementSummary(data: unknown): GlobalCommerceExpansionEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as GlobalCommerceExpansionEngagementSummary;
}

function parseBlueprintBlock(data: unknown): GlobalCommerceExpansionBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as GlobalCommerceExpansionBlueprint;
}

function parseRecord(data: unknown): Record<string, unknown> | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as Record<string, unknown>;
}

function parseStringList(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item): item is string => typeof item === "string");
}

export function parseGlobalCommerceExpansionCard(data: unknown): GlobalCommerceExpansionCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    expansion_score: Number(d.expansion_score ?? 0),
    readiness_classification:
      typeof d.readiness_classification === "string" ? d.readiness_classification : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    implementation_blueprint_phase109: parseBlueprintMeta(d.implementation_blueprint_phase109),
    global_commerce_expansion_mission:
      typeof d.global_commerce_expansion_mission === "string"
        ? d.global_commerce_expansion_mission
        : undefined,
    global_commerce_expansion_abos_principle:
      typeof d.global_commerce_expansion_abos_principle === "string"
        ? d.global_commerce_expansion_abos_principle
        : undefined,
    global_commerce_expansion_engagement_summary: parseEngagementSummary(
      d.global_commerce_expansion_engagement_summary,
    ),
    global_commerce_expansion_note:
      typeof d.global_commerce_expansion_note === "string" ? d.global_commerce_expansion_note : undefined,
    global_commerce_expansion_vision_note:
      typeof d.global_commerce_expansion_vision_note === "string"
        ? d.global_commerce_expansion_vision_note
        : undefined,
  };
}

export function parseGlobalCommerceExpansionDashboard(data: unknown): GlobalCommerceExpansionDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    auto_market_entry_disabled: Boolean(d.auto_market_entry_disabled ?? true),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    engine_enabled: Boolean(d.engine_enabled ?? true),
    expansion_score: Number(d.expansion_score ?? 0),
    readiness_classification:
      typeof d.readiness_classification === "string" ? d.readiness_classification : undefined,
    active_markets: Number(d.active_markets ?? 0),
    preparing_markets: Number(d.preparing_markets ?? 0),
    emerging_opportunities: Number(d.emerging_opportunities ?? 0),
    localization_guidance_count: Number(d.localization_guidance_count ?? 0),
    regulatory_notes_count: Number(d.regulatory_notes_count ?? 0),
    currency_visibility_count: Number(d.currency_visibility_count ?? 0),
    regional_insights_count: Number(d.regional_insights_count ?? 0),
    recommendations_pending: Number(d.recommendations_pending ?? 0),
    cultural_insights_count: Number(d.cultural_insights_count ?? 0),
    readiness_assessments_count: Number(d.readiness_assessments_count ?? 0),
    market_profiles: Array.isArray(d.market_profiles)
      ? (d.market_profiles as GlobalCommerceExpansionDashboard["market_profiles"])
      : [],
    readiness_assessments: Array.isArray(d.readiness_assessments)
      ? (d.readiness_assessments as GlobalCommerceExpansionDashboard["readiness_assessments"])
      : [],
    localization_guidance: Array.isArray(d.localization_guidance)
      ? (d.localization_guidance as GlobalCommerceExpansionDashboard["localization_guidance"])
      : [],
    cultural_insights: Array.isArray(d.cultural_insights)
      ? (d.cultural_insights as GlobalCommerceExpansionDashboard["cultural_insights"])
      : [],
    currency_visibility: Array.isArray(d.currency_visibility)
      ? (d.currency_visibility as GlobalCommerceExpansionDashboard["currency_visibility"])
      : [],
    regional_insights: Array.isArray(d.regional_insights)
      ? (d.regional_insights as GlobalCommerceExpansionDashboard["regional_insights"])
      : [],
    regulatory_notes: Array.isArray(d.regulatory_notes)
      ? (d.regulatory_notes as GlobalCommerceExpansionDashboard["regulatory_notes"])
      : [],
    recommendations: Array.isArray(d.recommendations)
      ? (d.recommendations as GlobalCommerceExpansionDashboard["recommendations"])
      : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as GlobalCommerceExpansionDashboard["briefings"]) : [],
    integrations: typeof d.integrations === "object" && d.integrations
      ? (d.integrations as Record<string, string>)
      : undefined,
    implementation_blueprint_phase109: parseBlueprintMeta(d.implementation_blueprint_phase109),
    global_commerce_expansion_engine_note:
      typeof d.global_commerce_expansion_engine_note === "string"
        ? d.global_commerce_expansion_engine_note
        : undefined,
    global_commerce_expansion_blueprint: parseBlueprintBlock(d.global_commerce_expansion_blueprint),
    global_commerce_expansion_distinction_note:
      typeof d.global_commerce_expansion_distinction_note === "string"
        ? d.global_commerce_expansion_distinction_note
        : undefined,
    global_commerce_expansion_mission:
      typeof d.global_commerce_expansion_mission === "string" ? d.global_commerce_expansion_mission : undefined,
    global_commerce_expansion_philosophy:
      typeof d.global_commerce_expansion_philosophy === "string"
        ? d.global_commerce_expansion_philosophy
        : undefined,
    global_commerce_expansion_abos_principle:
      typeof d.global_commerce_expansion_abos_principle === "string"
        ? d.global_commerce_expansion_abos_principle
        : undefined,
    global_commerce_expansion_objectives: parseObjectives(d.global_commerce_expansion_objectives),
    global_expansion_dashboard: parseRecord(d.global_expansion_dashboard),
    market_readiness_intelligence: parseRecord(d.market_readiness_intelligence),
    localization_support: parseRecord(d.localization_support),
    cultural_intelligence: parseRecord(d.cultural_intelligence),
    multi_currency_support: parseRecord(d.multi_currency_support),
    regional_commerce_insights: parseRecord(d.regional_commerce_insights),
    regulatory_awareness: parseRecord(d.regulatory_awareness),
    expansion_companion_guidance: parseCompanionGuidance(d.expansion_companion_guidance),
    growth_partner_connection: parseRecord(d.growth_partner_connection),
    expansion_self_love_connection: parseSelfLoveConnection(d.expansion_self_love_connection),
    expansion_leadership_connection: parseRecord(d.expansion_leadership_connection),
    expansion_trust_connection: parseTrustConnection(d.expansion_trust_connection),
    expansion_limitation_principles: parseLimitationPrinciples(d.expansion_limitation_principles),
    global_commerce_expansion_dogfooding: parseRecord(d.global_commerce_expansion_dogfooding),
    gcebp109_integration_links: parseIntegrationLinks(d.gcebp109_integration_links),
    global_commerce_expansion_engagement_summary: parseEngagementSummary(
      d.global_commerce_expansion_engagement_summary,
    ),
    global_commerce_expansion_success_criteria: parseSuccessCriteria(
      d.global_commerce_expansion_success_criteria,
    ),
    global_commerce_expansion_vision:
      typeof d.global_commerce_expansion_vision === "string" ? d.global_commerce_expansion_vision : undefined,
    global_commerce_expansion_vision_phrases: parseStringList(d.global_commerce_expansion_vision_phrases),
    global_commerce_expansion_privacy_note:
      typeof d.global_commerce_expansion_privacy_note === "string"
        ? d.global_commerce_expansion_privacy_note
        : undefined,
  };
}

export function parseGlobalCommerceExpansionActionResult(
  data: unknown,
): GlobalCommerceExpansionActionResult {
  return (data ?? {}) as GlobalCommerceExpansionActionResult;
}

export function parseGlobalCommerceExpansionBriefingResult(
  data: unknown,
): GlobalCommerceExpansionBriefingResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    briefing_id: typeof d.briefing_id === "string" ? d.briefing_id : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
  };
}
