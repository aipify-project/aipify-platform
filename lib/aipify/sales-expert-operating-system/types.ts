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
  booking_slug?: string;
  booking_page_enabled?: boolean;
  personal_link?: string;
  mass_email_enabled?: boolean;
  one_to_one_email_enabled?: boolean;
  [key: string]: unknown;
};

export type SalesExpertBooking = {
  id?: string;
  booking_type?: string;
  scheduled_at?: string;
  duration_minutes?: number;
  status?: string;
  timezone?: string;
  customer_id?: string;
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

export type ImplementationBlueprintPhase46 = {
  phase?: number;
  title?: string;
  doc?: string;
  mapping_note?: string;
};

export type ImplementationBlueprintPhase49 = {
  phase?: number;
  title?: string;
  doc?: string;
  mapping_note?: string;
};

export type ImplementationBlueprintPhase50 = {
  phase?: number;
  title?: string;
  doc?: string;
  mapping_note?: string;
};

export type ImplementationBlueprintPhase44 = {
  phase?: number;
  title?: string;
  doc?: string;
  mapping_note?: string;
};

export type RenewalExpansionObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type RenewalDashboardField = {
  key?: string;
  label?: string;
};

export type RenewalUpcomingItem = {
  customer_id?: string;
  org_name?: string;
  status?: string;
  subscription_status?: string;
  next_follow_up?: string;
  readiness_pct?: number;
  days_until_follow_up?: number | null;
};

export type RenewalExpansionSummary = {
  status?: string;
  upcoming_renewals_count?: number;
  recently_renewed_count?: number;
  anniversaries_count?: number;
  at_risk_count?: number;
  active_customers?: number;
  average_readiness_pct?: number;
  upcoming_renewals?: RenewalUpcomingItem[];
  recently_renewed?: Array<Record<string, unknown>>;
  commercial_renewal_events_scheduled?: number;
  aggregate_health_score?: number | null;
  aggregate_engagement_score?: number | null;
  aggregate_adoption_score?: number | null;
  aggregate_renewal_likelihood?: number | null;
  aggregate_expansion_opportunity?: number | null;
  readiness_indicators?: Array<{ key?: string; label?: string; met?: boolean; count?: number }>;
  retention_signal?: string;
  commercial_route?: string;
  privacy_note?: string;
};

export type RenewalCompanionExample = {
  emoji?: string;
  example?: string;
};

export type HealthInsightSignal = {
  key?: string;
  label?: string;
  description?: string;
};

export type CustomerHealthInsights = {
  principle?: string;
  signals?: HealthInsightSignal[];
  commercial_health_cross_link?: string;
  commercial_tables_note?: string;
  metadata_only?: boolean;
};

export type SuccessReviewCategory = {
  key?: string;
  label?: string;
  questions?: string[];
};

export type SuccessReviewQuestions = {
  principle?: string;
  categories?: SuccessReviewCategory[];
};

export type ExpansionOpportunityCategory = {
  key?: string;
  label?: string;
  guidance?: string;
  route?: string;
};

export type ExpansionOpportunities = {
  principle?: string;
  categories?: ExpansionOpportunityCategory[];
  tone?: string;
};

export type RenewalPlaybookMilestone = {
  key?: string;
  days_before?: number;
  label?: string;
  guidance?: string;
};

export type RenewalPlaybooks = {
  principle?: string;
  coach_tab_cross_link?: string;
  milestones?: RenewalPlaybookMilestone[];
};

export type CustomerCelebrationExperiences = {
  principle?: string;
  examples?: Array<{ emoji?: string; example?: string }>;
  performance_phase41_cross_link?: string;
  gratitude_route?: string;
};

export type ChurnPreventionSupport = {
  principle?: string;
  signals?: Array<{ key?: string; label?: string; guidance?: string }>;
  companion_examples?: RenewalCompanionExample[];
  customer_success_route?: string;
  tone?: string;
};

export type RenewalSalesExpertInsights = {
  principle?: string;
  dimensions?: Array<{ key?: string; label?: string; description?: string }>;
  revenue_intelligence_route?: string;
  revenue_intelligence_note?: string;
};

export type RenewalExpansionSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type ImplementationBlueprintPhase43 = {
  phase?: number;
  title?: string;
  doc?: string;
  mapping_note?: string;
};

export type BookingSessionType = {
  key?: string;
  label?: string;
  duration_minutes?: number;
  note?: string;
};

export type BookingCenter = {
  principle?: string;
  url_pattern?: string;
  session_types?: BookingSessionType[];
  duration_options_minutes?: number[];
  timezone_note?: string;
  extends?: Record<string, unknown>;
  status?: string;
};

export type CalendarProvider = {
  key?: string;
  label?: string;
  oauth_status?: string;
  conflict_avoidance?: string;
};

export type CalendarIntegrations = {
  principle?: string;
  status?: string;
  providers?: CalendarProvider[];
  context_engine_route?: string;
  honest_note?: string;
  boundary?: string;
};

export type CompanionNudge = {
  emoji?: string;
  key?: string;
  example?: string;
};

export type FollowUpEngagement = {
  principle?: string;
  companion_nudges?: CompanionNudge[];
  extends?: string;
  email_templates?: string[];
  boundary?: string;
};

export type MeetingPrepSection = {
  key?: string;
  label?: string;
  source?: string;
};

export type MeetingPreparation = {
  status?: string;
  principle?: string;
  prep_sections?: MeetingPrepSection[];
  coach_cross_link?: string;
  meeting_collaboration_route?: string;
  unified_tasks_route?: string;
};

export type EngagementHistory = {
  upcoming_bookings?: SalesExpertBooking[];
  recent_completed_bookings?: SalesExpertBooking[];
  upcoming_follow_ups?: SalesExpertFollowUp[];
  open_opportunities?: number;
  action_items_note?: string;
  privacy_note?: string;
};

export type EngagementSummary = {
  booking_slug?: string;
  booking_page_enabled?: boolean;
  booking_page_url?: string;
  booking_link?: string;
  upcoming_follow_ups?: number;
  scheduled_bookings?: number;
  upcoming_bookings_7d?: number;
  completed_bookings_30d?: number;
  demo_stage_opportunities?: number;
  calendar_sync_status?: string;
  privacy_note?: string;
};

export type EngagementSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type ImplementationBlueprintPhase42 = {
  phase?: number;
  title?: string;
  doc?: string;
  mapping_note?: string;
};

export type ImplementationBlueprintPhase48 = {
  phase?: number;
  title?: string;
  doc?: string;
  mapping_note?: string;
};

export type OperationsDashboardField = {
  key?: string;
  label?: string;
};

export type OperationsCommissionEstimates = {
  pending?: number;
  paid?: number;
  forecasted?: number;
  lifetime?: number;
};

export type OperationsSummary = {
  implementation_revenue_estimate?: number;
  training_revenue_estimate?: number;
  commission_estimates?: OperationsCommissionEstimates;
  active_customers?: number;
  active_opportunities?: number;
  upcoming_follow_ups?: number;
  scheduled_follow_ups?: number;
  support_obligations?: number;
  customers_onboarding?: number;
  commercial_partner_commissions?: Record<string, unknown>;
  trends_note?: string;
  currency?: string;
  supported_currencies?: string[];
  privacy_note?: string;
};

export type BusinessGoal = {
  goal_key?: string;
  target_value?: number;
  period?: string;
  status?: string;
  metadata?: Record<string, unknown>;
};

export type BusinessGoalsSummary = {
  status?: string;
  principle?: string;
  goals?: BusinessGoal[];
  goals_okr_route?: string;
  privacy_note?: string;
};

export type GoalManagementScaffold = {
  principle?: string;
  goal_keys?: Array<{ key?: string; label?: string; suggested_start?: number; currency?: string; route?: string }>;
  table?: string;
  boundary?: string;
};

export type CapacityAwareness = {
  principle?: string;
  companion_examples?: Array<{ emoji?: string; key?: string; example?: string }>;
  resource_planning_route?: string;
  resource_planning_note?: string;
  personal_productivity_route?: string;
  personal_productivity_note?: string;
};

export type ServiceTrackingCategory = {
  key?: string;
  label?: string;
  source?: string;
  status?: string;
  note?: string;
};

export type ServiceTracking = {
  principle?: string;
  categories?: ServiceTrackingCategory[];
  independent_business_note?: string;
  renewal_cross_link?: string;
};

export type ForecastSignal = {
  key?: string;
  label?: string;
  source?: string;
};

export type ForecastingSupport = {
  principle?: string;
  companion_examples?: Array<{ emoji?: string; key?: string; example?: string }>;
  signals?: ForecastSignal[];
  revenue_intelligence_route?: string;
  revenue_intelligence_note?: string;
  tone?: string;
};

export type OperationsSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type ImplementationBlueprintPhase47 = {
  phase?: number;
  title?: string;
  doc?: string;
  mapping_note?: string;
};

export type DemoEnvironment = {
  key?: string;
  label?: string;
  description?: string;
  industry_key?: string;
  metadata?: Record<string, unknown>;
};

export type DemoEnvironments = {
  status?: string;
  principle?: string;
  environments?: DemoEnvironment[];
  boundary?: string;
};

export type DemoDataExample = {
  key?: string;
  label?: string;
  note?: string;
};

export type DemoDataExamples = {
  principle?: string;
  examples?: DemoDataExample[];
};

export type IndustryDemonstration = {
  key?: string;
  label?: string;
  use_cases?: string[];
};

export type IndustryDemonstrations = {
  principle?: string;
  industries?: IndustryDemonstration[];
};

export type DemoGuidancePhase42 = {
  principle?: string;
  coach_tab_cross_link?: string;
  certification_cross_link?: string;
  companion_examples?: Array<{ emoji?: string; key?: string; example?: string }>;
  presentation_tips?: string[];
};

export type DiscoveryQuestionCategory = {
  key?: string;
  label?: string;
  questions?: string[];
};

export type DiscoveryQuestionLibrary = {
  principle?: string;
  categories?: DiscoveryQuestionCategory[];
};

export type DemoFlowStep = {
  order?: number;
  key?: string;
  label?: string;
  guidance?: string;
};

export type DemoFlowStructure = {
  principle?: string;
  steps?: DemoFlowStep[];
};

export type CustomDemoExperience = {
  key?: string;
  label?: string;
  description?: string;
};

export type DemoLinkAccessMode = {
  key?: string;
  label?: string;
  description?: string;
};

export type DemoLinksScaffold = {
  status?: string;
  principle?: string;
  access_modes?: DemoLinkAccessMode[];
  default_expiry_hours?: number;
  fields?: string[];
  boundary?: string;
  honest_notice?: string;
};

export type CompanionDemoExperience = {
  principle?: string;
  examples?: Array<{ emoji?: string; key?: string; label?: string; example?: string }>;
  self_love_note?: string;
};

export type DemoLinksSummary = {
  status?: string;
  active_links_count?: number;
  scaffold_note?: string;
  default_expiry_hours?: number;
  privacy_note?: string;
};

export type SalesDemoSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
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

export type TrainingPathwayModule = {
  key?: string;
  order?: number;
  label?: string;
  topics?: string[];
};

export type SalesTrainingPathway = {
  principle?: string;
  status?: string;
  modules?: TrainingPathwayModule[];
  foundations_route?: string;
  certification_route?: string;
};

export type SimulationScenario = {
  key?: string;
  label?: string;
  note?: string;
};

export type SalesSimulationEngine = {
  status?: string;
  principle?: string;
  scenarios?: SimulationScenario[];
  coach_tab_cross_link?: string;
  simulation_lab_route?: string;
  boundary?: string;
};

export type TelephoneSalesStep = {
  order?: number;
  key?: string;
  label?: string;
  guidance?: string;
};

export type TelephoneSalesCoaching = {
  principle?: string;
  steps?: TelephoneSalesStep[];
};

export type AssessmentDimension = {
  key?: string;
  label?: string;
  description?: string;
};

export type AssessmentPrinciples = {
  principle?: string;
  dimensions?: AssessmentDimension[];
  tone?: string;
};

export type CertificationTier = {
  key?: string;
  label?: string;
  public_label?: string;
  minimum_score_pct?: number;
  requirements?: string[];
};

export type CertificationRequirements = {
  principle?: string;
  tiers?: CertificationTier[];
  forbidden_public_terms?: string[];
};

export type ReassessmentPrinciples = {
  principle?: string;
  max_attempts_before_review?: number;
  rules?: string[];
  reassessment_note?: string;
};

export type CertificationDisplay = {
  status?: string;
  principle?: string;
  display_surfaces?: Array<{
    key?: string;
    label?: string;
    route?: string;
    fields?: string[];
  }>;
  identifier_format?: string;
  privacy_note?: string;
};

export type EmailEnablementCenter = {
  principle?: string;
  mass_unsolicited_outreach?: boolean;
  boundary?: string;
  template_metadata_extensions?: Array<{
    key?: string;
    label?: string;
    source?: string;
  }>;
  email_center_tab?: string;
};

export type ImplementationPricingExample = {
  key?: string;
  label?: string;
  illustrative_price?: number;
  note?: string;
};

export type ImplementationPricingGuidance = {
  principle?: string;
  currency?: string;
  examples?: ImplementationPricingExample[];
  consulting_note?: string;
  non_binding?: boolean;
};

export type InstallationJourneyStep = {
  order?: number;
  key?: string;
  label?: string;
  description?: string;
};

export type InstallationExperienceJourney = {
  principle?: string;
  steps?: InstallationJourneyStep[];
  install_route?: string;
  companion_note?: string;
};

export type FieldSalesEnablement = {
  principle?: string;
  distinct_from?: string;
  nudges?: Array<{ key?: string; label?: string; example?: string }>;
  coach_tab_cross_link?: string;
};

export type SalesPerformanceCulture = {
  principle?: string;
  pillars?: Array<{ key?: string; label?: string; description?: string }>;
  avoid?: string[];
};

export type SalesCertificationSummary = {
  status?: string;
  current_tier_key?: string;
  current_tier_label?: string;
  partner_status?: string;
  assessment_attempts_used?: number;
  max_attempts_before_review?: number;
  attempts_remaining?: number;
  next_recommended_module?: string;
  certification_route?: string;
  privacy_note?: string;
};

export type CertificationSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type CertificationTrustConnection = {
  principle?: string;
  experts_should_understand?: string[];
  metadata_only?: boolean;
  insights_generated_from?: string[];
};

export type MarketingPersonalLink = {
  key?: string;
  label?: string;
  url?: string;
  pattern?: string;
  tracks?: string[];
};

export type MarketingBanner = {
  key?: string;
  label?: string;
  width?: number;
  height?: number;
  banner_url?: string;
  tracking_url?: string;
  embed_html?: string;
  note?: string;
};

export type MarketingTextPack = {
  key?: string;
  label?: string;
  text?: string;
};

export type MarketingPromotionalTextPacks = {
  locale?: string;
  packs?: MarketingTextPack[];
  social_media?: Array<{ key?: string; text?: string }>;
  forum_post?: { title?: string; body?: string };
  email_snippet?: { subject?: string; body?: string };
};

export type MarketingChannel = {
  key?: string;
  label?: string;
  guidance?: string;
};

export type MarketingChannelGuidance = {
  principle?: string;
  channels?: MarketingChannel[];
  platform_guidance?: Array<{ platform?: string; note?: string }>;
};

export type MarketingForumGuidelines = {
  principle?: string;
  encourage?: string[];
  discourage?: string[];
  mass_unsolicited_outreach?: boolean;
};

export type MarketingVideoIdea = {
  key?: string;
  title?: string;
  idea?: string;
};

export type MarketingCoachConnection = {
  principle?: string;
  coach_tab_cross_link?: string;
  companion_examples?: Array<{ emoji?: string; example?: string }>;
  performance_cross_link?: string;
};

export type MarketingPerformanceTracking = {
  status?: string;
  link_clicks?: number;
  leads?: number;
  signups?: number;
  subscriptions?: number;
  best_banner_key?: string | null;
  best_channel_key?: string | null;
  estimated_commission_metadata?: number;
  currency?: string;
  privacy_note?: string;
  performance_tab_cross_link?: string;
};

export type MarketingSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type CommunityObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type MentorshipGuidanceArea = {
  key?: string;
  label?: string;
  note?: string;
};

export type MentorshipProgram = {
  principle?: string;
  status?: string;
  voluntary?: boolean;
  guidance_areas?: MentorshipGuidanceArea[];
  matching_note?: string;
  coach_cross_link?: string;
};

export type CommunityHubChannel = {
  key?: string;
  label?: string;
  emoji?: string;
  example_prompt?: string;
};

export type CommunityHub = {
  principle?: string;
  status?: string;
  channels?: CommunityHubChannel[];
  trust_rules?: string[];
};

export type SuccessStoryCategory = {
  key?: string;
  label?: string;
  note?: string;
};

export type SuccessStory = {
  id?: string;
  title?: string;
  category?: string;
  summary?: string;
  author_display?: string;
  is_scaffold?: boolean;
  created_at?: string;
};

export type CommunityRecognitionBadge = {
  key?: string;
  emoji?: string;
  label?: string;
  description?: string;
};

export type CommunityRecognition = {
  principle?: string;
  badges?: CommunityRecognitionBadge[];
  leaderboard_cross_link?: string;
  gratitude_cross_link?: string;
};

export type SalesCoachCommunityConnection = {
  principle?: string;
  recommendations?: Array<{ key?: string; label?: string; example?: string }>;
  coach_tab_cross_link?: string;
  certification_cross_link?: string;
};

export type RegionalGroup = {
  key?: string;
  label?: string;
  locales?: string[];
};

export type RegionalGroupsScaffold = {
  status?: string;
  principle?: string;
  groups?: RegionalGroup[];
  default_group?: string;
  i18n_note?: string;
};

export type MentorshipLink = {
  id?: string;
  mentor_user_id?: string;
  mentee_user_id?: string;
  status?: string;
  voluntary?: boolean;
  guidance_focus?: string[];
  created_at?: string;
};

export type CommunitySummary = {
  status?: string;
  mentorship_enabled?: boolean;
  regional_group?: string;
  stories_count?: number;
  active_mentorships?: number;
  contributors_count?: number;
  privacy_note?: string;
};

export type CommunitySettings = {
  mentorship_enabled?: boolean;
  regional_group?: string;
};

export type CommunitySuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type SalesLegacySummary = {
  status?: string;
  principle?: string;
  tenure_years?: number;
  orgs_supported?: number;
  customers_retained?: number;
  demos_delivered?: number;
  training_sessions?: number;
  community_contributions?: number;
  mentorship_relationships?: number;
  milestones_achieved?: number;
  performance_phase41_cross_link?: string;
  community_phase47_cross_link?: string;
  privacy_note?: string;
};

export type SalesSuccessTimelineEvent = {
  key?: string;
  emoji?: string;
  label?: string;
  occurred_at?: string;
  achieved?: boolean;
  guidance?: string;
};

export type SalesSuccessTimeline = {
  principle?: string;
  events?: SalesSuccessTimelineEvent[];
  companion_emojis?: string[];
  renewal_phase44_cross_link?: string;
  community_phase47_cross_link?: string;
  privacy_note?: string;
};

export type SalesImpactInsight = {
  key?: string;
  count?: number;
  label?: string;
  emoji?: string;
};

export type SalesImpactInsights = {
  principle?: string;
  insights?: SalesImpactInsight[];
  impact_engine_route?: string;
  impact_engine_note?: string;
  metadata_only?: boolean;
  privacy_note?: string;
};

export type SalesMentorshipLegacy = {
  principle?: string;
  mentored_count?: number;
  community_stories_count?: number;
  active_mentorships?: number;
  contributors_count?: number;
  knowledge_shared_note?: string;
  community_tab_cross_link?: string;
  gratitude_cross_link?: string;
  privacy_note?: string;
};

export type LegacyRecognitionExperience = {
  key?: string;
  emoji?: string;
  label?: string;
  description?: string;
};

export type LegacyRecognitionExperiences = {
  principle?: string;
  experiences?: LegacyRecognitionExperience[];
  optional?: boolean;
  gratitude_route?: string;
  performance_phase41_cross_link?: string;
  tone?: string;
};

export type LegacyReflectionPrompt = {
  emoji?: string;
  prompt?: string;
};

export type LegacySelfLoveReflection = {
  principle?: string;
  prompts?: LegacyReflectionPrompt[];
  route?: string;
  boundary?: string;
};

export type LegacyTrustConnection = {
  principle?: string;
  experts_should_understand?: string[];
  metadata_only?: boolean;
  optional_experiences_note?: string;
};

export type LegacySuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type SalesExpertLegacyCenter = {
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  objectives?: PerformanceObjective[];
  legacy_summary?: SalesLegacySummary;
  success_timeline?: SalesSuccessTimeline;
  impact_insights?: SalesImpactInsights;
  mentorship_legacy?: SalesMentorshipLegacy;
  recognition_experiences?: LegacyRecognitionExperiences;
  self_love_reflection?: LegacySelfLoveReflection;
  self_love?: PerformanceSelfLoveConnection;
  trust?: LegacyTrustConnection;
  dogfooding?: Record<string, unknown>;
  distinction_note?: string;
  integration_links?: IntegrationLink[];
  success_criteria?: LegacySuccessCriterion[];
  vision?: string[];
  privacy_note?: string;
};

export type SalesExpertCommunityCenter = {
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  objectives?: CommunityObjective[];
  mentorship_program?: MentorshipProgram;
  community_hub?: CommunityHub;
  success_story_categories?: SuccessStoryCategory[];
  success_stories?: SuccessStory[];
  community_recognition?: CommunityRecognition;
  sales_coach_connection?: SalesCoachCommunityConnection;
  regional_groups?: RegionalGroupsScaffold;
  self_love?: PerformanceSelfLoveConnection;
  trust?: PerformanceTrustConnection;
  dogfooding?: Record<string, unknown>;
  summary?: CommunitySummary;
  mentorship_links?: MentorshipLink[];
  settings?: CommunitySettings;
  distinction_note?: string;
  integration_links?: IntegrationLink[];
  success_criteria?: CommunitySuccessCriterion[];
  vision?: string[];
  privacy_note?: string;
};

export type IntelligenceCompanionExample = {
  emoji?: string;
  key?: string;
  example?: string;
};

export type OpportunityInsights = {
  principle?: string;
  companion_examples?: IntelligenceCompanionExample[];
  coach_tab_cross_link?: string;
  opportunities_tab_note?: string;
};

export type PipelineInsightCounts = {
  early_stage?: number;
  demo_candidates?: number;
  follow_up_priorities?: number;
  renewal_related?: number;
  expansion_conversations?: number;
  total_open?: number;
};

export type HighlightedOpportunity = {
  id?: string;
  title?: string;
  pipeline_stage?: string;
  category?: string;
  estimated_value?: number;
  currency?: string;
  next_action?: string;
  recommended_action?: string;
};

export type PipelineIntelligence = {
  principle?: string;
  counts?: PipelineInsightCounts;
  highlighted_opportunities?: HighlightedOpportunity[];
  renewal_expansion_cross_link?: string;
  privacy_note?: string;
};

export type IndustryInsightSector = {
  key?: string;
  label?: string;
  patterns?: string[];
  common_objections?: string[];
  typical_needs?: string[];
};

export type IndustryInsights = {
  principle?: string;
  industries?: IndustryInsightSector[];
  industry_intelligence_route?: string;
  blueprint_phase32_note?: string;
};

export type StaleOpportunity = {
  id?: string;
  title?: string;
  pipeline_stage?: string;
  days_since_activity?: number;
  suggested_action?: string;
};

export type DemoStageNudge = {
  id?: string;
  title?: string;
  pipeline_stage?: string;
  next_action?: string;
  nudge?: string;
};

export type EducationalResource = {
  key?: string;
  label?: string;
  route?: string;
  note?: string;
};

export type FollowUpIntelligence = {
  principle?: string;
  stale_opportunities?: StaleOpportunity[];
  stale_count?: number;
  demo_stage_nudges?: DemoStageNudge[];
  demo_nudge_count?: number;
  educational_resources?: EducationalResource[];
  engagement_phase43_cross_link?: string;
  privacy_note?: string;
};

export type ScoringDimension = {
  key?: string;
  label?: string;
  weight_note?: string;
};

export type OpportunityScoreItem = {
  opportunity_id?: string;
  title?: string;
  pipeline_stage?: string;
  engagement_score?: number;
  demo_completed?: boolean;
  demo_stage_active?: boolean;
  stakeholder_signals?: number;
  positive_signals?: unknown[];
  positive_signal_count?: number;
  composite_score?: number;
  score_note?: string;
  factors_explained?: string[];
};

export type OpportunityScoring = {
  principle?: string;
  scores?: OpportunityScoreItem[];
  scoring_dimensions?: ScoringDimension[];
  privacy_note?: string;
};

export type IntelligenceSummary = {
  status?: string;
  active_opportunities?: number;
  early_stage_count?: number;
  demo_candidates_count?: number;
  follow_up_priorities_count?: number;
  renewal_related_count?: number;
  expansion_conversations_count?: number;
  stale_opportunities_count?: number;
  demo_nudge_count?: number;
  top_scored_opportunities?: OpportunityScoreItem[];
  market_observations_note?: string;
  upcoming_follow_ups?: number;
  demo_stage_opportunities?: number;
  privacy_note?: string;
};

export type IntelligenceSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type IntelligenceTrustConnection = {
  principle?: string;
  experts_should_understand?: string[];
  metadata_only?: boolean;
  insights_generated_from?: string[];
};

export type SalesExpertMarketingCenter = {
  mission?: string;
  abos_principle?: string;
  features?: string[];
  tracking_slug?: string;
  preferred_locale?: string;
  tracking_enabled?: boolean;
  personal_links?: MarketingPersonalLink[];
  banners?: MarketingBanner[];
  promotional_text_packs?: MarketingPromotionalTextPacks;
  channel_guidance?: MarketingChannelGuidance;
  forum_guidelines?: MarketingForumGuidelines;
  video_ideas?: MarketingVideoIdea[];
  coach_marketing_connection?: MarketingCoachConnection;
  performance_tracking?: MarketingPerformanceTracking;
  self_love?: PerformanceSelfLoveConnection;
  trust?: PerformanceTrustConnection;
  success_criteria?: MarketingSuccessCriterion[];
  vision?: string[];
  integration_links?: IntegrationLink[];
  distinction_note?: string;
  implementation_blueprint?: Record<string, unknown>;
  mass_unsolicited_outreach?: boolean;
  privacy_note?: string;
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
  marketing_link_clicks?: number;
  marketing_signups?: number;
  marketing_subscriptions?: number;
  marketing_brief_summary?: string;
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
    bookings?: SalesExpertBooking[];
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
  implementation_blueprint_phase46?: ImplementationBlueprintPhase46;
  sales_certification_mission?: string;
  sales_certification_philosophy?: string;
  sales_certification_abos_principle?: string;
  sales_training_pathway?: SalesTrainingPathway;
  sales_simulation_engine?: SalesSimulationEngine;
  telephone_sales_coaching?: TelephoneSalesCoaching;
  assessment_principles?: AssessmentPrinciples;
  certification_requirements?: CertificationRequirements;
  reassessment_principles?: ReassessmentPrinciples;
  certification_display?: CertificationDisplay;
  email_enablement_center?: EmailEnablementCenter;
  implementation_pricing_guidance?: ImplementationPricingGuidance;
  installation_experience_journey?: InstallationExperienceJourney;
  field_sales_enablement?: FieldSalesEnablement;
  sales_performance_culture?: SalesPerformanceCulture;
  sales_certification_summary?: SalesCertificationSummary;
  sales_certification_self_love_connection?: PerformanceSelfLoveConnection;
  sales_certification_trust_connection?: CertificationTrustConnection;
  sales_certification_dogfooding?: Record<string, unknown>;
  sales_certification_success_criteria?: CertificationSuccessCriterion[];
  sales_certification_vision_phrases?: string[];
  sales_certification_distinction_note?: string;
  sales_certification_integration_links?: IntegrationLink[];
  sales_expert_marketing_center?: SalesExpertMarketingCenter;
  implementation_blueprint_phase42?: ImplementationBlueprintPhase42;
  sales_demo_mission?: string;
  sales_demo_philosophy?: string;
  sales_demo_objectives?: PerformanceObjective[];
  demo_environments?: DemoEnvironments;
  demo_data_examples?: DemoDataExamples;
  industry_demonstrations?: IndustryDemonstrations;
  demo_guidance?: DemoGuidancePhase42;
  discovery_question_library?: DiscoveryQuestionLibrary;
  demo_flow_structure?: DemoFlowStructure;
  custom_demo_experiences?: CustomDemoExperience[];
  demo_links_scaffold?: DemoLinksScaffold;
  demo_links_summary?: DemoLinksSummary;
  companion_demo_experience?: CompanionDemoExperience;
  sales_demo_self_love_connection?: PerformanceSelfLoveConnection;
  sales_demo_trust_connection?: PerformanceTrustConnection;
  sales_demo_dogfooding?: Record<string, unknown>;
  sales_demo_success_criteria?: SalesDemoSuccessCriterion[];
  sales_demo_vision_phrases?: string[];
  sales_demo_abos_principle?: string;
  sales_demo_distinction_note?: string;
  sales_demo_integration_links?: IntegrationLink[];
  implementation_blueprint_phase43?: ImplementationBlueprintPhase43;
  engagement_mission?: string;
  engagement_philosophy?: string;
  engagement_abos_principle?: string;
  engagement_objectives?: PerformanceObjective[];
  booking_center?: BookingCenter;
  calendar_integrations?: CalendarIntegrations;
  discovery_meetings?: Record<string, unknown>;
  demonstration_bookings?: Record<string, unknown>;
  follow_up_engagement?: FollowUpEngagement;
  meeting_preparation?: MeetingPreparation;
  engagement_history?: EngagementHistory;
  engagement_summary?: EngagementSummary;
  engagement_self_love_connection?: PerformanceSelfLoveConnection;
  engagement_trust_connection?: PerformanceTrustConnection;
  engagement_dogfooding?: Record<string, unknown>;
  engagement_success_criteria?: EngagementSuccessCriterion[];
  engagement_vision_phrases?: string[];
  engagement_distinction_note?: string;
  engagement_integration_links?: IntegrationLink[];
  implementation_blueprint_phase44?: ImplementationBlueprintPhase44;
  renewal_expansion_mission?: string;
  renewal_expansion_philosophy?: string;
  renewal_expansion_abos_principle?: string;
  renewal_expansion_objectives?: RenewalExpansionObjective[];
  renewal_dashboard_fields?: RenewalDashboardField[];
  renewal_expansion_summary?: RenewalExpansionSummary;
  renewal_companion_examples?: RenewalCompanionExample[];
  customer_health_insights?: CustomerHealthInsights;
  success_review_questions?: SuccessReviewQuestions;
  expansion_opportunities?: ExpansionOpportunities;
  renewal_playbooks?: RenewalPlaybooks;
  customer_celebration_experiences?: CustomerCelebrationExperiences;
  churn_prevention_support?: ChurnPreventionSupport;
  renewal_sales_expert_insights?: RenewalSalesExpertInsights;
  renewal_expansion_self_love_connection?: PerformanceSelfLoveConnection;
  renewal_expansion_trust_connection?: PerformanceTrustConnection;
  renewal_expansion_dogfooding?: Record<string, unknown>;
  renewal_expansion_success_criteria?: RenewalExpansionSuccessCriterion[];
  renewal_expansion_vision_phrases?: string[];
  renewal_expansion_distinction_note?: string;
  renewal_expansion_integration_links?: IntegrationLink[];
  implementation_blueprint_phase47?: ImplementationBlueprintPhase47;
  sales_community_mission?: string;
  sales_community_philosophy?: string;
  sales_community_abos_principle?: string;
  sales_community_objectives?: CommunityObjective[];
  sales_expert_community_center?: SalesExpertCommunityCenter;
  sales_community_distinction_note?: string;
  sales_community_integration_links?: IntegrationLink[];
  sales_community_success_criteria?: CommunitySuccessCriterion[];
  sales_community_vision_phrases?: string[];
  implementation_blueprint_phase49?: ImplementationBlueprintPhase49;
  sales_intelligence_mission?: string;
  sales_intelligence_philosophy?: string;
  sales_intelligence_abos_principle?: string;
  sales_intelligence_objectives?: PerformanceObjective[];
  opportunity_insights?: OpportunityInsights;
  sales_intelligence_summary?: IntelligenceSummary;
  pipeline_intelligence?: PipelineIntelligence;
  industry_insights?: IndustryInsights;
  follow_up_intelligence?: FollowUpIntelligence;
  opportunity_scoring?: OpportunityScoring;
  sales_intelligence_self_love_connection?: PerformanceSelfLoveConnection;
  sales_intelligence_trust_connection?: IntelligenceTrustConnection;
  sales_intelligence_dogfooding?: Record<string, unknown>;
  sales_intelligence_success_criteria?: IntelligenceSuccessCriterion[];
  sales_intelligence_vision_phrases?: string[];
  sales_intelligence_distinction_note?: string;
  sales_intelligence_integration_links?: IntegrationLink[];
  implementation_blueprint_phase48?: ImplementationBlueprintPhase48;
  sales_operations_mission?: string;
  sales_operations_philosophy?: string;
  sales_operations_abos_principle?: string;
  sales_operations_objectives?: PerformanceObjective[];
  sales_operations_dashboard_fields?: OperationsDashboardField[];
  sales_operations_summary?: OperationsSummary;
  sales_business_goal_management?: GoalManagementScaffold;
  sales_business_goals_summary?: BusinessGoalsSummary;
  sales_capacity_awareness?: CapacityAwareness;
  sales_service_tracking?: ServiceTracking;
  sales_forecasting_support?: ForecastingSupport;
  sales_operations_self_love_connection?: PerformanceSelfLoveConnection;
  sales_operations_trust_connection?: PerformanceTrustConnection;
  sales_operations_dogfooding?: Record<string, unknown>;
  sales_operations_success_criteria?: OperationsSuccessCriterion[];
  sales_operations_vision_phrases?: string[];
  sales_operations_distinction_note?: string;
  sales_operations_integration_links?: IntegrationLink[];
  implementation_blueprint_phase50?: ImplementationBlueprintPhase50;
  sales_legacy_mission?: string;
  sales_legacy_philosophy?: string;
  sales_legacy_abos_principle?: string;
  sales_legacy_objectives?: PerformanceObjective[];
  sales_legacy_summary?: SalesLegacySummary;
  sales_success_timeline?: SalesSuccessTimeline;
  sales_impact_insights?: SalesImpactInsights;
  sales_mentorship_legacy?: SalesMentorshipLegacy;
  sales_legacy_recognition?: LegacyRecognitionExperiences;
  sales_legacy_self_love_reflection?: LegacySelfLoveReflection;
  sales_legacy_center?: SalesExpertLegacyCenter;
  sales_legacy_self_love_connection?: PerformanceSelfLoveConnection;
  sales_legacy_trust_connection?: LegacyTrustConnection;
  sales_legacy_dogfooding?: Record<string, unknown>;
  sales_legacy_success_criteria?: LegacySuccessCriterion[];
  sales_legacy_vision_phrases?: string[];
  sales_legacy_distinction_note?: string;
  sales_legacy_integration_links?: IntegrationLink[];
  [key: string]: unknown;
};
