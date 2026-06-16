export type StrategyCategory =
  | "growth_strategy"
  | "customer_strategy"
  | "operational_excellence"
  | "digital_transformation"
  | "innovation_strategy"
  | "employee_strategy"
  | "financial_strategy"
  | "risk_strategy"
  | "sustainability_strategy"
  | "custom_strategic_theme";

export type StrategyStatus =
  | "planning"
  | "active"
  | "on_track"
  | "needs_attention"
  | "delayed"
  | "completed"
  | "archived";

export type StrategicImportance =
  | "important"
  | "high_priority"
  | "critical_priority"
  | "transformational";

export type StrategyMilestoneStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "missed"
  | "cancelled";

export type StrategyInitiativeItem = {
  id: string;
  title: string;
  description?: string;
  description_full?: string;
  category: StrategyCategory;
  executive_sponsor_id?: string | null;
  executive_sponsor_name: string;
  initiative_owner_id?: string | null;
  initiative_owner_name: string;
  contributor_ids?: string[];
  status: StrategyStatus;
  strategic_importance: StrategicImportance;
  start_date?: string | null;
  target_date?: string | null;
  success_definition?: string;
  success_definition_full?: string;
  progress_percent: number;
  needs_attention?: boolean;
  notes?: string;
  notes_full?: string;
  created_at: string;
  updated_at: string;
};

export type StrategyMilestone = {
  id: string;
  initiative_id: string;
  title: string;
  owner_id?: string | null;
  owner_name: string;
  target_date?: string | null;
  completion_date?: string | null;
  status: StrategyMilestoneStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type StrategyExecutionInsight = {
  id: string;
  key: string;
  count?: number;
  priority?: string;
};

export type StrategyExecutionRecommendation = {
  id: string;
  key: string;
  priority: string;
  initiative_id?: string;
};

export type StrategyDashboard = {
  active: number;
  requiring_attention: StrategyInitiativeItem[];
  progress_overview: number;
  upcoming_milestones: StrategyMilestone[];
  recently_completed: StrategyInitiativeItem[];
  execution_trends: StrategyInitiativeItem[];
};

export type StrategyListResponse = {
  found: boolean;
  can_manage?: boolean;
  items: StrategyInitiativeItem[];
  dashboard?: StrategyDashboard;
  execution_insights?: StrategyExecutionInsight[];
  recommendations?: StrategyExecutionRecommendation[];
  principle?: string;
};

export type StrategyDetail = {
  found: boolean;
  can_manage?: boolean;
  initiative?: StrategyInitiativeItem;
  milestones?: StrategyMilestone[];
  related_goals?: Array<{ id: string; title: string; status: string }>;
  related_decisions?: Array<{ id: string; title: string; status: string }>;
  related_follow_ups?: Array<{ id: string; title: string; status: string }>;
  related_risks?: Array<{ id: string; title: string; status: string }>;
  milestone_timeline?: StrategyMilestone[];
  audit_history?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  execution_insights?: StrategyExecutionInsight[];
  recommendations?: StrategyExecutionRecommendation[];
};

export type StrategyExecutionLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  back: string;
  notFound: string;
  filters: {
    search: string;
    category: string;
    status: string;
    owner: string;
    sponsor: string;
    importance: string;
    targetFrom: string;
    targetTo: string;
    all: string;
  };
  dashboard: {
    active: string;
    requiringAttention: string;
    progressOverview: string;
    upcomingMilestones: string;
    recentlyCompleted: string;
    executionTrends: string;
  };
  form: {
    createTitle: string;
    title: string;
    description: string;
    category: string;
    importance: string;
    successDefinition: string;
    targetDate: string;
    notes: string;
    submit: string;
    cancel: string;
  };
  card: {
    owner: string;
    sponsor: string;
    importance: string;
    progress: string;
    targetDate: string;
    view: string;
  };
  detail: {
    overview: string;
    ownership: string;
    progressTracking: string;
    successDefinition: string;
    relatedGoals: string;
    relatedDecisions: string;
    relatedFollowUps: string;
    relatedRisks: string;
    milestoneTimeline: string;
    audit: string;
    save: string;
    saved: string;
    recommendations: string;
    executionInsights: string;
    addMilestone: string;
    milestoneTitle: string;
    milestoneTarget: string;
    milestoneNotes: string;
    milestoneSubmit: string;
  };
  categories: Record<StrategyCategory, string>;
  statuses: Record<StrategyStatus, string>;
  importanceLevels: Record<StrategicImportance, string>;
  milestoneStatuses: Record<StrategyMilestoneStatus, string>;
  insights: Record<string, string>;
  recommendations: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    whyOwners: string;
    whyOwnersAnswer: string;
    autoExecute: string;
    autoExecuteAnswer: string;
  };
};
