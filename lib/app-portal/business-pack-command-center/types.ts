export type PackEcosystemStatus =
  | "thriving"
  | "healthy"
  | "stable"
  | "requires_attention"
  | "critical_review_needed";

export type PackHealthStatus =
  | "thriving"
  | "healthy"
  | "stable"
  | "requires_attention"
  | "at_risk";

export type PackCommandPriority =
  | "opportunity"
  | "recommended"
  | "important"
  | "immediate_attention";

export type PackUsageTrend = "growing" | "stable" | "declining";

export type PackCommandTimelineEvent = {
  id: string;
  pack_key?: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type PackCommandRecommendation = {
  id: string;
  key: string;
  pack_key: string;
  priority_level: string;
};

export type PackCommandCard = {
  id: string;
  pack_key: string;
  name: string;
  health_status: PackHealthStatus | string;
  adoption_score: number;
  value_score: number;
  usage_trend: PackUsageTrend | string;
  last_activity_at?: string | null;
  assigned_owner: string;
  recommended_action: string;
  priority_level: PackCommandPriority | string;
  value_category?: string;
  is_active?: boolean;
};

export type PackCommandInsightItem = {
  pack_key: string;
  name: string;
  value_score?: number;
  adoption_score?: number;
  usage_trend?: string;
  health_status?: string;
};

export type PackCommandOverview = {
  found: boolean;
  can_full?: boolean;
  can_manage?: boolean;
  can_view?: boolean;
  has_command_data?: boolean;
  total_installed?: number;
  active_packs?: number;
  ecosystem_status?: PackEcosystemStatus | string;
  adoption_overview?: { average_score: number; pack_count: number };
  value_overview?: { average_score: number; pack_count: number };
  packs_requiring_attention?: number;
  optimization_opportunities?: number;
  executive_summary?: string;
  packs?: PackCommandCard[];
  recommendations?: PackCommandRecommendation[];
  principle?: string;
};

export type PackCommandInsights = {
  found: boolean;
  most_valuable?: PackCommandInsightItem[];
  least_adopted?: PackCommandInsightItem[];
  fastest_growing?: PackCommandInsightItem[];
  requiring_review?: PackCommandInsightItem[];
  training_opportunities?: PackCommandInsightItem[];
  governance_observations?: string[];
};

export type PackCommandLabels = {
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
    packKey: string;
    healthStatus: string;
    adoptionLevel: string;
    valueCategory: string;
    owner: string;
    priorityLevel: string;
    periodFrom: string;
    all: string;
    lowAdoption: string;
    healthyAdoption: string;
    highAdoption: string;
  };
  dashboard: {
    totalInstalled: string;
    activePacks: string;
    adoptionOverview: string;
    valueOverview: string;
    packsRequiringAttention: string;
    optimizationOpportunities: string;
    executiveSummary: string;
    recommendedActions: string;
    ecosystemStatus: string;
    healthOverview: string;
    commandInsights: string;
    timeline: string;
  };
  card: {
    healthStatus: string;
    adoptionScore: string;
    valueScore: string;
    usageTrend: string;
    lastActivity: string;
    assignedOwner: string;
    recommendedAction: string;
    viewDetails: string;
  };
  ecosystemStatuses: Record<string, string>;
  healthStatuses: Record<string, string>;
  priorityLevels: Record<string, string>;
  usageTrends: Record<string, string>;
  valueCategories: Record<string, string>;
  recommendations: Record<string, string>;
  insights: {
    mostValuable: string;
    leastAdopted: string;
    fastestGrowing: string;
    requiringReview: string;
    trainingOpportunities: string;
    governanceObservations: string;
  };
  timelineEvents: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    replacePages: string;
    replacePagesAnswer: string;
    autoManage: string;
    autoManageAnswer: string;
  };
};

export const PACK_ECOSYSTEM_STATUSES: PackEcosystemStatus[] = [
  "thriving", "healthy", "stable", "requires_attention", "critical_review_needed",
];

export const PACK_HEALTH_STATUSES: PackHealthStatus[] = [
  "thriving", "healthy", "stable", "requires_attention", "at_risk",
];

export const PACK_COMMAND_PRIORITIES: PackCommandPriority[] = [
  "opportunity", "recommended", "important", "immediate_attention",
];

export const PACK_COMMAND_VALUE_CATEGORIES = [
  "productivity_value", "operational_efficiency", "customer_experience", "revenue_enablement",
  "cost_reduction", "risk_reduction", "employee_experience", "strategic_value",
] as const;
