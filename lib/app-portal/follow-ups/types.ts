export type FollowUpCategory =
  | "customer_follow_up"
  | "internal_follow_up"
  | "pending_decision"
  | "waiting_external"
  | "strategic_reminder"
  | "overdue_commitment";

export type FollowUpStatus =
  | "open"
  | "in_progress"
  | "waiting"
  | "completed"
  | "cancelled"
  | "escalated";

export type FollowUpPriority = "low" | "medium" | "high" | "critical";

export type FollowUpItem = {
  id: string;
  title: string;
  category: FollowUpCategory;
  assigned_owner_id?: string;
  assigned_owner: string;
  created_at: string;
  due_at?: string;
  status: FollowUpStatus;
  priority: FollowUpPriority;
  related_module?: string;
  suggested_next_action?: string;
  notes?: string;
  is_suggestion?: boolean;
  is_overdue?: boolean;
  days_open?: number;
  updated_at?: string;
  completed_at?: string;
};

export type FollowUpSuggestion = {
  id: string;
  title: string;
  category: FollowUpCategory;
  priority: FollowUpPriority;
  suggested_next_action: string;
  related_module?: string;
  requires_review: boolean;
};

export type FollowUpListResponse = {
  found: boolean;
  items: FollowUpItem[];
  suggestions: FollowUpSuggestion[];
  smart_reminders: Array<{ message: string; follow_up_id?: string | null; title: string }>;
  categories: Array<{ key: FollowUpCategory; count: number }>;
  principle?: string;
};

export type FollowUpDetail = {
  found: boolean;
  follow_up?: FollowUpItem;
  assigned_users?: Array<{ id: string; name: string }>;
  timeline?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  status_history?: Array<{ status: string; at: string; description?: string }>;
  recommended_actions?: string[];
  audit_history?: FollowUpDetail["timeline"];
};

export type FollowUpFilters = {
  category?: string;
  owner_id?: string;
  status?: string;
  priority?: string;
  overdue_only?: boolean;
};

export type FollowUpsLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  emptyTitle: string;
  emptyBody: string;
  createFollowUp: string;
  back: string;
  notFound: string;
  filters: {
    title: string;
    category: string;
    status: string;
    priority: string;
    overdueOnly: string;
    all: string;
  };
  card: {
    owner: string;
    created: string;
    due: string;
    status: string;
    priority: string;
    module: string;
    nextAction: string;
    overdue: string;
  };
  detail: {
    timeline: string;
    notes: string;
    recommendedActions: string;
    statusHistory: string;
    auditHistory: string;
    assignedUsers: string;
    save: string;
    saved: string;
  };
  sections: {
    categories: string;
    items: string;
    suggestions: string;
    reminders: string;
  };
  suggestions: {
    accept: string;
    requiresReview: string;
  };
  categories: Record<FollowUpCategory, string>;
  statuses: Record<FollowUpStatus, string>;
  priorities: Record<FollowUpPriority, string>;
  form: {
    title: string;
    titlePlaceholder: string;
    category: string;
    priority: string;
    dueDate: string;
    nextAction: string;
    notes: string;
    submit: string;
    cancel: string;
  };
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    autoComplete: string;
    autoCompleteAnswer: string;
    assignment: string;
    assignmentAnswer: string;
  };
};
