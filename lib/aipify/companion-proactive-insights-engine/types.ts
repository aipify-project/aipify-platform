export type InsightCategory =
  | "productivity" | "operations" | "support" | "customers" | "workforce" | "training"
  | "growth" | "security" | "compliance" | "leadership" | "communication" | "strategic_planning";

export type InsightPriority = "critical" | "high" | "medium" | "low" | "informational";
export type InsightConfidence = "very_high" | "high" | "medium" | "low" | "experimental";
export type InsightImpactLevel = "major" | "moderate" | "minor" | "informational";
export type InsightStatus = "new" | "reviewed" | "dismissed" | "escalated" | "archived";
export type InsightScope = "personal" | "team" | "organization";
export type InsightFeedbackType = "helpful" | "not_helpful" | "interesting" | "already_known" | "not_relevant";

export type ProactiveInsightRecord = {
  id: string;
  title: string;
  observation: string;
  why_it_matters: string;
  why_generated?: string;
  data_sources?: string;
  suggested_review: string;
  category: InsightCategory | string;
  source_key: string;
  insight_scope?: InsightScope | string;
  department?: string;
  priority: InsightPriority | string;
  confidence: InsightConfidence | string;
  impact_level: InsightImpactLevel | string;
  impact_score?: number;
  pattern_type?: string;
  status: InsightStatus | string;
  created_at: string;
  updated_at?: string;
};

export type InsightTimelineEvent = {
  id: string;
  event_type: string;
  description: string;
  insight_id?: string | null;
  created_at: string;
};

export type ProactiveInsightsDashboard = {
  found: boolean;
  can_personal?: boolean;
  can_team?: boolean;
  can_organization?: boolean;
  has_insights?: boolean;
  insight_health_score?: number;
  active_insights_count?: number;
  high_priority_count?: number;
  new_insights_count?: number;
  reviewed_count?: number;
  impact_score?: number;
  insights?: ProactiveInsightRecord[];
  timeline?: InsightTimelineEvent[];
  usage_examples?: string[];
  privacy_note?: string;
  principle?: string;
};

export const INSIGHT_CATEGORY_KEYS = [
  "productivity", "operations", "support", "customers", "workforce", "training",
  "growth", "security", "compliance", "leadership", "communication", "strategic_planning",
] as const;

export const INSIGHT_SOURCE_KEYS = [
  "context_engine", "memory_engine", "recommendation_engine", "calendar", "tasks",
  "notifications", "business_packs", "intelligence_layer", "support_activity",
  "organizational_activity", "connected_systems", "companion_activity",
] as const;

export const PATTERN_TYPE_KEYS = [
  "repeated_issues", "repeated_delays", "repeated_requests", "workflow_bottlenecks",
  "performance_trends", "behavioral_patterns", "communication_patterns",
] as const;

export type CompanionProactiveInsightsEngineLabels = {
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
    impact: string;
    department: string;
    status: string;
    dateFrom: string;
    all: string;
  };
  dashboard: {
    healthScore: string;
    activeInsights: string;
    highPriority: string;
    newInsights: string;
    reviewed: string;
    impactScore: string;
    timeline: string;
    usageExamples: string;
    whyGenerated: string;
    whyMatters: string;
    dataSources: string;
    patternDetection: string;
  };
  card: {
    observation: string;
    confidence: string;
    impact: string;
    suggestedReview: string;
    createdDate: string;
    status: string;
    source: string;
    priority: string;
  };
  actions: {
    review: string;
    dismiss: string;
    archive: string;
    escalate: string;
  };
  feedback: {
    title: string;
    helpful: string;
    notHelpful: string;
    interesting: string;
    alreadyKnown: string;
    notRelevant: string;
  };
  categories: Record<string, string>;
  sources: Record<string, string>;
  priorities: Record<string, string>;
  confidenceLevels: Record<string, string>;
  impactLevels: Record<string, string>;
  statuses: Record<string, string>;
  patterns: Record<string, string>;
  faq: {
    title: string;
    whatAre: string;
    whatAreAnswer: string;
    autoAction: string;
    autoActionAnswer: string;
    howGenerated: string;
    howGeneratedAnswer: string;
  };
};
