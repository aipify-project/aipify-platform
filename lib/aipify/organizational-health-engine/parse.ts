import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  DogfoodingBlueprint,
  HealthDomain,
  HealthEngagementSummary,
  HealthObservation,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LeadershipInsights,
  OrganizationalHealthEngineCard,
  OrganizationalHealthEngineDashboard,
  OrganizationalHealthIntervention,
  OrganizationalHealthReportExport,
  OrganizationalHealthScore,
  PrivacyPrinciples,
  RecognitionConnection,
  SelfLoveConnection,
  TrustConnection,
  WorkloadAwareness,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseBlueprintMeta(data: unknown): ImplementationBlueprintMeta | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImplementationBlueprintMeta;
}

function parseEngagementSummary(data: unknown): HealthEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as HealthEngagementSummary;
}

export function parseOrganizationalHealthEngineCard(data: unknown): OrganizationalHealthEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    overall_score: typeof d.overall_score === "number" ? d.overall_score : undefined,
    overall_status: typeof d.overall_status === "string" ? d.overall_status : undefined,
    categories_measured: typeof d.categories_measured === "number" ? d.categories_measured : undefined,
    pending_interventions: typeof d.pending_interventions === "number" ? d.pending_interventions : undefined,
    implementation_blueprint_phase61: parseBlueprintMeta(d.implementation_blueprint_phase61),
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
    health_note: typeof d.health_note === "string" ? d.health_note : undefined,
    ...d,
  } as OrganizationalHealthEngineCard;
}

export function parseOrganizationalHealthEngineDashboard(
  data: unknown
): OrganizationalHealthEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    scores: parseRecordList<OrganizationalHealthScore>(d.scores),
    interventions: parseRecordList<OrganizationalHealthIntervention>(d.interventions),
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
    settings:
      typeof d.settings === "object" && d.settings
        ? (d.settings as Record<string, unknown>)
        : undefined,
    implementation_blueprint_phase61: parseBlueprintMeta(d.implementation_blueprint_phase61),
    organizational_health_note:
      typeof d.organizational_health_note === "string" ? d.organizational_health_note : undefined,
    blueprint_distinction_note:
      typeof d.blueprint_distinction_note === "string" ? d.blueprint_distinction_note : undefined,
    blueprint_mission: typeof d.blueprint_mission === "string" ? d.blueprint_mission : undefined,
    blueprint_philosophy: typeof d.blueprint_philosophy === "string" ? d.blueprint_philosophy : undefined,
    blueprint_abos_principle:
      typeof d.blueprint_abos_principle === "string" ? d.blueprint_abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    blueprint_objectives: parseRecordList<BlueprintObjective>(d.blueprint_objectives),
    health_domains: parseRecordList<HealthDomain>(d.health_domains),
    health_observations: parseRecordList<HealthObservation>(d.health_observations),
    workload_awareness:
      typeof d.workload_awareness === "object" && d.workload_awareness
        ? (d.workload_awareness as WorkloadAwareness)
        : undefined,
    recognition_connection:
      typeof d.recognition_connection === "object" && d.recognition_connection
        ? (d.recognition_connection as RecognitionConnection)
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
    privacy_principles:
      typeof d.privacy_principles === "object" && d.privacy_principles
        ? (d.privacy_principles as PrivacyPrinciples)
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
  } as OrganizationalHealthEngineDashboard;
}

export function parseOrganizationalHealthReportExport(data: unknown): OrganizationalHealthReportExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    report_type: typeof d.report_type === "string" ? d.report_type : undefined,
    scores: parseRecordList<OrganizationalHealthScore>(d.scores),
    interventions: parseRecordList<OrganizationalHealthIntervention>(d.interventions),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    ...d,
  } as OrganizationalHealthReportExport;
}
