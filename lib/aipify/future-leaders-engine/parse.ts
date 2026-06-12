import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  FutureLeadersBlueprint,
  FutureLeadersCard,
  FutureLeadersDashboard,
  FutureLeadersEngagementSummary,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LeadershipMemoryEntry,
  LeadershipPathway,
  LimitationPrinciples,
  MentorshipProgram,
  SuccessionReview,
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

function parseEngagementSummary(data: unknown): FutureLeadersEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as FutureLeadersEngagementSummary;
}

function parseBlueprintBlock(data: unknown): FutureLeadersBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as FutureLeadersBlueprint;
}

function parsePathways(data: unknown): LeadershipPathway[] {
  if (!Array.isArray(data)) return [];
  return data as LeadershipPathway[];
}

function parseMentorships(data: unknown): MentorshipProgram[] {
  if (!Array.isArray(data)) return [];
  return data as MentorshipProgram[];
}

function parseLeadershipMemory(data: unknown): LeadershipMemoryEntry[] {
  if (!Array.isArray(data)) return [];
  return data as LeadershipMemoryEntry[];
}

function parseSuccessionReviews(data: unknown): SuccessionReview[] {
  if (!Array.isArray(data)) return [];
  return data as SuccessionReview[];
}

export function parseFutureLeadersCard(data: unknown): FutureLeadersCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    development_score: Number(d.development_score ?? 0),
    enabled: Boolean(d.enabled),
    development_mode: typeof d.development_mode === "string" ? d.development_mode : undefined,
    pathways_count: Number(d.pathways_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mentorship_enabled: Boolean(d.mentorship_enabled),
    reflection_enabled: Boolean(d.reflection_enabled),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    future_leaders_mission:
      typeof d.future_leaders_mission === "string" ? d.future_leaders_mission : undefined,
    future_leaders_abos_principle:
      typeof d.future_leaders_abos_principle === "string"
        ? d.future_leaders_abos_principle
        : undefined,
    future_leaders_engagement_summary: parseEngagementSummary(d.future_leaders_engagement_summary),
    future_leaders_note:
      typeof d.future_leaders_note === "string" ? d.future_leaders_note : undefined,
    future_leaders_vision_note:
      typeof d.future_leaders_vision_note === "string" ? d.future_leaders_vision_note : undefined,
  };
}

export function parseFutureLeadersDashboard(data: unknown): FutureLeadersDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    development_mode: typeof d.development_mode === "string" ? d.development_mode : undefined,
    mentorship_enabled: Boolean(d.mentorship_enabled),
    reflection_enabled: Boolean(d.reflection_enabled),
    succession_awareness_enabled: Boolean(d.succession_awareness_enabled),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    development_score: Number(d.development_score ?? 0),
    pathways_count: Number(d.pathways_count ?? 0),
    active_pathways_count: Number(d.active_pathways_count ?? 0),
    mentorships_count: Number(d.mentorships_count ?? 0),
    active_mentorships_count: Number(d.active_mentorships_count ?? 0),
    leadership_memory_count: Number(d.leadership_memory_count ?? 0),
    succession_reviews_count: Number(d.succession_reviews_count ?? 0),
    pathways: parsePathways(d.pathways),
    mentorships: parseMentorships(d.mentorships),
    leadership_memory: parseLeadershipMemory(d.leadership_memory),
    succession_reviews: parseSuccessionReviews(d.succession_reviews),
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    future_leaders_blueprint: parseBlueprintBlock(d.future_leaders_blueprint),
    future_leaders_mission:
      typeof d.future_leaders_mission === "string" ? d.future_leaders_mission : undefined,
    future_leaders_philosophy:
      typeof d.future_leaders_philosophy === "string" ? d.future_leaders_philosophy : undefined,
    future_leaders_abos_principle:
      typeof d.future_leaders_abos_principle === "string"
        ? d.future_leaders_abos_principle
        : undefined,
    future_leaders_objectives: parseObjectives(d.future_leaders_objectives),
    future_leaders_center_meta:
      typeof d.future_leaders_center_meta === "object" && d.future_leaders_center_meta
        ? (d.future_leaders_center_meta as Record<string, unknown>)
        : undefined,
    intergenerational_learning_engine_meta:
      typeof d.intergenerational_learning_engine_meta === "object" &&
      d.intergenerational_learning_engine_meta
        ? (d.intergenerational_learning_engine_meta as Record<string, unknown>)
        : undefined,
    succession_preparedness_engine_meta:
      typeof d.succession_preparedness_engine_meta === "object" &&
      d.succession_preparedness_engine_meta
        ? (d.succession_preparedness_engine_meta as Record<string, unknown>)
        : undefined,
    leadership_companion_meta:
      typeof d.leadership_companion_meta === "object" && d.leadership_companion_meta
        ? (d.leadership_companion_meta as Record<string, unknown>)
        : undefined,
    mentorship_network_engine_meta:
      typeof d.mentorship_network_engine_meta === "object" && d.mentorship_network_engine_meta
        ? (d.mentorship_network_engine_meta as Record<string, unknown>)
        : undefined,
    leadership_memory_engine_meta:
      typeof d.leadership_memory_engine_meta === "object" && d.leadership_memory_engine_meta
        ? (d.leadership_memory_engine_meta as Record<string, unknown>)
        : undefined,
    emerging_leader_pathways_meta:
      typeof d.emerging_leader_pathways_meta === "object" && d.emerging_leader_pathways_meta
        ? (d.emerging_leader_pathways_meta as Record<string, unknown>)
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
    iflebp151_integration_links: parseIntegrationLinks(d.iflebp151_integration_links),
    future_leaders_engagement_summary: parseEngagementSummary(d.future_leaders_engagement_summary),
    future_leaders_success_criteria: parseSuccessCriteria(d.future_leaders_success_criteria),
    future_leaders_vision:
      typeof d.future_leaders_vision === "string" ? d.future_leaders_vision : undefined,
    future_leaders_vision_phrases: Array.isArray(d.future_leaders_vision_phrases)
      ? (d.future_leaders_vision_phrases as string[])
      : undefined,
    future_leaders_privacy_note:
      typeof d.future_leaders_privacy_note === "string" ? d.future_leaders_privacy_note : undefined,
    future_leaders_dogfooding:
      typeof d.future_leaders_dogfooding === "string" ? d.future_leaders_dogfooding : undefined,
    future_leaders_engine_note:
      typeof d.future_leaders_engine_note === "string" ? d.future_leaders_engine_note : undefined,
    future_leaders_distinction_note:
      typeof d.future_leaders_distinction_note === "string"
        ? d.future_leaders_distinction_note
        : undefined,
  };
}
