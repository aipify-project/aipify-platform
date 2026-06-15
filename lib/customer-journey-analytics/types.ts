import type {
  CompanySize,
  CustomerSegment,
  DropOffType,
  ExportFormat,
  Industry,
  JourneyStage,
  JourneyTrend,
  PlanType,
  RecommendationType,
} from "./constants";

export type JourneyAnalyticsFilters = {
  country?: string;
  industry?: Industry | "";
  company_size?: CompanySize | "";
  plan?: PlanType | "";
  customer_segment?: CustomerSegment | "";
  customer_id?: string;
};

export type JourneyOverview = {
  new_registrations: number;
  onboarding_completion_rate: number;
  trial_conversion_rate: number;
  time_to_first_value_days: number;
  expansion_rate: number;
  drop_off_rate: number;
};

export type FunnelStep = {
  from_stage: JourneyStage;
  to_stage: JourneyStage;
  entered: number;
  converted: number;
  conversion_rate: number;
};

export type DropOffCase = {
  id: string;
  customer_id: string;
  customer: string;
  drop_off_type: DropOffType;
  stage: string;
  message: string;
  created_at: string;
};

export type JourneyCustomerRow = {
  customer_id: string;
  company: string;
  current_stage: JourneyStage;
  trend: JourneyTrend;
  last_activity: string | null;
  subscription_plan: string;
  country: string;
  industry: string;
  company_size: CompanySize;
  customer_segment: CustomerSegment;
  milestones_completed: number;
  time_to_first_value_days: number | null;
};

export type JourneyTimelineEvent = {
  id: string;
  customer_id?: string | null;
  customer?: string;
  stage: JourneyStage;
  completed_at: string;
  delay_days: number;
  support_interaction: boolean;
};

export type CommonPath = {
  id: string;
  path_key: string;
  path_label: string;
  conversion_rate: number;
  customer_count: number;
  is_success_path: boolean;
  abandonment_point: string | null;
};

export type JourneyRecommendation = {
  id: string;
  recommendation_type: RecommendationType;
  title: string;
  summary: string;
  target_stage: string | null;
  impact_score: number;
  status: string;
};

export type JourneyAuditEntry = {
  id: string;
  customer_id: string | null;
  event_type: string;
  summary: string;
  created_at: string;
};

export type JourneyStageMeta = {
  key: string;
  label: string;
};

export type CustomerJourneyAnalytics = {
  principle: string;
  privacy_note: string;
  filters: JourneyAnalyticsFilters;
  journey_stages: JourneyStageMeta[];
  overview: JourneyOverview;
  funnel: FunnelStep[];
  drop_offs: DropOffCase[];
  journeys: JourneyCustomerRow[];
  timeline: JourneyTimelineEvent[];
  common_paths: CommonPath[];
  recommendations: JourneyRecommendation[];
  audit: JourneyAuditEntry[];
};

export type CustomerJourneyAnalyticsLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  privacyNote: string;
  emptyState: string;
  sections: {
    overview: string;
    funnel: string;
    dropOffs: string;
    journeys: string;
    timeline: string;
    commonPaths: string;
    recommendations: string;
    audit: string;
    filters: string;
    exports: string;
  };
  overview: {
    newRegistrations: string;
    onboardingCompletionRate: string;
    trialConversionRate: string;
    timeToFirstValue: string;
    expansionRate: string;
    dropOffRate: string;
    days: string;
  };
  funnel: {
    from: string;
    to: string;
    entered: string;
    converted: string;
    conversionRate: string;
  };
  table: {
    company: string;
    currentStage: string;
    trend: string;
    lastActivity: string;
    subscriptionPlan: string;
    country: string;
    milestones: string;
    customer: string;
    dropOffType: string;
    stage: string;
    message: string;
    path: string;
    conversionRate: string;
    customers: string;
    abandonmentPoint: string;
    completedAt: string;
    delayDays: string;
    supportInteraction: string;
    impactScore: string;
  };
  stages: Record<JourneyStage, string>;
  dropOffTypes: Record<DropOffType, string>;
  recommendationTypes: Record<RecommendationType, string>;
  trends: Record<JourneyTrend, string>;
  filters: {
    country: string;
    industry: string;
    companySize: string;
    plan: string;
    customerSegment: string;
    allCountries: string;
    allIndustries: string;
    allSizes: string;
    allPlans: string;
    allSegments: string;
    apply: string;
    viewTimeline: string;
    clearTimeline: string;
  };
  plans: Record<PlanType, string>;
  companySizes: Record<CompanySize, string>;
  segments: Record<CustomerSegment, string>;
  industries: Record<Industry, string>;
  actions: {
    accept: string;
    dismiss: string;
    resolve: string;
    recalculate: string;
    applying: string;
    viewJourney: string;
  };
  exports: {
    csv: string;
    excel: string;
    pdf: string;
    exporting: string;
  };
  exportFormats: Record<ExportFormat, string>;
};
