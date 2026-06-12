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
  BlueprintGuidanceBlock,
  BlueprintPrincipleBlock,
  StrategicIntelligenceEngagementSummary,
  AdaptiveStrategicIntelligenceBlock,
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

function parseEngagementSummary(data: unknown): StrategicIntelligenceEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as StrategicIntelligenceEngagementSummary;
}

function parseGuidanceBlock(data: unknown): BlueprintGuidanceBlock | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as BlueprintGuidanceBlock;
}

function parsePrincipleBlock(data: unknown): BlueprintPrincipleBlock | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as BlueprintPrincipleBlock;
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

function parseAdaptiveStrategicIntelligenceBlock(
  data: unknown
): AdaptiveStrategicIntelligenceBlock | undefined {
  if (typeof data !== "object" || !data) return undefined;
  const d = data as Record<string, unknown>;
  return {
    implementation_blueprint_phase85: parseImplementationBlueprint(d.implementation_blueprint_phase85),
    adaptive_strategic_intelligence_note:
      typeof d.adaptive_strategic_intelligence_note === "string"
        ? d.adaptive_strategic_intelligence_note
        : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    objectives: parseRecordList<StrategicObjective>(d.objectives),
    adaptive_strategic_questions: parseGuidanceBlock(d.adaptive_strategic_questions),
    continuous_strategic_review: parseGuidanceBlock(d.continuous_strategic_review),
    companion_guidance: parseGuidanceBlock(d.companion_guidance),
    learning_organization_connection: parseGuidanceBlock(d.learning_organization_connection),
    strategic_flexibility: parseGuidanceBlock(d.strategic_flexibility),
    self_love_connection: parseSelfLoveConnection(d.self_love_connection),
    leadership_insights: parseGuidanceBlock(d.leadership_insights),
    trust_connection: parseTrustConnection(d.trust_connection),
    limitation_principles: parsePrincipleBlock(d.limitation_principles),
    dogfooding:
      typeof d.dogfooding === "object" && d.dogfooding ? (d.dogfooding as Record<string, unknown>) : undefined,
    success_criteria: parseRecordList<AbosSuccessCriterion>(d.success_criteria),
    vision_phrases: parseStringList(d.vision_phrases),
    integration_links: parseRecordList<IntegrationLink>(d.integration_links),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
  };
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
    implementation_blueprint_phase79: parseImplementationBlueprint(d.implementation_blueprint_phase79),
    blueprint_mission: typeof d.blueprint_mission === "string" ? d.blueprint_mission : undefined,
    blueprint_abos_principle:
      typeof d.blueprint_abos_principle === "string" ? d.blueprint_abos_principle : undefined,
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
    understanding_note: typeof d.understanding_note === "string" ? d.understanding_note : undefined,
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
    implementation_blueprint_phase79: parseImplementationBlueprint(d.implementation_blueprint_phase79),
    strategic_intelligence_engine_note:
      typeof d.strategic_intelligence_engine_note === "string"
        ? d.strategic_intelligence_engine_note
        : undefined,
    blueprint_distinction_note:
      typeof d.blueprint_distinction_note === "string" ? d.blueprint_distinction_note : undefined,
    blueprint_mission: typeof d.blueprint_mission === "string" ? d.blueprint_mission : undefined,
    blueprint_philosophy: typeof d.blueprint_philosophy === "string" ? d.blueprint_philosophy : undefined,
    blueprint_abos_principle:
      typeof d.blueprint_abos_principle === "string" ? d.blueprint_abos_principle : undefined,
    blueprint_objectives: parseRecordList<StrategicObjective>(d.blueprint_objectives),
    intelligence_sources: parseGuidanceBlock(d.intelligence_sources),
    strategic_observations: parseGuidanceBlock(d.strategic_observations),
    pattern_recognition: parseGuidanceBlock(d.pattern_recognition),
    opportunity_identification: parseGuidanceBlock(d.opportunity_identification),
    leadership_intelligence_briefings: parseGuidanceBlock(d.leadership_intelligence_briefings),
    companion_guidance: parseGuidanceBlock(d.companion_guidance),
    blueprint_self_love_connection: parseSelfLoveConnection(d.blueprint_self_love_connection),
    blueprint_trust_connection: parseTrustConnection(d.blueprint_trust_connection),
    limitation_principles: parsePrincipleBlock(d.limitation_principles),
    blueprint_dogfooding:
      typeof d.blueprint_dogfooding === "object" && d.blueprint_dogfooding
        ? (d.blueprint_dogfooding as Record<string, unknown>)
        : undefined,
    blueprint_integration_links: parseRecordList<IntegrationLink>(d.blueprint_integration_links),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_success_criteria: parseRecordList<AbosSuccessCriterion>(d.blueprint_success_criteria),
    blueprint_vision_phrases: parseStringList(d.blueprint_vision_phrases),
    blueprint_privacy_note:
      typeof d.blueprint_privacy_note === "string" ? d.blueprint_privacy_note : undefined,
    adaptive_strategic_intelligence: parseAdaptiveStrategicIntelligenceBlock(
      d.adaptive_strategic_intelligence
    ),
    ...d,
  } as StrategicIntelligenceFoundationEngineDashboard;
}
