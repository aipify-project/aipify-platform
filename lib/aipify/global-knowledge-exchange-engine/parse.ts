import type {
  AbosSuccessCriterion,
  BenchmarkSnapshot,
  BlueprintObjective,
  ExchangeProgram,
  GlobalKnowledgeExchangeBlueprint,
  GlobalKnowledgeExchangeCard,
  GlobalKnowledgeExchangeDashboard,
  GlobalKnowledgeExchangeEngagementSummary,
  ImplementationBlueprintMeta,
  IntegrationLink,
  KnowledgeContribution,
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

function parseEngagementSummary(data: unknown): GlobalKnowledgeExchangeEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as GlobalKnowledgeExchangeEngagementSummary;
}

function parseBlueprintBlock(data: unknown): GlobalKnowledgeExchangeBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as GlobalKnowledgeExchangeBlueprint;
}

function parsePrograms(data: unknown): ExchangeProgram[] {
  if (!Array.isArray(data)) return [];
  return data as ExchangeProgram[];
}

function parseContributions(data: unknown): KnowledgeContribution[] {
  if (!Array.isArray(data)) return [];
  return data as KnowledgeContribution[];
}

function parseBenchmarkSnapshots(data: unknown): BenchmarkSnapshot[] {
  if (!Array.isArray(data)) return [];
  return data as BenchmarkSnapshot[];
}

export function parseGlobalKnowledgeExchangeCard(data: unknown): GlobalKnowledgeExchangeCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    exchange_score: Number(d.exchange_score ?? 0),
    participation_status:
      typeof d.participation_status === "string" ? d.participation_status : undefined,
    enabled: Boolean(d.enabled),
    programs_count: Number(d.programs_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    approval_required: Boolean(d.approval_required),
    executive_approval_required: Boolean(d.executive_approval_required),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    global_knowledge_exchange_mission:
      typeof d.global_knowledge_exchange_mission === "string"
        ? d.global_knowledge_exchange_mission
        : undefined,
    global_knowledge_exchange_abos_principle:
      typeof d.global_knowledge_exchange_abos_principle === "string"
        ? d.global_knowledge_exchange_abos_principle
        : undefined,
    global_knowledge_exchange_engagement_summary: parseEngagementSummary(
      d.global_knowledge_exchange_engagement_summary,
    ),
    global_knowledge_exchange_note:
      typeof d.global_knowledge_exchange_note === "string"
        ? d.global_knowledge_exchange_note
        : undefined,
    global_knowledge_exchange_vision_note:
      typeof d.global_knowledge_exchange_vision_note === "string"
        ? d.global_knowledge_exchange_vision_note
        : undefined,
  };
}

export function parseGlobalKnowledgeExchangeDashboard(data: unknown): GlobalKnowledgeExchangeDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    participation_status:
      typeof d.participation_status === "string" ? d.participation_status : undefined,
    anonymization_level:
      typeof d.anonymization_level === "string" ? d.anonymization_level : undefined,
    approval_required: Boolean(d.approval_required),
    executive_approval_required: Boolean(d.executive_approval_required),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    exchange_score: Number(d.exchange_score ?? 0),
    programs_count: Number(d.programs_count ?? 0),
    contributions_count: Number(d.contributions_count ?? 0),
    approved_contributions_count: Number(d.approved_contributions_count ?? 0),
    pending_contributions_count: Number(d.pending_contributions_count ?? 0),
    benchmark_snapshots_count: Number(d.benchmark_snapshots_count ?? 0),
    programs: parsePrograms(d.programs),
    contributions: parseContributions(d.contributions),
    benchmark_snapshots: parseBenchmarkSnapshots(d.benchmark_snapshots),
    anonymized_benchmark_summary:
      typeof d.anonymized_benchmark_summary === "object" && d.anonymized_benchmark_summary
        ? (d.anonymized_benchmark_summary as Record<string, unknown>)
        : undefined,
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    global_knowledge_exchange_blueprint: parseBlueprintBlock(d.global_knowledge_exchange_blueprint),
    global_knowledge_exchange_mission:
      typeof d.global_knowledge_exchange_mission === "string"
        ? d.global_knowledge_exchange_mission
        : undefined,
    global_knowledge_exchange_philosophy:
      typeof d.global_knowledge_exchange_philosophy === "string"
        ? d.global_knowledge_exchange_philosophy
        : undefined,
    global_knowledge_exchange_abos_principle:
      typeof d.global_knowledge_exchange_abos_principle === "string"
        ? d.global_knowledge_exchange_abos_principle
        : undefined,
    global_knowledge_exchange_objectives: parseObjectives(d.global_knowledge_exchange_objectives),
    global_knowledge_center_meta:
      typeof d.global_knowledge_center_meta === "object" && d.global_knowledge_center_meta
        ? (d.global_knowledge_center_meta as Record<string, unknown>)
        : undefined,
    interorganizational_learning_engine_meta:
      typeof d.interorganizational_learning_engine_meta === "object" &&
      d.interorganizational_learning_engine_meta
        ? (d.interorganizational_learning_engine_meta as Record<string, unknown>)
        : undefined,
    knowledge_sharing_governance_meta:
      typeof d.knowledge_sharing_governance_meta === "object" && d.knowledge_sharing_governance_meta
        ? (d.knowledge_sharing_governance_meta as Record<string, unknown>)
        : undefined,
    anonymized_benchmarking_engine_meta:
      typeof d.anonymized_benchmarking_engine_meta === "object" &&
      d.anonymized_benchmarking_engine_meta
        ? (d.anonymized_benchmarking_engine_meta as Record<string, unknown>)
        : undefined,
    global_learning_networks_meta:
      typeof d.global_learning_networks_meta === "object" && d.global_learning_networks_meta
        ? (d.global_learning_networks_meta as Record<string, unknown>)
        : undefined,
    growth_partner_contribution_engine_meta:
      typeof d.growth_partner_contribution_engine_meta === "object" &&
      d.growth_partner_contribution_engine_meta
        ? (d.growth_partner_contribution_engine_meta as Record<string, unknown>)
        : undefined,
    collective_wisdom_companion_meta:
      typeof d.collective_wisdom_companion_meta === "object" && d.collective_wisdom_companion_meta
        ? (d.collective_wisdom_companion_meta as Record<string, unknown>)
        : undefined,
    privacy_confidentiality_framework_meta:
      typeof d.privacy_confidentiality_framework_meta === "object" &&
      d.privacy_confidentiality_framework_meta
        ? (d.privacy_confidentiality_framework_meta as Record<string, unknown>)
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
    gkeebp141_integration_links: parseIntegrationLinks(d.gkeebp141_integration_links),
    global_knowledge_exchange_engagement_summary: parseEngagementSummary(
      d.global_knowledge_exchange_engagement_summary,
    ),
    global_knowledge_exchange_success_criteria: parseSuccessCriteria(
      d.global_knowledge_exchange_success_criteria,
    ),
    global_knowledge_exchange_vision:
      typeof d.global_knowledge_exchange_vision === "string"
        ? d.global_knowledge_exchange_vision
        : undefined,
    global_knowledge_exchange_vision_phrases: Array.isArray(d.global_knowledge_exchange_vision_phrases)
      ? (d.global_knowledge_exchange_vision_phrases as string[])
      : undefined,
    global_knowledge_exchange_privacy_note:
      typeof d.global_knowledge_exchange_privacy_note === "string"
        ? d.global_knowledge_exchange_privacy_note
        : undefined,
    global_knowledge_exchange_dogfooding:
      typeof d.global_knowledge_exchange_dogfooding === "string"
        ? d.global_knowledge_exchange_dogfooding
        : undefined,
    global_knowledge_exchange_engine_note:
      typeof d.global_knowledge_exchange_engine_note === "string"
        ? d.global_knowledge_exchange_engine_note
        : undefined,
    global_knowledge_exchange_distinction_note:
      typeof d.global_knowledge_exchange_distinction_note === "string"
        ? d.global_knowledge_exchange_distinction_note
        : undefined,
  };
}
