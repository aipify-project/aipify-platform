import type {
  ImpactLevel,
  RecommendationCategory,
  RecommendationStatus,
} from "./constants";

export type DecisionFilters = {
  category?: RecommendationCategory | "";
  impact_level?: ImpactLevel | "";
  status?: RecommendationStatus | "";
  owner?: string;
  confidence_min?: number | "";
};

export type DecisionOverview = {
  recommendations_generated: number;
  recommendations_accepted: number;
  recommendations_declined: number;
  high_impact_opportunities: number;
  risks_identified: number;
  pending_reviews: number;
};

export type DecisionTask = {
  id: string;
  title: string;
  owner: string;
  status: string;
  created_at: string;
};

export type DecisionRecommendation = {
  id: string;
  title: string;
  description: string;
  category: RecommendationCategory;
  impact_level: ImpactLevel;
  confidence_score: number;
  status: RecommendationStatus;
  recommended_actions: string[];
  owner: string;
  note: string;
  roadmap_link: string;
  generated_at: string;
  updated_at: string;
  tasks: DecisionTask[];
};

export type DecisionAuditEntry = {
  id: string;
  recommendation_id: string | null;
  event_type: string;
  summary: string;
  created_at: string;
};

export type PlatformDecisionCenter = {
  principle: string;
  executive_summary: string;
  filters: DecisionFilters;
  overview: DecisionOverview;
  recommendations: DecisionRecommendation[];
  high_impact: DecisionRecommendation[];
  risks: DecisionRecommendation[];
  audit: DecisionAuditEntry[];
};

export type PlatformDecisionCenterLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  executiveSummary: string;
  emptyState: string;
  sections: {
    overview: string;
    recommendations: string;
    highImpact: string;
    risks: string;
    audit: string;
    filters: string;
    recommendedActions: string;
    tasks: string;
  };
  overview: {
    recommendationsGenerated: string;
    recommendationsAccepted: string;
    recommendationsDeclined: string;
    highImpactOpportunities: string;
    risksIdentified: string;
    pendingReviews: string;
  };
  table: {
    title: string;
    description: string;
    category: string;
    impactLevel: string;
    confidence: string;
    status: string;
    owner: string;
    generatedDate: string;
    actions: string;
  };
  categories: Record<RecommendationCategory, string>;
  impactLevels: Record<ImpactLevel, string>;
  statuses: Record<RecommendationStatus, string>;
  filters: {
    category: string;
    impactLevel: string;
    status: string;
    owner: string;
    confidenceMin: string;
    allCategories: string;
    allImpactLevels: string;
    allStatuses: string;
    apply: string;
  };
  actions: {
    accept: string;
    dismiss: string;
    startReview: string;
    markImplemented: string;
    createTask: string;
    assignOwner: string;
    addNote: string;
    linkRoadmap: string;
    applying: string;
  };
  prompts: {
    owner: string;
    note: string;
    roadmapLink: string;
    taskTitle: string;
  };
};
