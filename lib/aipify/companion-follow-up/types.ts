export type FollowUpStatus = "open" | "pending" | "waiting" | "overdue" | "completed" | "archived";
export type FollowUpPriority = "critical" | "high" | "medium" | "low";
export type FollowUpCategory =
  | "personal_tasks"
  | "team_commitments"
  | "customer_follow_ups"
  | "partner_follow_ups"
  | "executive_reviews"
  | "training_activities"
  | "meeting_actions"
  | "opportunity_reviews"
  | "support_escalations"
  | "approval_requests";
export type FollowUpSource =
  | "tasks"
  | "meetings"
  | "calendar_events"
  | "email_activity"
  | "notes"
  | "companion_recommendations"
  | "opportunities"
  | "projects"
  | "support_cases"
  | "business_packs";

export type FollowUpItem = {
  id: string;
  title: string;
  description: string;
  explanation: string;
  category: FollowUpCategory | string;
  source_type: FollowUpSource | string;
  priority: FollowUpPriority | string;
  status: FollowUpStatus | string;
  assigned_to?: string;
  owner_label?: string;
  due_date?: string | null;
  recommended_action?: string;
  waiting_direction?: string | null;
  waiting_subtype?: string;
  department?: string;
  detection_type?: string;
  created_at?: string;
  updated_at?: string;
  completed_at?: string | null;
};

export type FollowUpTimelineEvent = {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type FollowUpDashboard = {
  found: boolean;
  has_follow_ups?: boolean;
  role?: string;
  can_team?: boolean;
  can_organization?: boolean;
  can_executive?: boolean;
  follow_up_health_score?: number;
  open_count?: number;
  overdue_count?: number;
  upcoming_count?: number;
  completed_count?: number;
  success_rate?: number;
  items?: FollowUpItem[];
  timeline?: FollowUpTimelineEvent[];
  usage_example?: string;
  privacy_note?: string;
  principle?: string;
};

export type CompanionFollowUpLabels = {
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
    status: string;
    priority: string;
    owner: string;
    department: string;
    category: string;
    all: string;
  };
  sections: {
    openFollowUps: string;
    overdueFollowUps: string;
    upcomingFollowUps: string;
    completedFollowUps: string;
    waitingOnOthers: string;
    waitingForMe: string;
    timeline: string;
    usageExamples: string;
    allFollowUps: string;
  };
  dashboard: {
    healthScore: string;
    openFollowUps: string;
    overdueFollowUps: string;
    upcomingFollowUps: string;
    completedFollowUps: string;
    successRate: string;
  };
  card: {
    explanation: string;
    assignedTo: string;
    recommendedAction: string;
    dueDate: string;
    priority: string;
    status: string;
    category: string;
    source: string;
  };
  actions: {
    complete: string;
    postpone: string;
    archive: string;
    createReminder: string;
    reviewActivities: string;
  };
  priorities: Record<string, string>;
  statuses: Record<string, string>;
  categories: Record<string, string>;
  sources: Record<string, string>;
  recommendedActions: Record<string, string>;
  waiting: {
    awaitingResponses: string;
    pendingApprovals: string;
    externalDependencies: string;
    teamDependencies: string;
    assignedRequests: string;
    customerResponses: string;
    teamCommitments: string;
    leadershipRequests: string;
  };
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    reminders: string;
    remindersAnswer: string;
    whyImportant: string;
    whyImportantAnswer: string;
  };
};
