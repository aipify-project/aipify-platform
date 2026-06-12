import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  CompanionWorkforceBlueprint,
  CompanionWorkforceCard,
  CompanionWorkforceDashboard,
  CompanionWorkforceEngagementSummary,
  ImplementationBlueprintMeta,
  IntegrationLink,
  WorkforceCollaboration,
  WorkforceConflict,
  WorkforceMember,
  WorkforceRoutingRule,
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

function parseEngagementSummary(data: unknown): CompanionWorkforceEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CompanionWorkforceEngagementSummary;
}

function parseBlueprintBlock(data: unknown): CompanionWorkforceBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CompanionWorkforceBlueprint;
}

function parseRecordArray(data: unknown): Record<string, unknown>[] {
  if (!Array.isArray(data)) return [];
  return data as Record<string, unknown>[];
}

function parseRecordObject(data: unknown): Record<string, unknown> {
  if (typeof data !== "object" || !data) return {};
  return data as Record<string, unknown>;
}

export function parseCompanionWorkforceCard(data: unknown): CompanionWorkforceCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    workforce_score: Number(d.workforce_score ?? 0),
    members_active: Number(d.members_active ?? 0),
    collaborations_active: Number(d.collaborations_active ?? 0),
    conflicts_pending: Number(d.conflicts_pending ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required ?? true),
    workforce_center_enabled: Boolean(d.workforce_center_enabled ?? true),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    companion_workforce_mission:
      typeof d.companion_workforce_mission === "string" ? d.companion_workforce_mission : undefined,
    companion_workforce_abos_principle:
      typeof d.companion_workforce_abos_principle === "string"
        ? d.companion_workforce_abos_principle
        : undefined,
    companion_workforce_engagement_summary: parseEngagementSummary(d.companion_workforce_engagement_summary),
    companion_workforce_note:
      typeof d.companion_workforce_note === "string" ? d.companion_workforce_note : undefined,
    companion_workforce_vision_note:
      typeof d.companion_workforce_vision_note === "string" ? d.companion_workforce_vision_note : undefined,
  };
}

export function parseCompanionWorkforceDashboard(data: unknown): CompanionWorkforceDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    workforce_center_enabled: Boolean(d.workforce_center_enabled ?? true),
    collaboration_enabled: Boolean(d.collaboration_enabled ?? true),
    conflict_review_required: Boolean(d.conflict_review_required ?? true),
    human_oversight_required: Boolean(d.human_oversight_required ?? true),
    default_governance_tier:
      typeof d.default_governance_tier === "string" ? d.default_governance_tier : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    workforce_score: Number(d.workforce_score ?? 0),
    members_active: Number(d.members_active ?? 0),
    collaborations_active: Number(d.collaborations_active ?? 0),
    routing_rules_active: Number(d.routing_rules_active ?? 0),
    conflicts_pending: Number(d.conflicts_pending ?? 0),
    members: Array.isArray(d.members) ? (d.members as WorkforceMember[]) : [],
    collaborations: Array.isArray(d.collaborations) ? (d.collaborations as WorkforceCollaboration[]) : [],
    routing_rules: Array.isArray(d.routing_rules) ? (d.routing_rules as WorkforceRoutingRule[]) : [],
    conflicts: Array.isArray(d.conflicts) ? (d.conflicts as WorkforceConflict[]) : [],
    companion_workforce_center: parseRecordArray(d.companion_workforce_center),
    companion_roles_meta: parseRecordArray(d.companion_roles_meta),
    collaboration_model: parseRecordArray(d.collaboration_model),
    workforce_orchestration: parseRecordArray(d.workforce_orchestration),
    responsibility_framework: parseRecordArray(d.responsibility_framework),
    human_collaboration_model: parseRecordArray(d.human_collaboration_model),
    companion_health_engine: parseRecordObject(d.companion_health_engine),
    conflict_management: parseRecordArray(d.conflict_management),
    companion_limitations: parseRecordArray(d.companion_limitations),
    self_love_connection: parseRecordArray(d.self_love_connection),
    security_requirements: parseRecordArray(d.security_requirements),
    integration_links: parseIntegrationLinks(d.integration_links ?? d.ccwfbp132_cross_links),
    implementation_blueprint: parseBlueprintBlock(d.implementation_blueprint),
    companion_workforce_blueprint: parseBlueprintBlock(d.companion_workforce_blueprint),
    companion_workforce_mission:
      typeof d.companion_workforce_mission === "string" ? d.companion_workforce_mission : undefined,
    companion_workforce_philosophy:
      typeof d.companion_workforce_philosophy === "string" ? d.companion_workforce_philosophy : undefined,
    companion_workforce_abos_principle:
      typeof d.companion_workforce_abos_principle === "string"
        ? d.companion_workforce_abos_principle
        : undefined,
    companion_workforce_objectives: parseObjectives(d.companion_workforce_objectives),
    companion_workforce_engagement_summary: parseEngagementSummary(d.companion_workforce_engagement_summary),
    companion_workforce_success_criteria: parseSuccessCriteria(d.companion_workforce_success_criteria),
    ccwfbp132_cross_links: parseIntegrationLinks(d.ccwfbp132_cross_links),
    companion_workforce_vision:
      typeof d.companion_workforce_vision === "string" ? d.companion_workforce_vision : undefined,
    companion_workforce_vision_phrases: Array.isArray(d.companion_workforce_vision_phrases)
      ? (d.companion_workforce_vision_phrases as string[])
      : undefined,
    companion_workforce_privacy_note:
      typeof d.companion_workforce_privacy_note === "string" ? d.companion_workforce_privacy_note : undefined,
    companion_workforce_engine_note:
      typeof d.companion_workforce_engine_note === "string" ? d.companion_workforce_engine_note : undefined,
  };
}
