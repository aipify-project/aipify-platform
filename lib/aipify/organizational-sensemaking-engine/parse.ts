import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  ExecutiveSensemakingReview,
  ImplementationBlueprintMeta,
  IntegrationLink,
  KnowledgeSynthesis,
  LimitationPrinciples,
  OrganizationalSensemakingBlueprint,
  OrganizationalSensemakingCard,
  OrganizationalSensemakingDashboard,
  OrganizationalSensemakingEngagementSummary,
  SensemakingSignal,
} from "./types";

function parseBlueprintMeta(data: unknown): ImplementationBlueprintMeta | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImplementationBlueprintMeta;
}

function parseObjectives(data: unknown): BlueprintObjective[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as BlueprintObjective[];
}

function parseSuccessCriteria(data: unknown): AbosSuccessCriterion[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as AbosSuccessCriterion[];
}

function parseIntegrationLinks(data: unknown): IntegrationLink[] {
  if (!Array.isArray(data)) return [];
  return data as IntegrationLink[];
}

function parseLimitationPrinciples(data: unknown): LimitationPrinciples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as LimitationPrinciples;
}

function parseEngagementSummary(
  data: unknown,
): OrganizationalSensemakingEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as OrganizationalSensemakingEngagementSummary;
}

function parseBlueprintBlock(data: unknown): OrganizationalSensemakingBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as OrganizationalSensemakingBlueprint;
}

function parseSignals(data: unknown): SensemakingSignal[] {
  if (!Array.isArray(data)) return [];
  return data as SensemakingSignal[];
}

function parseSyntheses(data: unknown): KnowledgeSynthesis[] {
  if (!Array.isArray(data)) return [];
  return data as KnowledgeSynthesis[];
}

function parseReviews(data: unknown): ExecutiveSensemakingReview[] {
  if (!Array.isArray(data)) return [];
  return data as ExecutiveSensemakingReview[];
}

export function parseOrganizationalSensemakingCard(data: unknown): OrganizationalSensemakingCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    sensemaking_score: Number(d.sensemaking_score ?? 0),
    enabled: Boolean(d.enabled),
    sensemaking_mode: typeof d.sensemaking_mode === "string" ? d.sensemaking_mode : undefined,
    signals_count: Number(d.signals_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    theme_detection_enabled: Boolean(d.theme_detection_enabled),
    synthesis_enabled: Boolean(d.synthesis_enabled),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    organizational_sensemaking_mission:
      typeof d.organizational_sensemaking_mission === "string"
        ? d.organizational_sensemaking_mission
        : undefined,
    organizational_sensemaking_abos_principle:
      typeof d.organizational_sensemaking_abos_principle === "string"
        ? d.organizational_sensemaking_abos_principle
        : undefined,
    organizational_sensemaking_engagement_summary: parseEngagementSummary(
      d.organizational_sensemaking_engagement_summary,
    ),
    organizational_sensemaking_note:
      typeof d.organizational_sensemaking_note === "string"
        ? d.organizational_sensemaking_note
        : undefined,
    organizational_sensemaking_vision_note:
      typeof d.organizational_sensemaking_vision_note === "string"
        ? d.organizational_sensemaking_vision_note
        : undefined,
  };
}

export function parseOrganizationalSensemakingDashboard(
  data: unknown,
): OrganizationalSensemakingDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    sensemaking_mode: typeof d.sensemaking_mode === "string" ? d.sensemaking_mode : undefined,
    theme_detection_enabled: Boolean(d.theme_detection_enabled),
    synthesis_enabled: Boolean(d.synthesis_enabled),
    reflection_enabled: Boolean(d.reflection_enabled),
    cross_department_visibility: Boolean(d.cross_department_visibility),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    sensemaking_score: Number(d.sensemaking_score ?? 0),
    signals_count: Number(d.signals_count ?? 0),
    active_signals_count: Number(d.active_signals_count ?? 0),
    syntheses_count: Number(d.syntheses_count ?? 0),
    reviews_count: Number(d.reviews_count ?? 0),
    signals: parseSignals(d.signals),
    syntheses: parseSyntheses(d.syntheses),
    reviews: parseReviews(d.reviews),
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    organizational_sensemaking_blueprint: parseBlueprintBlock(d.organizational_sensemaking_blueprint),
    organizational_sensemaking_mission:
      typeof d.organizational_sensemaking_mission === "string"
        ? d.organizational_sensemaking_mission
        : undefined,
    organizational_sensemaking_philosophy:
      typeof d.organizational_sensemaking_philosophy === "string"
        ? d.organizational_sensemaking_philosophy
        : undefined,
    organizational_sensemaking_abos_principle:
      typeof d.organizational_sensemaking_abos_principle === "string"
        ? d.organizational_sensemaking_abos_principle
        : undefined,
    organizational_sensemaking_objectives: parseObjectives(d.organizational_sensemaking_objectives),
    sensemaking_center_meta:
      typeof d.sensemaking_center_meta === "object" && d.sensemaking_center_meta
        ? (d.sensemaking_center_meta as Record<string, unknown>)
        : undefined,
    collective_intelligence_engine_meta:
      typeof d.collective_intelligence_engine_meta === "object" &&
      d.collective_intelligence_engine_meta
        ? (d.collective_intelligence_engine_meta as Record<string, unknown>)
        : undefined,
    organizational_signal_engine_meta:
      typeof d.organizational_signal_engine_meta === "object" &&
      d.organizational_signal_engine_meta
        ? (d.organizational_signal_engine_meta as Record<string, unknown>)
        : undefined,
    executive_sensemaking_reviews_meta:
      typeof d.executive_sensemaking_reviews_meta === "object" &&
      d.executive_sensemaking_reviews_meta
        ? (d.executive_sensemaking_reviews_meta as Record<string, unknown>)
        : undefined,
    sensemaking_companion_meta:
      typeof d.sensemaking_companion_meta === "object" && d.sensemaking_companion_meta
        ? (d.sensemaking_companion_meta as Record<string, unknown>)
        : undefined,
    diverse_perspective_framework_meta:
      typeof d.diverse_perspective_framework_meta === "object" &&
      d.diverse_perspective_framework_meta
        ? (d.diverse_perspective_framework_meta as Record<string, unknown>)
        : undefined,
    knowledge_synthesis_engine_meta:
      typeof d.knowledge_synthesis_engine_meta === "object" && d.knowledge_synthesis_engine_meta
        ? (d.knowledge_synthesis_engine_meta as Record<string, unknown>)
        : undefined,
    organizational_awareness_engine_meta:
      typeof d.organizational_awareness_engine_meta === "object" &&
      d.organizational_awareness_engine_meta
        ? (d.organizational_awareness_engine_meta as Record<string, unknown>)
        : undefined,
    companion_limitations_meta: parseLimitationPrinciples(d.companion_limitations_meta),
    self_love_connection_meta:
      typeof d.self_love_connection_meta === "object" && d.self_love_connection_meta
        ? (d.self_love_connection_meta as Record<string, unknown>)
        : undefined,
    security_requirements_meta:
      typeof d.security_requirements_meta === "object" && d.security_requirements_meta
        ? (d.security_requirements_meta as Record<string, unknown>)
        : undefined,
    ocsmebp158_integration_links: parseIntegrationLinks(d.ocsmebp158_integration_links),
    organizational_sensemaking_engagement_summary: parseEngagementSummary(
      d.organizational_sensemaking_engagement_summary,
    ),
    organizational_sensemaking_success_criteria: parseSuccessCriteria(
      d.organizational_sensemaking_success_criteria,
    ),
    organizational_sensemaking_vision:
      typeof d.organizational_sensemaking_vision === "string"
        ? d.organizational_sensemaking_vision
        : undefined,
    organizational_sensemaking_vision_phrases: Array.isArray(d.organizational_sensemaking_vision_phrases)
      ? (d.organizational_sensemaking_vision_phrases as string[])
      : undefined,
    organizational_sensemaking_privacy_note:
      typeof d.organizational_sensemaking_privacy_note === "string"
        ? d.organizational_sensemaking_privacy_note
        : undefined,
    organizational_sensemaking_dogfooding:
      typeof d.organizational_sensemaking_dogfooding === "string"
        ? d.organizational_sensemaking_dogfooding
        : undefined,
    organizational_sensemaking_engine_note:
      typeof d.organizational_sensemaking_engine_note === "string"
        ? d.organizational_sensemaking_engine_note
        : undefined,
    organizational_sensemaking_distinction_note:
      typeof d.organizational_sensemaking_distinction_note === "string"
        ? d.organizational_sensemaking_distinction_note
        : undefined,
  };
}
