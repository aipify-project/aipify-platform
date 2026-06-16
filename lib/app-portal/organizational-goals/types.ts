export type GoalType =
  | "strategic"
  | "operational"
  | "customer_experience"
  | "employee_experience"
  | "revenue"
  | "security"
  | "growth"
  | "innovation"
  | "compliance";

export type GoalStatus = "draft" | "active" | "at_risk" | "on_track" | "achieved" | "cancelled";
export type GoalPriority = "low" | "medium" | "high" | "critical";
export type ProgressUpdateType =
  | "milestone_achieved"
  | "progress_change"
  | "challenge"
  | "lesson_learned"
  | "support_needed";

export type GoalItem = {
  id: string;
  title: string;
  description: string;
  description_full?: string;
  goal_type: GoalType;
  owner_id?: string;
  owner_name: string;
  contributor_ids?: string[];
  status: GoalStatus;
  priority: GoalPriority;
  start_date?: string | null;
  target_date?: string | null;
  success_criteria: string;
  success_criteria_full?: string;
  progress_percent: number;
  related_business_packs?: string[];
  related_initiatives?: string[];
  related_follow_up_ids?: string[];
  created_at: string;
  updated_at: string;
};

export type GoalRecommendation = {
  id: string;
  key: string;
  priority: string;
  goal_id?: string;
};

export type GoalsDashboard = {
  active_goals: number;
  achieved_this_quarter: number;
  requiring_attention: number;
  upcoming_target_dates: Array<{ id: string; title: string; target_date?: string; status: string }>;
};

export type GoalListResponse = {
  found: boolean;
  can_manage?: boolean;
  items: GoalItem[];
  dashboard?: GoalsDashboard;
  recommendations?: GoalRecommendation[];
  principle?: string;
};

export type GoalContributor = { user_id: string; name: string };

export type GoalProgressEntry = {
  id: string;
  update_type: ProgressUpdateType;
  progress_percent?: number | null;
  milestone_title?: string | null;
  notes: string;
  created_at: string;
  created_by: string;
};

export type GoalRelatedLink = { id: string; title: string; status: string };

export type GoalAuditEntry = {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
  performed_by: string;
};

export type GoalDetail = {
  found: boolean;
  can_manage?: boolean;
  goal?: GoalItem;
  contributors?: GoalContributor[];
  progress_timeline?: GoalProgressEntry[];
  related_follow_ups?: GoalRelatedLink[];
  related_decisions?: GoalRelatedLink[];
  related_actions?: GoalRelatedLink[];
  activity_history?: GoalAuditEntry[];
  audit_history?: GoalAuditEntry[];
  recommendations?: GoalRecommendation[];
};

export type OrganizationalGoalsLabels = {
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
    goalType: string;
    status: string;
    priority: string;
    owner: string;
    all: string;
  };
  dashboard: {
    active: string;
    achievedQuarter: string;
    attention: string;
    upcoming: string;
  };
  form: {
    createTitle: string;
    title: string;
    description: string;
    goalType: string;
    priority: string;
    status: string;
    startDate: string;
    targetDate: string;
    successCriteria: string;
    submit: string;
    cancel: string;
  };
  card: {
    progress: string;
    owner: string;
    targetDate: string;
    view: string;
  };
  detail: {
    overview: string;
    successCriteria: string;
    contributors: string;
    progressTimeline: string;
    relatedActions: string;
    relatedDecisions: string;
    relatedFollowUps: string;
    activityHistory: string;
    auditHistory: string;
    recommendations: string;
    save: string;
    saved: string;
    progressUpdate: string;
    updateType: string;
    progressPercent: string;
    milestoneTitle: string;
    notes: string;
    recordProgress: string;
  };
  goalTypes: Record<GoalType, string>;
  statuses: Record<GoalStatus, string>;
  priorities: Record<GoalPriority, string>;
  progressTypes: Record<ProgressUpdateType, string>;
  recommendations: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    updated: string;
    updatedAnswer: string;
    autoComplete: string;
    autoCompleteAnswer: string;
  };
};
