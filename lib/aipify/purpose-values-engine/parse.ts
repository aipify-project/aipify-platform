import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  DecisionAlignment,
  DecisionSupportExample,
  DogfoodingBlueprint,
  ExampleValue,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LeadershipInsights,
  OrganizationStatedValue,
  OrganizationalStorytelling,
  PurposeDiscovery,
  PurposeFrameworkItem,
  PurposeValuesEngineCard,
  PurposeValuesEngineDashboard,
  PurposeValuesEngagementSummary,
  PurposeValuesExport,
  PurposeValuesSettings,
  SelfLoveConnection,
  TrustConnection,
  ValueInAction,
  ValuesAlignmentSignal,
  ValuesAssistanceExample,
  ValuesExploration,
  ValuesReflection,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSettings(data: unknown): PurposeValuesSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as PurposeValuesSettings;
}

function parseBlueprintMeta(data: unknown): ImplementationBlueprintMeta | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImplementationBlueprintMeta;
}

function parseEngagementSummary(data: unknown): PurposeValuesEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as PurposeValuesEngagementSummary;
}

export function parsePurposeValuesEngineCard(data: unknown): PurposeValuesEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    active_values: typeof d.active_values === "number" ? d.active_values : undefined,
    pending_reflections: typeof d.pending_reflections === "number" ? d.pending_reflections : undefined,
    enabled: typeof d.enabled === "boolean" ? d.enabled : undefined,
    implementation_blueprint_phase64: parseBlueprintMeta(d.implementation_blueprint_phase64),
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
    values_note: typeof d.values_note === "string" ? d.values_note : undefined,
    ...d,
  } as PurposeValuesEngineCard;
}

export function parsePurposeValuesEngineDashboard(data: unknown): PurposeValuesEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    purpose_framework: parseRecordList<PurposeFrameworkItem>(d.purpose_framework),
    example_values: parseRecordList<ExampleValue>(d.example_values),
    values_aware_assistance_examples: parseRecordList<ValuesAssistanceExample>(
      d.values_aware_assistance_examples
    ),
    decision_support_examples: parseRecordList<DecisionSupportExample>(d.decision_support_examples),
    culture_support_areas: Array.isArray(d.culture_support_areas)
      ? (d.culture_support_areas as string[])
      : undefined,
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    trust_engine_note: typeof d.trust_engine_note === "string" ? d.trust_engine_note : undefined,
    growth_evolution_note:
      typeof d.growth_evolution_note === "string" ? d.growth_evolution_note : undefined,
    settings: parseSettings(d.settings),
    stated_values: parseRecordList<OrganizationStatedValue>(d.stated_values),
    recent_signals: parseRecordList<ValuesAlignmentSignal>(d.recent_signals),
    pending_reflections: parseRecordList<ValuesReflection>(d.pending_reflections),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    integration_links:
      typeof d.integration_links === "object" && d.integration_links
        ? (d.integration_links as Record<string, unknown>)
        : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    implementation_blueprint_phase64: parseBlueprintMeta(d.implementation_blueprint_phase64),
    purpose_values_note: typeof d.purpose_values_note === "string" ? d.purpose_values_note : undefined,
    blueprint_distinction_note:
      typeof d.blueprint_distinction_note === "string" ? d.blueprint_distinction_note : undefined,
    blueprint_mission: typeof d.blueprint_mission === "string" ? d.blueprint_mission : undefined,
    blueprint_philosophy: typeof d.blueprint_philosophy === "string" ? d.blueprint_philosophy : undefined,
    blueprint_abos_principle:
      typeof d.blueprint_abos_principle === "string" ? d.blueprint_abos_principle : undefined,
    blueprint_objectives: parseRecordList<BlueprintObjective>(d.blueprint_objectives),
    purpose_discovery:
      typeof d.purpose_discovery === "object" && d.purpose_discovery
        ? (d.purpose_discovery as PurposeDiscovery)
        : undefined,
    values_exploration:
      typeof d.values_exploration === "object" && d.values_exploration
        ? (d.values_exploration as ValuesExploration)
        : undefined,
    values_in_action: parseRecordList<ValueInAction>(d.values_in_action),
    decision_alignment:
      typeof d.decision_alignment === "object" && d.decision_alignment
        ? (d.decision_alignment as DecisionAlignment)
        : undefined,
    organizational_storytelling:
      typeof d.organizational_storytelling === "object" && d.organizational_storytelling
        ? (d.organizational_storytelling as OrganizationalStorytelling)
        : undefined,
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
    ...d,
  } as PurposeValuesEngineDashboard;
}

export function parseOrganizationStatedValues(data: unknown): OrganizationStatedValue[] {
  return parseRecordList<OrganizationStatedValue>(data) ?? [];
}

export function parsePurposeValuesExport(data: unknown): PurposeValuesExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    format: typeof d.format === "string" ? d.format : undefined,
    settings: parseSettings(d.settings),
    purpose_framework: parseRecordList<PurposeFrameworkItem>(d.purpose_framework),
    stated_values: parseRecordList<OrganizationStatedValue>(d.stated_values),
    recent_signals: parseRecordList<ValuesAlignmentSignal>(d.recent_signals),
    pending_reflections: parseRecordList<ValuesReflection>(d.pending_reflections),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as PurposeValuesExport;
}
