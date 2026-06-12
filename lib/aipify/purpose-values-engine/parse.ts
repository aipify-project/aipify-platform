import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  CompanionGuidance,
  CulturalAlignmentEngagementSummary,
  CulturalObservations,
  DecisionAlignment,
  DecisionSupportExample,
  DogfoodingBlueprint,
  ExampleValue,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LeadershipConnection,
  LeadershipInsights,
  OnboardingConnection,
  OrganizationStatedValue,
  OrganizationalStorytelling,
  PrivacyPrinciples,
  PurposeDiscovery,
  PurposeFrameworkItem,
  OrganizationalPurposeAlignmentBlueprint,
  PurposeAlignmentEngagementSummary,
  PurposeValuesCulturalAlignmentBlueprint,
  PurposeValuesEngineCard,
  PurposeValuesEngineDashboard,
  PurposeValuesEngagementSummary,
  PurposeValuesExport,
  PurposeValuesSettings,
  RecognitionConnection,
  ReflectionQuestionSet,
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

function parseCulturalEngagementSummary(data: unknown): CulturalAlignmentEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CulturalAlignmentEngagementSummary;
}

function parseReflectionQuestionSet(data: unknown): ReflectionQuestionSet | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ReflectionQuestionSet;
}

function parseCulturalObservations(data: unknown): CulturalObservations | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CulturalObservations;
}

function parseOnboardingConnection(data: unknown): OnboardingConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as OnboardingConnection;
}

function parseCompanionGuidance(data: unknown): CompanionGuidance | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CompanionGuidance;
}

function parseRecognitionConnection(data: unknown): RecognitionConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as RecognitionConnection;
}

function parseLeadershipConnection(data: unknown): LeadershipConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as LeadershipConnection;
}

function parsePrivacyPrinciples(data: unknown): PrivacyPrinciples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as PrivacyPrinciples;
}

function parseCulturalAlignmentBlueprint(data: unknown): PurposeValuesCulturalAlignmentBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as PurposeValuesCulturalAlignmentBlueprint;
}

function parsePurposeAlignmentEngagementSummary(data: unknown): PurposeAlignmentEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as PurposeAlignmentEngagementSummary;
}

function parseOrganizationalPurposeAlignmentBlueprint(
  data: unknown
): OrganizationalPurposeAlignmentBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as OrganizationalPurposeAlignmentBlueprint;
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
    implementation_blueprint_phase95: parseBlueprintMeta(d.implementation_blueprint_phase95),
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
    values_note: typeof d.values_note === "string" ? d.values_note : undefined,
    cultural_alignment_mission:
      typeof d.cultural_alignment_mission === "string" ? d.cultural_alignment_mission : undefined,
    cultural_alignment_abos_principle:
      typeof d.cultural_alignment_abos_principle === "string" ? d.cultural_alignment_abos_principle : undefined,
    cultural_alignment_engagement_summary: parseCulturalEngagementSummary(
      d.cultural_alignment_engagement_summary
    ),
    cultural_alignment_note:
      typeof d.cultural_alignment_note === "string" ? d.cultural_alignment_note : undefined,
    cultural_alignment_vision_note:
      typeof d.cultural_alignment_vision_note === "string" ? d.cultural_alignment_vision_note : undefined,
    implementation_blueprint_phase138: parseBlueprintMeta(d.implementation_blueprint_phase138),
    purpose_alignment_mission:
      typeof d.purpose_alignment_mission === "string" ? d.purpose_alignment_mission : undefined,
    purpose_alignment_abos_principle:
      typeof d.purpose_alignment_abos_principle === "string" ? d.purpose_alignment_abos_principle : undefined,
    purpose_alignment_engagement_summary: parsePurposeAlignmentEngagementSummary(
      d.purpose_alignment_engagement_summary
    ),
    purpose_alignment_note: typeof d.purpose_alignment_note === "string" ? d.purpose_alignment_note : undefined,
    purpose_alignment_vision_note:
      typeof d.purpose_alignment_vision_note === "string" ? d.purpose_alignment_vision_note : undefined,
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
    implementation_blueprint_phase95: parseBlueprintMeta(d.implementation_blueprint_phase95),
    purpose_values_cultural_alignment_note:
      typeof d.purpose_values_cultural_alignment_note === "string"
        ? d.purpose_values_cultural_alignment_note
        : undefined,
    purpose_values_cultural_alignment_blueprint: parseCulturalAlignmentBlueprint(
      d.purpose_values_cultural_alignment_blueprint
    ),
    cultural_alignment_distinction_note:
      typeof d.cultural_alignment_distinction_note === "string"
        ? d.cultural_alignment_distinction_note
        : undefined,
    cultural_alignment_mission:
      typeof d.cultural_alignment_mission === "string" ? d.cultural_alignment_mission : undefined,
    cultural_alignment_philosophy:
      typeof d.cultural_alignment_philosophy === "string" ? d.cultural_alignment_philosophy : undefined,
    cultural_alignment_abos_principle:
      typeof d.cultural_alignment_abos_principle === "string" ? d.cultural_alignment_abos_principle : undefined,
    cultural_alignment_objectives: parseRecordList<BlueprintObjective>(d.cultural_alignment_objectives),
    cultural_alignment_purpose_questions: parseReflectionQuestionSet(
      d.cultural_alignment_purpose_questions
    ),
    cultural_alignment_values_reflection_questions: parseReflectionQuestionSet(
      d.cultural_alignment_values_reflection_questions
    ),
    cultural_alignment_cultural_observations: parseCulturalObservations(
      d.cultural_alignment_cultural_observations
    ),
    cultural_alignment_onboarding_connection: parseOnboardingConnection(
      d.cultural_alignment_onboarding_connection
    ),
    cultural_alignment_companion_guidance: parseCompanionGuidance(d.cultural_alignment_companion_guidance),
    cultural_alignment_recognition_connection: parseRecognitionConnection(
      d.cultural_alignment_recognition_connection
    ),
    cultural_alignment_self_love_connection:
      typeof d.cultural_alignment_self_love_connection === "object" &&
      d.cultural_alignment_self_love_connection
        ? (d.cultural_alignment_self_love_connection as SelfLoveConnection)
        : undefined,
    cultural_alignment_leadership_connection: parseLeadershipConnection(
      d.cultural_alignment_leadership_connection
    ),
    cultural_alignment_trust_connection:
      typeof d.cultural_alignment_trust_connection === "object" && d.cultural_alignment_trust_connection
        ? (d.cultural_alignment_trust_connection as TrustConnection)
        : undefined,
    cultural_alignment_privacy_principles: parsePrivacyPrinciples(d.cultural_alignment_privacy_principles),
    cultural_alignment_dogfooding:
      typeof d.cultural_alignment_dogfooding === "object" && d.cultural_alignment_dogfooding
        ? (d.cultural_alignment_dogfooding as DogfoodingBlueprint)
        : undefined,
    cultural_alignment_integration_links: parseRecordList<IntegrationLink>(
      d.cultural_alignment_integration_links
    ),
    cultural_alignment_engagement_summary: parseCulturalEngagementSummary(
      d.cultural_alignment_engagement_summary
    ),
    cultural_alignment_success_criteria: parseRecordList<AbosSuccessCriterion>(
      d.cultural_alignment_success_criteria
    ),
    cultural_alignment_vision:
      typeof d.cultural_alignment_vision === "string" ? d.cultural_alignment_vision : undefined,
    cultural_alignment_vision_phrases: Array.isArray(d.cultural_alignment_vision_phrases)
      ? (d.cultural_alignment_vision_phrases as string[])
      : undefined,
    cultural_alignment_privacy_note:
      typeof d.cultural_alignment_privacy_note === "string" ? d.cultural_alignment_privacy_note : undefined,
    implementation_blueprint_phase138: parseBlueprintMeta(d.implementation_blueprint_phase138),
    organizational_purpose_alignment_note:
      typeof d.organizational_purpose_alignment_note === "string"
        ? d.organizational_purpose_alignment_note
        : undefined,
    organizational_purpose_alignment_blueprint: parseOrganizationalPurposeAlignmentBlueprint(
      d.organizational_purpose_alignment_blueprint
    ),
    purpose_alignment_distinction_note:
      typeof d.purpose_alignment_distinction_note === "string" ? d.purpose_alignment_distinction_note : undefined,
    purpose_alignment_mission:
      typeof d.purpose_alignment_mission === "string" ? d.purpose_alignment_mission : undefined,
    purpose_alignment_philosophy:
      typeof d.purpose_alignment_philosophy === "string" ? d.purpose_alignment_philosophy : undefined,
    purpose_alignment_abos_principle:
      typeof d.purpose_alignment_abos_principle === "string" ? d.purpose_alignment_abos_principle : undefined,
    purpose_alignment_objectives: parseRecordList<BlueprintObjective>(d.purpose_alignment_objectives),
    purpose_alignment_center:
      typeof d.purpose_alignment_center === "object" && d.purpose_alignment_center
        ? (d.purpose_alignment_center as PurposeValuesEngineDashboard["purpose_alignment_center"])
        : undefined,
    purpose_alignment_values_framework:
      typeof d.purpose_alignment_values_framework === "object" && d.purpose_alignment_values_framework
        ? (d.purpose_alignment_values_framework as PurposeValuesEngineDashboard["purpose_alignment_values_framework"])
        : undefined,
    purpose_alignment_review_engine:
      typeof d.purpose_alignment_review_engine === "object" && d.purpose_alignment_review_engine
        ? (d.purpose_alignment_review_engine as PurposeValuesEngineDashboard["purpose_alignment_review_engine"])
        : undefined,
    purpose_alignment_companion:
      typeof d.purpose_alignment_companion === "object" && d.purpose_alignment_companion
        ? (d.purpose_alignment_companion as PurposeValuesEngineDashboard["purpose_alignment_companion"])
        : undefined,
    purpose_alignment_culture_health:
      typeof d.purpose_alignment_culture_health === "object" && d.purpose_alignment_culture_health
        ? (d.purpose_alignment_culture_health as PurposeValuesEngineDashboard["purpose_alignment_culture_health"])
        : undefined,
    purpose_alignment_integration_framework:
      typeof d.purpose_alignment_integration_framework === "object" && d.purpose_alignment_integration_framework
        ? (d.purpose_alignment_integration_framework as PurposeValuesEngineDashboard["purpose_alignment_integration_framework"])
        : undefined,
    purpose_alignment_values_memory_engine:
      typeof d.purpose_alignment_values_memory_engine === "object" && d.purpose_alignment_values_memory_engine
        ? (d.purpose_alignment_values_memory_engine as PurposeValuesEngineDashboard["purpose_alignment_values_memory_engine"])
        : undefined,
    purpose_alignment_companion_limitations:
      typeof d.purpose_alignment_companion_limitations === "object" && d.purpose_alignment_companion_limitations
        ? (d.purpose_alignment_companion_limitations as PurposeValuesEngineDashboard["purpose_alignment_companion_limitations"])
        : undefined,
    purpose_alignment_self_love_connection:
      typeof d.purpose_alignment_self_love_connection === "object" && d.purpose_alignment_self_love_connection
        ? (d.purpose_alignment_self_love_connection as SelfLoveConnection)
        : undefined,
    purpose_alignment_executive_reviews:
      typeof d.purpose_alignment_executive_reviews === "object" && d.purpose_alignment_executive_reviews
        ? (d.purpose_alignment_executive_reviews as PurposeValuesEngineDashboard["purpose_alignment_executive_reviews"])
        : undefined,
    purpose_alignment_security_requirements:
      typeof d.purpose_alignment_security_requirements === "object" && d.purpose_alignment_security_requirements
        ? (d.purpose_alignment_security_requirements as PurposeValuesEngineDashboard["purpose_alignment_security_requirements"])
        : undefined,
    purpose_alignment_dogfooding:
      typeof d.purpose_alignment_dogfooding === "object" && d.purpose_alignment_dogfooding
        ? (d.purpose_alignment_dogfooding as DogfoodingBlueprint)
        : undefined,
    purpose_alignment_integration_links: parseRecordList<IntegrationLink>(d.purpose_alignment_integration_links),
    purpose_alignment_era_cross_links: parseRecordList<{ phase?: string; label?: string; route?: string; status?: string }>(
      d.purpose_alignment_era_cross_links
    ),
    purpose_alignment_engagement_summary: parsePurposeAlignmentEngagementSummary(
      d.purpose_alignment_engagement_summary
    ),
    purpose_alignment_success_criteria: parseRecordList<AbosSuccessCriterion>(
      d.purpose_alignment_success_criteria
    ),
    purpose_alignment_vision:
      typeof d.purpose_alignment_vision === "string" ? d.purpose_alignment_vision : undefined,
    purpose_alignment_vision_phrases: Array.isArray(d.purpose_alignment_vision_phrases)
      ? (d.purpose_alignment_vision_phrases as string[])
      : undefined,
    purpose_alignment_privacy_note:
      typeof d.purpose_alignment_privacy_note === "string" ? d.purpose_alignment_privacy_note : undefined,
    alignment_reviews: parseRecordList(d.alignment_reviews),
    values_memory_entries: parseRecordList(d.values_memory_entries),
    culture_health_snapshots: parseRecordList(d.culture_health_snapshots),
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
