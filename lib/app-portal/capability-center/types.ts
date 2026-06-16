export type MaturityLevelKey = "emerging" | "developing" | "established" | "optimized" | "exemplary";
export type ProgressTrend = "improving" | "stable" | "declining";

export type CapabilityCategory = {
  key: string;
  score: number;
  system_level: number;
  level: number;
  level_key: MaturityLevelKey;
  has_self_assessment?: boolean;
  self_level?: number | null;
  strengths: string[];
  improvements: string[];
  recommended_actions: string[];
  aipify_capabilities: string[];
  knowledge_resources: string[];
};

export type CapabilityRecommendation = {
  id: string;
  key: string;
  priority: string;
  category?: string;
};

export type CapabilityDashboard = {
  overall_score: number;
  overall_level: number;
  overall_level_key: MaturityLevelKey;
  trend: ProgressTrend;
  highest_categories: CapabilityCategory[];
  lowest_categories: CapabilityCategory[];
  focus_areas: Array<{ key: string; level: string }>;
};

export type HistoryPoint = {
  recorded_at: string;
  overall_score: number;
  category_scores: Record<string, number>;
};

export type CapabilityProgress = {
  history: HistoryPoint[];
  trend: ProgressTrend;
  recent_milestones: Array<{ key: string; level: string; completed_at?: string }>;
  continued_focus: Array<{ key: string; level: string }>;
};

export type CapabilityCenterResponse = {
  found: boolean;
  has_activity?: boolean;
  dashboard?: CapabilityDashboard;
  categories?: CapabilityCategory[];
  recommendations?: CapabilityRecommendation[];
  progress?: CapabilityProgress;
  principle?: string;
};

export type CapabilityCategoriesResponse = {
  found: boolean;
  categories: CapabilityCategory[];
};

export type CapabilityCenterLabels = {
  title: string;
  subtitle: string;
  loading: string;
  emptyTitle: string;
  emptyBody: string;
  principle: string;
  sections: {
    dashboard: string;
    categories: string;
    detail: string;
    recommendations: string;
    progress: string;
    selfAssessment: string;
  };
  dashboard: {
    overallScore: string;
    overallLevel: string;
    trend: string;
    highest: string;
    lowest: string;
    focusAreas: string;
    advisory: string;
  };
  trends: Record<ProgressTrend, string>;
  levels: Record<MaturityLevelKey, string>;
  levelNumbers: Record<number, string>;
  categories: Record<string, string>;
  strengths: Record<string, string>;
  improvements: Record<string, string>;
  actions: Record<string, string>;
  capabilities: Record<string, string>;
  resources: Record<string, string>;
  recommendations: Record<string, string>;
  progress: {
    history: string;
    milestones: string;
    continuedFocus: string;
  };
  selfAssessment: {
    category: string;
    level: string;
    notes: string;
    submit: string;
    success: string;
    selectCategory: string;
  };
  detail: {
    strengths: string;
    improvements: string;
    actions: string;
    capabilities: string;
    resources: string;
  };
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    howDetermined: string;
    howDeterminedAnswer: string;
    comparison: string;
    comparisonAnswer: string;
  };
};
