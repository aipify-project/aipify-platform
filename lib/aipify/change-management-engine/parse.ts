import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  BlueprintSection,
  ChangeAdoptionMetricRecord,
  ChangeCommunicationPlanRecord,
  ChangeEngagementSummary,
  ChangeImpactAssessmentRecord,
  ChangeInitiativeRecord,
  ChangeManagementEngineCard,
  ChangeManagementEngineDashboard,
  ChangeMilestoneRecord,
  CompanionGuidanceExample,
  DogfoodingBlueprint,
  ImplementationBlueprintMeta,
  IntegrationLink,
  TransformationOrchestrationPhase127Blueprint,
  OrganizationalRenewalPhase155Blueprint,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseBlueprintMeta(data: unknown): ImplementationBlueprintMeta | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImplementationBlueprintMeta;
}

function parseEngagementSummary(data: unknown): ChangeEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ChangeEngagementSummary;
}

function parseBlueprintSection(data: unknown): BlueprintSection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as BlueprintSection;
}

function parseDogfooding(data: unknown): DogfoodingBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as DogfoodingBlueprint;
}

function parsePhase127Blueprint(data: unknown): TransformationOrchestrationPhase127Blueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as TransformationOrchestrationPhase127Blueprint;
}

function parsePhase155Blueprint(data: unknown): OrganizationalRenewalPhase155Blueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as OrganizationalRenewalPhase155Blueprint;
}

export function parseChangeManagementEngineCard(data: unknown): ChangeManagementEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    active_initiatives: typeof d.active_initiatives === "number" ? d.active_initiatives : undefined,
    pending_milestones: typeof d.pending_milestones === "number" ? d.pending_milestones : undefined,
    implementation_blueprint_phase62: parseBlueprintMeta(d.implementation_blueprint_phase62),
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
    change_note: typeof d.change_note === "string" ? d.change_note : undefined,
    implementation_blueprint_phase127: parseBlueprintMeta(d.implementation_blueprint_phase127),
    phase127_mission: typeof d.phase127_mission === "string" ? d.phase127_mission : undefined,
    phase127_abos_principle: typeof d.phase127_abos_principle === "string" ? d.phase127_abos_principle : undefined,
    phase127_engagement_summary: parseEngagementSummary(d.phase127_engagement_summary),
    phase127_note: typeof d.phase127_note === "string" ? d.phase127_note : undefined,
    implementation_blueprint_phase155: parseBlueprintMeta(d.implementation_blueprint_phase155),
    phase155_mission: typeof d.phase155_mission === "string" ? d.phase155_mission : undefined,
    phase155_abos_principle: typeof d.phase155_abos_principle === "string" ? d.phase155_abos_principle : undefined,
    phase155_engagement_summary: parseEngagementSummary(d.phase155_engagement_summary),
    phase155_note: typeof d.phase155_note === "string" ? d.phase155_note : undefined,
    ...d,
  } as ChangeManagementEngineCard;
}

export function parseChangeManagementEngineDashboard(data: unknown): ChangeManagementEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    initiatives: parseRecordList<ChangeInitiativeRecord>(d.initiatives),
    impact_assessments: parseRecordList<ChangeImpactAssessmentRecord>(d.impact_assessments),
    communication_plans: parseRecordList<ChangeCommunicationPlanRecord>(d.communication_plans),
    adoption_metrics: parseRecordList<ChangeAdoptionMetricRecord>(d.adoption_metrics),
    milestones: parseRecordList<ChangeMilestoneRecord>(d.milestones),
    integration_notes:
      typeof d.integration_notes === "object" && d.integration_notes
        ? (d.integration_notes as Record<string, string>)
        : undefined,
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    implementation_blueprint_phase62: parseBlueprintMeta(d.implementation_blueprint_phase62),
    change_management_note: typeof d.change_management_note === "string" ? d.change_management_note : undefined,
    blueprint_distinction_note:
      typeof d.blueprint_distinction_note === "string" ? d.blueprint_distinction_note : undefined,
    blueprint_mission: typeof d.blueprint_mission === "string" ? d.blueprint_mission : undefined,
    blueprint_philosophy: typeof d.blueprint_philosophy === "string" ? d.blueprint_philosophy : undefined,
    blueprint_abos_principle:
      typeof d.blueprint_abos_principle === "string" ? d.blueprint_abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    blueprint_objectives: parseRecordList<BlueprintObjective>(d.blueprint_objectives),
    blueprint_change_types: parseRecordList<BlueprintObjective>(d.blueprint_change_types),
    readiness_assessment: parseBlueprintSection(d.readiness_assessment),
    companion_guidance: parseRecordList<CompanionGuidanceExample>(d.companion_guidance),
    communication_support: parseBlueprintSection(d.communication_support),
    adoption_support: parseBlueprintSection(d.adoption_support),
    resistance_awareness: parseBlueprintSection(d.resistance_awareness),
    self_love_connection: parseBlueprintSection(d.self_love_connection),
    leadership_insights: parseBlueprintSection(d.leadership_insights),
    trust_connection: parseBlueprintSection(d.trust_connection),
    dogfooding: parseDogfooding(d.dogfooding),
    blueprint_integration_links: parseRecordList<IntegrationLink>(d.blueprint_integration_links),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    success_criteria: parseRecordList<AbosSuccessCriterion>(d.success_criteria),
    vision_phrases: Array.isArray(d.vision_phrases) ? (d.vision_phrases as string[]) : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    implementation_blueprint_phase127: parsePhase127Blueprint(d.implementation_blueprint_phase127),
    transformation_orchestration_phase127_note:
      typeof d.transformation_orchestration_phase127_note === "string"
        ? d.transformation_orchestration_phase127_note
        : undefined,
    implementation_blueprint_phase155: parsePhase155Blueprint(d.implementation_blueprint_phase155),
    organizational_renewal_phase155_note:
      typeof d.organizational_renewal_phase155_note === "string"
        ? d.organizational_renewal_phase155_note
        : undefined,
    ...d,
  } as ChangeManagementEngineDashboard;
}
