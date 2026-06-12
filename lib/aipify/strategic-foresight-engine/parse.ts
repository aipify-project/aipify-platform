import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  EngagementSummary,
  ForesightScenario,
  ForesightTrend,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
  ReadinessSnapshot,
  SelfLoveConnection,
  StrategicForesightBlueprint,
  StrategicForesightCard,
  StrategicForesightDashboard,
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

function parseTrends(data: unknown): ForesightTrend[] {
  if (!Array.isArray(data)) return [];
  return data as ForesightTrend[];
}

function parseScenarios(data: unknown): ForesightScenario[] {
  if (!Array.isArray(data)) return [];
  return data as ForesightScenario[];
}

function parseReadinessSnapshots(data: unknown): ReadinessSnapshot[] {
  if (!Array.isArray(data)) return [];
  return data as ReadinessSnapshot[];
}

function parseLimitationPrinciples(data: unknown): LimitationPrinciples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as LimitationPrinciples;
}

function parseSelfLoveConnection(data: unknown): SelfLoveConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SelfLoveConnection;
}

function parseEngagementSummary(data: unknown): EngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as EngagementSummary;
}

function parseBlueprintBlock(data: unknown): StrategicForesightBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as StrategicForesightBlueprint;
}

function parseRecord(data: unknown): Record<string, unknown> | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as Record<string, unknown>;
}

function parseRecordArray(data: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(data)) return [];
  return data as Array<Record<string, unknown>>;
}

export function parseStrategicForesightCard(data: unknown): StrategicForesightCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    foresight_preparedness_score: Number(d.foresight_preparedness_score ?? 0),
    active_trends: Number(d.active_trends ?? 0),
    active_scenarios: Number(d.active_scenarios ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    foresight_enabled: Boolean(d.foresight_enabled ?? true),
    implementation_blueprint_phase122: parseBlueprintMeta(d.implementation_blueprint_phase122),
    strategic_foresight_mission:
      typeof d.strategic_foresight_mission === "string" ? d.strategic_foresight_mission : undefined,
    strategic_foresight_abos_principle:
      typeof d.strategic_foresight_abos_principle === "string"
        ? d.strategic_foresight_abos_principle
        : undefined,
    strategic_foresight_engagement_summary: parseEngagementSummary(d.strategic_foresight_engagement_summary),
    strategic_foresight_vision_note:
      typeof d.strategic_foresight_vision_note === "string" ? d.strategic_foresight_vision_note : undefined,
  };
}

export function parseStrategicForesightDashboard(data: unknown): StrategicForesightDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    foresight_enabled: Boolean(d.foresight_enabled ?? true),
    trend_monitoring_enabled: Boolean(d.trend_monitoring_enabled ?? true),
    scenario_planning_enabled: Boolean(d.scenario_planning_enabled ?? true),
    strategic_briefings_enabled: Boolean(d.strategic_briefings_enabled ?? true),
    future_readiness_enabled: Boolean(d.future_readiness_enabled ?? true),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    foresight_preparedness_score: Number(d.foresight_preparedness_score ?? 0),
    active_trends: Number(d.active_trends ?? 0),
    active_scenarios: Number(d.active_scenarios ?? 0),
    readiness_snapshots: Number(d.readiness_snapshots ?? 0),
    trend_categories_count: Number(d.trend_categories_count ?? 0),
    scenario_types_count: Number(d.scenario_types_count ?? 0),
    intelligence_center_capabilities_count: Number(d.intelligence_center_capabilities_count ?? 0),
    trends: parseTrends(d.trends),
    scenarios: parseScenarios(d.scenarios),
    readiness_snapshots_list: parseReadinessSnapshots(d.readiness_snapshots_list),
    trend_category_scaffolds: parseRecordArray(d.trend_category_scaffolds),
    scenario_type_scaffolds: parseRecordArray(d.scenario_type_scaffolds),
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint_phase122: parseBlueprintMeta(d.implementation_blueprint_phase122),
    strategic_foresight_blueprint: parseBlueprintBlock(d.strategic_foresight_blueprint),
    strategic_foresight_mission:
      typeof d.strategic_foresight_mission === "string" ? d.strategic_foresight_mission : undefined,
    strategic_foresight_philosophy:
      typeof d.strategic_foresight_philosophy === "string" ? d.strategic_foresight_philosophy : undefined,
    strategic_foresight_abos_principle:
      typeof d.strategic_foresight_abos_principle === "string"
        ? d.strategic_foresight_abos_principle
        : undefined,
    strategic_foresight_objectives: parseObjectives(d.strategic_foresight_objectives),
    strategic_intelligence_center: parseRecord(d.strategic_intelligence_center),
    trend_intelligence_engine: parseRecord(d.trend_intelligence_engine),
    foresight_framework: parseRecord(d.foresight_framework),
    scenario_planning_engine: parseRecord(d.scenario_planning_engine),
    opportunity_intelligence: parseRecord(d.opportunity_intelligence),
    risk_landscape_engine: parseRecord(d.risk_landscape_engine),
    future_readiness_assessments: parseRecord(d.future_readiness_assessments),
    executive_foresight_companion: parseRecord(d.executive_foresight_companion),
    companion_limitations: parseRecord(d.companion_limitations),
    self_love_in_foresight: parseSelfLoveConnection(d.self_love_in_foresight),
    strategic_knowledge_library: parseRecord(d.strategic_knowledge_library),
    sfebp122_cross_links: parseIntegrationLinks(d.sfebp122_cross_links),
    limitation_principles: parseLimitationPrinciples(d.limitation_principles),
    companion_adaptation: parseRecord(d.companion_adaptation),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    success_criteria: parseSuccessCriteria(d.success_criteria),
    success_metrics: parseRecordArray(d.success_metrics),
    strategic_foresight_vision:
      typeof d.strategic_foresight_vision === "string" ? d.strategic_foresight_vision : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
  };
}
