export type PortfolioStatus =
  | "high_performing"
  | "healthy"
  | "stable"
  | "requires_optimization"
  | "executive_attention_required";

export type PortfolioMaturityLevel =
  | "emerging_portfolio"
  | "developing_portfolio"
  | "mature_portfolio"
  | "strategic_portfolio"
  | "transformational_portfolio";

export type PortfolioPriorityLevel =
  | "informational"
  | "opportunity"
  | "important"
  | "executive_attention_required";

export type PortfolioReviewType =
  | "quarterly_executive"
  | "semi_annual"
  | "annual_portfolio"
  | "ad_hoc";

export type PortfolioReviewOutcome =
  | "continue_investment"
  | "optimize_investment"
  | "expand_investment"
  | "retire_capability"
  | "further_investigation_required";

export type PortfolioOverviewSummary = {
  installed_packs?: number;
  active_packs?: number;
  adoption_overview?: number;
  governance_overview?: number;
  compliance_overview?: string;
  value_overview?: number;
  lifecycle_overview?: string;
  ecosystem_overview?: string;
};

export type ExecutivePortfolioPackCard = {
  id: string;
  pack_key: string;
  name: string;
  portfolio_status: PortfolioStatus | string;
  maturity_level: PortfolioMaturityLevel | string;
  priority_level: PortfolioPriorityLevel | string;
  adoption_score: number;
  value_score: number;
  governance_score: number;
  compliance_status: string;
  lifecycle_stage: string;
  executive_sponsor: string;
  recommended_action: string;
  estimated_value: number;
  is_active?: boolean;
};

export type PortfolioReview = {
  id: string;
  review_type: string;
  review_outcome: string;
  reviewer_name: string;
  governance_notes: string;
  reviewed_at?: string;
};

export type PortfolioInsightItem = {
  pack_key?: string;
  name?: string;
};

export type PortfolioInsights = {
  highest_performing?: PortfolioInsightItem[];
  underutilized?: PortfolioInsightItem[];
  strongest_roi?: PortfolioInsightItem[];
  governance_attention?: PortfolioInsightItem[];
  optimization_opportunities?: PortfolioInsightItem[];
  maturity_observations?: string[];
};

export type PortfolioRecommendation = {
  id: string;
  key: string;
  pack_key?: string;
};

export type PortfolioTimelineEvent = {
  id: string;
  pack_key?: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type ExecutivePortfolioOverview = {
  found: boolean;
  can_full?: boolean;
  can_manage?: boolean;
  can_view?: boolean;
  can_review?: boolean;
  has_portfolio_data?: boolean;
  portfolio_health_score?: number;
  total_installed?: number;
  total_active?: number;
  total_value_realized?: number;
  packs_requiring_attention?: number;
  portfolio_growth_trend?: string;
  portfolio_maturity_level?: string;
  executive_summary?: string;
  portfolio_overview?: PortfolioOverviewSummary;
  packs?: ExecutivePortfolioPackCard[];
  insights?: PortfolioInsights;
  recommendations?: PortfolioRecommendation[];
  principle?: string;
};

export type ExecutivePortfolioDetail = ExecutivePortfolioPackCard & {
  found: boolean;
  review_history?: PortfolioReview[];
  can_review?: boolean;
  recommendations?: PortfolioRecommendation[];
};

export type ExecutivePortfolioReviewResult = {
  found: boolean;
  review_id?: string;
  pack_key?: string;
  review_outcome?: string;
  message?: string;
};

export type ExecutivePortfolioLabels = {
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
    portfolioStatus: string;
    packKey: string;
    maturityLevel: string;
    executiveSponsor: string;
    priorityLevel: string;
    reviewPeriod: string;
    all: string;
  };
  dashboard: {
    portfolioHealthScore: string;
    totalInstalled: string;
    totalActive: string;
    totalValueRealized: string;
    packsRequiringAttention: string;
    portfolioGrowthTrend: string;
    executiveSummary: string;
    portfolioOverview: string;
    portfolioInsights: string;
    recommendedActions: string;
    timeline: string;
    healthOverview: string;
    maturityLevel: string;
  };
  overview: {
    installedPacks: string;
    adoptionOverview: string;
    governanceOverview: string;
    complianceOverview: string;
    valueOverview: string;
    lifecycleOverview: string;
    ecosystemOverview: string;
  };
  card: {
    portfolioStatus: string;
    adoptionScore: string;
    valueScore: string;
    governanceScore: string;
    complianceStatus: string;
    lifecycleStage: string;
    executiveSponsor: string;
    recommendedAction: string;
    viewDetails: string;
    completeReview: string;
  };
  review: {
    title: string;
    notes: string;
    reviewType: string;
    reviewOutcome: string;
    submit: string;
    success: string;
    governanceNote: string;
  };
  portfolioStatuses: Record<string, string>;
  maturityLevels: Record<string, string>;
  priorityLevels: Record<string, string>;
  reviewTypes: Record<string, string>;
  reviewOutcomes: Record<string, string>;
  growthTrends: Record<string, string>;
  recommendations: Record<string, string>;
  insights: {
    highestPerforming: string;
    underutilized: string;
    strongestRoi: string;
    governanceAttention: string;
    optimizationOpportunities: string;
    maturityObservations: string;
  };
  timelineEvents: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    investmentDecisions: string;
    investmentDecisionsAnswer: string;
    whyOversight: string;
    whyOversightAnswer: string;
  };
};

export const PORTFOLIO_STATUSES: PortfolioStatus[] = [
  "high_performing", "healthy", "stable", "requires_optimization", "executive_attention_required",
];

export const PORTFOLIO_MATURITY_LEVELS: PortfolioMaturityLevel[] = [
  "emerging_portfolio", "developing_portfolio", "mature_portfolio", "strategic_portfolio", "transformational_portfolio",
];

export const PORTFOLIO_PRIORITY_LEVELS: PortfolioPriorityLevel[] = [
  "informational", "opportunity", "important", "executive_attention_required",
];

export const PORTFOLIO_REVIEW_TYPES: PortfolioReviewType[] = [
  "quarterly_executive", "semi_annual", "annual_portfolio", "ad_hoc",
];

export const PORTFOLIO_REVIEW_OUTCOMES: PortfolioReviewOutcome[] = [
  "continue_investment", "optimize_investment", "expand_investment", "retire_capability", "further_investigation_required",
];
