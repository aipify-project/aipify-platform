import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  CompanionGuidance,
  ImplementationBlueprintMeta,
  IntegrationLink,
  MultiStoreActionResult,
  MultiStoreBriefingResult,
  MultiStoreOrchestrationBlueprint,
  MultiStoreOrchestrationCard,
  MultiStoreOrchestrationDashboard,
  MultiStoreOrchestrationEngagementSummary,
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

function parseEngagementSummary(data: unknown): MultiStoreOrchestrationEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as MultiStoreOrchestrationEngagementSummary;
}

function parseBlueprintBlock(data: unknown): MultiStoreOrchestrationBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as MultiStoreOrchestrationBlueprint;
}

function parseRecord(data: unknown): Record<string, unknown> | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as Record<string, unknown>;
}

function parseStringList(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item): item is string => typeof item === "string");
}

export function parseMultiStoreOrchestrationCard(data: unknown): MultiStoreOrchestrationCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    portfolio_score: Number(d.portfolio_score ?? 0),
    portfolio_classification: typeof d.portfolio_classification === "string" ? d.portfolio_classification : undefined,
    stores_connected: Number(d.stores_connected ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    implementation_blueprint_phase105: parseBlueprintMeta(d.implementation_blueprint_phase105),
    multi_store_orchestration_mission:
      typeof d.multi_store_orchestration_mission === "string" ? d.multi_store_orchestration_mission : undefined,
    multi_store_orchestration_abos_principle:
      typeof d.multi_store_orchestration_abos_principle === "string"
        ? d.multi_store_orchestration_abos_principle
        : undefined,
    multi_store_orchestration_engagement_summary: parseEngagementSummary(
      d.multi_store_orchestration_engagement_summary,
    ),
    multi_store_orchestration_note:
      typeof d.multi_store_orchestration_note === "string" ? d.multi_store_orchestration_note : undefined,
    multi_store_orchestration_vision_note:
      typeof d.multi_store_orchestration_vision_note === "string"
        ? d.multi_store_orchestration_vision_note
        : undefined,
  };
}

export function parseMultiStoreOrchestrationDashboard(data: unknown): MultiStoreOrchestrationDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    auto_sync_disabled: Boolean(d.auto_sync_disabled ?? true),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    orchestration_enabled: Boolean(d.orchestration_enabled ?? true),
    portfolio_score: Number(d.portfolio_score ?? 0),
    portfolio_classification: typeof d.portfolio_classification === "string" ? d.portfolio_classification : undefined,
    stores_connected: Number(d.stores_connected ?? 0),
    portfolio_revenue: Number(d.portfolio_revenue ?? 0),
    avg_profit_margin_percent: Number(d.avg_profit_margin_percent ?? 0),
    stores_needing_attention: Number(d.stores_needing_attention ?? 0),
    opportunity_count: Number(d.opportunity_count ?? 0),
    governance_gaps: Number(d.governance_gaps ?? 0),
    regions_tracked: Number(d.regions_tracked ?? 0),
    store_summaries: Array.isArray(d.store_summaries)
      ? (d.store_summaries as MultiStoreOrchestrationDashboard["store_summaries"])
      : [],
    cross_store_insights: Array.isArray(d.cross_store_insights)
      ? (d.cross_store_insights as MultiStoreOrchestrationDashboard["cross_store_insights"])
      : [],
    product_sync_guidance: Array.isArray(d.product_sync_guidance)
      ? (d.product_sync_guidance as MultiStoreOrchestrationDashboard["product_sync_guidance"])
      : [],
    opportunity_distributions: Array.isArray(d.opportunity_distributions)
      ? (d.opportunity_distributions as MultiStoreOrchestrationDashboard["opportunity_distributions"])
      : [],
    governance_coordination: Array.isArray(d.governance_coordination)
      ? (d.governance_coordination as MultiStoreOrchestrationDashboard["governance_coordination"])
      : [],
    regional_expansion: Array.isArray(d.regional_expansion)
      ? (d.regional_expansion as MultiStoreOrchestrationDashboard["regional_expansion"])
      : [],
    strategic_recommendations: Array.isArray(d.strategic_recommendations)
      ? (d.strategic_recommendations as MultiStoreOrchestrationDashboard["strategic_recommendations"])
      : [],
    portfolio_notifications: Array.isArray(d.portfolio_notifications)
      ? (d.portfolio_notifications as MultiStoreOrchestrationDashboard["portfolio_notifications"])
      : [],
    executive_reports: Array.isArray(d.executive_reports)
      ? (d.executive_reports as MultiStoreOrchestrationDashboard["executive_reports"])
      : [],
    integrations:
      typeof d.integrations === "object" && d.integrations ? (d.integrations as Record<string, string>) : undefined,
    implementation_blueprint_phase105: parseBlueprintMeta(d.implementation_blueprint_phase105),
    multi_store_orchestration_engine_note:
      typeof d.multi_store_orchestration_engine_note === "string"
        ? d.multi_store_orchestration_engine_note
        : undefined,
    multi_store_orchestration_blueprint: parseBlueprintBlock(d.multi_store_orchestration_blueprint),
    multi_store_orchestration_distinction_note:
      typeof d.multi_store_orchestration_distinction_note === "string"
        ? d.multi_store_orchestration_distinction_note
        : undefined,
    multi_store_orchestration_mission:
      typeof d.multi_store_orchestration_mission === "string" ? d.multi_store_orchestration_mission : undefined,
    multi_store_orchestration_philosophy:
      typeof d.multi_store_orchestration_philosophy === "string" ? d.multi_store_orchestration_philosophy : undefined,
    multi_store_orchestration_abos_principle:
      typeof d.multi_store_orchestration_abos_principle === "string"
        ? d.multi_store_orchestration_abos_principle
        : undefined,
    multi_store_orchestration_objectives: parseObjectives(d.multi_store_orchestration_objectives),
    multi_store_supported_environments: parseRecord(d.multi_store_supported_environments),
    multi_store_executive_commerce_dashboard: parseRecord(d.multi_store_executive_commerce_dashboard),
    multi_store_performance_comparison: parseRecord(d.multi_store_performance_comparison),
    multi_store_cross_store_intelligence: parseRecord(d.multi_store_cross_store_intelligence),
    multi_store_unified_product_management: parseRecord(d.multi_store_unified_product_management),
    multi_store_global_commerce_insights: parseRecord(d.multi_store_global_commerce_insights),
    multi_store_automation_connection: parseRecord(d.multi_store_automation_connection),
    multi_store_companion_guidance: parseCompanionGuidance(d.multi_store_companion_guidance),
    multi_store_leadership_connection: parseRecord(d.multi_store_leadership_connection),
    multi_store_self_love_connection: parseSelfLoveConnection(d.multi_store_self_love_connection),
    multi_store_trust_connection: parseTrustConnection(d.multi_store_trust_connection),
    multi_store_permission_principles: parseRecord(d.multi_store_permission_principles),
    multi_store_orchestration_dogfooding: parseRecord(d.multi_store_orchestration_dogfooding),
    msobp105_integration_links: parseIntegrationLinks(d.msobp105_integration_links),
    multi_store_orchestration_engagement_summary: parseEngagementSummary(
      d.multi_store_orchestration_engagement_summary,
    ),
    multi_store_orchestration_success_criteria: parseSuccessCriteria(d.multi_store_orchestration_success_criteria),
    multi_store_orchestration_vision:
      typeof d.multi_store_orchestration_vision === "string" ? d.multi_store_orchestration_vision : undefined,
    multi_store_orchestration_vision_phrases: parseStringList(d.multi_store_orchestration_vision_phrases),
    multi_store_orchestration_privacy_note:
      typeof d.multi_store_orchestration_privacy_note === "string"
        ? d.multi_store_orchestration_privacy_note
        : undefined,
  };
}

export function parseMultiStoreActionResult(data: unknown): MultiStoreActionResult {
  return (data ?? {}) as MultiStoreActionResult;
}

export function parseMultiStoreBriefingResult(data: unknown): MultiStoreBriefingResult {
  return (data ?? {}) as MultiStoreBriefingResult;
}
