export type PriorityLevel = "critical" | "high" | "medium" | "low";
export type ReviewStatus  = "pending" | "in_review" | "reviewed" | "actioned";
export type BriefingPeriod = "today" | "this_week" | "this_month" | "this_quarter";

export type IntelligencePriority = {
  id: string;
  priority_key: string;
  title: string;
  source_module: string;
  priority_level: PriorityLevel | string;
  category: string;
  time_horizon?: string;
  recommended_action: string;
  review_status: ReviewStatus | string;
};

export type IntelligenceSource = {
  key: string;
  label: string;
  score: number | string;
  route: string;
};

export type OutlookEntry = { label: string; text: string };

export type ExecutiveBriefing = {
  period: BriefingPeriod | string;
  summary: string;
  key_observations: string[];
  suggested_actions: string[];
  review_items: string[];
};

export type ICCTimelineEvent = {
  id: string;
  event_type: string;
  source_module: string;
  description: string;
  created_at: string;
};

export type ModuleScores = {
  benchmarking?: number;
  predictive?: number;
  scenario?: number;
  foresight?: number;
  opportunities?: number;
  forecasting?: number;
  readiness?: number;
  cfi?: number;
  overall?: number;
};

export type IntelligenceCommandCenterOverview = {
  found: boolean;
  can_full?: boolean;
  can_view?: boolean;
  can_review?: boolean;
  has_intelligence_data?: boolean;
  enterprise_intelligence_score?: number;
  executive_health_score?: number;
  organizational_readiness_score?: number;
  strategic_opportunity_score?: number;
  forecast_confidence_score?: number;
  collaboration_health_score?: number;
  future_preparedness_score?: number;
  module_scores?: ModuleScores;
  executive_summary?: string;
  key_observations?: string[];
  priorities?: IntelligencePriority[];
  outlook?: Record<string, string>;
  intelligence_sources?: IntelligenceSource[];
  advisory_note?: string;
  principle?: string;
};

export type ICCActionResult = {
  found: boolean;
  message?: string;
};

export type IntelligenceCommandCenterLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  advisoryNote: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  accessDenied: string;
  filters: {
    search: string;
    category: string;
    priority: string;
    timeHorizon: string;
    department: string;
    executiveOwner: string;
    reviewStatus: string;
    all: string;
  };
  dashboard: {
    intelligenceScore: string;
    executiveHealthScore: string;
    readinessScore: string;
    opportunityScore: string;
    forecastScore: string;
    collaborationScore: string;
    futurePreparednessScore: string;
    executiveSummary: string;
    keyObservations: string;
    executiveSnapshot: string;
    topPriorities: string;
    opportunitiesRisks: string;
    futureOutlook: string;
    crossFunctionalHealth: string;
    executiveActions: string;
    intelligenceSources: string;
    briefingMode: string;
    priorities: string;
    timeline: string;
    viewModule: string;
    refreshIntelligence: string;
    markReviewed: string;
  };
  briefing: {
    today: string;
    thisWeek: string;
    thisMonth: string;
    thisQuarter: string;
    summary: string;
    keyObservations: string;
    suggestedActions: string;
    reviewItems: string;
    generate: string;
  };
  priority: {
    sourceModule: string;
    priorityLevel: string;
    category: string;
    timeHorizon: string;
    recommendedAction: string;
    reviewStatus: string;
  };
  outlook: {
    "30_days": string;
    "90_days": string;
    "6_months": string;
    "12_months": string;
    "24_months": string;
  };
  priorityLevels: Record<string, string>;
  reviewStatuses: Record<string, string>;
  sourceModules: Record<string, string>;
  timelineEvents: Record<string, string>;
  refresh: { success: string };
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    replacesModules: string;
    replacesModulesAnswer: string;
    whoShouldUse: string;
    whoShouldUseAnswer: string;
  };
};

export const PRIORITY_LEVELS: PriorityLevel[] = ["critical","high","medium","low"];
export const BRIEFING_PERIODS: BriefingPeriod[] = ["today","this_week","this_month","this_quarter"];
export const REVIEW_STATUSES: ReviewStatus[]    = ["pending","in_review","reviewed","actioned"];
