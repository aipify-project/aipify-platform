import type {
  BlueprintIntegrationLink,
  BlueprintObjective,
  BlueprintSection,
  BlueprintSuccessCriterion,
  CompanionGrowthAdaptiveSettings,
  CompanionGrowthFeedbackEvent,
  EvolutionCapability,
  GrowthDimension,
  GrowthEvolutionEngineCard,
  GrowthEvolutionEngineDashboard,
  GrowthEvolutionExport,
  GrowthEvolutionRecommendation,
  GrowthEvolutionSettings,
  GrowthEvolutionSignal,
  LearningCycleStep,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSettings(data: unknown): GrowthEvolutionSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as GrowthEvolutionSettings;
}

function parseAdaptiveSettings(data: unknown): CompanionGrowthAdaptiveSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CompanionGrowthAdaptiveSettings;
}

function parseBlueprintSection(data: unknown): BlueprintSection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as BlueprintSection;
}

export function parseGrowthEvolutionEngineCard(data: unknown): GrowthEvolutionEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as GrowthEvolutionEngineCard;
}

export function parseGrowthEvolutionEngineDashboard(data: unknown): GrowthEvolutionEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    proactive_companion_note:
      typeof d.proactive_companion_note === "string" ? d.proactive_companion_note : undefined,
    trust_engine_note: typeof d.trust_engine_note === "string" ? d.trust_engine_note : undefined,
    growth_dimensions: parseRecordList<GrowthDimension>(d.growth_dimensions),
    learning_cycle_steps: parseRecordList<LearningCycleStep>(d.learning_cycle_steps),
    evolution_capabilities: parseRecordList<EvolutionCapability>(d.evolution_capabilities),
    settings: parseSettings(d.settings),
    recent_signals: parseRecordList<GrowthEvolutionSignal>(d.recent_signals),
    pending_recommendations: parseRecordList<GrowthEvolutionRecommendation>(d.pending_recommendations),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    integration_links:
      typeof d.integration_links === "object" && d.integration_links
        ? (d.integration_links as Record<string, unknown>)
        : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    implementation_blueprint:
      typeof d.implementation_blueprint === "object" && d.implementation_blueprint
        ? (d.implementation_blueprint as Record<string, unknown>)
        : undefined,
    blueprint_philosophy: typeof d.blueprint_philosophy === "string" ? d.blueprint_philosophy : undefined,
    blueprint_mission: typeof d.blueprint_mission === "string" ? d.blueprint_mission : undefined,
    blueprint_abos_principle:
      typeof d.blueprint_abos_principle === "string" ? d.blueprint_abos_principle : undefined,
    cgadbp_distinction_note:
      typeof d.cgadbp_distinction_note === "string" ? d.cgadbp_distinction_note : undefined,
    cgadbp_objectives: parseRecordList<BlueprintObjective>(d.cgadbp_objectives),
    cgadbp_feedback_collection: parseBlueprintSection(d.cgadbp_feedback_collection),
    cgadbp_companion_evolution_principles: parseBlueprintSection(d.cgadbp_companion_evolution_principles),
    cgadbp_organizational_learning: parseBlueprintSection(d.cgadbp_organizational_learning),
    cgadbp_individual_adaptation: parseBlueprintSection(d.cgadbp_individual_adaptation),
    cgadbp_self_love_connection: parseBlueprintSection(d.cgadbp_self_love_connection),
    cgadbp_innovation_balance: parseBlueprintSection(d.cgadbp_innovation_balance),
    cgadbp_trust_connection: parseBlueprintSection(d.cgadbp_trust_connection),
    cgadbp_dogfooding:
      typeof d.cgadbp_dogfooding === "object" && d.cgadbp_dogfooding
        ? (d.cgadbp_dogfooding as Record<string, unknown>)
        : undefined,
    cgadbp_vision_phrases: parseRecordList<string>(d.cgadbp_vision_phrases),
    cgadbp_integration_links: parseRecordList<BlueprintIntegrationLink>(d.cgadbp_integration_links),
    cgadbp_adaptive_summary:
      typeof d.cgadbp_adaptive_summary === "object" && d.cgadbp_adaptive_summary
        ? (d.cgadbp_adaptive_summary as Record<string, unknown>)
        : undefined,
    cgadbp_success_criteria: parseRecordList<BlueprintSuccessCriterion>(d.cgadbp_success_criteria),
    adaptive_settings: parseAdaptiveSettings(d.adaptive_settings),
    recent_feedback: parseRecordList<CompanionGrowthFeedbackEvent>(d.recent_feedback),
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    ...d,
  } as GrowthEvolutionEngineDashboard;
}

export function parseGrowthEvolutionRecommendations(data: unknown): GrowthEvolutionRecommendation[] {
  return parseRecordList<GrowthEvolutionRecommendation>(data) ?? [];
}

export function parseGrowthEvolutionExport(data: unknown): GrowthEvolutionExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    format: typeof d.format === "string" ? d.format : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    settings: parseSettings(d.settings),
    growth_dimensions: parseRecordList<GrowthDimension>(d.growth_dimensions),
    learning_cycle_steps: parseRecordList<LearningCycleStep>(d.learning_cycle_steps),
    evolution_capabilities: parseRecordList<EvolutionCapability>(d.evolution_capabilities),
    recent_signals: parseRecordList<GrowthEvolutionSignal>(d.recent_signals),
    recommendations: parseRecordList<GrowthEvolutionRecommendation>(d.recommendations),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as GrowthEvolutionExport;
}

export function parseGrowthEvolutionSettings(data: unknown): GrowthEvolutionSettings {
  const d = (data ?? {}) as Record<string, unknown>;
  return parseSettings(d) ?? (d as GrowthEvolutionSettings);
}
