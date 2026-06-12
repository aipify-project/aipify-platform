import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  CompanionGuidanceItem,
  DogfoodingBlueprint,
  EmergingTheme,
  FutureExplorationQuestion,
  FutureReadinessEngagementSummary,
  FutureTechnologiesActionResult,
  FutureTechnologiesBriefingResult,
  FutureTechnologiesCard,
  FutureTechnologiesDashboard,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LeadershipInsights,
  OrganizationalResilienceBlueprint,
  ScenarioPreparedness,
  SelfLoveConnection,
  TrustConnection,
} from "./types";

function parseBlueprintMeta(data: unknown): ImplementationBlueprintMeta | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImplementationBlueprintMeta;
}

function parseEngagementSummary(data: unknown): FutureReadinessEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as FutureReadinessEngagementSummary;
}

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

export function parseFutureTechnologiesCard(data: unknown): FutureTechnologiesCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    future_readiness_score: Number(d.future_readiness_score ?? 0),
    active_initiatives: Number(d.active_initiatives ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    implementation_blueprint_phase63: parseBlueprintMeta(d.implementation_blueprint_phase63),
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
    readiness_note: typeof d.readiness_note === "string" ? d.readiness_note : undefined,
  };
}

export function parseFutureTechnologiesDashboard(data: unknown): FutureTechnologiesDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    observatory_enabled: Boolean(d.observatory_enabled ?? true),
    scenario_planning_enabled: Boolean(d.scenario_planning_enabled ?? true),
    voice_readiness_tracking: Boolean(d.voice_readiness_tracking ?? true),
    multimodal_exploration: Boolean(d.multimodal_exploration ?? true),
    human_approval_required: Boolean(d.human_approval_required ?? true),
    interoperability_focus: Boolean(d.interoperability_focus ?? true),
    future_readiness_score: Number(d.future_readiness_score ?? 0),
    avg_technology_relevance: Number(d.avg_technology_relevance ?? 0),
    active_initiatives: Number(d.active_initiatives ?? 0),
    open_pilot_opportunities: Number(d.open_pilot_opportunities ?? 0),
    observation_areas: Array.isArray(d.observation_areas) ? (d.observation_areas as string[]) : [],
    emerging_interfaces: Array.isArray(d.emerging_interfaces)
      ? (d.emerging_interfaces as FutureTechnologiesDashboard["emerging_interfaces"])
      : [],
    technology_observations: Array.isArray(d.technology_observations)
      ? (d.technology_observations as FutureTechnologiesDashboard["technology_observations"])
      : [],
    trend_reports: Array.isArray(d.trend_reports) ? (d.trend_reports as FutureTechnologiesDashboard["trend_reports"]) : [],
    emerging_initiatives: Array.isArray(d.emerging_initiatives)
      ? (d.emerging_initiatives as FutureTechnologiesDashboard["emerging_initiatives"])
      : [],
    pilot_opportunities: Array.isArray(d.pilot_opportunities)
      ? (d.pilot_opportunities as FutureTechnologiesDashboard["pilot_opportunities"])
      : [],
    readiness_assessments: Array.isArray(d.readiness_assessments)
      ? (d.readiness_assessments as FutureTechnologiesDashboard["readiness_assessments"])
      : [],
    scenario_plans: Array.isArray(d.scenario_plans) ? (d.scenario_plans as FutureTechnologiesDashboard["scenario_plans"]) : [],
    recommendations: Array.isArray(d.recommendations)
      ? (d.recommendations as FutureTechnologiesDashboard["recommendations"])
      : [],
    responsible_adoption_principles: Array.isArray(d.responsible_adoption_principles)
      ? (d.responsible_adoption_principles as string[])
      : [],
    automation_evolution_principles: Array.isArray(d.automation_evolution_principles)
      ? (d.automation_evolution_principles as string[])
      : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as FutureTechnologiesDashboard["briefings"]) : [],
    integrations: typeof d.integrations === "object" && d.integrations
      ? (d.integrations as Record<string, string>)
      : undefined,
    implementation_blueprint_phase63: parseBlueprintMeta(d.implementation_blueprint_phase63),
    future_readiness_note: typeof d.future_readiness_note === "string" ? d.future_readiness_note : undefined,
    blueprint_distinction_note:
      typeof d.blueprint_distinction_note === "string" ? d.blueprint_distinction_note : undefined,
    blueprint_mission: typeof d.blueprint_mission === "string" ? d.blueprint_mission : undefined,
    blueprint_philosophy: typeof d.blueprint_philosophy === "string" ? d.blueprint_philosophy : undefined,
    blueprint_abos_principle: typeof d.blueprint_abos_principle === "string" ? d.blueprint_abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    blueprint_objectives: parseRecordList<BlueprintObjective>(d.blueprint_objectives),
    future_exploration: parseRecordList<FutureExplorationQuestion>(d.future_exploration),
    emerging_themes: parseRecordList<EmergingTheme>(d.emerging_themes),
    scenario_preparedness:
      typeof d.scenario_preparedness === "object" && d.scenario_preparedness
        ? (d.scenario_preparedness as ScenarioPreparedness)
        : undefined,
    organizational_resilience:
      typeof d.organizational_resilience === "object" && d.organizational_resilience
        ? (d.organizational_resilience as OrganizationalResilienceBlueprint)
        : undefined,
    companion_guidance: parseRecordList<CompanionGuidanceItem>(d.companion_guidance),
    self_love_connection:
      typeof d.self_love_connection === "object" && d.self_love_connection
        ? (d.self_love_connection as SelfLoveConnection)
        : undefined,
    leadership_insights:
      typeof d.leadership_insights === "object" && d.leadership_insights
        ? (d.leadership_insights as LeadershipInsights)
        : undefined,
    trust_connection:
      typeof d.trust_connection === "object" && d.trust_connection
        ? (d.trust_connection as TrustConnection)
        : undefined,
    dogfooding:
      typeof d.dogfooding === "object" && d.dogfooding ? (d.dogfooding as DogfoodingBlueprint) : undefined,
    blueprint_integration_links: parseRecordList<IntegrationLink>(d.blueprint_integration_links),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    success_criteria: parseRecordList<AbosSuccessCriterion>(d.success_criteria),
    vision_phrases: Array.isArray(d.vision_phrases) ? (d.vision_phrases as string[]) : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
  };
}

export function parseFutureTechnologiesActionResult(data: unknown): FutureTechnologiesActionResult {
  return (data ?? {}) as FutureTechnologiesActionResult;
}

export function parseFutureTechnologiesBriefingResult(data: unknown): FutureTechnologiesBriefingResult {
  return (data ?? {}) as FutureTechnologiesBriefingResult;
}
