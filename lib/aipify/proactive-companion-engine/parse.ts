import type {
  AbosSuccessCriterion,
  BlueprintBoundaries,
  CompanionExample,
  DogfoodingBlueprint,
  IntegrationLink,
  ProactiveCompanionAssistanceCategory,
  ProactiveCompanionEngineCard,
  ProactiveCompanionEngineDashboard,
  ProactiveCompanionExport,
  ProactiveCompanionNudge,
  ProactiveCompanionSettings,
  ProactiveCompanionStyleExample,
  ProactiveCompanionUserPreferences,
  ProactiveEngagementSummary,
  ProactiveExamplesBlueprint,
  ProactiveObjective,
  SelfLoveConnection,
  TrustConnection,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSettings(data: unknown): ProactiveCompanionSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ProactiveCompanionSettings;
}

function parseUserPreferences(data: unknown): ProactiveCompanionUserPreferences | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ProactiveCompanionUserPreferences;
}

function parseStringArray(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item): item is string => typeof item === "string");
}

function parseProactiveObjectives(data: unknown): ProactiveObjective[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as ProactiveObjective[];
}

function parseProactiveExamples(data: unknown): ProactiveExamplesBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ProactiveExamplesBlueprint;
}

function parseCompanionExamples(data: unknown): CompanionExample[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as CompanionExample[];
}

function parseBlueprintBoundaries(data: unknown): BlueprintBoundaries | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as BlueprintBoundaries;
}

function parseSelfLoveConnection(data: unknown): SelfLoveConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SelfLoveConnection;
}

function parseTrustConnection(data: unknown): TrustConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as TrustConnection;
}

function parseDogfooding(data: unknown): DogfoodingBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as DogfoodingBlueprint;
}

function parseEngagementSummary(data: unknown): ProactiveEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ProactiveEngagementSummary;
}

function parseSuccessCriteria(data: unknown): AbosSuccessCriterion[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as AbosSuccessCriterion[];
}

function parseIntegrationLinks(data: unknown): IntegrationLink[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as IntegrationLink[];
}

export function parseProactiveCompanionEngineCard(data: unknown): ProactiveCompanionEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    pending_nudges: typeof d.pending_nudges === "number" ? d.pending_nudges : undefined,
    enabled: typeof d.enabled === "boolean" ? d.enabled : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
    implementation_blueprint:
      typeof d.implementation_blueprint === "object" && d.implementation_blueprint
        ? (d.implementation_blueprint as ProactiveCompanionEngineCard["implementation_blueprint"])
        : undefined,
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    ...d,
  } as ProactiveCompanionEngineCard;
}

export function parseProactiveCompanionEngineDashboard(
  data: unknown
): ProactiveCompanionEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    assistance_categories: parseRecordList<ProactiveCompanionAssistanceCategory>(d.assistance_categories),
    companion_style_examples: parseRecordList<ProactiveCompanionStyleExample>(d.companion_style_examples),
    boundaries: parseStringArray(d.boundaries),
    settings: parseSettings(d.settings),
    user_preferences: parseUserPreferences(d.user_preferences),
    preference_summary:
      typeof d.preference_summary === "object" && d.preference_summary
        ? (d.preference_summary as Record<string, unknown>)
        : undefined,
    active_nudges: parseRecordList<ProactiveCompanionNudge>(d.active_nudges),
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
        ? (d.implementation_blueprint as ProactiveCompanionEngineDashboard["implementation_blueprint"])
        : undefined,
    proactive_assistance_note:
      typeof d.proactive_assistance_note === "string" ? d.proactive_assistance_note : undefined,
    blueprint_philosophy: typeof d.blueprint_philosophy === "string" ? d.blueprint_philosophy : undefined,
    blueprint_mission: typeof d.blueprint_mission === "string" ? d.blueprint_mission : undefined,
    blueprint_abos_principle:
      typeof d.blueprint_abos_principle === "string" ? d.blueprint_abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    blueprint_distinction_note:
      typeof d.blueprint_distinction_note === "string" ? d.blueprint_distinction_note : undefined,
    proactive_objectives: parseProactiveObjectives(d.proactive_objectives),
    proactive_examples: parseProactiveExamples(d.proactive_examples),
    companion_examples: parseCompanionExamples(d.companion_examples),
    blueprint_boundaries: parseBlueprintBoundaries(d.blueprint_boundaries),
    self_love_connection: parseSelfLoveConnection(d.self_love_connection),
    trust_connection: parseTrustConnection(d.trust_connection),
    dogfooding: parseDogfooding(d.dogfooding),
    blueprint_integration_links: parseIntegrationLinks(d.blueprint_integration_links),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    success_criteria: parseSuccessCriteria(d.success_criteria),
    vision_phrases: parseStringArray(d.vision_phrases),
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    ...d,
  } as ProactiveCompanionEngineDashboard;
}

export function parseProactiveCompanionNudges(data: unknown): ProactiveCompanionNudge[] {
  return parseRecordList<ProactiveCompanionNudge>(data) ?? [];
}

export function parseProactiveCompanionExport(data: unknown): ProactiveCompanionExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    format: typeof d.format === "string" ? d.format : undefined,
    settings: parseSettings(d.settings),
    preference_summary:
      typeof d.preference_summary === "object" && d.preference_summary
        ? (d.preference_summary as Record<string, unknown>)
        : undefined,
    assistance_categories: parseRecordList<ProactiveCompanionAssistanceCategory>(d.assistance_categories),
    boundaries: parseStringArray(d.boundaries),
    active_nudges: parseRecordList<ProactiveCompanionNudge>(d.active_nudges),
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as ProactiveCompanionExport;
}

export function parseProactiveCompanionUserPreferences(
  data: unknown
): ProactiveCompanionUserPreferences {
  const d = (data ?? {}) as Record<string, unknown>;
  return parseUserPreferences(d) ?? (d as ProactiveCompanionUserPreferences);
}
