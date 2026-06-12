import type {
  AiEthicsResponsibleUseEngineCard,
  AiEthicsResponsibleUseEngineDashboard,
  AiUseCaseRecord,
  AutonomyPrinciples,
  BlueprintIntegrationLink,
  BlueprintObjective,
  BlueprintSuccessCriterion,
  CompanionPrinciples,
  DataEthics,
  EmotionalSafety,
  GovernanceSummary,
  ImplementationBlueprintPhase54,
  ImplementationBlueprintPhase65,
  CouncilEngagementSummary,
} from "./types";

function parseUseCaseList(data: unknown): AiUseCaseRecord[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as AiUseCaseRecord[];
}

function parseObjectList(data: unknown): Array<Record<string, unknown>> | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as Array<Record<string, unknown>>;
}

function parseObjectives(data: unknown): BlueprintObjective[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as BlueprintObjective[];
}

function parseIntegrationLinks(data: unknown): BlueprintIntegrationLink[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as BlueprintIntegrationLink[];
}

function parseSuccessCriteria(data: unknown): BlueprintSuccessCriterion[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as BlueprintSuccessCriterion[];
}

function parseBlueprintPhase54(data: unknown): ImplementationBlueprintPhase54 | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImplementationBlueprintPhase54;
}

function parseBlueprintPhase65(data: unknown): ImplementationBlueprintPhase65 | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImplementationBlueprintPhase65;
}

function parseCouncilEngagementSummary(data: unknown): CouncilEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CouncilEngagementSummary;
}

function parseGovernanceSummary(data: unknown): GovernanceSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as GovernanceSummary;
}

function parseCompanionPrinciples(data: unknown): CompanionPrinciples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CompanionPrinciples;
}

function parseAutonomyPrinciples(data: unknown): AutonomyPrinciples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as AutonomyPrinciples;
}

function parseEmotionalSafety(data: unknown): EmotionalSafety | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as EmotionalSafety;
}

function parseDataEthics(data: unknown): DataEthics | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as DataEthics;
}

function parseStringList(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item): item is string => typeof item === "string");
}

export function parseAiEthicsResponsibleUseEngineCard(data: unknown): AiEthicsResponsibleUseEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    approved_use_cases: typeof d.approved_use_cases === "number" ? d.approved_use_cases : undefined,
    proposed_reviews: typeof d.proposed_reviews === "number" ? d.proposed_reviews : undefined,
    restricted_count: typeof d.restricted_count === "number" ? d.restricted_count : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    implementation_blueprint_phase54: parseBlueprintPhase54(d.implementation_blueprint_phase54),
    implementation_blueprint_phase65: parseBlueprintPhase65(d.implementation_blueprint_phase65),
    companion_governance_phase: typeof d.companion_governance_phase === "number" ? d.companion_governance_phase : undefined,
    companion_evolution_council_phase:
      typeof d.companion_evolution_council_phase === "number" ? d.companion_evolution_council_phase : undefined,
    escgbp_abos_principle: typeof d.escgbp_abos_principle === "string" ? d.escgbp_abos_principle : undefined,
    cecbp_abos_principle: typeof d.cecbp_abos_principle === "string" ? d.cecbp_abos_principle : undefined,
    governance_summary: parseGovernanceSummary(d.governance_summary),
    council_engagement_summary: parseCouncilEngagementSummary(d.council_engagement_summary),
    governance_health: typeof d.governance_health === "string" ? d.governance_health : undefined,
    critical_prohibition_note: typeof d.critical_prohibition_note === "string" ? d.critical_prohibition_note : undefined,
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
    council_vision_phrase: typeof d.council_vision_phrase === "string" ? d.council_vision_phrase : undefined,
    ...d,
  } as AiEthicsResponsibleUseEngineCard;
}

export function parseAiEthicsResponsibleUseEngineDashboard(data: unknown): AiEthicsResponsibleUseEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: parseStringList(d.principles),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    ethics_policy: typeof d.ethics_policy === "object" && d.ethics_policy ? (d.ethics_policy as Record<string, unknown>) : undefined,
    prohibited_examples: parseObjectList(d.prohibited_examples),
    explainability_requirements:
      typeof d.explainability_requirements === "object" && d.explainability_requirements
        ? (d.explainability_requirements as Record<string, unknown>)
        : undefined,
    approved_use_cases: parseUseCaseList(d.approved_use_cases),
    restricted_use_cases: parseUseCaseList(d.restricted_use_cases),
    proposed_use_cases: parseUseCaseList(d.proposed_use_cases),
    review_schedules: parseObjectList(d.review_schedules),
    policy_exceptions: parseObjectList(d.policy_exceptions),
    oversight_trends:
      typeof d.oversight_trends === "object" && d.oversight_trends
        ? (d.oversight_trends as Record<string, unknown>)
        : undefined,
    integration_notes:
      typeof d.integration_notes === "object" && d.integration_notes
        ? (d.integration_notes as Record<string, unknown>)
        : undefined,
    implementation_blueprint_phase54: parseBlueprintPhase54(d.implementation_blueprint_phase54),
    companion_governance_phase: typeof d.companion_governance_phase === "number" ? d.companion_governance_phase : undefined,
    escgbp_mission: typeof d.escgbp_mission === "string" ? d.escgbp_mission : undefined,
    escgbp_philosophy: typeof d.escgbp_philosophy === "string" ? d.escgbp_philosophy : undefined,
    escgbp_abos_principle: typeof d.escgbp_abos_principle === "string" ? d.escgbp_abos_principle : undefined,
    escgbp_objectives: parseObjectives(d.escgbp_objectives),
    companion_principles: parseCompanionPrinciples(d.companion_principles),
    autonomy_principles: parseAutonomyPrinciples(d.autonomy_principles),
    emotional_safety: parseEmotionalSafety(d.emotional_safety),
    data_ethics: parseDataEthics(d.data_ethics),
    escgbp_self_love_connection:
      typeof d.escgbp_self_love_connection === "object" && d.escgbp_self_love_connection
        ? (d.escgbp_self_love_connection as Record<string, unknown>)
        : undefined,
    organizational_governance:
      typeof d.organizational_governance === "object" && d.organizational_governance
        ? (d.organizational_governance as Record<string, unknown>)
        : undefined,
    companion_evolution_reviews:
      typeof d.companion_evolution_reviews === "object" && d.companion_evolution_reviews
        ? (d.companion_evolution_reviews as Record<string, unknown>)
        : undefined,
    escgbp_trust_connection:
      typeof d.escgbp_trust_connection === "object" && d.escgbp_trust_connection
        ? (d.escgbp_trust_connection as Record<string, unknown>)
        : undefined,
    escgbp_dogfooding:
      typeof d.escgbp_dogfooding === "object" && d.escgbp_dogfooding
        ? (d.escgbp_dogfooding as Record<string, unknown>)
        : undefined,
    escgbp_integration_links: parseIntegrationLinks(d.escgbp_integration_links),
    governance_summary: parseGovernanceSummary(d.governance_summary),
    escgbp_success_criteria: parseSuccessCriteria(d.escgbp_success_criteria),
    escgbp_distinction_note: typeof d.escgbp_distinction_note === "string" ? d.escgbp_distinction_note : undefined,
    escgbp_vision_phrases: parseStringList(d.escgbp_vision_phrases),
    critical_prohibition_note: typeof d.critical_prohibition_note === "string" ? d.critical_prohibition_note : undefined,
    human_agency_note: typeof d.human_agency_note === "string" ? d.human_agency_note : undefined,
    implementation_blueprint_phase65: parseBlueprintPhase65(d.implementation_blueprint_phase65),
    companion_evolution_council_phase:
      typeof d.companion_evolution_council_phase === "number" ? d.companion_evolution_council_phase : undefined,
    cecbp_mission: typeof d.cecbp_mission === "string" ? d.cecbp_mission : undefined,
    cecbp_philosophy: typeof d.cecbp_philosophy === "string" ? d.cecbp_philosophy : undefined,
    cecbp_abos_principle: typeof d.cecbp_abos_principle === "string" ? d.cecbp_abos_principle : undefined,
    cecbp_objectives: parseObjectives(d.cecbp_objectives),
    council_responsibilities:
      typeof d.council_responsibilities === "object" && d.council_responsibilities
        ? (d.council_responsibilities as Record<string, unknown>)
        : undefined,
    guiding_questions:
      typeof d.guiding_questions === "object" && d.guiding_questions
        ? (d.guiding_questions as Record<string, unknown>)
        : undefined,
    representation_principles:
      typeof d.representation_principles === "object" && d.representation_principles
        ? (d.representation_principles as Record<string, unknown>)
        : undefined,
    companion_philosophy_reviews:
      typeof d.companion_philosophy_reviews === "object" && d.companion_philosophy_reviews
        ? (d.companion_philosophy_reviews as Record<string, unknown>)
        : undefined,
    cecbp_community_feedback:
      typeof d.cecbp_community_feedback === "object" && d.cecbp_community_feedback
        ? (d.cecbp_community_feedback as Record<string, unknown>)
        : undefined,
    cecbp_self_love_connection:
      typeof d.cecbp_self_love_connection === "object" && d.cecbp_self_love_connection
        ? (d.cecbp_self_love_connection as Record<string, unknown>)
        : undefined,
    cecbp_trust_connection:
      typeof d.cecbp_trust_connection === "object" && d.cecbp_trust_connection
        ? (d.cecbp_trust_connection as Record<string, unknown>)
        : undefined,
    cecbp_dogfooding:
      typeof d.cecbp_dogfooding === "object" && d.cecbp_dogfooding
        ? (d.cecbp_dogfooding as Record<string, unknown>)
        : undefined,
    cecbp_integration_links: parseIntegrationLinks(d.cecbp_integration_links),
    council_engagement_summary: parseCouncilEngagementSummary(d.council_engagement_summary),
    cecbp_success_criteria: parseSuccessCriteria(d.cecbp_success_criteria),
    cecbp_distinction_note: typeof d.cecbp_distinction_note === "string" ? d.cecbp_distinction_note : undefined,
    cecbp_vision_phrases: parseStringList(d.cecbp_vision_phrases),
    ...d,
  } as AiEthicsResponsibleUseEngineDashboard;
}
