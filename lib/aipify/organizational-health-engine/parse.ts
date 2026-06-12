import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  CompanionCheckIns,
  DogfoodingBlueprint,
  EmployeeExperienceQuestions,
  EmployeeExperienceWellbeingBlueprint,
  EmployeeJourneyConnection,
  HealthDomain,
  HealthEngagementSummary,
  HealthObservation,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LeadershipConnection,
  LeadershipInsights,
  OrganizationalHealthEngineCard,
  OrganizationalHealthEngineDashboard,
  OrganizationalHealthIntervention,
  OrganizationalHealthReportExport,
  OrganizationalHealthScore,
  PrivacyPrinciples,
  RecognitionConnection,
  RecognitionPractices,
  SelfLoveConnection,
  SelfLoveWellbeingConnection,
  TrustConnection,
  WellbeingEngagementSummary,
  WellbeingTrustConnection,
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

function parseWellbeingEngagementSummary(data: unknown): WellbeingEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as WellbeingEngagementSummary;
}

function parseEmployeeExperienceWellbeingBlueprint(
  data: unknown
): EmployeeExperienceWellbeingBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as EmployeeExperienceWellbeingBlueprint;
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
    implementation_blueprint_phase96: parseBlueprintMeta(d.implementation_blueprint_phase96),
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    wellbeing_engagement_summary: parseWellbeingEngagementSummary(d.wellbeing_engagement_summary),
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
    health_note: typeof d.health_note === "string" ? d.health_note : undefined,
    employee_experience_wellbeing_mission:
      typeof d.employee_experience_wellbeing_mission === "string"
        ? d.employee_experience_wellbeing_mission
        : undefined,
    employee_experience_wellbeing_abos_principle:
      typeof d.employee_experience_wellbeing_abos_principle === "string"
        ? d.employee_experience_wellbeing_abos_principle
        : undefined,
    employee_experience_wellbeing_note:
      typeof d.employee_experience_wellbeing_note === "string"
        ? d.employee_experience_wellbeing_note
        : undefined,
    employee_experience_wellbeing_vision_note:
      typeof d.employee_experience_wellbeing_vision_note === "string"
        ? d.employee_experience_wellbeing_vision_note
        : undefined,
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
    implementation_blueprint_phase96: parseBlueprintMeta(d.implementation_blueprint_phase96),
    employee_experience_wellbeing_engine_note:
      typeof d.employee_experience_wellbeing_engine_note === "string"
        ? d.employee_experience_wellbeing_engine_note
        : undefined,
    employee_experience_wellbeing_blueprint: parseEmployeeExperienceWellbeingBlueprint(
      d.employee_experience_wellbeing_blueprint
    ),
    employee_experience_wellbeing_distinction_note:
      typeof d.employee_experience_wellbeing_distinction_note === "string"
        ? d.employee_experience_wellbeing_distinction_note
        : undefined,
    employee_experience_wellbeing_mission:
      typeof d.employee_experience_wellbeing_mission === "string"
        ? d.employee_experience_wellbeing_mission
        : undefined,
    employee_experience_wellbeing_philosophy:
      typeof d.employee_experience_wellbeing_philosophy === "string"
        ? d.employee_experience_wellbeing_philosophy
        : undefined,
    employee_experience_wellbeing_abos_principle:
      typeof d.employee_experience_wellbeing_abos_principle === "string"
        ? d.employee_experience_wellbeing_abos_principle
        : undefined,
    employee_experience_wellbeing_objectives: parseRecordList<BlueprintObjective>(
      d.employee_experience_wellbeing_objectives
    ),
    employee_experience_questions:
      typeof d.employee_experience_questions === "object" && d.employee_experience_questions
        ? (d.employee_experience_questions as EmployeeExperienceQuestions)
        : undefined,
    wellbeing_observations: parseRecordList<HealthObservation>(d.wellbeing_observations),
    wellbeing_recognition_practices:
      typeof d.wellbeing_recognition_practices === "object" && d.wellbeing_recognition_practices
        ? (d.wellbeing_recognition_practices as RecognitionPractices)
        : undefined,
    companion_check_ins:
      typeof d.companion_check_ins === "object" && d.companion_check_ins
        ? (d.companion_check_ins as CompanionCheckIns)
        : undefined,
    wellbeing_self_love_connection:
      typeof d.wellbeing_self_love_connection === "object" && d.wellbeing_self_love_connection
        ? (d.wellbeing_self_love_connection as SelfLoveWellbeingConnection)
        : undefined,
    wellbeing_leadership_connection:
      typeof d.wellbeing_leadership_connection === "object" && d.wellbeing_leadership_connection
        ? (d.wellbeing_leadership_connection as LeadershipConnection)
        : undefined,
    employee_journey_connection:
      typeof d.employee_journey_connection === "object" && d.employee_journey_connection
        ? (d.employee_journey_connection as EmployeeJourneyConnection)
        : undefined,
    wellbeing_trust_connection:
      typeof d.wellbeing_trust_connection === "object" && d.wellbeing_trust_connection
        ? (d.wellbeing_trust_connection as WellbeingTrustConnection)
        : undefined,
    wellbeing_privacy_principles:
      typeof d.wellbeing_privacy_principles === "object" && d.wellbeing_privacy_principles
        ? (d.wellbeing_privacy_principles as PrivacyPrinciples)
        : undefined,
    wellbeing_dogfooding:
      typeof d.wellbeing_dogfooding === "object" && d.wellbeing_dogfooding
        ? (d.wellbeing_dogfooding as DogfoodingBlueprint)
        : undefined,
    wellbeing_integration_links: parseRecordList<IntegrationLink>(d.wellbeing_integration_links),
    wellbeing_engagement_summary: parseWellbeingEngagementSummary(d.wellbeing_engagement_summary),
    wellbeing_success_criteria: parseRecordList<AbosSuccessCriterion>(d.wellbeing_success_criteria),
    employee_experience_wellbeing_vision:
      typeof d.employee_experience_wellbeing_vision === "string"
        ? d.employee_experience_wellbeing_vision
        : undefined,
    employee_experience_wellbeing_vision_phrases: Array.isArray(d.employee_experience_wellbeing_vision_phrases)
      ? (d.employee_experience_wellbeing_vision_phrases as string[])
      : undefined,
    employee_experience_wellbeing_privacy_note:
      typeof d.employee_experience_wellbeing_privacy_note === "string"
        ? d.employee_experience_wellbeing_privacy_note
        : undefined,
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
