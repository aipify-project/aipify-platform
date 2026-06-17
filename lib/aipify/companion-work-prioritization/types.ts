export type PriorityLevel = "critical" | "high" | "medium" | "low" | "optional";
export type PrioritySource =
  | "tasks"
  | "calendar"
  | "approvals"
  | "projects"
  | "recommendations"
  | "proactive_insights"
  | "notifications"
  | "business_packs"
  | "organizational_goals"
  | "executive_priorities";
export type PriorityStatus = "pending" | "in_progress" | "blocked" | "completed" | "archived" | "postponed";
export type RecommendedAction =
  | "complete_immediately"
  | "review_today"
  | "schedule_this_week"
  | "delegate"
  | "monitor"
  | "archive";

export type WorkPriorityItem = {
  id: string;
  title: string;
  description: string;
  priority_level: PriorityLevel | string;
  priority_score: number;
  reason: string;
  recommended_action: RecommendedAction | string;
  source_type: PrioritySource | string;
  owner_label?: string;
  due_date?: string | null;
  status: PriorityStatus | string;
  department?: string;
  project?: string;
  factors?: Record<string, unknown>;
  rank_order?: number;
};

export type WorkloadSnapshot = {
  current_workload: number;
  upcoming_workload: number;
  overload_risk: string;
  capacity_indicator: string;
  delegation_suggestion: string;
};

export type PriorityDependency = {
  id: string;
  dependency_type: string;
  title: string;
  description: string;
  priority_id?: string;
  related_key?: string;
};

export type FocusModeView = {
  top_priority?: string;
  next_priority?: string;
  suggested_sequence?: unknown[];
  focus_limit?: number;
};

export type PriorityTimelineEvent = {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type WorkPrioritizationDashboard = {
  found: boolean;
  has_priorities?: boolean;
  role?: string;
  can_team?: boolean;
  can_organization?: boolean;
  can_executive?: boolean;
  work_priority_score?: number;
  critical_count?: number;
  focus_limit?: number;
  todays_focus?: string;
  items?: WorkPriorityItem[];
  workload?: WorkloadSnapshot | null;
  timeline?: PriorityTimelineEvent[];
  usage_example?: string;
  privacy_note?: string;
  principle?: string;
};

export type CompanionWorkPrioritizationLabels = {
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
    priority: string;
    department: string;
    status: string;
    project: string;
    owner: string;
    all: string;
  };
  sections: {
    criticalItems: string;
    todaysFocus: string;
    upcomingDeadlines: string;
    delegationOpportunities: string;
    recommendedActions: string;
    workloadBalance: string;
    dependencies: string;
    focusMode: string;
    timeline: string;
    usageExamples: string;
    allPriorities: string;
  };
  dashboard: {
    workPriorityScore: string;
    criticalItems: string;
    todaysFocus: string;
    upcomingDeadlines: string;
    delegationOpportunities: string;
    recommendedActions: string;
  };
  card: {
    reason: string;
    recommendedAction: string;
    owner: string;
    dueDate: string;
    priority: string;
    status: string;
    source: string;
    project: string;
  };
  actions: { recalculate: string; viewDetails: string; reviewTasks: string };
  priorities: Record<string, string>;
  statuses: Record<string, string>;
  sources: Record<string, string>;
  recommendedActions: Record<string, string>;
  workload: {
    current: string;
    upcoming: string;
    overloadRisk: string;
    capacity: string;
    delegationSuggestion: string;
  };
  dependencies: {
    blocked: string;
    blocking: string;
    dependent_team: string;
    pending_approval: string;
  };
  focusMode: {
    topPriority: string;
    nextPriority: string;
    suggestedSequence: string;
    estimatedEffort: string;
  };
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    canDecide: string;
    canDecideAnswer: string;
    howCalculated: string;
    howCalculatedAnswer: string;
  };
};
