export type SalesExpertCustomer = {
  id?: string;
  org_name?: string;
  status?: string;
  subscription_status?: string;
  onboarding_progress?: number;
  next_follow_up?: string;
  notes_metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

export type SalesExpertOpportunity = {
  id?: string;
  title?: string;
  pipeline_stage?: string;
  estimated_value?: number;
  currency?: string;
  next_action?: string;
  recommended_action?: string;
  status?: string;
  customer_id?: string;
  [key: string]: unknown;
};

export type SalesExpertCommission = {
  id?: string;
  commission_type?: string;
  amount?: number;
  currency?: string;
  status?: string;
  subscription_plan_key?: string | null;
  period_month?: string;
  [key: string]: unknown;
};

export type SalesExpertEmailTemplate = {
  template_key?: string;
  title?: string;
  subject_pattern?: string;
  category?: string;
  placeholders?: string[];
  [key: string]: unknown;
};

export type SalesExpertEmail = {
  id?: string;
  template_key?: string;
  subject_metadata?: string;
  status?: string;
  delivery_mode?: string;
  scheduled_for?: string;
  sent_at?: string;
  [key: string]: unknown;
};

export type SalesExpertFollowUp = {
  id?: string;
  cadence_days?: number;
  template_key?: string;
  scheduled_for?: string;
  status?: string;
  customer_id?: string;
  [key: string]: unknown;
};

export type SalesExpertSettings = {
  organization_id?: string;
  expert_display_name?: string;
  expert_company_name?: string;
  booking_link?: string;
  personal_link?: string;
  mass_email_enabled?: boolean;
  one_to_one_email_enabled?: boolean;
  [key: string]: unknown;
};

export type OfficialTerminology = {
  principle?: string;
  tiers?: Array<{ key?: string; label?: string }>;
  portal_terms?: string[];
  forbidden_public_terms?: string[];
};

export type ImplementationServicePricing = {
  currency?: string;
  principle?: string;
  services?: Array<{ key?: string; label?: string; suggested_price?: number }>;
  consulting_note?: string;
};

export type SubscriptionPrinciples = {
  aipify_subscription?: { relationship?: string; description?: string };
  consulting_services?: { relationship?: string; description?: string };
  commission_principle?: string;
};

export type IntegrationLink = {
  key?: string;
  label?: string;
  route?: string;
  note?: string;
};

export type PerformanceObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type PerformanceDashboardField = {
  key?: string;
  label?: string;
};

export type PerformanceSummary = {
  monthly_commissions_pending?: number;
  monthly_commissions_paid?: number;
  forecasted_commissions?: number;
  lifetime_subscription_value?: number;
  active_subscriptions?: number;
  new_customers_30d?: number;
  retention_rate_pct?: number | null;
  active_customers?: number;
  milestones_achieved?: number;
  performance_trends_note?: string;
};

export type MilestoneRecognition = {
  key?: string;
  emoji?: string;
  label?: string;
  threshold?: number | null;
  note?: string;
};

export type MilestoneProgressItem = {
  key?: string;
  met?: boolean;
  current?: number;
  threshold?: number;
};

export type MilestoneProgress = {
  active_customers?: number;
  total_customers?: number;
  new_customers_30d?: number;
  active_subscriptions?: number;
  retention_rate_pct?: number | null;
  milestones?: MilestoneProgressItem[];
  privacy_note?: string;
};

export type BellMoment = {
  emoji?: string;
  key?: string;
  example?: string;
  trigger?: string;
};

export type RecognitionRoses = {
  principle?: string;
  examples?: Array<{ emoji?: string; example?: string }>;
  gratitude_engine_route?: string;
  boundary?: string;
};

export type Leaderboards = {
  principle?: string;
  encouraged_categories?: Array<{ key?: string; label?: string }>;
  avoid?: string[];
};

export type PerformanceSelfLoveConnection = {
  principle?: string;
  examples?: Array<{ emoji?: string; example?: string }>;
  route?: string;
  boundary?: string;
};

export type PerformanceTrustConnection = {
  principle?: string;
  experts_should_understand?: string[];
  metadata_only?: boolean;
};

export type PerformanceSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type ImplementationBlueprintPhase41 = {
  phase?: number;
  title?: string;
  doc?: string;
  mapping_note?: string;
};

export type ImplementationBlueprintPhase45 = {
  phase?: number;
  title?: string;
  doc?: string;
  mapping_note?: string;
};

export type SalesCompanionRole = {
  key?: string;
  emoji?: string;
  label?: string;
  description?: string;
};

export type CoachDashboardField = {
  key?: string;
  label?: string;
};

export type CoachSummary = {
  monthly_commissions_pending?: number;
  monthly_commissions_paid?: number;
  forecasted_commissions?: number;
  new_customers_this_month?: number;
  renewal_count?: number;
  retention_rate_pct?: number | null;
  conversion_rate_pct?: number | null;
  upcoming_follow_ups?: number;
  scheduled_demos?: number;
  active_opportunities?: number;
  active_customers?: number;
  suggested_next_actions_count?: number;
  privacy_note?: string;
};

export type DailyBriefingItem = {
  key?: string;
  message?: string;
};

export type DailySalesBriefing = {
  greeting_tone?: string;
  items?: DailyBriefingItem[];
  examples?: Array<{ key?: string; example?: string }>;
  privacy_note?: string;
};

export type ActivityRecommendation = {
  key?: string;
  label?: string;
  priority?: string;
  reason?: string;
};

export type SalesActivityRecommendations = {
  principle?: string;
  recommendations?: ActivityRecommendation[];
  scaffold?: ActivityRecommendation[];
};

export type FieldSalesCoaching = {
  principle?: string;
  nudges?: Array<{ key?: string; label?: string; example?: string }>;
};

export type DemonstrationGuidance = {
  checklists?: string[];
  industry_talking_points?: Array<{ sector?: string; point?: string }>;
  discovery_questions?: string[];
  recommended_next_steps?: string[];
};

export type ObjectionHandlingEntry = {
  objection?: string;
  response?: string;
  tone?: string;
};

export type CommunicationCoaching = {
  areas?: Array<{ key?: string; label?: string; guidance?: string }>;
};

export type PerformanceInsightItem = {
  key?: string;
  label?: string;
  note?: string;
};

export type PersonalPerformanceInsights = {
  principle?: string;
  strengths?: PerformanceInsightItem[];
  opportunities?: PerformanceInsightItem[];
  scaffold?: {
    principle?: string;
    strength_examples?: string[];
    opportunity_examples?: string[];
  };
  privacy_note?: string;
};

export type CoachBellMoments = {
  principle?: string;
  moments?: Array<{
    emoji?: string;
    key?: string;
    label?: string;
    example?: string;
    phase41_key?: string;
  }>;
  phase41_cross_link?: string;
};

export type SalesTrainingIntegration = {
  training_tab_route?: string;
  training_tab_note?: string;
  foundations_route?: string;
  foundations_label?: string;
  certification_route?: string;
  certification_label?: string;
  principle?: string;
};

export type RoleplaySimulation = {
  status?: string;
  scenarios?: Array<{ key?: string; label?: string; note?: string }>;
  simulation_lab_route?: string;
  simulation_lab_note?: string;
};

export type CoachTrustConnection = {
  principle?: string;
  experts_should_understand?: string[];
  metadata_only?: boolean;
  insights_generated_from?: string[];
};

export type CoachSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type SalesExpertEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  engine_phase?: string;
  route?: string;
  active_opportunities?: number;
  monthly_commissions_pending?: number;
  upcoming_follow_ups?: number;
  lifetime_subscription_value?: number;
  [key: string]: unknown;
};

export type SalesExpertEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  privacy_note?: string;
  engine_phase?: string;
  settings?: SalesExpertSettings;
  summary?: Record<string, unknown>;
  sections?: {
    dashboard?: Record<string, unknown>;
    customers?: SalesExpertCustomer[];
    opportunities?: SalesExpertOpportunity[];
    commissions?: SalesExpertCommission[];
    email_templates?: SalesExpertEmailTemplate[];
    emails?: SalesExpertEmail[];
    follow_ups?: SalesExpertFollowUp[];
  };
  official_terminology?: OfficialTerminology;
  portal_sections?: IntegrationLink[];
  blueprint_email_templates?: SalesExpertEmailTemplate[];
  follow_up_cadences?: Array<{ cadence_days?: number; label?: string; purpose?: string }>;
  implementation_services?: ImplementationServicePricing;
  subscription_principles?: SubscriptionPrinciples;
  commercial_commission_summary?: Record<string, unknown>;
  mass_email_supported?: boolean;
  integration_links?: IntegrationLink[];
  training_center?: Record<string, unknown>;
  resource_library?: Record<string, unknown>;
  distinction_note?: string;
  implementation_blueprint?: Record<string, unknown>;
  implementation_blueprint_phase41?: ImplementationBlueprintPhase41;
  performance_recognition_mission?: string;
  performance_recognition_philosophy?: string;
  performance_recognition_abos_principle?: string;
  performance_objectives?: PerformanceObjective[];
  performance_dashboard_fields?: PerformanceDashboardField[];
  performance_summary?: PerformanceSummary;
  milestone_recognition?: MilestoneRecognition[];
  milestone_progress?: MilestoneProgress;
  bell_moments?: BellMoment[];
  recognition_roses?: RecognitionRoses;
  leaderboards?: Leaderboards;
  performance_self_love_connection?: PerformanceSelfLoveConnection;
  performance_trust_connection?: PerformanceTrustConnection;
  performance_dogfooding?: Record<string, unknown>;
  performance_vision_phrases?: string[];
  performance_integration_links?: IntegrationLink[];
  performance_blueprint_success_criteria?: PerformanceSuccessCriterion[];
  performance_distinction_note?: string;
  implementation_blueprint_phase45?: ImplementationBlueprintPhase45;
  sales_coach_mission?: string;
  sales_coach_philosophy?: string;
  sales_coach_abos_principle?: string;
  sales_companion_roles?: SalesCompanionRole[];
  sales_coach_dashboard_fields?: CoachDashboardField[];
  sales_coach_summary?: CoachSummary;
  daily_sales_briefing?: DailySalesBriefing;
  sales_activity_recommendations?: SalesActivityRecommendations;
  field_sales_coaching?: FieldSalesCoaching;
  demonstration_guidance?: DemonstrationGuidance;
  objection_handling_library?: ObjectionHandlingEntry[];
  communication_coaching?: CommunicationCoaching;
  personal_performance_insights?: PersonalPerformanceInsights;
  sales_coach_self_love_connection?: PerformanceSelfLoveConnection;
  sales_coach_bell_moments?: CoachBellMoments;
  sales_training_integration?: SalesTrainingIntegration;
  roleplay_simulation?: RoleplaySimulation;
  sales_coach_trust_connection?: CoachTrustConnection;
  sales_coach_dogfooding?: Record<string, unknown>;
  sales_coach_success_criteria?: CoachSuccessCriterion[];
  sales_coach_vision_phrases?: string[];
  sales_coach_distinction_note?: string;
  sales_coach_integration_links?: IntegrationLink[];
  [key: string]: unknown;
};
