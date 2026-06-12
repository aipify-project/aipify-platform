import type {
  BlueprintObjective,
  BlueprintSuccessCriterion,
  CompanionGuidance,
  CuriosityDiscoveryEngineCard,
  CuriosityDiscoveryEngineDashboard,
  CuriosityDiscoveryEngineExport,
  CuriosityDiscoveryEngineSettings,
  DiscoveryCategoryInfo,
  DiscoveryPrompt,
  DiscoveryQuestionExample,
  DiscoverySignal,
  DogfoodingBlueprint,
  ImplementationBlueprintMeta,
  InnovationConnection,
  IntegrationLink,
  LeadershipInsights,
  LimitationPrinciples,
  OpportunityEvaluation,
  OpportunityExplorationEngagementSummary,
  OpportunityQuestions,
  OpportunitySources,
  SelfLoveConnection,
  TrustConnection,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSettings(data: unknown): CuriosityDiscoveryEngineSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CuriosityDiscoveryEngineSettings;
}

function parseBlueprintMeta(data: unknown): ImplementationBlueprintMeta | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImplementationBlueprintMeta;
}

function parseEngagementSummary(data: unknown): OpportunityExplorationEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as OpportunityExplorationEngagementSummary;
}

function parseObjectSection<T>(data: unknown): T | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as T;
}

function parseStringList(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item) => typeof item === "string") as string[];
}

export function parseCuriosityDiscoveryEngineCard(data: unknown): CuriosityDiscoveryEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    prompt_count: typeof d.prompt_count === "number" ? d.prompt_count : undefined,
    pending_prompts: typeof d.pending_prompts === "number" ? d.pending_prompts : undefined,
    signal_count: typeof d.signal_count === "number" ? d.signal_count : undefined,
    enabled: typeof d.enabled === "boolean" ? d.enabled : undefined,
    implementation_blueprint_phase80: parseBlueprintMeta(d.implementation_blueprint_phase80),
    blueprint_mission: typeof d.blueprint_mission === "string" ? d.blueprint_mission : undefined,
    blueprint_abos_principle:
      typeof d.blueprint_abos_principle === "string" ? d.blueprint_abos_principle : undefined,
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
    exploration_note: typeof d.exploration_note === "string" ? d.exploration_note : undefined,
    ...d,
  } as CuriosityDiscoveryEngineCard;
}

export function parseCuriosityDiscoveryEngineDashboard(data: unknown): CuriosityDiscoveryEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    discovery_categories: parseRecordList<DiscoveryCategoryInfo>(d.discovery_categories),
    question_examples: parseRecordList<DiscoveryQuestionExample>(d.question_examples),
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    trust_note: typeof d.trust_note === "string" ? d.trust_note : undefined,
    settings: parseSettings(d.settings),
    recent_prompts: parseRecordList<DiscoveryPrompt>(d.recent_prompts),
    recent_signals: parseRecordList<DiscoverySignal>(d.recent_signals),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    integration_links:
      typeof d.integration_links === "object" && d.integration_links
        ? (d.integration_links as Record<string, unknown>)
        : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    implementation_blueprint_phase80: parseBlueprintMeta(d.implementation_blueprint_phase80),
    opportunity_exploration_note:
      typeof d.opportunity_exploration_note === "string" ? d.opportunity_exploration_note : undefined,
    blueprint_distinction_note:
      typeof d.blueprint_distinction_note === "string" ? d.blueprint_distinction_note : undefined,
    blueprint_mission: typeof d.blueprint_mission === "string" ? d.blueprint_mission : undefined,
    blueprint_philosophy: typeof d.blueprint_philosophy === "string" ? d.blueprint_philosophy : undefined,
    blueprint_abos_principle:
      typeof d.blueprint_abos_principle === "string" ? d.blueprint_abos_principle : undefined,
    blueprint_objectives: parseRecordList<BlueprintObjective>(d.blueprint_objectives),
    opportunity_sources: parseObjectSection<OpportunitySources>(d.opportunity_sources),
    opportunity_questions: parseObjectSection<OpportunityQuestions>(d.opportunity_questions),
    opportunity_evaluation: parseObjectSection<OpportunityEvaluation>(d.opportunity_evaluation),
    companion_guidance: parseObjectSection<CompanionGuidance>(d.companion_guidance),
    innovation_connection: parseObjectSection<InnovationConnection>(d.innovation_connection),
    blueprint_self_love_connection: parseObjectSection<SelfLoveConnection>(d.blueprint_self_love_connection),
    leadership_insights: parseObjectSection<LeadershipInsights>(d.leadership_insights),
    blueprint_trust_connection: parseObjectSection<TrustConnection>(d.blueprint_trust_connection),
    limitation_principles: parseObjectSection<LimitationPrinciples>(d.limitation_principles),
    blueprint_dogfooding: parseObjectSection<DogfoodingBlueprint>(d.blueprint_dogfooding),
    blueprint_integration_links: parseRecordList<IntegrationLink>(d.blueprint_integration_links),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_success_criteria: parseRecordList<BlueprintSuccessCriterion>(d.blueprint_success_criteria),
    blueprint_vision_phrases: parseStringList(d.blueprint_vision_phrases),
    blueprint_privacy_note:
      typeof d.blueprint_privacy_note === "string" ? d.blueprint_privacy_note : undefined,
    ...d,
  } as CuriosityDiscoveryEngineDashboard;
}

export function parseCuriosityDiscoveryEngineExport(data: unknown): CuriosityDiscoveryEngineExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    format: typeof d.format === "string" ? d.format : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    discovery_categories: parseRecordList<DiscoveryCategoryInfo>(d.discovery_categories),
    question_examples: parseRecordList<DiscoveryQuestionExample>(d.question_examples),
    trust_note: typeof d.trust_note === "string" ? d.trust_note : undefined,
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    settings: parseSettings(d.settings),
    recent_prompts: parseRecordList<DiscoveryPrompt>(d.recent_prompts),
    recent_signals: parseRecordList<DiscoverySignal>(d.recent_signals),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as CuriosityDiscoveryEngineExport;
}
