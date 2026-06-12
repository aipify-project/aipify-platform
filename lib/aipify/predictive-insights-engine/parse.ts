import type {
  BlueprintObjective,
  BottleneckForecasting,
  CompanionGuidance,
  ExecutiveInsightsBlueprint,
  ImplementationBlueprintMeta,
  LimitationPrinciples,
  OperationalPatternRecognition,
  OrganizationPredictiveInsight,
  PredictiveInsightsEngineCard,
  PredictiveInsightsEngineDashboard,
  PredictiveInsightsExport,
  PredictiveOperationsEngagementSummary,
  ResourceAwareness,
  ScenarioObservations,
  SelfLoveConnection,
  TrustConnection,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseBlueprintMeta(data: unknown): ImplementationBlueprintMeta | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImplementationBlueprintMeta;
}

function parseEngagementSummary(data: unknown): PredictiveOperationsEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as PredictiveOperationsEngagementSummary;
}

function parseSections(data: unknown): PredictiveInsightsEngineDashboard["sections"] {
  if (typeof data !== "object" || !data) return undefined;
  const s = data as Record<string, unknown>;
  return {
    active_insights: parseRecordList<OrganizationPredictiveInsight>(s.active_insights),
    by_prediction_type: parseRecordList<Record<string, unknown>>(s.by_prediction_type),
    by_risk_level: parseRecordList<Record<string, unknown>>(s.by_risk_level),
  };
}

export function parsePredictiveInsightsEngineCard(data: unknown): PredictiveInsightsEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    active_insights: typeof d.active_insights === "number" ? d.active_insights : undefined,
    high_risk_insights: typeof d.high_risk_insights === "number" ? d.high_risk_insights : undefined,
    critical_insights: typeof d.critical_insights === "number" ? d.critical_insights : undefined,
    prediction_type_count:
      typeof d.prediction_type_count === "number" ? d.prediction_type_count : undefined,
    implementation_blueprint_phase74: parseBlueprintMeta(d.implementation_blueprint_phase74),
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
    preparedness_note: typeof d.preparedness_note === "string" ? d.preparedness_note : undefined,
    ...d,
  } as PredictiveInsightsEngineCard;
}

export function parsePredictiveInsightsEngineDashboard(
  data: unknown
): PredictiveInsightsEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    sections: parseSections(d.sections),
    settings: typeof d.settings === "object" && d.settings ? (d.settings as Record<string, unknown>) : undefined,
    executive_summary:
      typeof d.executive_summary === "object" && d.executive_summary
        ? (d.executive_summary as Record<string, unknown>)
        : undefined,
    integration_notes:
      typeof d.integration_notes === "object" && d.integration_notes
        ? (d.integration_notes as Record<string, string>)
        : undefined,
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    implementation_blueprint_phase74: parseBlueprintMeta(d.implementation_blueprint_phase74),
    predictive_operations_note:
      typeof d.predictive_operations_note === "string" ? d.predictive_operations_note : undefined,
    blueprint_distinction_note:
      typeof d.blueprint_distinction_note === "string" ? d.blueprint_distinction_note : undefined,
    blueprint_mission: typeof d.blueprint_mission === "string" ? d.blueprint_mission : undefined,
    blueprint_philosophy:
      typeof d.blueprint_philosophy === "string" ? d.blueprint_philosophy : undefined,
    blueprint_abos_principle:
      typeof d.blueprint_abos_principle === "string" ? d.blueprint_abos_principle : undefined,
    blueprint_objectives: parseRecordList<BlueprintObjective>(d.blueprint_objectives),
    operational_pattern_recognition:
      typeof d.operational_pattern_recognition === "object" && d.operational_pattern_recognition
        ? (d.operational_pattern_recognition as OperationalPatternRecognition)
        : undefined,
    resource_awareness:
      typeof d.resource_awareness === "object" && d.resource_awareness
        ? (d.resource_awareness as ResourceAwareness)
        : undefined,
    bottleneck_forecasting:
      typeof d.bottleneck_forecasting === "object" && d.bottleneck_forecasting
        ? (d.bottleneck_forecasting as BottleneckForecasting)
        : undefined,
    scenario_observations:
      typeof d.scenario_observations === "object" && d.scenario_observations
        ? (d.scenario_observations as ScenarioObservations)
        : undefined,
    executive_insights_blueprint:
      typeof d.executive_insights_blueprint === "object" && d.executive_insights_blueprint
        ? (d.executive_insights_blueprint as ExecutiveInsightsBlueprint)
        : undefined,
    companion_guidance:
      typeof d.companion_guidance === "object" && d.companion_guidance
        ? (d.companion_guidance as CompanionGuidance)
        : undefined,
    self_love_connection:
      typeof d.self_love_connection === "object" && d.self_love_connection
        ? (d.self_love_connection as SelfLoveConnection)
        : undefined,
    trust_connection:
      typeof d.trust_connection === "object" && d.trust_connection
        ? (d.trust_connection as TrustConnection)
        : undefined,
    limitation_principles:
      typeof d.limitation_principles === "object" && d.limitation_principles
        ? (d.limitation_principles as LimitationPrinciples)
        : undefined,
    dogfooding:
      typeof d.dogfooding === "object" && d.dogfooding
        ? (d.dogfooding as PredictiveInsightsEngineDashboard["dogfooding"])
        : undefined,
    blueprint_integration_links: parseRecordList(d.blueprint_integration_links),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    success_criteria: parseRecordList(d.success_criteria),
    vision_phrases: Array.isArray(d.vision_phrases) ? (d.vision_phrases as string[]) : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    ...d,
  } as PredictiveInsightsEngineDashboard;
}

export function parsePredictiveInsightsExport(data: unknown): PredictiveInsightsExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    insights: parseRecordList<OrganizationPredictiveInsight>(d.insights),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    ...d,
  } as PredictiveInsightsExport;
}
