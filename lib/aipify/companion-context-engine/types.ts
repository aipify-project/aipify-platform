export type ContextSourceStatus = "connected" | "disconnected" | "pending" | "restricted";
export type ContextSourceCategory = "user" | "organization" | "work" | "system";
export type ContextPriority = "low" | "moderate" | "high" | "critical";
export type ContextConfidence = "low" | "moderate" | "high";

export type ContextSource = {
  id: string;
  source_key: string;
  title: string;
  description?: string;
  category: ContextSourceCategory | string;
  status: ContextSourceStatus | string;
  signal_count: number;
  coverage_pct: number;
  department: string;
  priority: ContextPriority | string;
  last_updated_at?: string | null;
};

export type ContextRecord = {
  id: string;
  title: string;
  summary: string;
  source_key: string;
  priority: ContextPriority | string;
  confidence: ContextConfidence | string;
};

export type ContextRecommendation = {
  id: string;
  rec_key?: string;
  title: string;
  summary: string;
  recommendation: string;
  effort?: string;
  value_hint?: string;
  priority: ContextPriority | string;
  department?: string;
};

export type CompanionContextView = {
  current_focus?: string;
  recent_activity?: string;
  pending_actions?: { title: string; summary?: string }[];
  upcoming_events?: string;
  recommended_attention?: { title: string; recommendation?: string }[];
  context_confidence?: string;
};

export type ContextTimelineEvent = {
  id: string;
  event_type: string;
  description: string;
  source_key?: string;
  created_at: string;
};

export type CompanionContextDashboard = {
  found: boolean;
  can_self?: boolean;
  can_team?: boolean;
  can_org?: boolean;
  has_context_data?: boolean;
  context_health_score?: number;
  companion_readiness_score?: number;
  available_signals?: number;
  context_coverage_pct?: number;
  active_sources_count?: number;
  context_confidence?: string;
  active_sources?: ContextSource[];
  recently_updated_sources?: { source_key: string; title: string }[];
  user_context?: ContextRecord[];
  organization_context?: ContextRecord[];
  work_context?: ContextRecord[];
  companion_view?: CompanionContextView;
  usage_example?: string;
  privacy_note?: string;
  principle?: string;
};

export const CONTEXT_SOURCE_KEYS = [
  "user_profile", "role_permissions", "organization", "business_packs",
  "connected_applications", "notifications", "tasks", "calendar_events",
  "recent_activity", "knowledge_center", "companion_history",
  "support_activity", "operational_activity",
] as const;

export type CompanionContextEngineLabels = {
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
    source: string;
    department: string;
    priority: string;
    dateFrom: string;
    all: string;
  };
  dashboard: {
    contextHealthScore: string;
    companionReadinessScore: string;
    availableSignals: string;
    contextCoverage: string;
    activeSources: string;
    recentlyUpdated: string;
    userContext: string;
    organizationContext: string;
    workContext: string;
    companionView: string;
    currentFocus: string;
    recentActivity: string;
    pendingActions: string;
    upcomingEvents: string;
    recommendedAttention: string;
    contextConfidence: string;
    timeline: string;
    recommendations: string;
    usageExamples: string;
    connectSources: string;
  };
  source: {
    status: string;
    signals: string;
    coverage: string;
    category: string;
  };
  recommendation: {
    effort: string;
    value: string;
  };
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    autoAccess: string;
    autoAccessAnswer: string;
    whyImportant: string;
    whyImportantAnswer: string;
  };
  sources: Record<string, string>;
  statuses: Record<string, string>;
  priorities: Record<string, string>;
  confidenceLevels: Record<string, string>;
};
