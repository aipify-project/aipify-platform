export type MeetingType =
  | "executive_meeting"
  | "team_meeting"
  | "project_meeting"
  | "customer_meeting"
  | "vendor_meeting"
  | "retrospective"
  | "planning_session"
  | "incident_review"
  | "compliance_review"
  | "custom_meeting";

export type MeetingStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export type ActionStatus = "open" | "in_progress" | "waiting" | "completed" | "cancelled";

export type ActionPriority = "low" | "medium" | "high";

export type MeetingItem = {
  id: string;
  title: string;
  description?: string;
  description_full?: string;
  meeting_type: MeetingType;
  organizer_id?: string | null;
  organizer_name: string;
  participant_ids?: string[];
  meeting_at: string;
  duration_minutes: number;
  status: MeetingStatus;
  objectives?: string;
  objectives_full?: string;
  notes?: string;
  notes_full?: string;
  related_modules?: string[];
  related_goal_ids?: string[];
  needs_outcomes?: boolean;
  without_notes?: boolean;
  open_actions?: number;
  overdue_actions?: number;
  created_at: string;
  updated_at: string;
};

export type MeetingActionItem = {
  id: string;
  meeting_id: string;
  title: string;
  description?: string;
  owner_id?: string | null;
  owner_name: string;
  due_date?: string | null;
  priority: ActionPriority;
  status: ActionStatus;
  overdue?: boolean;
  created_at: string;
  updated_at: string;
};

export type MeetingDecision = {
  id: string;
  meeting_id: string;
  title: string;
  rationale?: string;
  owner_id?: string | null;
  owner_name: string;
  related_goal_ids?: string[];
  related_follow_up_ids?: string[];
  created_at: string;
};

export type MeetingRecommendation = {
  id: string;
  key: string;
  priority: string;
  meeting_id?: string;
};

export type MeetingsDashboard = {
  upcoming: number;
  needs_outcomes: number;
  outstanding_actions: number;
  recently_completed: MeetingItem[];
  without_notes: number;
  overdue_actions: number;
};

export type MeetingListResponse = {
  found: boolean;
  can_manage?: boolean;
  items: MeetingItem[];
  dashboard?: MeetingsDashboard;
  recommendations?: MeetingRecommendation[];
  principle?: string;
};

export type MeetingDetail = {
  found: boolean;
  can_manage?: boolean;
  meeting?: MeetingItem;
  participants?: Array<{ user_id: string; name: string }>;
  action_items?: MeetingActionItem[];
  decisions?: MeetingDecision[];
  related_goals?: Array<{ id: string; title: string; status: string }>;
  related_follow_ups?: Array<{ id: string; title: string; status: string }>;
  activity_timeline?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  audit_history?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  recommendations?: MeetingRecommendation[];
};

export type MeetingsLabels = {
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
    type: string;
    status: string;
    organizer: string;
    dateFrom: string;
    dateTo: string;
    outstandingActions: string;
    all: string;
    yes: string;
    no: string;
  };
  dashboard: {
    upcoming: string;
    needsOutcomes: string;
    outstandingActions: string;
    recentlyCompleted: string;
    withoutNotes: string;
    overdueActions: string;
  };
  form: {
    createTitle: string;
    title: string;
    type: string;
    description: string;
    objectives: string;
    meetingAt: string;
    duration: string;
    notes: string;
    submit: string;
    cancel: string;
  };
  card: {
    organizer: string;
    meetingAt: string;
    duration: string;
    openActions: string;
    view: string;
  };
  detail: {
    overview: string;
    participants: string;
    notes: string;
    objectives: string;
    decisions: string;
    actionItems: string;
    relatedGoals: string;
    relatedFollowUps: string;
    activity: string;
    audit: string;
    save: string;
    saved: string;
    recommendations: string;
    addAction: string;
    addDecision: string;
    actionTitle: string;
    actionDue: string;
    decisionTitle: string;
    decisionRationale: string;
  };
  types: Record<MeetingType, string>;
  statuses: Record<MeetingStatus, string>;
  actionStatuses: Record<ActionStatus, string>;
  priorities: Record<ActionPriority, string>;
  recommendations: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    outcomes: string;
    outcomesAnswer: string;
    autoComplete: string;
    autoCompleteAnswer: string;
  };
};
