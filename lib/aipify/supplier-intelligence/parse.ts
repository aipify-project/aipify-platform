import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  CompanionGuidance,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
  SelfLoveConnection,
  SupplierIntelligenceActionResult,
  SupplierIntelligenceBlueprint,
  SupplierIntelligenceBriefingResult,
  SupplierIntelligenceCard,
  SupplierIntelligenceDashboard,
  SupplierIntelligenceEngagementSummary,
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

function parseEngagementSummary(data: unknown): SupplierIntelligenceEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SupplierIntelligenceEngagementSummary;
}

function parseBlueprintBlock(data: unknown): SupplierIntelligenceBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SupplierIntelligenceBlueprint;
}

function parseRecord(data: unknown): Record<string, unknown> | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as Record<string, unknown>;
}

function parseStringList(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item): item is string => typeof item === "string");
}

export function parseSupplierIntelligenceCard(data: unknown): SupplierIntelligenceCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    portfolio_score: Number(d.portfolio_score ?? 0),
    health_classification: typeof d.health_classification === "string" ? d.health_classification : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    implementation_blueprint_phase106: parseBlueprintMeta(d.implementation_blueprint_phase106),
    supplier_intelligence_mission:
      typeof d.supplier_intelligence_mission === "string" ? d.supplier_intelligence_mission : undefined,
    supplier_intelligence_abos_principle:
      typeof d.supplier_intelligence_abos_principle === "string"
        ? d.supplier_intelligence_abos_principle
        : undefined,
    supplier_intelligence_engagement_summary: parseEngagementSummary(
      d.supplier_intelligence_engagement_summary,
    ),
    supplier_intelligence_note:
      typeof d.supplier_intelligence_note === "string" ? d.supplier_intelligence_note : undefined,
    supplier_intelligence_vision_note:
      typeof d.supplier_intelligence_vision_note === "string"
        ? d.supplier_intelligence_vision_note
        : undefined,
  };
}

export function parseSupplierIntelligenceDashboard(data: unknown): SupplierIntelligenceDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    auto_replacement_disabled: Boolean(d.auto_replacement_disabled ?? true),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    engine_enabled: Boolean(d.engine_enabled ?? true),
    diversification_alert_threshold: Number(d.diversification_alert_threshold ?? 70),
    portfolio_score: Number(d.portfolio_score ?? 0),
    health_classification: typeof d.health_classification === "string" ? d.health_classification : undefined,
    active_suppliers: Number(d.active_suppliers ?? 0),
    open_risks: Number(d.open_risks ?? 0),
    opportunity_insights_count: Number(d.opportunity_insights_count ?? 0),
    diversification_alerts: Number(d.diversification_alerts_count ?? 0),
    relationship_records_count: Number(d.relationship_records_count ?? 0),
    recommendations_pending: Number(d.recommendations_pending ?? 0),
    supplier_profiles: Array.isArray(d.supplier_profiles)
      ? (d.supplier_profiles as SupplierIntelligenceDashboard["supplier_profiles"])
      : [],
    health_scores: Array.isArray(d.health_scores)
      ? (d.health_scores as SupplierIntelligenceDashboard["health_scores"])
      : [],
    relationship_records: Array.isArray(d.relationship_records)
      ? (d.relationship_records as SupplierIntelligenceDashboard["relationship_records"])
      : [],
    risk_events: Array.isArray(d.risk_events)
      ? (d.risk_events as SupplierIntelligenceDashboard["risk_events"])
      : [],
    opportunity_insights: Array.isArray(d.opportunity_insights)
      ? (d.opportunity_insights as SupplierIntelligenceDashboard["opportunity_insights"])
      : [],
    diversification_alerts_list: Array.isArray(d.diversification_alerts)
      ? (d.diversification_alerts as SupplierIntelligenceDashboard["diversification_alerts_list"])
      : Array.isArray(d.diversification_alerts_list)
        ? (d.diversification_alerts_list as SupplierIntelligenceDashboard["diversification_alerts_list"])
        : [],
    recommendations: Array.isArray(d.recommendations)
      ? (d.recommendations as SupplierIntelligenceDashboard["recommendations"])
      : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as SupplierIntelligenceDashboard["briefings"]) : [],
    integrations: typeof d.integrations === "object" && d.integrations
      ? (d.integrations as Record<string, string>)
      : undefined,
    implementation_blueprint_phase106: parseBlueprintMeta(d.implementation_blueprint_phase106),
    supplier_intelligence_engine_note:
      typeof d.supplier_intelligence_engine_note === "string" ? d.supplier_intelligence_engine_note : undefined,
    supplier_intelligence_blueprint: parseBlueprintBlock(d.supplier_intelligence_blueprint),
    supplier_intelligence_distinction_note:
      typeof d.supplier_intelligence_distinction_note === "string"
        ? d.supplier_intelligence_distinction_note
        : undefined,
    supplier_intelligence_mission:
      typeof d.supplier_intelligence_mission === "string" ? d.supplier_intelligence_mission : undefined,
    supplier_intelligence_philosophy:
      typeof d.supplier_intelligence_philosophy === "string" ? d.supplier_intelligence_philosophy : undefined,
    supplier_intelligence_abos_principle:
      typeof d.supplier_intelligence_abos_principle === "string"
        ? d.supplier_intelligence_abos_principle
        : undefined,
    supplier_intelligence_objectives: parseObjectives(d.supplier_intelligence_objectives),
    supplier_dashboard: parseRecord(d.supplier_dashboard),
    supplier_health_indicators: parseRecord(d.supplier_health_indicators),
    supplier_score_components: parseRecord(d.supplier_score_components),
    supplier_diversification_insights: parseRecord(d.supplier_diversification_insights),
    supplier_relationship_management: parseRecord(d.supplier_relationship_management),
    supplier_risk_intelligence: parseRecord(d.supplier_risk_intelligence),
    supplier_opportunity_insights: parseRecord(d.supplier_opportunity_insights),
    supplier_companion_guidance: parseCompanionGuidance(d.supplier_companion_guidance),
    supplier_meeting_companion_connection: parseRecord(d.supplier_meeting_companion_connection),
    supplier_self_love_connection: parseSelfLoveConnection(d.supplier_self_love_connection),
    supplier_leadership_connection: parseRecord(d.supplier_leadership_connection),
    supplier_trust_connection: parseTrustConnection(d.supplier_trust_connection),
    supplier_limitation_principles: parseLimitationPrinciples(d.supplier_limitation_principles),
    supplier_intelligence_dogfooding: parseRecord(d.supplier_intelligence_dogfooding),
    sirbp106_integration_links: parseIntegrationLinks(d.sirbp106_integration_links),
    supplier_intelligence_engagement_summary: parseEngagementSummary(
      d.supplier_intelligence_engagement_summary,
    ),
    supplier_intelligence_success_criteria: parseSuccessCriteria(d.supplier_intelligence_success_criteria),
    supplier_intelligence_vision:
      typeof d.supplier_intelligence_vision === "string" ? d.supplier_intelligence_vision : undefined,
    supplier_intelligence_vision_phrases: parseStringList(d.supplier_intelligence_vision_phrases),
    supplier_intelligence_privacy_note:
      typeof d.supplier_intelligence_privacy_note === "string"
        ? d.supplier_intelligence_privacy_note
        : undefined,
  };
}

export function parseSupplierIntelligenceActionResult(data: unknown): SupplierIntelligenceActionResult {
  return (data ?? {}) as SupplierIntelligenceActionResult;
}

export function parseSupplierIntelligenceBriefingResult(data: unknown): SupplierIntelligenceBriefingResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    briefing_id: typeof d.briefing_id === "string" ? d.briefing_id : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
  };
}
