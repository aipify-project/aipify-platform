export type BusinessPackSuccessStatus =
  | "getting_started"
  | "active"
  | "healthy"
  | "optimized"
  | "requires_attention";

export type BusinessPackRecommendationPriority =
  | "opportunity"
  | "recommended"
  | "important"
  | "high_impact";

export type BusinessPackUsageTrend = "growing" | "stable" | "declining";

export type BusinessPackMilestone = {
  key: string;
  title: string;
  pack_key?: string;
  achieved_at: string;
};

export type BusinessPackRecommendation = {
  id: string;
  key: string;
  priority: BusinessPackRecommendationPriority | string;
  pack_key?: string | null;
  type?: string;
};

export type BusinessPackOnboardingItem = {
  key: string;
  title: string;
  category: string;
};

export type BusinessPackCard = {
  id: string;
  pack_key: string;
  name: string;
  status: BusinessPackSuccessStatus | string;
  adoption_score: number;
  usage_trend: BusinessPackUsageTrend | string;
  users_assigned: number;
  features_activated: number;
  last_activity?: string | null;
  milestones?: BusinessPackMilestone[];
  recommended_actions?: BusinessPackRecommendation[];
  onboarding_checklist?: BusinessPackOnboardingItem[];
};

export type BusinessPackAdoptionInsights = {
  features_frequently_used: string[];
  features_rarely_used: string[];
  users_actively_engaging: string[];
  areas_requiring_onboarding: string[];
  learning_opportunities: string[];
  recommended_configurations: string[];
};

export type BusinessPackTimelineEvent = {
  id: string;
  event_type: string;
  description: string;
  pack_key?: string | null;
  created_at: string;
};

export type BusinessPackHighlight = {
  pack_key: string;
  name: string;
  score: number;
};

export type BusinessPackSuccessOverview = {
  found: boolean;
  can_full?: boolean;
  can_manage?: boolean;
  can_view?: boolean;
  journey_started?: boolean;
  has_installed_packs?: boolean;
  overall_adoption_score?: number;
  installed_packs?: BusinessPackCard[];
  most_active_packs?: BusinessPackHighlight[];
  underutilized_packs?: BusinessPackHighlight[];
  milestones_achieved?: BusinessPackMilestone[];
  recommendations?: BusinessPackRecommendation[];
  adoption_insights?: BusinessPackAdoptionInsights;
  learning_opportunities?: string[];
  timeline?: BusinessPackTimelineEvent[];
  principle?: string;
};

export type BusinessPackSuccessDetail = BusinessPackCard & {
  found: boolean;
  adoption_insights?: BusinessPackAdoptionInsights;
  timeline?: BusinessPackTimelineEvent[];
  recommendations?: BusinessPackRecommendation[];
};

export type BusinessPackSuccessLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  accessDenied: string;
  filters: {
    search: string;
    pack: string;
    adoptionStatus: string;
    priority: string;
    successStatus: string;
    periodFrom: string;
    all: string;
  };
  dashboard: {
    installedPacks: string;
    overallAdoptionScore: string;
    mostActivePacks: string;
    underutilizedPacks: string;
    recommendedNextActions: string;
    successMilestones: string;
    learningOpportunities: string;
    adoptionInsights: string;
    successTimeline: string;
    onboardingChecklist: string;
  };
  packCard: {
    status: string;
    adoptionScore: string;
    usageTrend: string;
    usersAssigned: string;
    featuresActivated: string;
    lastActivity: string;
    recommendedActions: string;
    viewDetails: string;
  };
  packStatus: Record<string, string>;
  usageTrends: Record<string, string>;
  priorityLevels: Record<string, string>;
  recommendations: Record<string, string>;
  milestones: Record<string, string>;
  onboarding: Record<string, string>;
  insights: {
    featuresFrequentlyUsed: string;
    featuresRarelyUsed: string;
    usersActivelyEngaging: string;
    areasRequiringOnboarding: string;
    learningOpportunities: string;
    recommendedConfigurations: string;
  };
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    improveAutomatically: string;
    improveAutomaticallyAnswer: string;
    whyImportant: string;
    whyImportantAnswer: string;
  };
};

export const BUSINESS_PACK_SUCCESS_PRIORITIES: BusinessPackRecommendationPriority[] = [
  "opportunity",
  "recommended",
  "important",
  "high_impact",
];

export const BUSINESS_PACK_SUCCESS_STATUSES: BusinessPackSuccessStatus[] = [
  "getting_started",
  "active",
  "healthy",
  "optimized",
  "requires_attention",
];
