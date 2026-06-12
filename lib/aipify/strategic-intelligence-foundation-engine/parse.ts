import type {
  StrategicIntelligenceFoundationEngineCard,
  StrategicIntelligenceFoundationEngineDashboard,
  StrategicInsight,
  AbosSuccessCriterion,
  InsightCategory,
  StrategicObjective,
  CompanionCommunicationExample,
  SelfLoveConnection,
  TrustConnection,
  DataSources,
  IntegrationLink,
  ImplementationBlueprint,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseStringList(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item): item is string => typeof item === "string");
}

function parseImplementationBlueprint(data: unknown): ImplementationBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImplementationBlueprint;
}

function parseSelfLoveConnection(data: unknown): SelfLoveConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SelfLoveConnection;
}

function parseTrustConnection(data: unknown): TrustConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as TrustConnection;
}

function parseDataSources(data: unknown): DataSources | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as DataSources;
}

function parseSummary(data: unknown): StrategicIntelligenceFoundationEngineDashboard["summary"] {
  if (typeof data !== "object" || !data) return undefined;
  const s = data as Record<string, unknown>;
  return {
    new_insights: typeof s.new_insights === "number" ? s.new_insights : undefined,
    high_impact: typeof s.high_impact === "number" ? s.high_impact : undefined,
    completed: typeof s.completed === "number" ? s.completed : undefined,
  };
}

export function parseStrategicIntelligenceFoundationEngineCard(
  data: unknown
): StrategicIntelligenceFoundationEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    new_insights: typeof d.new_insights === "number" ? d.new_insights : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    implementation_blueprint: parseImplementationBlueprint(d.implementation_blueprint),
    strategic_intelligence_foundation_note:
      typeof d.strategic_intelligence_foundation_note === "string"
        ? d.strategic_intelligence_foundation_note
        : undefined,
    ...d,
  } as StrategicIntelligenceFoundationEngineCard;
}

export function parseStrategicIntelligenceFoundationEngineDashboard(
  data: unknown
): StrategicIntelligenceFoundationEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    implementation_blueprint: parseImplementationBlueprint(d.implementation_blueprint),
    mission: typeof d.mission === "string" ? d.mission : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    strategic_intelligence_foundation_note:
      typeof d.strategic_intelligence_foundation_note === "string"
        ? d.strategic_intelligence_foundation_note
        : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    strategic_objectives: parseRecordList<StrategicObjective>(d.strategic_objectives),
    insight_categories: parseRecordList<InsightCategory>(d.insight_categories),
    companion_communication_examples: parseRecordList<CompanionCommunicationExample>(
      d.companion_communication_examples
    ),
    self_love_connection: parseSelfLoveConnection(d.self_love_connection),
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    trust_connection: parseTrustConnection(d.trust_connection),
    data_sources: parseDataSources(d.data_sources),
    dogfooding: typeof d.dogfooding === "object" && d.dogfooding ? (d.dogfooding as Record<string, unknown>) : undefined,
    success_criteria: parseRecordList<AbosSuccessCriterion>(d.success_criteria),
    vision_phrases: parseStringList(d.vision_phrases),
    integration_links: parseRecordList<IntegrationLink>(d.integration_links),
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: parseStringList(d.principles),
    summary: parseSummary(d.summary),
    insights: parseRecordList<StrategicInsight>(d.insights) ?? [],
    priorities: parseRecordList<StrategicInsight>(d.priorities) ?? [],
    ...d,
  } as StrategicIntelligenceFoundationEngineDashboard;
}
