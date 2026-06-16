export type CapacityCategory =
  | "individual_capacity"
  | "team_capacity"
  | "department_capacity"
  | "operational_capacity"
  | "leadership_capacity"
  | "support_capacity"
  | "project_capacity"
  | "seasonal_capacity"
  | "growth_capacity"
  | "custom_category";

export type CapacityStatus =
  | "healthy"
  | "approaching_limit"
  | "overloaded"
  | "underutilized"
  | "requires_review";

export type WorkloadLevel = "very_low" | "balanced" | "elevated" | "high" | "critical";

export type TrendDirection = "increasing" | "stable" | "decreasing";

export type TeamBreakdownItem = {
  name: string;
  utilization: number;
  workload_level?: WorkloadLevel;
};

export type CapacityRecordItem = {
  id: string;
  title: string;
  owner_id?: string | null;
  owner_name: string;
  team_name: string;
  category: CapacityCategory;
  current_utilization: number;
  recommended_utilization: number;
  trend_direction: TrendDirection;
  workload_level: WorkloadLevel;
  status: CapacityStatus;
  last_updated_date?: string;
  related_operations?: string[];
  notes?: string;
  notes_full?: string;
  team_breakdown?: TeamBreakdownItem[];
  created_at: string;
  updated_at: string;
};

export type TrendHistoryItem = {
  id: string;
  utilization: number;
  workload_level: WorkloadLevel;
  trend_direction: TrendDirection;
  notes?: string;
  recorded_at: string;
};

export type WorkloadInsight = {
  key: string;
  active: boolean;
};

export type CapacityRecommendation = {
  id: string;
  key: string;
  priority: string;
  record_id?: string;
};

export type CapacityDashboard = {
  overview_utilization: number;
  teams_approaching_limits: number;
  balanced_teams: number;
  recent_changes: CapacityRecordItem[];
  recommended_reviews: number;
};

export type CapacityListResponse = {
  found: boolean;
  can_manage?: boolean;
  items: CapacityRecordItem[];
  dashboard?: CapacityDashboard;
  workload_insights?: WorkloadInsight[];
  recommendations?: CapacityRecommendation[];
  principle?: string;
};

export type CapacityDetail = {
  found: boolean;
  can_manage?: boolean;
  record?: CapacityRecordItem;
  trend_history?: TrendHistoryItem[];
  related_follow_ups?: Array<{ id: string; title: string; status: string }>;
  activity_timeline?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  audit_history?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  recommendations?: CapacityRecommendation[];
};

export type CapacityWorkloadLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  back: string;
  notFound: string;
  accessDenied: string;
  filters: {
    search: string;
    team: string;
    category: string;
    status: string;
    owner: string;
    workload: string;
    trend: string;
    all: string;
  };
  dashboard: {
    overview: string;
    approachingLimits: string;
    balancedTeams: string;
    capacityTrends: string;
    recentChanges: string;
    recommendedReviews: string;
  };
  insights: {
    title: string;
    persistentOverload: string;
    suddenIncrease: string;
    aboveLimits: string;
    unusedCapacity: string;
    operationalStrain: string;
    inactive: string;
  };
  form: {
    createTitle: string;
    title: string;
    team: string;
    category: string;
    currentUtilization: string;
    recommendedUtilization: string;
    trend: string;
    notes: string;
    submit: string;
    cancel: string;
  };
  card: {
    owner: string;
    team: string;
    utilization: string;
    recommended: string;
    trend: string;
    workload: string;
    lastUpdated: string;
    view: string;
  };
  detail: {
    overview: string;
    trendAnalysis: string;
    teamBreakdown: string;
    relatedActivities: string;
    relatedFollowUps: string;
    followUpRecommendations: string;
    timeline: string;
    audit: string;
    save: string;
    saved: string;
    recommendations: string;
  };
  categories: Record<CapacityCategory, string>;
  statuses: Record<CapacityStatus, string>;
  workload: Record<WorkloadLevel, string>;
  trends: Record<TrendDirection, string>;
  recommendations: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    monitoring: string;
    monitoringAnswer: string;
    autoRebalance: string;
    autoRebalanceAnswer: string;
  };
};
