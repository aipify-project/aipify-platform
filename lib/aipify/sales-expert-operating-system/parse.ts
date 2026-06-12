import type {
  BellMoment,
  CoachBellMoments,
  CoachSummary,
  CoachTrustConnection,
  CommunicationCoaching,
  CoachSuccessCriterion,
  CoachDashboardField,
  DailySalesBriefing,
  DemonstrationGuidance,
  FieldSalesCoaching,
  ImplementationBlueprintPhase41,
  ImplementationBlueprintPhase45,
  Leaderboards,
  MilestoneProgress,
  MilestoneRecognition,
  ObjectionHandlingEntry,
  PerformanceDashboardField,
  PerformanceObjective,
  PerformanceSelfLoveConnection,
  PerformanceSuccessCriterion,
  PerformanceSummary,
  PerformanceTrustConnection,
  PersonalPerformanceInsights,
  RecognitionRoses,
  RoleplaySimulation,
  SalesActivityRecommendations,
  SalesCompanionRole,
  SalesExpertCommission,
  SalesExpertCustomer,
  SalesExpertEmail,
  SalesExpertEmailTemplate,
  SalesExpertEngineCard,
  SalesExpertEngineDashboard,
  SalesExpertFollowUp,
  SalesExpertOpportunity,
  SalesExpertSettings,
  SalesTrainingIntegration,
} from "./types";

function parseList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSettings(data: unknown): SalesExpertSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SalesExpertSettings;
}

function parseObject<T>(data: unknown): T | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as T;
}

function parseStringList(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item): item is string => typeof item === "string");
}

function parseSections(data: unknown): SalesExpertEngineDashboard["sections"] {
  if (typeof data !== "object" || !data) return undefined;
  const s = data as Record<string, unknown>;
  return {
    dashboard:
      typeof s.dashboard === "object" && s.dashboard
        ? (s.dashboard as Record<string, unknown>)
        : undefined,
    customers: parseList<SalesExpertCustomer>(s.customers),
    opportunities: parseList<SalesExpertOpportunity>(s.opportunities),
    commissions: parseList<SalesExpertCommission>(s.commissions),
    email_templates: parseList<SalesExpertEmailTemplate>(s.email_templates),
    emails: parseList<SalesExpertEmail>(s.emails),
    follow_ups: parseList<SalesExpertFollowUp>(s.follow_ups),
  };
}

export function parseSalesExpertEngineCard(data: unknown): SalesExpertEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as SalesExpertEngineCard;
}

export function parseSalesExpertEngineDashboard(data: unknown): SalesExpertEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    engine_phase: typeof d.engine_phase === "string" ? d.engine_phase : undefined,
    settings: parseSettings(d.settings),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    sections: parseSections(d.sections),
    official_terminology:
      typeof d.official_terminology === "object" && d.official_terminology
        ? (d.official_terminology as SalesExpertEngineDashboard["official_terminology"])
        : undefined,
    portal_sections: parseList(d.portal_sections),
    blueprint_email_templates: parseList<SalesExpertEmailTemplate>(d.blueprint_email_templates),
    follow_up_cadences: parseList(d.follow_up_cadences),
    implementation_services:
      typeof d.implementation_services === "object" && d.implementation_services
        ? (d.implementation_services as SalesExpertEngineDashboard["implementation_services"])
        : undefined,
    subscription_principles:
      typeof d.subscription_principles === "object" && d.subscription_principles
        ? (d.subscription_principles as SalesExpertEngineDashboard["subscription_principles"])
        : undefined,
    commercial_commission_summary:
      typeof d.commercial_commission_summary === "object" && d.commercial_commission_summary
        ? (d.commercial_commission_summary as Record<string, unknown>)
        : undefined,
    mass_email_supported: d.mass_email_supported === false ? false : Boolean(d.mass_email_supported),
    integration_links: parseList(d.integration_links),
    training_center:
      typeof d.training_center === "object" && d.training_center
        ? (d.training_center as Record<string, unknown>)
        : undefined,
    resource_library:
      typeof d.resource_library === "object" && d.resource_library
        ? (d.resource_library as Record<string, unknown>)
        : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    implementation_blueprint:
      typeof d.implementation_blueprint === "object" && d.implementation_blueprint
        ? (d.implementation_blueprint as Record<string, unknown>)
        : undefined,
    implementation_blueprint_phase41: parseObject<ImplementationBlueprintPhase41>(
      d.implementation_blueprint_phase41,
    ),
    performance_recognition_mission:
      typeof d.performance_recognition_mission === "string" ? d.performance_recognition_mission : undefined,
    performance_recognition_philosophy:
      typeof d.performance_recognition_philosophy === "string" ? d.performance_recognition_philosophy : undefined,
    performance_recognition_abos_principle:
      typeof d.performance_recognition_abos_principle === "string"
        ? d.performance_recognition_abos_principle
        : undefined,
    performance_objectives: parseList<PerformanceObjective>(d.performance_objectives),
    performance_dashboard_fields: parseList<PerformanceDashboardField>(d.performance_dashboard_fields),
    performance_summary: parseObject<PerformanceSummary>(d.performance_summary),
    milestone_recognition: parseList<MilestoneRecognition>(d.milestone_recognition),
    milestone_progress: parseObject<MilestoneProgress>(d.milestone_progress),
    bell_moments: parseList<BellMoment>(d.bell_moments),
    recognition_roses: parseObject<RecognitionRoses>(d.recognition_roses),
    leaderboards: parseObject<Leaderboards>(d.leaderboards),
    performance_self_love_connection: parseObject<PerformanceSelfLoveConnection>(
      d.performance_self_love_connection,
    ),
    performance_trust_connection: parseObject<PerformanceTrustConnection>(d.performance_trust_connection),
    performance_dogfooding: parseObject<Record<string, unknown>>(d.performance_dogfooding),
    performance_vision_phrases: parseStringList(d.performance_vision_phrases),
    performance_integration_links: parseList(d.performance_integration_links),
    performance_blueprint_success_criteria: parseList<PerformanceSuccessCriterion>(
      d.performance_blueprint_success_criteria,
    ),
    performance_distinction_note:
      typeof d.performance_distinction_note === "string" ? d.performance_distinction_note : undefined,
    implementation_blueprint_phase45: parseObject<ImplementationBlueprintPhase45>(
      d.implementation_blueprint_phase45,
    ),
    sales_coach_mission: typeof d.sales_coach_mission === "string" ? d.sales_coach_mission : undefined,
    sales_coach_philosophy:
      typeof d.sales_coach_philosophy === "string" ? d.sales_coach_philosophy : undefined,
    sales_coach_abos_principle:
      typeof d.sales_coach_abos_principle === "string" ? d.sales_coach_abos_principle : undefined,
    sales_companion_roles: parseList<SalesCompanionRole>(d.sales_companion_roles),
    sales_coach_dashboard_fields: parseList<CoachDashboardField>(d.sales_coach_dashboard_fields),
    sales_coach_summary: parseObject<CoachSummary>(d.sales_coach_summary),
    daily_sales_briefing: parseObject<DailySalesBriefing>(d.daily_sales_briefing),
    sales_activity_recommendations: parseObject<SalesActivityRecommendations>(
      d.sales_activity_recommendations,
    ),
    field_sales_coaching: parseObject<FieldSalesCoaching>(d.field_sales_coaching),
    demonstration_guidance: parseObject<DemonstrationGuidance>(d.demonstration_guidance),
    objection_handling_library: parseList<ObjectionHandlingEntry>(d.objection_handling_library),
    communication_coaching: parseObject<CommunicationCoaching>(d.communication_coaching),
    personal_performance_insights: parseObject<PersonalPerformanceInsights>(
      d.personal_performance_insights,
    ),
    sales_coach_self_love_connection: parseObject<PerformanceSelfLoveConnection>(
      d.sales_coach_self_love_connection,
    ),
    sales_coach_bell_moments: parseObject<CoachBellMoments>(d.sales_coach_bell_moments),
    sales_training_integration: parseObject<SalesTrainingIntegration>(d.sales_training_integration),
    roleplay_simulation: parseObject<RoleplaySimulation>(d.roleplay_simulation),
    sales_coach_trust_connection: parseObject<CoachTrustConnection>(d.sales_coach_trust_connection),
    sales_coach_dogfooding: parseObject<Record<string, unknown>>(d.sales_coach_dogfooding),
    sales_coach_success_criteria: parseList<CoachSuccessCriterion>(d.sales_coach_success_criteria),
    sales_coach_vision_phrases: parseStringList(d.sales_coach_vision_phrases),
    sales_coach_distinction_note:
      typeof d.sales_coach_distinction_note === "string" ? d.sales_coach_distinction_note : undefined,
    sales_coach_integration_links: parseList(d.sales_coach_integration_links),
    ...d,
  } as SalesExpertEngineDashboard;
}
