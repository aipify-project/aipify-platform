import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  ConstructiveDialogueBlueprint,
  ConstructiveDialogueCard,
  ConstructiveDialogueDashboard,
  ConstructiveDialogueEngagementSummary,
  DialogueMemoryEntry,
  DialogueProgram,
  DialogueReview,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
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

function parseEngagementSummary(data: unknown): ConstructiveDialogueEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ConstructiveDialogueEngagementSummary;
}

function parseBlueprintBlock(data: unknown): ConstructiveDialogueBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ConstructiveDialogueBlueprint;
}

function parseReviews(data: unknown): DialogueReview[] {
  if (!Array.isArray(data)) return [];
  return data as DialogueReview[];
}

function parsePrograms(data: unknown): DialogueProgram[] {
  if (!Array.isArray(data)) return [];
  return data as DialogueProgram[];
}

function parseMemory(data: unknown): DialogueMemoryEntry[] {
  if (!Array.isArray(data)) return [];
  return data as DialogueMemoryEntry[];
}

export function parseConstructiveDialogueCard(data: unknown): ConstructiveDialogueCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    constructive_dialogue_score: Number(d.constructive_dialogue_score ?? 0),
    dialogue_readiness_level: Number(d.dialogue_readiness_level ?? 1),
    dialogue_reviews_count: Number(d.dialogue_reviews_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    reflection_opt_in: Boolean(d.reflection_opt_in),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    constructive_dialogue_mission:
      typeof d.constructive_dialogue_mission === "string"
        ? d.constructive_dialogue_mission
        : undefined,
    constructive_dialogue_abos_principle:
      typeof d.constructive_dialogue_abos_principle === "string"
        ? d.constructive_dialogue_abos_principle
        : undefined,
    constructive_dialogue_engagement_summary: parseEngagementSummary(
      d.constructive_dialogue_engagement_summary,
    ),
    constructive_dialogue_note:
      typeof d.constructive_dialogue_note === "string" ? d.constructive_dialogue_note : undefined,
    constructive_dialogue_vision_note:
      typeof d.constructive_dialogue_vision_note === "string"
        ? d.constructive_dialogue_vision_note
        : undefined,
  };
}

export function parseConstructiveDialogueDashboard(data: unknown): ConstructiveDialogueDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    dialogue_readiness_level: Number(d.dialogue_readiness_level ?? 1),
    dialogue_maturity_stage:
      typeof d.dialogue_maturity_stage === "string" ? d.dialogue_maturity_stage : undefined,
    reflection_opt_in: Boolean(d.reflection_opt_in),
    human_oversight_required: Boolean(d.human_oversight_required),
    governance_visibility:
      typeof d.governance_visibility === "string" ? d.governance_visibility : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    constructive_dialogue_score: Number(d.constructive_dialogue_score ?? 0),
    dialogue_programs_count: Number(d.dialogue_programs_count ?? 0),
    dialogue_reviews_count: Number(d.dialogue_reviews_count ?? 0),
    dialogue_memory_count: Number(d.dialogue_memory_count ?? 0),
    dialogue_programs: parsePrograms(d.dialogue_programs),
    dialogue_reviews: parseReviews(d.dialogue_reviews),
    dialogue_memory_entries: parseMemory(d.dialogue_memory_entries),
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    constructive_dialogue_blueprint: parseBlueprintBlock(d.constructive_dialogue_blueprint),
    constructive_dialogue_mission:
      typeof d.constructive_dialogue_mission === "string"
        ? d.constructive_dialogue_mission
        : undefined,
    constructive_dialogue_philosophy:
      typeof d.constructive_dialogue_philosophy === "string"
        ? d.constructive_dialogue_philosophy
        : undefined,
    constructive_dialogue_abos_principle:
      typeof d.constructive_dialogue_abos_principle === "string"
        ? d.constructive_dialogue_abos_principle
        : undefined,
    constructive_dialogue_objectives: parseObjectives(d.constructive_dialogue_objectives),
    constructive_dialogue_center_meta:
      typeof d.constructive_dialogue_center_meta === "object" &&
      d.constructive_dialogue_center_meta
        ? (d.constructive_dialogue_center_meta as Record<string, unknown>)
        : undefined,
    peacebuilding_engine_meta:
      typeof d.peacebuilding_engine_meta === "object" && d.peacebuilding_engine_meta
        ? (d.peacebuilding_engine_meta as Record<string, unknown>)
        : undefined,
    conflict_navigation_framework_meta:
      typeof d.conflict_navigation_framework_meta === "object" &&
      d.conflict_navigation_framework_meta
        ? (d.conflict_navigation_framework_meta as Record<string, unknown>)
        : undefined,
    executive_dialogue_reviews_meta:
      typeof d.executive_dialogue_reviews_meta === "object" &&
      d.executive_dialogue_reviews_meta
        ? (d.executive_dialogue_reviews_meta as Record<string, unknown>)
        : undefined,
    dialogue_companion_meta:
      typeof d.dialogue_companion_meta === "object" && d.dialogue_companion_meta
        ? (d.dialogue_companion_meta as Record<string, unknown>)
        : undefined,
    perspective_expansion_engine_meta:
      typeof d.perspective_expansion_engine_meta === "object" &&
      d.perspective_expansion_engine_meta
        ? (d.perspective_expansion_engine_meta as Record<string, unknown>)
        : undefined,
    relationship_resilience_engine_meta:
      typeof d.relationship_resilience_engine_meta === "object" &&
      d.relationship_resilience_engine_meta
        ? (d.relationship_resilience_engine_meta as Record<string, unknown>)
        : undefined,
    dialogue_memory_engine_meta:
      typeof d.dialogue_memory_engine_meta === "object" && d.dialogue_memory_engine_meta
        ? (d.dialogue_memory_engine_meta as Record<string, unknown>)
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
    cpdebp168_integration_links: parseIntegrationLinks(d.cpdebp168_integration_links),
    constructive_dialogue_engagement_summary: parseEngagementSummary(
      d.constructive_dialogue_engagement_summary,
    ),
    constructive_dialogue_success_criteria: parseSuccessCriteria(
      d.constructive_dialogue_success_criteria,
    ),
    constructive_dialogue_vision:
      typeof d.constructive_dialogue_vision === "string"
        ? d.constructive_dialogue_vision
        : undefined,
    constructive_dialogue_vision_phrases: Array.isArray(d.constructive_dialogue_vision_phrases)
      ? (d.constructive_dialogue_vision_phrases as string[])
      : undefined,
    constructive_dialogue_privacy_note:
      typeof d.constructive_dialogue_privacy_note === "string"
        ? d.constructive_dialogue_privacy_note
        : undefined,
    constructive_dialogue_dogfooding:
      typeof d.constructive_dialogue_dogfooding === "string"
        ? d.constructive_dialogue_dogfooding
        : undefined,
    constructive_dialogue_engine_note:
      typeof d.constructive_dialogue_engine_note === "string"
        ? d.constructive_dialogue_engine_note
        : undefined,
    constructive_dialogue_distinction_note:
      typeof d.constructive_dialogue_distinction_note === "string"
        ? d.constructive_dialogue_distinction_note
        : undefined,
  };
}
