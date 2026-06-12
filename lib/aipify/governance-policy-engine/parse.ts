import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  BoardMeetingSupport,
  CompanionExample,
  DecisionContinuity,
  DogfoodingBlueprint,
  GovernanceEngagementSummary,
  GovernancePolicyEngineCard,
  GovernancePolicyEngineDashboard,
  GovernancePrinciple,
  ImplementationBlueprintMeta,
  IntegrationLink,
  BoardGovernanceCompanionPhase123Blueprint,
  SelfLoveConnection,
  StrategicOversight,
  TrustConnection,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseBlueprintMeta(data: unknown): ImplementationBlueprintMeta | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImplementationBlueprintMeta;
}

function parseEngagementSummary(data: unknown): GovernanceEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as GovernanceEngagementSummary;
}

function parseObjectBlock<T>(data: unknown): T | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as T;
}

export function parseGovernancePolicyEngineCard(data: unknown): GovernancePolicyEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    active_policies: Number(d.active_policies ?? 0),
    open_violations: Number(d.open_violations ?? 0),
    pending_approvals: Number(d.pending_approvals ?? 0),
    upcoming_reviews: Number(d.upcoming_reviews ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    quality_guardian_blueprint_note:
      typeof d.quality_guardian_blueprint_note === "string" ? d.quality_guardian_blueprint_note : undefined,
    implementation_blueprint_phase67: parseBlueprintMeta(d.implementation_blueprint_phase67),
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
    governance_note: typeof d.governance_note === "string" ? d.governance_note : undefined,
    implementation_blueprint_phase123: parseBlueprintMeta(d.implementation_blueprint_phase123),
    phase123_mission: typeof d.phase123_mission === "string" ? d.phase123_mission : undefined,
    phase123_abos_principle:
      typeof d.phase123_abos_principle === "string" ? d.phase123_abos_principle : undefined,
    phase123_engagement_summary: parseEngagementSummary(d.phase123_engagement_summary),
    phase123_note: typeof d.phase123_note === "string" ? d.phase123_note : undefined,
  };
}

export function parseGovernancePolicyEngineDashboard(
  data: unknown
): GovernancePolicyEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    settings:
      typeof d.settings === "object" && d.settings
        ? (d.settings as GovernancePolicyEngineDashboard["settings"])
        : undefined,
    active_policies: Array.isArray(d.active_policies)
      ? (d.active_policies as GovernancePolicyEngineDashboard["active_policies"])
      : [],
    policy_violations: Array.isArray(d.policy_violations)
      ? (d.policy_violations as GovernancePolicyEngineDashboard["policy_violations"])
      : [],
    upcoming_reviews: Array.isArray(d.upcoming_reviews)
      ? (d.upcoming_reviews as GovernancePolicyEngineDashboard["upcoming_reviews"])
      : [],
    pending_approvals: Array.isArray(d.pending_approvals)
      ? (d.pending_approvals as GovernancePolicyEngineDashboard["pending_approvals"])
      : [],
    pending_approval_count: Number(d.pending_approval_count ?? 0),
    approval_requirements:
      typeof d.approval_requirements === "object" && d.approval_requirements
        ? (d.approval_requirements as GovernancePolicyEngineDashboard["approval_requirements"])
        : undefined,
    governance_recommendations: Array.isArray(d.governance_recommendations)
      ? (d.governance_recommendations as GovernancePolicyEngineDashboard["governance_recommendations"])
      : undefined,
    policy_categories: Array.isArray(d.policy_categories)
      ? (d.policy_categories as GovernancePolicyEngineDashboard["policy_categories"])
      : undefined,
    autonomy_levels: Array.isArray(d.autonomy_levels)
      ? (d.autonomy_levels as GovernancePolicyEngineDashboard["autonomy_levels"])
      : undefined,
    integrates_with: Array.isArray(d.integrates_with)
      ? (d.integrates_with as string[])
      : undefined,
    implementation_blueprint_phase67: parseBlueprintMeta(d.implementation_blueprint_phase67),
    board_governance_companion_note:
      typeof d.board_governance_companion_note === "string" ? d.board_governance_companion_note : undefined,
    blueprint_distinction_note:
      typeof d.blueprint_distinction_note === "string" ? d.blueprint_distinction_note : undefined,
    blueprint_mission: typeof d.blueprint_mission === "string" ? d.blueprint_mission : undefined,
    blueprint_philosophy: typeof d.blueprint_philosophy === "string" ? d.blueprint_philosophy : undefined,
    blueprint_abos_principle:
      typeof d.blueprint_abos_principle === "string" ? d.blueprint_abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    blueprint_objectives: parseRecordList<BlueprintObjective>(d.blueprint_objectives),
    board_preparation: parseRecordList<CompanionExample>(d.board_preparation),
    board_meeting_support: parseObjectBlock<BoardMeetingSupport>(d.board_meeting_support),
    strategic_oversight: parseObjectBlock<StrategicOversight>(d.strategic_oversight),
    risk_awareness: parseRecordList<CompanionExample>(d.risk_awareness),
    blueprint_governance_principles: parseRecordList<GovernancePrinciple>(d.blueprint_governance_principles),
    decision_continuity: parseObjectBlock<DecisionContinuity>(d.decision_continuity),
    self_love_connection: parseObjectBlock<SelfLoveConnection>(d.self_love_connection),
    trust_connection: parseObjectBlock<TrustConnection>(d.trust_connection),
    dogfooding: parseObjectBlock<DogfoodingBlueprint>(d.dogfooding),
    blueprint_integration_links: parseRecordList<IntegrationLink>(d.blueprint_integration_links),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    success_criteria: parseRecordList<AbosSuccessCriterion>(d.success_criteria),
    vision_phrases: Array.isArray(d.vision_phrases) ? (d.vision_phrases as string[]) : undefined,
    metadata_note: typeof d.metadata_note === "string" ? d.metadata_note : undefined,
    implementation_blueprint_phase123: parseObjectBlock<BoardGovernanceCompanionPhase123Blueprint>(
      d.implementation_blueprint_phase123
    ),
    board_governance_companion_phase123_note:
      typeof d.board_governance_companion_phase123_note === "string"
        ? d.board_governance_companion_phase123_note
        : undefined,
  };
}
