export type AutomationStatus =
  | "recommended"
  | "draft"
  | "active"
  | "paused"
  | "requires_review"
  | "retired";

export type AutomationCategory =
  | "operational"
  | "support"
  | "governance"
  | "executive"
  | "notification"
  | "business_pack"
  | "customer_success"
  | "custom";

export type AutomationHealthStatus = "healthy" | "stable" | "requires_attention" | "at_risk";

export type AutomationApproval = {
  id: string;
  status: string;
  approver_name: string;
  governance_notes: string;
  review_schedule: string;
  approved_at?: string;
};

export type AutomationCard = {
  id: string;
  automation_key: string;
  name: string;
  pack_key: string;
  category: AutomationCategory | string;
  status: AutomationStatus | string;
  health_status: AutomationHealthStatus | string;
  trigger_description: string;
  action_description: string;
  estimated_value: number;
  time_saved_hours: number;
  owner: string;
  success_rate: number;
  recommended_improvements?: string[];
  last_execution_at?: string | null;
};

export type AutomationInsightItem = {
  automation_key: string;
  name: string;
  estimated_value?: number;
};

export type AutomationInsights = {
  most_valuable?: AutomationInsightItem[];
  underutilized?: AutomationInsightItem[];
  frequently_used?: AutomationInsightItem[];
  failed_attention?: AutomationInsightItem[];
  expansion_opportunities?: AutomationInsightItem[];
};

export type AutomationRecommendation = {
  id: string;
  key: string;
  automation_key?: string;
};

export type AutomationTimelineEvent = {
  id: string;
  automation_key?: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type AutomationOverview = {
  found: boolean;
  can_full?: boolean;
  can_manage?: boolean;
  can_view?: boolean;
  can_approve?: boolean;
  has_automation_data?: boolean;
  total_automations?: number;
  active_automations?: number;
  recommended_automations?: number;
  automations_requiring_review?: number;
  time_saved_hours?: number;
  executive_summary?: string;
  automations?: AutomationCard[];
  insights?: AutomationInsights;
  recommendations?: AutomationRecommendation[];
  principle?: string;
};

export type AutomationDetail = AutomationCard & {
  found: boolean;
  approval_history?: AutomationApproval[];
  can_approve?: boolean;
  recommendations?: AutomationRecommendation[];
};

export type AutomationApproveResult = {
  found: boolean;
  approval_id?: string;
  status?: string;
  automation_key?: string;
  message?: string;
};

export type AutomationLabels = {
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
    category: string;
    status: string;
    owner: string;
    packKey: string;
    healthStatus: string;
    periodFrom: string;
    all: string;
  };
  dashboard: {
    totalAutomations: string;
    activeAutomations: string;
    recommendedAutomations: string;
    requiringReview: string;
    timeSaved: string;
    healthOverview: string;
    executiveSummary: string;
    recommendedActions: string;
    automationInsights: string;
    timeline: string;
    approvalHistory: string;
  };
  card: {
    category: string;
    status: string;
    healthStatus: string;
    trigger: string;
    action: string;
    estimatedValue: string;
    owner: string;
    lastExecution: string;
    successRate: string;
    improvements: string;
    viewDetails: string;
    approve: string;
  };
  approval: {
    title: string;
    notes: string;
    reviewSchedule: string;
    submit: string;
    success: string;
    governanceNote: string;
  };
  statuses: Record<string, string>;
  categories: Record<string, string>;
  healthStatuses: Record<string, string>;
  recommendations: Record<string, string>;
  insights: {
    mostValuable: string;
    underutilized: string;
    frequentlyUsed: string;
    failedAttention: string;
    expansionOpportunities: string;
  };
  timelineEvents: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    autoActivate: string;
    autoActivateAnswer: string;
    whyGovernance: string;
    whyGovernanceAnswer: string;
  };
};

export const AUTOMATION_STATUSES: AutomationStatus[] = [
  "recommended", "draft", "active", "paused", "requires_review", "retired",
];

export const AUTOMATION_CATEGORIES: AutomationCategory[] = [
  "operational", "support", "governance", "executive", "notification",
  "business_pack", "customer_success", "custom",
];

export const AUTOMATION_HEALTH_STATUSES: AutomationHealthStatus[] = [
  "healthy", "stable", "requires_attention", "at_risk",
];
