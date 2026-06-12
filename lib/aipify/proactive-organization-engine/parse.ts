import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  ImplementationBlueprintMeta,
  IntegrationLink,
  ProactiveOrganizationBlueprint,
  ProactiveOrganizationCard,
  ProactiveOrganizationDashboard,
  ProactiveOrganizationEngagementSummary,
  ProactiveCompanionMeta,
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

function parseEngagementSummary(data: unknown): ProactiveOrganizationEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ProactiveOrganizationEngagementSummary;
}

function parseBlueprintBlock(data: unknown): ProactiveOrganizationBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ProactiveOrganizationBlueprint;
}

function parseRecordArray(data: unknown): Record<string, unknown>[] {
  if (!Array.isArray(data)) return [];
  return data as Record<string, unknown>[];
}

export function parseProactiveOrganizationCard(data: unknown): ProactiveOrganizationCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    proactive_score: Number(d.proactive_score ?? 0),
    signals_active: Number(d.signals_active ?? 0),
    support_opportunities_open: Number(d.support_opportunities_open ?? 0),
    recommendations_pending: Number(d.recommendations_pending ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_governance_required: Boolean(d.human_governance_required ?? true),
    care_not_surveillance_mode: Boolean(d.care_not_surveillance_mode ?? true),
    proactive_center_enabled: Boolean(d.proactive_center_enabled ?? true),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    proactive_organization_mission:
      typeof d.proactive_organization_mission === "string" ? d.proactive_organization_mission : undefined,
    proactive_organization_abos_principle:
      typeof d.proactive_organization_abos_principle === "string"
        ? d.proactive_organization_abos_principle
        : undefined,
    proactive_organization_engagement_summary: parseEngagementSummary(d.proactive_organization_engagement_summary),
    proactive_organization_note:
      typeof d.proactive_organization_note === "string" ? d.proactive_organization_note : undefined,
    proactive_organization_vision_note:
      typeof d.proactive_organization_vision_note === "string" ? d.proactive_organization_vision_note : undefined,
  };
}

export function parseProactiveOrganizationDashboard(data: unknown): ProactiveOrganizationDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    proactive_center_enabled: Boolean(d.proactive_center_enabled ?? true),
    anticipatory_support_enabled: Boolean(d.anticipatory_support_enabled ?? true),
    pulse_monitoring_enabled: Boolean(d.pulse_monitoring_enabled ?? true),
    companion_alerts_enabled: Boolean(d.companion_alerts_enabled ?? true),
    human_governance_required: Boolean(d.human_governance_required ?? true),
    care_not_surveillance_mode: Boolean(d.care_not_surveillance_mode ?? true),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    proactive_score: Number(d.proactive_score ?? 0),
    signals_active: Number(d.signals_active ?? 0),
    support_opportunities_open: Number(d.support_opportunities_open ?? 0),
    recommendations_pending: Number(d.recommendations_pending ?? 0),
    pulse_indicators: Number(d.pulse_indicators ?? 0),
    avg_pulse_value: Number(d.avg_pulse_value ?? 0),
    early_signals: Array.isArray(d.early_signals)
      ? (d.early_signals as ProactiveOrganizationDashboard["early_signals"])
      : [],
    support_opportunities: Array.isArray(d.support_opportunities)
      ? (d.support_opportunities as ProactiveOrganizationDashboard["support_opportunities"])
      : [],
    pulse_snapshots: Array.isArray(d.pulse_snapshots)
      ? (d.pulse_snapshots as ProactiveOrganizationDashboard["pulse_snapshots"])
      : [],
    recommendations: Array.isArray(d.recommendations)
      ? (d.recommendations as ProactiveOrganizationDashboard["recommendations"])
      : [],
    proactive_organization_center: parseRecordArray(d.proactive_organization_center),
    early_signal_engine: parseRecordArray(d.early_signal_engine),
    preventative_support_engine: parseRecordArray(d.preventative_support_engine),
    organizational_pulse_engine: parseRecordArray(d.organizational_pulse_engine),
    proactive_companion: d.proactive_companion as ProactiveCompanionMeta | undefined,
    support_opportunity_engine: parseRecordArray(d.support_opportunity_engine),
    proactive_knowledge_delivery: parseRecordArray(d.proactive_knowledge_delivery),
    executive_anticipation_dashboard: parseRecordArray(d.executive_anticipation_dashboard),
    companion_limitations: parseRecordArray(d.companion_limitations),
    self_love_connection: parseRecordArray(d.self_love_connection),
    security_requirements: parseRecordArray(d.security_requirements),
    integration_links: parseIntegrationLinks(d.integration_links ?? d.porgbp135_cross_links),
    implementation_blueprint: parseBlueprintBlock(d.implementation_blueprint),
    proactive_organization_blueprint: parseBlueprintBlock(d.proactive_organization_blueprint),
    proactive_organization_mission:
      typeof d.proactive_organization_mission === "string" ? d.proactive_organization_mission : undefined,
    proactive_organization_philosophy:
      typeof d.proactive_organization_philosophy === "string" ? d.proactive_organization_philosophy : undefined,
    proactive_organization_abos_principle:
      typeof d.proactive_organization_abos_principle === "string"
        ? d.proactive_organization_abos_principle
        : undefined,
    proactive_organization_objectives: parseObjectives(d.proactive_organization_objectives),
    proactive_organization_engagement_summary: parseEngagementSummary(d.proactive_organization_engagement_summary),
    proactive_organization_success_criteria: parseSuccessCriteria(d.proactive_organization_success_criteria),
    porgbp135_cross_links: parseIntegrationLinks(d.porgbp135_cross_links),
    proactive_organization_vision:
      typeof d.proactive_organization_vision === "string" ? d.proactive_organization_vision : undefined,
    proactive_organization_vision_phrases: Array.isArray(d.proactive_organization_vision_phrases)
      ? (d.proactive_organization_vision_phrases as string[])
      : undefined,
    proactive_organization_privacy_note:
      typeof d.proactive_organization_privacy_note === "string" ? d.proactive_organization_privacy_note : undefined,
    proactive_organization_engine_note:
      typeof d.proactive_organization_engine_note === "string" ? d.proactive_organization_engine_note : undefined,
  };
}
