import type {
  ApprovalRole,
  GapType,
  HealthStatus,
  KnowledgeLocale,
  KnowledgeSource,
  SuggestionType,
  TranslationStatus,
  WorkflowStatus,
} from "./constants";

export type EvolutionFilters = {
  health_status?: HealthStatus | "";
  workflow_status?: WorkflowStatus | "";
  source?: KnowledgeSource | "";
  locale?: KnowledgeLocale | "";
};

export type EvolutionOverview = {
  knowledge_articles: number;
  suggested_improvements: number;
  pending_reviews: number;
  recently_updated: number;
  knowledge_gaps: number;
  learning_opportunities: number;
};

export type ArticleLocalization = {
  locale: KnowledgeLocale;
  translation_status: TranslationStatus;
  updated_at: string;
};

export type KnowledgeArticle = {
  id: string;
  title: string;
  slug: string;
  source: KnowledgeSource;
  workflow_status: WorkflowStatus;
  health_status: HealthStatus;
  health_score: number;
  usage_frequency: number;
  helpfulness_rating: number;
  resolution_effectiveness: number;
  freshness_score: number;
  feedback_sentiment: number;
  owner: string;
  summary: string;
  localizations: ArticleLocalization[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export type KnowledgeGap = {
  id: string;
  gap_type: GapType;
  topic: string;
  message: string;
  occurrence_count: number;
  created_at: string;
};

export type KnowledgeSuggestion = {
  id: string;
  suggestion_type: SuggestionType;
  title: string;
  summary: string;
  article_id: string | null;
  status: string;
};

export type KnowledgeRecommendation = {
  id: string;
  recommendation_key: string;
  message: string;
  priority: string;
  status: string;
};

export type AnalyticsEntry = {
  title?: string;
  topic?: string;
  views?: number;
  rating?: number;
  count?: number;
};

export type KnowledgeAnalytics = {
  most_viewed: AnalyticsEntry[];
  highest_rated: AnalyticsEntry[];
  lowest_rated: AnalyticsEntry[];
  most_requested_topics: AnalyticsEntry[];
  resolution_contribution_rate: number;
};

export type EvolutionAuditEntry = {
  id: string;
  article_id: string | null;
  event_type: string;
  summary: string;
  created_at: string;
};

export type KnowledgeEvolutionCenter = {
  principle: string;
  filters: EvolutionFilters;
  overview: EvolutionOverview;
  articles: KnowledgeArticle[];
  gaps: KnowledgeGap[];
  suggestions: KnowledgeSuggestion[];
  recommendations: KnowledgeRecommendation[];
  analytics: KnowledgeAnalytics;
  audit: EvolutionAuditEntry[];
};

export type KnowledgeEvolutionCenterLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  sections: {
    overview: string;
    articles: string;
    gaps: string;
    suggestions: string;
    recommendations: string;
    analytics: string;
    audit: string;
    filters: string;
    localizations: string;
    createArticle: string;
  };
  overview: {
    knowledgeArticles: string;
    suggestedImprovements: string;
    pendingReviews: string;
    recentlyUpdated: string;
    knowledgeGaps: string;
    learningOpportunities: string;
  };
  table: {
    title: string;
    source: string;
    healthScore: string;
    healthStatus: string;
    workflowStatus: string;
    owner: string;
    usage: string;
    helpfulness: string;
    topic: string;
    occurrences: string;
    message: string;
    priority: string;
    views: string;
    rating: string;
    resolutionRate: string;
  };
  sources: Record<KnowledgeSource, string>;
  gapTypes: Record<GapType, string>;
  suggestionTypes: Record<SuggestionType, string>;
  workflowStatuses: Record<WorkflowStatus, string>;
  healthStatuses: Record<HealthStatus, string>;
  approvalRoles: Record<ApprovalRole, string>;
  locales: Record<KnowledgeLocale, string>;
  translationStatuses: Record<TranslationStatus, string>;
  filters: {
    healthStatus: string;
    workflowStatus: string;
    source: string;
    locale: string;
    allHealth: string;
    allStatuses: string;
    allSources: string;
    allLocales: string;
    apply: string;
  };
  analytics: {
    mostViewed: string;
    highestRated: string;
    lowestRated: string;
    mostRequested: string;
    resolutionContribution: string;
  };
  actions: {
    approve: string;
    publish: string;
    archive: string;
    submitReview: string;
    accept: string;
    decline: string;
    resolveGap: string;
    applying: string;
  };
  create: {
    title: string;
    summary: string;
    submit: string;
    placeholderTitle: string;
    placeholderSummary: string;
  };
};
