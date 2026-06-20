export type CustomerSuccessStatus =
  | "getting_started"
  | "developing"
  | "established"
  | "advanced"
  | "high_performing";

export type MaturityKey =
  | "getting_started"
  | "operational"
  | "optimized"
  | "strategic"
  | "transformational";

export type RecommendationPriority = "opportunity" | "recommended" | "important" | "high_impact";

export type CategoryScores = {
  learning_completion: number;
  feature_adoption: number;
  user_engagement: number;
  operational_maturity: number;
  security_completion: number;
  integration_usage: number;
};

export type SuccessMilestone = {
  key: string;
  title: string;
  achieved_at: string;
  auto_detected?: boolean;
};

export type CustomerSuccessRecommendation = {
  id: string;
  key: string;
  priority: RecommendationPriority | string;
  category: string;
};

export type TimelineEvent = {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type CustomerSuccessAdoptionInsights = {
  features_frequently_used: string[];
  features_rarely_used: string[];
  teams_high_engagement: string[];
  teams_requiring_support: string[];
  training_opportunities: string[];
  security_recommendations: string[];
};

export type CustomerSuccessOverview = {
  found: boolean;
  can_manage?: boolean;
  can_admin?: boolean;
  journey_started?: boolean;
  adoption_score?: number;
  utilization_score?: number;
  success_status?: CustomerSuccessStatus;
  maturity?: { stage: number; key: MaturityKey | string };
  category_scores?: CategoryScores;
  milestones_achieved?: SuccessMilestone[];
  recently_improved?: Array<{ id: string; text: string }>;
  areas_requiring_attention?: Array<{ id: string; text: string }>;
  upcoming_opportunities?: CustomerSuccessRecommendation[];
  recommendations?: CustomerSuccessRecommendation[];
  timeline?: TimelineEvent[];
  adoption_insights?: CustomerSuccessAdoptionInsights;
  personal_progress?: { courses_completed?: number; certifications?: number };
  team_reporting?: { team_count?: string; two_fa_adoption_percent?: number; learning_completions?: string } | null;
  principle?: string;
};

export type CustomerSuccessLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  accessDenied: string;
  organizationMissing: string;
  subscriptionRequired: string;
  permissionMissing: string;
  filters: {
    search: string;
    category: string;
    priority: string;
    successStatus: string;
    periodFrom: string;
    department: string;
    all: string;
  };
  dashboard: {
    adoptionScore: string;
    utilizationScore: string;
    recommendedActions: string;
    recentlyImproved: string;
    areasAttention: string;
    milestonesAchieved: string;
    upcomingOpportunities: string;
    personalProgress: string;
  };
  scores: {
    learningCompletion: string;
    featureAdoption: string;
    userEngagement: string;
    operationalMaturity: string;
    securityCompletion: string;
    integrationUsage: string;
  };
  statuses: Record<CustomerSuccessStatus, string>;
  maturity: {
    title: string;
    stage: string;
    gettingStarted: string;
    operational: string;
    optimized: string;
    strategic: string;
    transformational: string;
  };
  insights: {
    title: string;
    frequentlyUsed: string;
    rarelyUsed: string;
    highEngagement: string;
    requiringSupport: string;
    trainingOpportunities: string;
    securityRecommendations: string;
  };
  timeline: { title: string };
  team: {
    title: string;
    teamCount: string;
    twoFaAdoption: string;
    learningCompletions: string;
  };
  recommendations: Record<string, string>;
  priorities: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    autoImprove: string;
    autoImproveAnswer: string;
    whyAdoption: string;
    whyAdoptionAnswer: string;
  };
};

export const CUSTOMER_SUCCESS_STATUSES: CustomerSuccessStatus[] = [
  "getting_started", "developing", "established", "advanced", "high_performing",
];

export const RECOMMENDATION_PRIORITIES: RecommendationPriority[] = [
  "opportunity", "recommended", "important", "high_impact",
];
