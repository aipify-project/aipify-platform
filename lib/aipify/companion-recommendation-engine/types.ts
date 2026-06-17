export type RecommendationCategory =
  | "productivity" | "operations" | "support" | "customer_success" | "team_management"
  | "training" | "security" | "compliance" | "business_growth" | "communication"
  | "workflow_optimization" | "strategic_planning";

export type RecommendationPriority = "critical" | "high" | "medium" | "low" | "informational";
export type RecommendationConfidence = "very_high" | "high" | "medium" | "low" | "experimental";
export type RecommendationStatus = "active" | "accepted" | "dismissed" | "saved" | "completed" | "archived";
export type RecommendationScope = "personal" | "team" | "organization";
export type RecommendationFeedbackType = "helpful" | "not_helpful" | "already_completed" | "not_relevant";

export type RecommendationRecord = {
  id: string;
  title: string;
  description: string;
  reason: string;
  suggested_action: string;
  category: RecommendationCategory | string;
  source_key: string;
  rec_scope?: RecommendationScope | string;
  department?: string;
  priority: RecommendationPriority | string;
  confidence: RecommendationConfidence | string;
  status: RecommendationStatus | string;
  accuracy_score?: number;
  created_at: string;
  updated_at?: string;
};

export type RecommendationTimelineEvent = {
  id: string;
  event_type: string;
  description: string;
  recommendation_id?: string | null;
  created_at: string;
};

export type CompanionRecommendationsDashboard = {
  found: boolean;
  can_personal?: boolean;
  can_team?: boolean;
  can_organization?: boolean;
  has_recommendations?: boolean;
  recommendation_health_score?: number;
  active_recommendations_count?: number;
  high_priority_count?: number;
  accepted_count?: number;
  dismissed_count?: number;
  accuracy_score?: number;
  recommendations?: RecommendationRecord[];
  timeline?: RecommendationTimelineEvent[];
  usage_examples?: string[];
  privacy_note?: string;
  principle?: string;
};

export const RECOMMENDATION_CATEGORY_KEYS = [
  "productivity", "operations", "support", "customer_success", "team_management",
  "training", "security", "compliance", "business_growth", "communication",
  "workflow_optimization", "strategic_planning",
] as const;

export const RECOMMENDATION_SOURCE_KEYS = [
  "context_engine", "memory_engine", "calendar", "tasks", "notifications",
  "companion_activity", "business_packs", "organizational_activity",
  "intelligence_layer", "connected_systems",
] as const;

export type CompanionRecommendationEngineLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  privacyNote: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  accessDenied: string;
  filters: {
    search: string;
    category: string;
    priority: string;
    confidence: string;
    department: string;
    status: string;
    dateFrom: string;
    all: string;
  };
  dashboard: {
    healthScore: string;
    activeRecommendations: string;
    highPriority: string;
    accepted: string;
    dismissed: string;
    accuracyScore: string;
    timeline: string;
    usageExamples: string;
    whySeeing: string;
  };
  card: {
    reason: string;
    priority: string;
    confidence: string;
    suggestedAction: string;
    createdDate: string;
    status: string;
    source: string;
  };
  actions: {
    accept: string;
    dismiss: string;
    saveForLater: string;
    review: string;
  };
  feedback: {
    title: string;
    helpful: string;
    notHelpful: string;
    alreadyCompleted: string;
    notRelevant: string;
  };
  categories: Record<string, string>;
  sources: Record<string, string>;
  priorities: Record<string, string>;
  confidenceLevels: Record<string, string>;
  statuses: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    decisions: string;
    decisionsAnswer: string;
    explanations: string;
    explanationsAnswer: string;
  };
};
