import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  CivicCollaborationBlueprint,
  CivicCollaborationCard,
  CivicCollaborationDashboard,
  CivicCollaborationEngagementSummary,
  CommunityPartnership,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
  PublicValueInitiative,
  TrustReflection,
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

function parseEngagementSummary(data: unknown): CivicCollaborationEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CivicCollaborationEngagementSummary;
}

function parseBlueprintBlock(data: unknown): CivicCollaborationBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CivicCollaborationBlueprint;
}

function parsePartnerships(data: unknown): CommunityPartnership[] {
  if (!Array.isArray(data)) return [];
  return data as CommunityPartnership[];
}

function parseInitiatives(data: unknown): PublicValueInitiative[] {
  if (!Array.isArray(data)) return [];
  return data as PublicValueInitiative[];
}

function parseTrustReflections(data: unknown): TrustReflection[] {
  if (!Array.isArray(data)) return [];
  return data as TrustReflection[];
}

export function parseCivicCollaborationCard(data: unknown): CivicCollaborationCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    public_value_score: Number(d.public_value_score ?? 0),
    enabled: Boolean(d.enabled),
    collaboration_mode: typeof d.collaboration_mode === "string" ? d.collaboration_mode : undefined,
    initiatives_count: Number(d.initiatives_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    partnership_programs_enabled: Boolean(d.partnership_programs_enabled),
    trust_reflection_enabled: Boolean(d.trust_reflection_enabled),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    civic_collaboration_mission:
      typeof d.civic_collaboration_mission === "string" ? d.civic_collaboration_mission : undefined,
    civic_collaboration_abos_principle:
      typeof d.civic_collaboration_abos_principle === "string"
        ? d.civic_collaboration_abos_principle
        : undefined,
    civic_collaboration_engagement_summary: parseEngagementSummary(
      d.civic_collaboration_engagement_summary,
    ),
    civic_collaboration_note:
      typeof d.civic_collaboration_note === "string" ? d.civic_collaboration_note : undefined,
    civic_collaboration_vision_note:
      typeof d.civic_collaboration_vision_note === "string"
        ? d.civic_collaboration_vision_note
        : undefined,
  };
}

export function parseCivicCollaborationDashboard(data: unknown): CivicCollaborationDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    collaboration_mode: typeof d.collaboration_mode === "string" ? d.collaboration_mode : undefined,
    partnership_programs_enabled: Boolean(d.partnership_programs_enabled),
    public_value_initiatives_enabled: Boolean(d.public_value_initiatives_enabled),
    trust_reflection_enabled: Boolean(d.trust_reflection_enabled),
    education_mentorship_enabled: Boolean(d.education_mentorship_enabled),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    public_value_score: Number(d.public_value_score ?? 0),
    partnerships_count: Number(d.partnerships_count ?? 0),
    active_partnerships_count: Number(d.active_partnerships_count ?? 0),
    initiatives_count: Number(d.initiatives_count ?? 0),
    active_initiatives_count: Number(d.active_initiatives_count ?? 0),
    trust_reflections_count: Number(d.trust_reflections_count ?? 0),
    partnerships: parsePartnerships(d.partnerships),
    initiatives: parseInitiatives(d.initiatives),
    trust_reflections: parseTrustReflections(d.trust_reflections),
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    civic_collaboration_blueprint: parseBlueprintBlock(d.civic_collaboration_blueprint),
    civic_collaboration_mission:
      typeof d.civic_collaboration_mission === "string" ? d.civic_collaboration_mission : undefined,
    civic_collaboration_philosophy:
      typeof d.civic_collaboration_philosophy === "string"
        ? d.civic_collaboration_philosophy
        : undefined,
    civic_collaboration_abos_principle:
      typeof d.civic_collaboration_abos_principle === "string"
        ? d.civic_collaboration_abos_principle
        : undefined,
    civic_collaboration_objectives: parseObjectives(d.civic_collaboration_objectives),
    public_value_center_meta:
      typeof d.public_value_center_meta === "object" && d.public_value_center_meta
        ? (d.public_value_center_meta as Record<string, unknown>)
        : undefined,
    civic_collaboration_engine_meta:
      typeof d.civic_collaboration_engine_meta === "object" && d.civic_collaboration_engine_meta
        ? (d.civic_collaboration_engine_meta as Record<string, unknown>)
        : undefined,
    community_partnership_framework_meta:
      typeof d.community_partnership_framework_meta === "object" &&
      d.community_partnership_framework_meta
        ? (d.community_partnership_framework_meta as Record<string, unknown>)
        : undefined,
    public_trust_engine_meta:
      typeof d.public_trust_engine_meta === "object" && d.public_trust_engine_meta
        ? (d.public_trust_engine_meta as Record<string, unknown>)
        : undefined,
    civic_companion_meta:
      typeof d.civic_companion_meta === "object" && d.civic_companion_meta
        ? (d.civic_companion_meta as Record<string, unknown>)
        : undefined,
    education_mentorship_engine_meta:
      typeof d.education_mentorship_engine_meta === "object" && d.education_mentorship_engine_meta
        ? (d.education_mentorship_engine_meta as Record<string, unknown>)
        : undefined,
    collective_resilience_framework_meta:
      typeof d.collective_resilience_framework_meta === "object" &&
      d.collective_resilience_framework_meta
        ? (d.collective_resilience_framework_meta as Record<string, unknown>)
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
    ccvebp161_integration_links: parseIntegrationLinks(d.ccvebp161_integration_links),
    civic_collaboration_engagement_summary: parseEngagementSummary(
      d.civic_collaboration_engagement_summary,
    ),
    civic_collaboration_success_criteria: parseSuccessCriteria(
      d.civic_collaboration_success_criteria,
    ),
    civic_collaboration_vision:
      typeof d.civic_collaboration_vision === "string" ? d.civic_collaboration_vision : undefined,
    civic_collaboration_vision_phrases: Array.isArray(d.civic_collaboration_vision_phrases)
      ? (d.civic_collaboration_vision_phrases as string[])
      : undefined,
    civic_collaboration_privacy_note:
      typeof d.civic_collaboration_privacy_note === "string"
        ? d.civic_collaboration_privacy_note
        : undefined,
    civic_collaboration_dogfooding:
      typeof d.civic_collaboration_dogfooding === "string"
        ? d.civic_collaboration_dogfooding
        : undefined,
    civic_collaboration_engine_note:
      typeof d.civic_collaboration_engine_note === "string"
        ? d.civic_collaboration_engine_note
        : undefined,
    civic_collaboration_distinction_note:
      typeof d.civic_collaboration_distinction_note === "string"
        ? d.civic_collaboration_distinction_note
        : undefined,
  };
}
