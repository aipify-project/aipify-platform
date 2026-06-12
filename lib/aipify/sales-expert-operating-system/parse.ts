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
  ImplementationBlueprintPhase43,
  ImplementationBlueprintPhase45,
  ImplementationBlueprintPhase42,
  ImplementationBlueprintPhase46,
  ImplementationBlueprintPhase48,
  BusinessGoalsSummary,
  CapacityAwareness,
  ForecastingSupport,
  GoalManagementScaffold,
  OperationsDashboardField,
  OperationsSuccessCriterion,
  OperationsSummary,
  ServiceTracking,
  ImplementationBlueprintPhase44,
  ImplementationBlueprintPhase47,
  CommunityObjective,
  CommunitySuccessCriterion,
  SalesExpertCommunityCenter,
  ChurnPreventionSupport,
  CustomerCelebrationExperiences,
  CustomerHealthInsights,
  ExpansionOpportunities,
  RenewalExpansionObjective,
  RenewalExpansionSuccessCriterion,
  RenewalExpansionSummary,
  RenewalPlaybooks,
  RenewalSalesExpertInsights,
  SuccessReviewQuestions,
  CompanionDemoExperience,
  CustomDemoExperience,
  DemoDataExamples,
  DemoEnvironments,
  DemoFlowStructure,
  DemoGuidancePhase42,
  DemoLinksScaffold,
  DemoLinksSummary,
  DiscoveryQuestionLibrary,
  IndustryDemonstrations,
  SalesDemoSuccessCriterion,
  AssessmentPrinciples,
  CertificationDisplay,
  CertificationRequirements,
  CertificationSuccessCriterion,
  CertificationTrustConnection,
  EmailEnablementCenter,
  FieldSalesEnablement,
  ImplementationPricingGuidance,
  InstallationExperienceJourney,
  ReassessmentPrinciples,
  SalesCertificationSummary,
  SalesPerformanceCulture,
  SalesSimulationEngine,
  SalesTrainingPathway,
  TelephoneSalesCoaching,
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
  SalesExpertBooking,
  SalesExpertOpportunity,
  SalesExpertSettings,
  SalesTrainingIntegration,
  EngagementHistory,
  EngagementSummary,
  EngagementSuccessCriterion,
  BookingCenter,
  CalendarIntegrations,
  FollowUpEngagement,
  MeetingPreparation,
  SalesExpertMarketingCenter,
  ImplementationBlueprintPhase49,
  OpportunityInsights,
  IntelligenceSummary,
  PipelineIntelligence,
  IndustryInsights,
  FollowUpIntelligence,
  OpportunityScoring,
  IntelligenceSuccessCriterion,
  IntelligenceTrustConnection,
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
    bookings: parseList<SalesExpertBooking>(s.bookings),
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
    implementation_blueprint_phase46: parseObject<ImplementationBlueprintPhase46>(
      d.implementation_blueprint_phase46,
    ),
    sales_certification_mission:
      typeof d.sales_certification_mission === "string" ? d.sales_certification_mission : undefined,
    sales_certification_philosophy:
      typeof d.sales_certification_philosophy === "string" ? d.sales_certification_philosophy : undefined,
    sales_certification_abos_principle:
      typeof d.sales_certification_abos_principle === "string"
        ? d.sales_certification_abos_principle
        : undefined,
    sales_training_pathway: parseObject<SalesTrainingPathway>(d.sales_training_pathway),
    sales_simulation_engine: parseObject<SalesSimulationEngine>(d.sales_simulation_engine),
    telephone_sales_coaching: parseObject<TelephoneSalesCoaching>(d.telephone_sales_coaching),
    assessment_principles: parseObject<AssessmentPrinciples>(d.assessment_principles),
    certification_requirements: parseObject<CertificationRequirements>(d.certification_requirements),
    reassessment_principles: parseObject<ReassessmentPrinciples>(d.reassessment_principles),
    certification_display: parseObject<CertificationDisplay>(d.certification_display),
    email_enablement_center: parseObject<EmailEnablementCenter>(d.email_enablement_center),
    implementation_pricing_guidance: parseObject<ImplementationPricingGuidance>(
      d.implementation_pricing_guidance,
    ),
    installation_experience_journey: parseObject<InstallationExperienceJourney>(
      d.installation_experience_journey,
    ),
    field_sales_enablement: parseObject<FieldSalesEnablement>(d.field_sales_enablement),
    sales_performance_culture: parseObject<SalesPerformanceCulture>(d.sales_performance_culture),
    sales_certification_summary: parseObject<SalesCertificationSummary>(d.sales_certification_summary),
    sales_certification_self_love_connection: parseObject<PerformanceSelfLoveConnection>(
      d.sales_certification_self_love_connection,
    ),
    sales_certification_trust_connection: parseObject<CertificationTrustConnection>(
      d.sales_certification_trust_connection,
    ),
    sales_certification_dogfooding: parseObject<Record<string, unknown>>(d.sales_certification_dogfooding),
    sales_certification_success_criteria: parseList<CertificationSuccessCriterion>(
      d.sales_certification_success_criteria,
    ),
    sales_certification_vision_phrases: parseStringList(d.sales_certification_vision_phrases),
    sales_certification_distinction_note:
      typeof d.sales_certification_distinction_note === "string"
        ? d.sales_certification_distinction_note
        : undefined,
    sales_certification_integration_links: parseList(d.sales_certification_integration_links),
    sales_expert_marketing_center: parseObject<SalesExpertMarketingCenter>(
      d.sales_expert_marketing_center,
    ),
    implementation_blueprint_phase42: parseObject<ImplementationBlueprintPhase42>(
      d.implementation_blueprint_phase42,
    ),
    sales_demo_mission: typeof d.sales_demo_mission === "string" ? d.sales_demo_mission : undefined,
    sales_demo_philosophy:
      typeof d.sales_demo_philosophy === "string" ? d.sales_demo_philosophy : undefined,
    sales_demo_objectives: parseList<PerformanceObjective>(d.sales_demo_objectives),
    demo_environments: parseObject<DemoEnvironments>(d.demo_environments),
    demo_data_examples: parseObject<DemoDataExamples>(d.demo_data_examples),
    industry_demonstrations: parseObject<IndustryDemonstrations>(d.industry_demonstrations),
    demo_guidance: parseObject<DemoGuidancePhase42>(d.demo_guidance),
    discovery_question_library: parseObject<DiscoveryQuestionLibrary>(d.discovery_question_library),
    demo_flow_structure: parseObject<DemoFlowStructure>(d.demo_flow_structure),
    custom_demo_experiences: parseList<CustomDemoExperience>(d.custom_demo_experiences),
    demo_links_scaffold: parseObject<DemoLinksScaffold>(d.demo_links_scaffold),
    demo_links_summary: parseObject<DemoLinksSummary>(d.demo_links_summary),
    companion_demo_experience: parseObject<CompanionDemoExperience>(d.companion_demo_experience),
    sales_demo_self_love_connection: parseObject<PerformanceSelfLoveConnection>(
      d.sales_demo_self_love_connection,
    ),
    sales_demo_trust_connection: parseObject<PerformanceTrustConnection>(d.sales_demo_trust_connection),
    sales_demo_dogfooding: parseObject<Record<string, unknown>>(d.sales_demo_dogfooding),
    sales_demo_success_criteria: parseList<SalesDemoSuccessCriterion>(d.sales_demo_success_criteria),
    sales_demo_vision_phrases: parseStringList(d.sales_demo_vision_phrases),
    sales_demo_abos_principle:
      typeof d.sales_demo_abos_principle === "string" ? d.sales_demo_abos_principle : undefined,
    sales_demo_distinction_note:
      typeof d.sales_demo_distinction_note === "string" ? d.sales_demo_distinction_note : undefined,
    sales_demo_integration_links: parseList(d.sales_demo_integration_links),
    implementation_blueprint_phase43: parseObject<ImplementationBlueprintPhase43>(
      d.implementation_blueprint_phase43,
    ),
    engagement_mission: typeof d.engagement_mission === "string" ? d.engagement_mission : undefined,
    engagement_philosophy:
      typeof d.engagement_philosophy === "string" ? d.engagement_philosophy : undefined,
    engagement_abos_principle:
      typeof d.engagement_abos_principle === "string" ? d.engagement_abos_principle : undefined,
    engagement_objectives: parseList<PerformanceObjective>(d.engagement_objectives),
    booking_center: parseObject<BookingCenter>(d.booking_center),
    calendar_integrations: parseObject<CalendarIntegrations>(d.calendar_integrations),
    discovery_meetings: parseObject<Record<string, unknown>>(d.discovery_meetings),
    demonstration_bookings: parseObject<Record<string, unknown>>(d.demonstration_bookings),
    follow_up_engagement: parseObject<FollowUpEngagement>(d.follow_up_engagement),
    meeting_preparation: parseObject<MeetingPreparation>(d.meeting_preparation),
    engagement_history: parseObject<EngagementHistory>(d.engagement_history),
    engagement_summary: parseObject<EngagementSummary>(d.engagement_summary),
    engagement_self_love_connection: parseObject<PerformanceSelfLoveConnection>(
      d.engagement_self_love_connection,
    ),
    engagement_trust_connection: parseObject<PerformanceTrustConnection>(
      d.engagement_trust_connection,
    ),
    engagement_dogfooding: parseObject<Record<string, unknown>>(d.engagement_dogfooding),
    engagement_success_criteria: parseList<EngagementSuccessCriterion>(
      d.engagement_success_criteria,
    ),
    engagement_vision_phrases: parseStringList(d.engagement_vision_phrases),
    engagement_distinction_note:
      typeof d.engagement_distinction_note === "string" ? d.engagement_distinction_note : undefined,
    engagement_integration_links: parseList(d.engagement_integration_links),
    implementation_blueprint_phase44: parseObject<ImplementationBlueprintPhase44>(
      d.implementation_blueprint_phase44,
    ),
    renewal_expansion_mission:
      typeof d.renewal_expansion_mission === "string" ? d.renewal_expansion_mission : undefined,
    renewal_expansion_philosophy:
      typeof d.renewal_expansion_philosophy === "string" ? d.renewal_expansion_philosophy : undefined,
    renewal_expansion_abos_principle:
      typeof d.renewal_expansion_abos_principle === "string"
        ? d.renewal_expansion_abos_principle
        : undefined,
    renewal_expansion_objectives: parseList<RenewalExpansionObjective>(d.renewal_expansion_objectives),
    renewal_dashboard_fields: parseList(d.renewal_dashboard_fields),
    renewal_expansion_summary: parseObject<RenewalExpansionSummary>(d.renewal_expansion_summary),
    renewal_companion_examples: parseList(d.renewal_companion_examples),
    customer_health_insights: parseObject<CustomerHealthInsights>(d.customer_health_insights),
    success_review_questions: parseObject<SuccessReviewQuestions>(d.success_review_questions),
    expansion_opportunities: parseObject<ExpansionOpportunities>(d.expansion_opportunities),
    renewal_playbooks: parseObject<RenewalPlaybooks>(d.renewal_playbooks),
    customer_celebration_experiences: parseObject<CustomerCelebrationExperiences>(
      d.customer_celebration_experiences,
    ),
    churn_prevention_support: parseObject<ChurnPreventionSupport>(d.churn_prevention_support),
    renewal_sales_expert_insights: parseObject<RenewalSalesExpertInsights>(
      d.renewal_sales_expert_insights,
    ),
    renewal_expansion_self_love_connection: parseObject<PerformanceSelfLoveConnection>(
      d.renewal_expansion_self_love_connection,
    ),
    renewal_expansion_trust_connection: parseObject<PerformanceTrustConnection>(
      d.renewal_expansion_trust_connection,
    ),
    renewal_expansion_dogfooding: parseObject<Record<string, unknown>>(d.renewal_expansion_dogfooding),
    renewal_expansion_success_criteria: parseList<RenewalExpansionSuccessCriterion>(
      d.renewal_expansion_success_criteria,
    ),
    renewal_expansion_vision_phrases: parseStringList(d.renewal_expansion_vision_phrases),
    renewal_expansion_distinction_note:
      typeof d.renewal_expansion_distinction_note === "string"
        ? d.renewal_expansion_distinction_note
        : undefined,
    renewal_expansion_integration_links: parseList(d.renewal_expansion_integration_links),
    implementation_blueprint_phase47: parseObject<ImplementationBlueprintPhase47>(
      d.implementation_blueprint_phase47,
    ),
    sales_community_mission:
      typeof d.sales_community_mission === "string" ? d.sales_community_mission : undefined,
    sales_community_philosophy:
      typeof d.sales_community_philosophy === "string" ? d.sales_community_philosophy : undefined,
    sales_community_abos_principle:
      typeof d.sales_community_abos_principle === "string"
        ? d.sales_community_abos_principle
        : undefined,
    sales_community_objectives: parseList<CommunityObjective>(d.sales_community_objectives),
    sales_expert_community_center: parseObject<SalesExpertCommunityCenter>(
      d.sales_expert_community_center,
    ),
    sales_community_distinction_note:
      typeof d.sales_community_distinction_note === "string"
        ? d.sales_community_distinction_note
        : undefined,
    sales_community_integration_links: parseList(d.sales_community_integration_links),
    sales_community_success_criteria: parseList<CommunitySuccessCriterion>(
      d.sales_community_success_criteria,
    ),
    sales_community_vision_phrases: parseStringList(d.sales_community_vision_phrases),
    implementation_blueprint_phase49: parseObject<ImplementationBlueprintPhase49>(
      d.implementation_blueprint_phase49,
    ),
    sales_intelligence_mission:
      typeof d.sales_intelligence_mission === "string" ? d.sales_intelligence_mission : undefined,
    sales_intelligence_philosophy:
      typeof d.sales_intelligence_philosophy === "string" ? d.sales_intelligence_philosophy : undefined,
    sales_intelligence_abos_principle:
      typeof d.sales_intelligence_abos_principle === "string"
        ? d.sales_intelligence_abos_principle
        : undefined,
    sales_intelligence_objectives: parseList<PerformanceObjective>(d.sales_intelligence_objectives),
    opportunity_insights: parseObject<OpportunityInsights>(d.opportunity_insights),
    sales_intelligence_summary: parseObject<IntelligenceSummary>(d.sales_intelligence_summary),
    pipeline_intelligence: parseObject<PipelineIntelligence>(d.pipeline_intelligence),
    industry_insights: parseObject<IndustryInsights>(d.industry_insights),
    follow_up_intelligence: parseObject<FollowUpIntelligence>(d.follow_up_intelligence),
    opportunity_scoring: parseObject<OpportunityScoring>(d.opportunity_scoring),
    sales_intelligence_self_love_connection: parseObject<PerformanceSelfLoveConnection>(
      d.sales_intelligence_self_love_connection,
    ),
    sales_intelligence_trust_connection: parseObject<IntelligenceTrustConnection>(
      d.sales_intelligence_trust_connection,
    ),
    sales_intelligence_dogfooding: parseObject<Record<string, unknown>>(d.sales_intelligence_dogfooding),
    sales_intelligence_success_criteria: parseList<IntelligenceSuccessCriterion>(
      d.sales_intelligence_success_criteria,
    ),
    sales_intelligence_vision_phrases: parseStringList(d.sales_intelligence_vision_phrases),
    sales_intelligence_distinction_note:
      typeof d.sales_intelligence_distinction_note === "string"
        ? d.sales_intelligence_distinction_note
        : undefined,
    sales_intelligence_integration_links: parseList(d.sales_intelligence_integration_links),
    implementation_blueprint_phase48: parseObject<ImplementationBlueprintPhase48>(
      d.implementation_blueprint_phase48,
    ),
    sales_operations_mission:
      typeof d.sales_operations_mission === "string" ? d.sales_operations_mission : undefined,
    sales_operations_philosophy:
      typeof d.sales_operations_philosophy === "string" ? d.sales_operations_philosophy : undefined,
    sales_operations_abos_principle:
      typeof d.sales_operations_abos_principle === "string" ? d.sales_operations_abos_principle : undefined,
    sales_operations_objectives: parseList<PerformanceObjective>(d.sales_operations_objectives),
    sales_operations_dashboard_fields: parseList<OperationsDashboardField>(
      d.sales_operations_dashboard_fields,
    ),
    sales_operations_summary: parseObject<OperationsSummary>(d.sales_operations_summary),
    sales_business_goal_management: parseObject<GoalManagementScaffold>(
      d.sales_business_goal_management,
    ),
    sales_business_goals_summary: parseObject<BusinessGoalsSummary>(d.sales_business_goals_summary),
    sales_capacity_awareness: parseObject<CapacityAwareness>(d.sales_capacity_awareness),
    sales_service_tracking: parseObject<ServiceTracking>(d.sales_service_tracking),
    sales_forecasting_support: parseObject<ForecastingSupport>(d.sales_forecasting_support),
    sales_operations_self_love_connection: parseObject<PerformanceSelfLoveConnection>(
      d.sales_operations_self_love_connection,
    ),
    sales_operations_trust_connection: parseObject<PerformanceTrustConnection>(
      d.sales_operations_trust_connection,
    ),
    sales_operations_dogfooding: parseObject<Record<string, unknown>>(d.sales_operations_dogfooding),
    sales_operations_success_criteria: parseList<OperationsSuccessCriterion>(
      d.sales_operations_success_criteria,
    ),
    sales_operations_vision_phrases: parseStringList(d.sales_operations_vision_phrases),
    sales_operations_distinction_note:
      typeof d.sales_operations_distinction_note === "string"
        ? d.sales_operations_distinction_note
        : undefined,
    sales_operations_integration_links: parseList(d.sales_operations_integration_links),
    ...d,
  } as SalesExpertEngineDashboard;
}
