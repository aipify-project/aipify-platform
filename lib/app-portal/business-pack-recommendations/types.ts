export type PackRecommendationCategory =
  | "industry_based"
  | "role_based"
  | "maturity_based"
  | "operational"
  | "security"
  | "efficiency"
  | "customer_success"
  | "executive";

export type PackConfidenceLevel =
  | "exploratory"
  | "suggested"
  | "strong_match"
  | "highly_relevant";

export type PackComplexity = "simple" | "moderate" | "advanced";

export type PackBusinessImpact =
  | "incremental_improvement"
  | "meaningful_improvement"
  | "high_business_impact"
  | "strategic_transformation";

export type PackRecommendation = {
  id: string;
  pack_key: string;
  catalogSlug?: string;
  packId?: string;
  name: string;
  category: string;
  industry?: string;
  confidence_level: PackConfidenceLevel | string;
  confidence_score?: number;
  complexity: PackComplexity | string;
  business_impact: PackBusinessImpact | string;
  reason_key: string;
  benefits_key: string;
  suggested_users?: string;
  related_packs?: string[];
  installed?: boolean;
  saved?: boolean;
  features?: string[];
  recommended_audience?: string;
  can_save?: boolean;
};

export type PackRecommendationHighlight = {
  pack_key: string;
  name?: string;
  saved_at?: string;
  viewed_at?: string;
  status?: string;
};

export type PackComparisonItem = {
  pack_key: string;
  name: string;
  features: string[];
  benefits_key: string;
  complexity: string;
  business_impact: string;
  recommended_audience: string;
  related_packs: string[];
};

export type PackRecommendationOverview = {
  found: boolean;
  can_full?: boolean;
  can_manage?: boolean;
  can_view?: boolean;
  has_recommendations?: boolean;
  recommendations?: PackRecommendation[];
  installed_packs?: PackRecommendationHighlight[];
  saved_recommendations?: PackRecommendationHighlight[];
  recently_viewed?: PackRecommendationHighlight[];
  operational_categories?: string[];
  principle?: string;
};

export type PackRecommendationLabels = {
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
    industry: string;
    category: string;
    complexity: string;
    businessImpact: string;
    confidenceLevel: string;
    installedStatus: string;
    all: string;
    installed: string;
    notInstalled: string;
  };
  dashboard: {
    recommendedPacks: string;
    installedPacks: string;
    savedRecommendations: string;
    recentlyViewed: string;
    operationalCategories: string;
    comparePacks: string;
    compare: string;
  };
  card: {
    confidenceScore: string;
    reason: string;
    benefits: string;
    complexity: string;
    suggestedUsers: string;
    relatedPacks: string;
    learnMore: string;
    saveRecommendation: string;
    dismiss: string;
    saved: string;
    matchBadge: string;
    accessInstalled: string;
    accessAvailable: string;
    compare: string;
  };
  compare: {
    title: string;
    features: string;
    benefits: string;
    complexity: string;
    impact: string;
    audience: string;
    related: string;
    runCompare: string;
    selectTwo: string;
  };
  categories: Record<string, string>;
  confidenceLevels: Record<string, string>;
  complexityLevels: Record<string, string>;
  impactLevels: Record<string, string>;
  reasons: Record<string, string>;
  benefits: Record<string, string>;
  aipifySuggestions: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    autoInstall: string;
    autoInstallAnswer: string;
    whyChange: string;
    whyChangeAnswer: string;
  };
};

export const PACK_RECOMMENDATION_CATEGORIES = [
  "operational", "security", "efficiency", "customer_success", "executive",
] as const;

export const PACK_CONFIDENCE_LEVELS: PackConfidenceLevel[] = [
  "exploratory", "suggested", "strong_match", "highly_relevant",
];

export const PACK_COMPLEXITY_LEVELS: PackComplexity[] = ["simple", "moderate", "advanced"];

export const PACK_IMPACT_LEVELS: PackBusinessImpact[] = [
  "incremental_improvement",
  "meaningful_improvement",
  "high_business_impact",
  "strategic_transformation",
];
