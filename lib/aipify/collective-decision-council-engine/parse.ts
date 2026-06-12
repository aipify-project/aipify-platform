import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  CollectiveDecisionCouncilBlueprint,
  CollectiveDecisionCouncilCard,
  CollectiveDecisionCouncilDashboard,
  CollectiveDecisionCouncilEngagementSummary,
  CouncilMemoryEntry,
  CouncilPerspective,
  CouncilWorkspace,
  ImplementationBlueprintMeta,
  IntegrationLink,
  StakeholderImpact,
  TransparencyRecord,
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

function parseEngagementSummary(data: unknown): CollectiveDecisionCouncilEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CollectiveDecisionCouncilEngagementSummary;
}

function parseBlueprintBlock(data: unknown): CollectiveDecisionCouncilBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CollectiveDecisionCouncilBlueprint;
}

function parseRecordArray(data: unknown): Record<string, unknown>[] {
  if (!Array.isArray(data)) return [];
  return data as Record<string, unknown>[];
}

function parseRecordObject(data: unknown): Record<string, unknown> {
  if (typeof data !== "object" || !data) return {};
  return data as Record<string, unknown>;
}

export function parseCollectiveDecisionCouncilCard(data: unknown): CollectiveDecisionCouncilCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    council_wisdom_score: Number(d.council_wisdom_score ?? 0),
    active_workspaces: Number(d.active_workspaces ?? 0),
    perspectives: Number(d.perspectives ?? 0),
    human_perspectives: Number(d.human_perspectives ?? 0),
    companion_perspectives: Number(d.companion_perspectives ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required ?? true),
    council_center_enabled: Boolean(d.council_center_enabled ?? true),
    implementation_blueprint_phase137: parseBlueprintMeta(d.implementation_blueprint_phase137),
    collective_decision_council_mission:
      typeof d.collective_decision_council_mission === "string"
        ? d.collective_decision_council_mission
        : undefined,
    collective_decision_council_abos_principle:
      typeof d.collective_decision_council_abos_principle === "string"
        ? d.collective_decision_council_abos_principle
        : undefined,
    collective_decision_council_engagement_summary: parseEngagementSummary(
      d.collective_decision_council_engagement_summary
    ),
    collective_decision_council_vision_note:
      typeof d.collective_decision_council_vision_note === "string"
        ? d.collective_decision_council_vision_note
        : undefined,
  };
}

export function parseCollectiveDecisionCouncilDashboard(data: unknown): CollectiveDecisionCouncilDashboard {
  const d = (data ?? {}) as Record<string, unknown>;

  return {
    has_customer: Boolean(d.has_customer),
    council_center_enabled: Boolean(d.council_center_enabled ?? true),
    disagreement_framework_enabled: Boolean(d.disagreement_framework_enabled ?? true),
    companion_advisory_enabled: Boolean(d.companion_advisory_enabled ?? true),
    stakeholder_mapping_enabled: Boolean(d.stakeholder_mapping_enabled ?? true),
    transparency_records_enabled: Boolean(d.transparency_records_enabled ?? true),
    council_memory_enabled: Boolean(d.council_memory_enabled ?? true),
    human_oversight_required: Boolean(d.human_oversight_required ?? true),
    default_governance_tier:
      typeof d.default_governance_tier === "string" ? d.default_governance_tier : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    council_wisdom_score: Number(d.council_wisdom_score ?? 0),
    active_workspaces: Number(d.active_workspaces ?? 0),
    perspectives: Number(d.perspectives ?? 0),
    human_perspectives: Number(d.human_perspectives ?? 0),
    companion_perspectives: Number(d.companion_perspectives ?? 0),
    stakeholder_impacts: Number(d.stakeholder_impacts ?? 0),
    transparency_records: Number(d.transparency_records ?? 0),
    council_memory_entries: Number(d.council_memory_entries ?? 0),
    workspaces: Array.isArray(d.workspaces) ? (d.workspaces as CouncilWorkspace[]) : [],
    perspectives_list: Array.isArray(d.perspectives_list)
      ? (d.perspectives_list as CouncilPerspective[])
      : [],
    stakeholder_impacts_list: Array.isArray(d.stakeholder_impacts_list)
      ? (d.stakeholder_impacts_list as StakeholderImpact[])
      : [],
    transparency_records_list: Array.isArray(d.transparency_records_list)
      ? (d.transparency_records_list as TransparencyRecord[])
      : [],
    council_memory_list: Array.isArray(d.council_memory_list)
      ? (d.council_memory_list as CouncilMemoryEntry[])
      : [],
    perspective_type_scaffolds: parseRecordArray(d.perspective_type_scaffolds),
    stakeholder_group_scaffolds: parseRecordArray(d.stakeholder_group_scaffolds),
    disagreement_principles: parseRecordArray(d.disagreement_principles),
    council_participant_roles: parseRecordArray(d.council_participant_roles),
    integration_links: parseIntegrationLinks(d.integration_links ?? d.cdccbp137_integration_links),
    implementation_blueprint_phase137: parseBlueprintMeta(d.implementation_blueprint_phase137),
    collective_decision_council_blueprint: parseBlueprintBlock(d.collective_decision_council_blueprint),
    collective_decision_council_mission:
      typeof d.collective_decision_council_mission === "string"
        ? d.collective_decision_council_mission
        : undefined,
    collective_decision_council_philosophy:
      typeof d.collective_decision_council_philosophy === "string"
        ? d.collective_decision_council_philosophy
        : undefined,
    collective_decision_council_abos_principle:
      typeof d.collective_decision_council_abos_principle === "string"
        ? d.collective_decision_council_abos_principle
        : undefined,
    collective_decision_council_objectives: parseObjectives(d.collective_decision_council_objectives),
    collective_decision_center: d.collective_decision_center as Record<string, unknown> | undefined,
    human_companion_council_model: d.human_companion_council_model as Record<string, unknown> | undefined,
    decision_perspective_engine: d.decision_perspective_engine as Record<string, unknown> | undefined,
    companion_advisory_engine: d.companion_advisory_engine as Record<string, unknown> | undefined,
    stakeholder_impact_review: d.stakeholder_impact_review as Record<string, unknown> | undefined,
    disagreement_framework: d.disagreement_framework as Record<string, unknown> | undefined,
    decision_transparency_engine: d.decision_transparency_engine as Record<string, unknown> | undefined,
    council_memory_engine: d.council_memory_engine as Record<string, unknown> | undefined,
    companion_limitations: d.companion_limitations as Record<string, unknown> | undefined,
    self_love_connection: d.self_love_connection as Record<string, unknown> | undefined,
    security_requirements: parseRecordArray(d.security_requirements),
    cdccbp137_integration_links: parseIntegrationLinks(d.cdccbp137_integration_links),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    success_criteria: parseSuccessCriteria(d.success_criteria),
    success_metrics: parseRecordArray(d.success_metrics),
    vision_phrases: Array.isArray(d.vision_phrases) ? (d.vision_phrases as string[]) : undefined,
    collective_decision_council_vision:
      typeof d.collective_decision_council_vision === "string"
        ? d.collective_decision_council_vision
        : undefined,
    dogfooding: typeof d.dogfooding === "string" ? d.dogfooding : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
  };
}
