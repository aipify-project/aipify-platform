import type {
  HealthCategory,
  HealthTrend,
  RecommendationType,
  RecoveryWorkflowType,
  SupportStatus,
  WarningSignal,
} from "./constants";

export type HealthFilters = {
  health_category?: HealthCategory | "";
  trend?: HealthTrend | "";
};

export type HealthOverview = {
  healthy: number;
  stable: number;
  attention_needed: number;
  at_risk: number;
  recovery_opportunities: number;
};

export type HealthCustomerRow = {
  customer_id: string;
  company: string;
  health_score: number;
  health_category: HealthCategory;
  trend: HealthTrend;
  last_activity: string | null;
  subscription_plan: string;
  support_status: SupportStatus;
  assigned_success_owner: string;
};

export type EarlyWarning = {
  id: string;
  customer_id: string;
  company: string;
  signal_type: WarningSignal;
  severity: string;
  message: string;
  created_at: string;
};

export type HealthRecommendation = {
  id: string;
  customer_id: string;
  company: string;
  recommendation_type: RecommendationType;
  title: string;
  summary: string;
  status: string;
};

export type HealthTask = {
  id: string;
  customer_id: string;
  company: string;
  task_type: string;
  title: string;
  status: string;
  created_at: string;
};

export type RecoveryWorkflow = {
  id: string;
  customer_id: string;
  company: string;
  workflow_type: RecoveryWorkflowType;
  status: string;
  owner: string;
  notes: string;
  created_at: string;
};

export type HealthAuditEntry = {
  id: string;
  customer_id: string | null;
  event_type: string;
  summary: string;
  created_at: string;
};

export type CustomerHealthDashboard = {
  principle: string;
  privacy_note: string;
  is_empty: boolean;
  filters: HealthFilters;
  overview: HealthOverview;
  customers: HealthCustomerRow[];
  early_warnings: EarlyWarning[];
  recommendations: HealthRecommendation[];
  tasks: HealthTask[];
  recovery_workflows: RecoveryWorkflow[];
  audit: HealthAuditEntry[];
};

export type CustomerHealthLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  privacyNote: string;
  emptyState: string;
  sections: {
    overview: string;
    customers: string;
    warnings: string;
    recommendations: string;
    tasks: string;
    recovery: string;
    audit: string;
    filters: string;
  };
  overview: {
    healthy: string;
    stable: string;
    attentionNeeded: string;
    atRisk: string;
    recoveryOpportunities: string;
  };
  table: {
    company: string;
    healthScore: string;
    trend: string;
    lastActivity: string;
    subscriptionPlan: string;
    supportStatus: string;
    assignedOwner: string;
    actions: string;
    signal: string;
    message: string;
    recommendation: string;
    task: string;
    workflow: string;
    event: string;
  };
  healthCategories: Record<HealthCategory, string>;
  trends: Record<HealthTrend, string>;
  supportStatuses: Record<SupportStatus, string>;
  actions: {
    assignOwner: string;
    recoveryOutreach: string;
    onboardingSequence: string;
    recommendTraining: string;
    scheduleCheckIn: string;
    resolveWarning: string;
    completeTask: string;
    applying: string;
  };
  filters: {
    category: string;
    trend: string;
    allCategories: string;
    allTrends: string;
    apply: string;
  };
};
