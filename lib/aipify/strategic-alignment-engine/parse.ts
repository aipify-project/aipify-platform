import type {
  AbosSuccessCriterion,
  AlignmentQuestions,
  BlueprintObjective,
  CompanionGuidance,
  CrossFunctionalVisibility,
  DogfoodingBlueprint,
  GoalCommunication,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LeadershipInsights,
  OrganizationalAlignmentEngagementSummary,
  SelfLoveConnection,
  StrategicAlignmentEngineCard,
  StrategicAlignmentEngineDashboard,
  StrategicAlignmentReportExport,
  StrategicAlignmentSnapshot,
  StrategicCascading,
  StrategicObjective,
  StrategicObjectiveLink,
  StrategicReview,
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

function parseEngagementSummary(data: unknown): OrganizationalAlignmentEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as OrganizationalAlignmentEngagementSummary;
}

export function parseStrategicAlignmentEngineCard(data: unknown): StrategicAlignmentEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    active_objectives: typeof d.active_objectives === "number" ? d.active_objectives : undefined,
    misaligned_count: typeof d.misaligned_count === "number" ? d.misaligned_count : undefined,
    implementation_blueprint_phase68: parseBlueprintMeta(d.implementation_blueprint_phase68),
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
    alignment_note: typeof d.alignment_note === "string" ? d.alignment_note : undefined,
    ...d,
  } as StrategicAlignmentEngineCard;
}

export function parseStrategicAlignmentEngineDashboard(
  data: unknown
): StrategicAlignmentEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    objectives: parseRecordList<StrategicObjective>(d.objectives),
    links: parseRecordList<StrategicObjectiveLink>(d.links),
    reviews: parseRecordList<StrategicReview>(d.reviews),
    snapshots: parseRecordList<StrategicAlignmentSnapshot>(d.snapshots),
    executive_summary:
      typeof d.executive_summary === "object" && d.executive_summary
        ? (d.executive_summary as Record<string, unknown>)
        : undefined,
    integration_notes:
      typeof d.integration_notes === "object" && d.integration_notes
        ? (d.integration_notes as Record<string, string>)
        : undefined,
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    implementation_blueprint_phase68: parseBlueprintMeta(d.implementation_blueprint_phase68),
    organizational_alignment_note:
      typeof d.organizational_alignment_note === "string" ? d.organizational_alignment_note : undefined,
    blueprint_distinction_note:
      typeof d.blueprint_distinction_note === "string" ? d.blueprint_distinction_note : undefined,
    blueprint_mission: typeof d.blueprint_mission === "string" ? d.blueprint_mission : undefined,
    blueprint_philosophy: typeof d.blueprint_philosophy === "string" ? d.blueprint_philosophy : undefined,
    blueprint_abos_principle:
      typeof d.blueprint_abos_principle === "string" ? d.blueprint_abos_principle : undefined,
    blueprint_objectives: parseRecordList<BlueprintObjective>(d.blueprint_objectives),
    alignment_questions:
      typeof d.alignment_questions === "object" && d.alignment_questions
        ? (d.alignment_questions as AlignmentQuestions)
        : undefined,
    strategic_cascading:
      typeof d.strategic_cascading === "object" && d.strategic_cascading
        ? (d.strategic_cascading as StrategicCascading)
        : undefined,
    cross_functional_visibility:
      typeof d.cross_functional_visibility === "object" && d.cross_functional_visibility
        ? (d.cross_functional_visibility as CrossFunctionalVisibility)
        : undefined,
    companion_guidance:
      typeof d.companion_guidance === "object" && d.companion_guidance
        ? (d.companion_guidance as CompanionGuidance)
        : undefined,
    goal_communication:
      typeof d.goal_communication === "object" && d.goal_communication
        ? (d.goal_communication as GoalCommunication)
        : undefined,
    self_love_connection:
      typeof d.self_love_connection === "object" && d.self_love_connection
        ? (d.self_love_connection as SelfLoveConnection)
        : undefined,
    leadership_insights:
      typeof d.leadership_insights === "object" && d.leadership_insights
        ? (d.leadership_insights as LeadershipInsights)
        : undefined,
    trust_connection:
      typeof d.trust_connection === "object" && d.trust_connection
        ? (d.trust_connection as TrustConnection)
        : undefined,
    dogfooding:
      typeof d.dogfooding === "object" && d.dogfooding
        ? (d.dogfooding as DogfoodingBlueprint)
        : undefined,
    blueprint_integration_links: parseRecordList<IntegrationLink>(d.blueprint_integration_links),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    success_criteria: parseRecordList<AbosSuccessCriterion>(d.success_criteria),
    vision_phrases: Array.isArray(d.vision_phrases) ? (d.vision_phrases as string[]) : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    ...d,
  } as StrategicAlignmentEngineDashboard;
}

export function parseStrategicAlignmentReportExport(data: unknown): StrategicAlignmentReportExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    objective:
      typeof d.objective === "object" && d.objective
        ? (d.objective as StrategicObjective)
        : undefined,
    objectives: parseRecordList<StrategicObjective>(d.objectives),
    links: parseRecordList<StrategicObjectiveLink>(d.links),
    reviews: parseRecordList<StrategicReview>(d.reviews),
    snapshots: parseRecordList<StrategicAlignmentSnapshot>(d.snapshots),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    ...d,
  } as StrategicAlignmentReportExport;
}
