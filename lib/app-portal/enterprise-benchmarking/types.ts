export type MaturityLevel = 1 | 2 | 3 | 4 | 5;

export type MaturityLevelLabel =
  | "emerging"
  | "developing"
  | "established"
  | "advanced"
  | "transformational";

export type BenchmarkDimensionKey =
  | "leadership_decision_making"
  | "operational_excellence"
  | "governance_compliance"
  | "learning_development"
  | "customer_success"
  | "business_pack_adoption"
  | "strategic_execution"
  | "risk_resilience"
  | "automation_readiness"
  | "organizational_intelligence";

export type BenchmarkPriorityLevel = "low" | "moderate" | "high" | "critical";

export type BenchmarkDimensionCard = {
  id: string;
  dimension_key: string;
  name: string;
  organizational_area: string;
  maturity_level: number;
  maturity_level_label: MaturityLevelLabel | string;
  maturity_score: number;
  priority_level: BenchmarkPriorityLevel | string;
  strengths?: string[];
  improvement_opportunities?: string[];
  recommended_actions?: string[];
  related_capabilities?: string[];
  learning_resources?: string[];
  historical_trend?: unknown[];
  last_assessed_at?: string | null;
};

export type BenchmarkFocusArea = {
  dimension_key: string;
  name: string;
};

export type BenchmarkInsightItem = {
  dimension_key?: string;
  name?: string;
  score?: number;
};

export type BenchmarkInsights = {
  strongest_dimensions?: BenchmarkInsightItem[];
  lowest_dimensions?: BenchmarkInsightItem[];
  improving_rapidly?: BenchmarkInsightItem[];
  limited_progress?: BenchmarkInsightItem[];
  cross_functional_patterns?: string[];
};

export type BenchmarkRecommendation = {
  id: string;
  key: string;
  dimension_key?: string;
};

export type BenchmarkTimelineEvent = {
  id: string;
  dimension_key?: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type BenchmarkOverview = {
  found: boolean;
  can_full?: boolean;
  can_view?: boolean;
  can_assess?: boolean;
  has_maturity_data?: boolean;
  overall_maturity_score?: number;
  operational_maturity_score?: number;
  governance_maturity_score?: number;
  learning_maturity_score?: number;
  executive_intelligence_score?: number;
  business_pack_maturity_score?: number;
  recommended_focus_areas?: BenchmarkFocusArea[];
  executive_summary?: string;
  dimensions?: BenchmarkDimensionCard[];
  insights?: BenchmarkInsights;
  recommendations?: BenchmarkRecommendation[];
  anonymized_benchmark_note?: string;
  principle?: string;
};

export type BenchmarkDimensionDetail = BenchmarkDimensionCard & {
  found: boolean;
  assessment_history?: {
    id: string;
    maturity_level: number;
    assessor_name: string;
    assessment_notes: string;
    assessed_at?: string;
  }[];
  can_assess?: boolean;
  recommendations?: BenchmarkRecommendation[];
};

export type BenchmarkAssessmentResult = {
  found: boolean;
  assessment_id?: string;
  dimension_key?: string;
  maturity_level?: number;
  message?: string;
};

export type EnterpriseBenchmarkingLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  anonymizedNote: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  accessDenied: string;
  filters: {
    search: string;
    dimension: string;
    maturityLevel: string;
    organizationalArea: string;
    priorityLevel: string;
    timePeriod: string;
    all: string;
  };
  dashboard: {
    overallMaturity: string;
    operationalMaturity: string;
    governanceMaturity: string;
    learningMaturity: string;
    executiveIntelligence: string;
    businessPackMaturity: string;
    recommendedFocus: string;
    executiveSummary: string;
    benchmarkInsights: string;
    recommendedActions: string;
    timeline: string;
    maturityDimensions: string;
    viewDimension: string;
  };
  detail: {
    back: string;
    currentLevel: string;
    strengths: string;
    opportunities: string;
    historicalTrends: string;
    recommendedActions: string;
    relatedCapabilities: string;
    learningResources: string;
    completeAssessment: string;
  };
  assessment: {
    title: string;
    notes: string;
    maturityLevel: string;
    submit: string;
    success: string;
    governanceNote: string;
  };
  maturityLevels: Record<string, string>;
  dimensions: Record<string, string>;
  priorityLevels: Record<string, string>;
  recommendations: Record<string, string>;
  insights: {
    strongest: string;
    lowest: string;
    improvingRapidly: string;
    limitedProgress: string;
    crossFunctional: string;
  };
  timelineEvents: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    anonymous: string;
    anonymousAnswer: string;
    determinesSuccess: string;
    determinesSuccessAnswer: string;
  };
};

export const BENCHMARK_DIMENSION_KEYS: BenchmarkDimensionKey[] = [
  "leadership_decision_making", "operational_excellence", "governance_compliance",
  "learning_development", "customer_success", "business_pack_adoption",
  "strategic_execution", "risk_resilience", "automation_readiness", "organizational_intelligence",
];

export const MATURITY_LEVELS: MaturityLevel[] = [1, 2, 3, 4, 5];

export const BENCHMARK_PRIORITY_LEVELS: BenchmarkPriorityLevel[] = ["low", "moderate", "high", "critical"];
