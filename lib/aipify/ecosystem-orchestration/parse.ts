import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  EcosystemOrchestrationBlueprint,
  EcosystemOrchestrationCard,
  EcosystemOrchestrationDashboard,
  EcosystemOrchestrationEngagementSummary,
  HealthSnapshot,
  ImplementationBlueprintMeta,
  IntegrationLink,
  KnowledgeFlowSignal,
  LimitationPrinciples,
  MemoryEntry,
  OpportunitySignal,
  ResilienceIndicator,
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

function parseEngagementSummary(data: unknown): EcosystemOrchestrationEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as EcosystemOrchestrationEngagementSummary;
}

function parseBlueprintBlock(data: unknown): EcosystemOrchestrationBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as EcosystemOrchestrationBlueprint;
}

function parseRecord(data: unknown): Record<string, unknown> | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as Record<string, unknown>;
}

export function parseEcosystemOrchestrationCard(data: unknown): EcosystemOrchestrationCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    orchestration_score: Number(d.orchestration_score ?? 0),
    health_indicators_count: Number(d.health_indicators_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    ecosystem_orchestration_mission:
      typeof d.ecosystem_orchestration_mission === "string" ? d.ecosystem_orchestration_mission : undefined,
    ecosystem_orchestration_abos_principle:
      typeof d.ecosystem_orchestration_abos_principle === "string"
        ? d.ecosystem_orchestration_abos_principle
        : undefined,
    ecosystem_orchestration_engagement_summary: parseEngagementSummary(
      d.ecosystem_orchestration_engagement_summary,
    ),
    ecosystem_orchestration_note:
      typeof d.ecosystem_orchestration_note === "string" ? d.ecosystem_orchestration_note : undefined,
    ecosystem_orchestration_vision_note:
      typeof d.ecosystem_orchestration_vision_note === "string" ? d.ecosystem_orchestration_vision_note : undefined,
  };
}

export function parseEcosystemOrchestrationDashboard(data: unknown): EcosystemOrchestrationDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    enabled: Boolean(d.enabled),
    collective_evolution_enabled: Boolean(d.collective_evolution_enabled),
    orchestration_visibility:
      typeof d.orchestration_visibility === "string" ? d.orchestration_visibility : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    orchestration_score: Number(d.orchestration_score ?? 0),
    health_indicators_count: Number(d.health_indicators_count ?? 0),
    knowledge_flow_signals_count: Number(d.knowledge_flow_signals_count ?? 0),
    resilience_indicators_count: Number(d.resilience_indicators_count ?? 0),
    opportunity_signals_count: Number(d.opportunity_signals_count ?? 0),
    memory_entries_count: Number(d.memory_entries_count ?? 0),
    avg_health_value: Number(d.avg_health_value ?? 0),
    health_snapshots: Array.isArray(d.health_snapshots) ? (d.health_snapshots as HealthSnapshot[]) : [],
    knowledge_flow_signals: Array.isArray(d.knowledge_flow_signals)
      ? (d.knowledge_flow_signals as KnowledgeFlowSignal[])
      : [],
    resilience_indicators: Array.isArray(d.resilience_indicators)
      ? (d.resilience_indicators as ResilienceIndicator[])
      : [],
    opportunity_signals: Array.isArray(d.opportunity_signals)
      ? (d.opportunity_signals as OpportunitySignal[])
      : [],
    memory_entries: Array.isArray(d.memory_entries) ? (d.memory_entries as MemoryEntry[]) : [],
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    ecosystem_orchestration_engine_note:
      typeof d.ecosystem_orchestration_engine_note === "string"
        ? d.ecosystem_orchestration_engine_note
        : undefined,
    ecosystem_orchestration_blueprint: parseBlueprintBlock(d.ecosystem_orchestration_blueprint),
    ecosystem_orchestration_distinction_note:
      typeof d.ecosystem_orchestration_distinction_note === "string"
        ? d.ecosystem_orchestration_distinction_note
        : undefined,
    ecosystem_orchestration_mission:
      typeof d.ecosystem_orchestration_mission === "string" ? d.ecosystem_orchestration_mission : undefined,
    ecosystem_orchestration_philosophy:
      typeof d.ecosystem_orchestration_philosophy === "string" ? d.ecosystem_orchestration_philosophy : undefined,
    ecosystem_orchestration_abos_principle:
      typeof d.ecosystem_orchestration_abos_principle === "string"
        ? d.ecosystem_orchestration_abos_principle
        : undefined,
    ecosystem_orchestration_objectives: parseObjectives(d.ecosystem_orchestration_objectives),
    orchestration_center_meta: parseRecord(d.orchestration_center_meta),
    collective_evolution_meta: parseRecord(d.collective_evolution_meta),
    ecosystem_health_model_meta: parseRecord(d.ecosystem_health_model_meta),
    knowledge_flow_meta: parseRecord(d.knowledge_flow_meta),
    resilience_engine_meta: parseRecord(d.resilience_engine_meta),
    strategic_opportunity_meta: parseRecord(d.strategic_opportunity_meta),
    companion_responsibilities_meta: parseRecord(d.companion_responsibilities_meta),
    stewardship_council_meta: parseRecord(d.stewardship_council_meta),
    self_love_in_ecosystem_meta: parseRecord(d.self_love_in_ecosystem_meta),
    ecosystem_memory_meta: parseRecord(d.ecosystem_memory_meta),
    eocbp120_era_ecosystem_cross_links: parseIntegrationLinks(d.eocbp120_era_ecosystem_cross_links),
    eocbp120_extended_cross_links: parseIntegrationLinks(d.eocbp120_extended_cross_links),
    ecosystem_orchestration_limitation_principles: parseLimitationPrinciples(
      d.ecosystem_orchestration_limitation_principles,
    ),
    ecosystem_orchestration_companion_adaptation: parseBlueprintBlock(
      d.ecosystem_orchestration_companion_adaptation,
    )?.companion_adaptation,
    eocbp120_integration_links: parseIntegrationLinks(d.eocbp120_integration_links),
    ecosystem_orchestration_engagement_summary: parseEngagementSummary(
      d.ecosystem_orchestration_engagement_summary,
    ),
    ecosystem_orchestration_success_criteria: parseSuccessCriteria(d.ecosystem_orchestration_success_criteria),
    ecosystem_orchestration_success_metrics: parseRecord(d.ecosystem_orchestration_success_metrics),
    ecosystem_orchestration_vision:
      typeof d.ecosystem_orchestration_vision === "string" ? d.ecosystem_orchestration_vision : undefined,
    ecosystem_orchestration_privacy_note:
      typeof d.ecosystem_orchestration_privacy_note === "string"
        ? d.ecosystem_orchestration_privacy_note
        : undefined,
  };
}
