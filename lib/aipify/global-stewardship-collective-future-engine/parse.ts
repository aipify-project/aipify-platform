import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  ExecutiveStewardshipReview,
  GlobalStewardshipBlueprint,
  GlobalStewardshipCard,
  GlobalStewardshipDashboard,
  GlobalStewardshipEngagementSummary,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
  StewardshipFutureScenario,
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

function parseEngagementSummary(data: unknown): GlobalStewardshipEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as GlobalStewardshipEngagementSummary;
}

function parseBlueprintBlock(data: unknown): GlobalStewardshipBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as GlobalStewardshipBlueprint;
}

function parseReviews(data: unknown): ExecutiveStewardshipReview[] {
  if (!Array.isArray(data)) return [];
  return data as ExecutiveStewardshipReview[];
}

function parseScenarios(data: unknown): StewardshipFutureScenario[] {
  if (!Array.isArray(data)) return [];
  return data as StewardshipFutureScenario[];
}

export function parseGlobalStewardshipCard(data: unknown): GlobalStewardshipCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    stewardship_score: Number(d.stewardship_score ?? 0),
    stewardship_maturity_level: Number(d.stewardship_maturity_level ?? 1),
    executive_reviews_count: Number(d.executive_reviews_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    reflection_opt_in: Boolean(d.reflection_opt_in),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    global_stewardship_mission:
      typeof d.global_stewardship_mission === "string" ? d.global_stewardship_mission : undefined,
    global_stewardship_abos_principle:
      typeof d.global_stewardship_abos_principle === "string"
        ? d.global_stewardship_abos_principle
        : undefined,
    global_stewardship_engagement_summary: parseEngagementSummary(
      d.global_stewardship_engagement_summary,
    ),
    global_stewardship_note:
      typeof d.global_stewardship_note === "string" ? d.global_stewardship_note : undefined,
    global_stewardship_vision_note:
      typeof d.global_stewardship_vision_note === "string"
        ? d.global_stewardship_vision_note
        : undefined,
  };
}

export function parseGlobalStewardshipDashboard(data: unknown): GlobalStewardshipDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    stewardship_maturity_level: Number(d.stewardship_maturity_level ?? 1),
    readiness_level: typeof d.readiness_level === "string" ? d.readiness_level : undefined,
    reflection_opt_in: Boolean(d.reflection_opt_in),
    executive_review_enabled: Boolean(d.executive_review_enabled),
    scenario_planning_enabled: Boolean(d.scenario_planning_enabled),
    human_oversight_required: Boolean(d.human_oversight_required),
    governance_visibility:
      typeof d.governance_visibility === "string" ? d.governance_visibility : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    stewardship_score: Number(d.stewardship_score ?? 0),
    executive_reviews_count: Number(d.executive_reviews_count ?? 0),
    future_scenarios_count: Number(d.future_scenarios_count ?? 0),
    executive_reviews: parseReviews(d.executive_reviews),
    future_scenarios: parseScenarios(d.future_scenarios),
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    global_stewardship_blueprint: parseBlueprintBlock(d.global_stewardship_blueprint),
    global_stewardship_mission:
      typeof d.global_stewardship_mission === "string" ? d.global_stewardship_mission : undefined,
    global_stewardship_philosophy:
      typeof d.global_stewardship_philosophy === "string" ? d.global_stewardship_philosophy : undefined,
    global_stewardship_abos_principle:
      typeof d.global_stewardship_abos_principle === "string"
        ? d.global_stewardship_abos_principle
        : undefined,
    global_stewardship_objectives: parseObjectives(d.global_stewardship_objectives),
    global_stewardship_center_meta:
      typeof d.global_stewardship_center_meta === "object" && d.global_stewardship_center_meta
        ? (d.global_stewardship_center_meta as Record<string, unknown>)
        : undefined,
    collective_future_engine_meta:
      typeof d.collective_future_engine_meta === "object" && d.collective_future_engine_meta
        ? (d.collective_future_engine_meta as Record<string, unknown>)
        : undefined,
    long_term_thinking_framework_meta:
      typeof d.long_term_thinking_framework_meta === "object" &&
      d.long_term_thinking_framework_meta
        ? (d.long_term_thinking_framework_meta as Record<string, unknown>)
        : undefined,
    stewardship_companion_meta:
      typeof d.stewardship_companion_meta === "object" && d.stewardship_companion_meta
        ? (d.stewardship_companion_meta as Record<string, unknown>)
        : undefined,
    collective_resilience_engine_meta:
      typeof d.collective_resilience_engine_meta === "object" &&
      d.collective_resilience_engine_meta
        ? (d.collective_resilience_engine_meta as Record<string, unknown>)
        : undefined,
    executive_stewardship_reviews_meta:
      typeof d.executive_stewardship_reviews_meta === "object" &&
      d.executive_stewardship_reviews_meta
        ? (d.executive_stewardship_reviews_meta as Record<string, unknown>)
        : undefined,
    legacy_intelligence_engine_meta:
      typeof d.legacy_intelligence_engine_meta === "object" && d.legacy_intelligence_engine_meta
        ? (d.legacy_intelligence_engine_meta as Record<string, unknown>)
        : undefined,
    global_responsibility_principles_meta:
      typeof d.global_responsibility_principles_meta === "object" &&
      d.global_responsibility_principles_meta
        ? (d.global_responsibility_principles_meta as Record<string, unknown>)
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
    gscfebp150_era_capstone_summary: parseIntegrationLinks(d.gscfebp150_era_capstone_summary),
    gscfebp150_extended_cross_links: parseIntegrationLinks(d.gscfebp150_extended_cross_links),
    gscfebp150_integration_links: parseIntegrationLinks(d.gscfebp150_integration_links),
    global_stewardship_engagement_summary: parseEngagementSummary(
      d.global_stewardship_engagement_summary,
    ),
    global_stewardship_success_criteria: parseSuccessCriteria(
      d.global_stewardship_success_criteria,
    ),
    global_stewardship_vision:
      typeof d.global_stewardship_vision === "string" ? d.global_stewardship_vision : undefined,
    global_stewardship_vision_phrases: Array.isArray(d.global_stewardship_vision_phrases)
      ? (d.global_stewardship_vision_phrases as string[])
      : undefined,
    global_stewardship_privacy_note:
      typeof d.global_stewardship_privacy_note === "string"
        ? d.global_stewardship_privacy_note
        : undefined,
    global_stewardship_dogfooding:
      typeof d.global_stewardship_dogfooding === "string"
        ? d.global_stewardship_dogfooding
        : undefined,
    global_stewardship_engine_note:
      typeof d.global_stewardship_engine_note === "string"
        ? d.global_stewardship_engine_note
        : undefined,
    global_stewardship_distinction_note:
      typeof d.global_stewardship_distinction_note === "string"
        ? d.global_stewardship_distinction_note
        : undefined,
  };
}
