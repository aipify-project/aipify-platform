import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  ImplementationBlueprintMeta,
  IntegrationLink,
  JointOperationsBlueprint,
  JointOperationsCard,
  JointOperationsDashboard,
  JointOperationsEngagementSummary,
  JointPartnership,
  JointSharedObjective,
  JointSharedWorkspace,
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

function parseEngagementSummary(data: unknown): JointOperationsEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as JointOperationsEngagementSummary;
}

function parseBlueprintBlock(data: unknown): JointOperationsBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as JointOperationsBlueprint;
}

function parsePartnerships(data: unknown): JointPartnership[] {
  if (!Array.isArray(data)) return [];
  return data as JointPartnership[];
}

function parseWorkspaces(data: unknown): JointSharedWorkspace[] {
  if (!Array.isArray(data)) return [];
  return data as JointSharedWorkspace[];
}

function parseObjectivesList(data: unknown): JointSharedObjective[] {
  if (!Array.isArray(data)) return [];
  return data as JointSharedObjective[];
}

export function parseJointOperationsCard(data: unknown): JointOperationsCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    collaboration_score: Number(d.collaboration_score ?? 0),
    enabled: Boolean(d.enabled),
    default_governance_tier:
      typeof d.default_governance_tier === "string" ? d.default_governance_tier : undefined,
    partnerships_count: Number(d.partnerships_count ?? 0),
    active_workspaces_count: Number(d.active_workspaces_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    executive_approval_required: Boolean(d.executive_approval_required),
    participation_opt_in_required: Boolean(d.participation_opt_in_required),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    joint_operations_mission:
      typeof d.joint_operations_mission === "string" ? d.joint_operations_mission : undefined,
    joint_operations_abos_principle:
      typeof d.joint_operations_abos_principle === "string"
        ? d.joint_operations_abos_principle
        : undefined,
    joint_operations_engagement_summary: parseEngagementSummary(d.joint_operations_engagement_summary),
    joint_operations_note:
      typeof d.joint_operations_note === "string" ? d.joint_operations_note : undefined,
    joint_operations_vision_note:
      typeof d.joint_operations_vision_note === "string" ? d.joint_operations_vision_note : undefined,
  };
}

export function parseJointOperationsDashboard(data: unknown): JointOperationsDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  const securityMeta = d.security_requirements_meta;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    default_governance_tier:
      typeof d.default_governance_tier === "string" ? d.default_governance_tier : undefined,
    executive_approval_required: Boolean(d.executive_approval_required),
    participation_opt_in_required: Boolean(d.participation_opt_in_required),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    collaboration_score: Number(d.collaboration_score ?? 0),
    partnerships_count: Number(d.partnerships_count ?? 0),
    active_partnerships_count: Number(d.active_partnerships_count ?? 0),
    shared_workspaces_count: Number(d.shared_workspaces_count ?? 0),
    active_workspaces_count: Number(d.active_workspaces_count ?? 0),
    shared_objectives_count: Number(d.shared_objectives_count ?? 0),
    partnerships: parsePartnerships(d.partnerships),
    shared_workspaces: parseWorkspaces(d.shared_workspaces),
    shared_objectives: parseObjectivesList(d.shared_objectives),
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    joint_operations_blueprint: parseBlueprintBlock(d.joint_operations_blueprint),
    joint_operations_mission:
      typeof d.joint_operations_mission === "string" ? d.joint_operations_mission : undefined,
    joint_operations_philosophy:
      typeof d.joint_operations_philosophy === "string" ? d.joint_operations_philosophy : undefined,
    joint_operations_abos_principle:
      typeof d.joint_operations_abos_principle === "string"
        ? d.joint_operations_abos_principle
        : undefined,
    joint_operations_objectives: parseObjectives(d.joint_operations_objectives),
    joint_operations_center_meta:
      typeof d.joint_operations_center_meta === "object" && d.joint_operations_center_meta
        ? (d.joint_operations_center_meta as Record<string, unknown>)
        : undefined,
    collaboration_framework_engine_meta:
      typeof d.collaboration_framework_engine_meta === "object" &&
      d.collaboration_framework_engine_meta
        ? (d.collaboration_framework_engine_meta as Record<string, unknown>)
        : undefined,
    shared_workspace_engine_meta:
      typeof d.shared_workspace_engine_meta === "object" && d.shared_workspace_engine_meta
        ? (d.shared_workspace_engine_meta as Record<string, unknown>)
        : undefined,
    joint_governance_engine_meta:
      typeof d.joint_governance_engine_meta === "object" && d.joint_governance_engine_meta
        ? (d.joint_governance_engine_meta as Record<string, unknown>)
        : undefined,
    cross_organizational_companion_engine_meta:
      typeof d.cross_organizational_companion_engine_meta === "object" &&
      d.cross_organizational_companion_engine_meta
        ? (d.cross_organizational_companion_engine_meta as Record<string, unknown>)
        : undefined,
    partner_experience_engine_meta:
      typeof d.partner_experience_engine_meta === "object" && d.partner_experience_engine_meta
        ? (d.partner_experience_engine_meta as Record<string, unknown>)
        : undefined,
    shared_objectives_framework_meta:
      typeof d.shared_objectives_framework_meta === "object" && d.shared_objectives_framework_meta
        ? (d.shared_objectives_framework_meta as Record<string, unknown>)
        : undefined,
    collaboration_memory_engine_meta:
      typeof d.collaboration_memory_engine_meta === "object" &&
      d.collaboration_memory_engine_meta
        ? (d.collaboration_memory_engine_meta as Record<string, unknown>)
        : undefined,
    companion_limitations_meta: parseLimitationPrinciples(d.companion_limitations_meta),
    self_love_connection_meta:
      typeof d.self_love_connection_meta === "object" && d.self_love_connection_meta
        ? (d.self_love_connection_meta as Record<string, unknown>)
        : undefined,
    security_requirements_meta:
      typeof securityMeta === "object" && securityMeta
        ? (securityMeta as Record<string, unknown>)
        : undefined,
    cojobp143_integration_links: parseIntegrationLinks(d.cojobp143_integration_links),
    joint_operations_engagement_summary: parseEngagementSummary(d.joint_operations_engagement_summary),
    joint_operations_success_criteria: parseSuccessCriteria(d.joint_operations_success_criteria),
    joint_operations_vision:
      typeof d.joint_operations_vision === "string" ? d.joint_operations_vision : undefined,
    joint_operations_vision_phrases: Array.isArray(d.joint_operations_vision_phrases)
      ? (d.joint_operations_vision_phrases as string[])
      : undefined,
    joint_operations_privacy_note:
      typeof d.joint_operations_privacy_note === "string"
        ? d.joint_operations_privacy_note
        : undefined,
    joint_operations_dogfooding:
      typeof d.joint_operations_dogfooding === "string" ? d.joint_operations_dogfooding : undefined,
    joint_operations_engine_note:
      typeof d.joint_operations_engine_note === "string" ? d.joint_operations_engine_note : undefined,
    joint_operations_distinction_note:
      typeof d.joint_operations_distinction_note === "string"
        ? d.joint_operations_distinction_note
        : undefined,
  };
}
