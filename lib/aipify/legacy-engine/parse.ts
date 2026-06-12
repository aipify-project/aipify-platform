import type {
  BlueprintGuidanceBlock,
  BlueprintObjective,
  BlueprintSuccessCriterion,
  DogfoodingBlueprint,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LegacyDimensionInfo,
  LegacyEngineCard,
  LegacyEngineDashboard,
  LegacyEngineExport,
  LegacyEngineSettings,
  LegacyMilestone,
  LegacyMilestoneExample,
  LegacyStory,
  LegacyStorytellingExample,
  SelfLoveConnection,
  StewardshipEngagementSummary,
  TrustConnection,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSettings(data: unknown): LegacyEngineSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as LegacyEngineSettings;
}

function parseBlueprintMeta(data: unknown): ImplementationBlueprintMeta | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImplementationBlueprintMeta;
}

function parseEngagementSummary(data: unknown): StewardshipEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as StewardshipEngagementSummary;
}

function parseObjectSection<T>(data: unknown): T | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as T;
}

function parseStringList(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item) => typeof item === "string") as string[];
}

export function parseLegacyEngineCard(data: unknown): LegacyEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    story_count: typeof d.story_count === "number" ? d.story_count : undefined,
    milestone_count: typeof d.milestone_count === "number" ? d.milestone_count : undefined,
    uncelebrated_milestones:
      typeof d.uncelebrated_milestones === "number" ? d.uncelebrated_milestones : undefined,
    enabled: typeof d.enabled === "boolean" ? d.enabled : undefined,
    implementation_blueprint_phase83: parseBlueprintMeta(d.implementation_blueprint_phase83),
    blueprint_mission: typeof d.blueprint_mission === "string" ? d.blueprint_mission : undefined,
    blueprint_abos_principle:
      typeof d.blueprint_abos_principle === "string" ? d.blueprint_abos_principle : undefined,
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
    stewardship_note: typeof d.stewardship_note === "string" ? d.stewardship_note : undefined,
    ...d,
  } as LegacyEngineCard;
}

export function parseLegacyEngineDashboard(data: unknown): LegacyEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    legacy_dimensions: parseRecordList<LegacyDimensionInfo>(d.legacy_dimensions),
    storytelling_examples: parseRecordList<LegacyStorytellingExample>(d.storytelling_examples),
    milestone_examples: parseRecordList<LegacyMilestoneExample>(d.milestone_examples),
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    trust_note: typeof d.trust_note === "string" ? d.trust_note : undefined,
    settings: parseSettings(d.settings),
    recent_stories: parseRecordList<LegacyStory>(d.recent_stories),
    recent_milestones: parseRecordList<LegacyMilestone>(d.recent_milestones),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    integration_links:
      typeof d.integration_links === "object" && d.integration_links
        ? (d.integration_links as Record<string, unknown>)
        : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    implementation_blueprint_phase83: parseBlueprintMeta(d.implementation_blueprint_phase83),
    long_term_stewardship_note:
      typeof d.long_term_stewardship_note === "string" ? d.long_term_stewardship_note : undefined,
    blueprint_distinction_note:
      typeof d.blueprint_distinction_note === "string" ? d.blueprint_distinction_note : undefined,
    blueprint_mission: typeof d.blueprint_mission === "string" ? d.blueprint_mission : undefined,
    blueprint_philosophy: typeof d.blueprint_philosophy === "string" ? d.blueprint_philosophy : undefined,
    blueprint_abos_principle:
      typeof d.blueprint_abos_principle === "string" ? d.blueprint_abos_principle : undefined,
    blueprint_objectives: parseRecordList<BlueprintObjective>(d.blueprint_objectives),
    stewardship_questions: parseObjectSection<BlueprintGuidanceBlock>(d.stewardship_questions),
    sustainable_growth: parseObjectSection<BlueprintGuidanceBlock>(d.sustainable_growth),
    legacy_awareness: parseObjectSection<BlueprintGuidanceBlock>(d.legacy_awareness),
    companion_guidance: parseObjectSection<BlueprintGuidanceBlock>(d.companion_guidance),
    blueprint_self_love_connection: parseObjectSection<SelfLoveConnection>(d.blueprint_self_love_connection),
    leadership_insights: parseObjectSection<BlueprintGuidanceBlock>(d.leadership_insights),
    blueprint_trust_connection: parseObjectSection<TrustConnection>(d.blueprint_trust_connection),
    blueprint_dogfooding: parseObjectSection<DogfoodingBlueprint>(d.blueprint_dogfooding),
    blueprint_integration_links: parseRecordList<IntegrationLink>(d.blueprint_integration_links),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_success_criteria: parseRecordList<BlueprintSuccessCriterion>(d.blueprint_success_criteria),
    blueprint_vision_phrases: parseStringList(d.blueprint_vision_phrases),
    blueprint_privacy_note:
      typeof d.blueprint_privacy_note === "string" ? d.blueprint_privacy_note : undefined,
    ...d,
  } as LegacyEngineDashboard;
}

export function parseLegacyEngineExport(data: unknown): LegacyEngineExport {
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
    legacy_dimensions: parseRecordList<LegacyDimensionInfo>(d.legacy_dimensions),
    storytelling_examples: parseRecordList<LegacyStorytellingExample>(d.storytelling_examples),
    milestone_examples: parseRecordList<LegacyMilestoneExample>(d.milestone_examples),
    trust_note: typeof d.trust_note === "string" ? d.trust_note : undefined,
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    settings: parseSettings(d.settings),
    recent_stories: parseRecordList<LegacyStory>(d.recent_stories),
    recent_milestones: parseRecordList<LegacyMilestone>(d.recent_milestones),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as LegacyEngineExport;
}
