import type { FocusTrend, NoteType, ReminderType, TaskPriority, TaskStatus } from "./constants";

export type WorkspaceOverview = {
  my_tasks: number;
  today_priorities: number;
  upcoming_reminders: number;
  pending_approvals: number;
  suggested_actions: number;
  completed_this_week: number;
};

export type WorkspaceTask = {
  id: string;
  title: string;
  description: string;
  due_date: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  category: string;
  assignee_user_id: string | null;
  assignee_label: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type WorkspaceReminder = {
  id: string;
  title: string;
  reminder_type: ReminderType;
  due_at: string;
  recurrence_rule: string | null;
  linked_task_id: string | null;
  dismissed_at: string | null;
  created_at: string;
};

export type WorkspaceNote = {
  id: string;
  title: string;
  body: string;
  note_type: NoteType;
  created_at: string;
  updated_at: string;
};

export type WorkspaceMeeting = {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string | null;
  calendar_purpose: string;
};

export type WorkspaceFocusArea = {
  key: string;
  label: string;
};

export type WorkspaceMyDay = {
  tasks: WorkspaceTask[];
  meetings: WorkspaceMeeting[];
  reminders: WorkspaceReminder[];
  focus_areas: WorkspaceFocusArea[];
};

export type WorkspaceInsights = {
  completed_this_week: number;
  average_completion_hours: number;
  overdue_items: number;
  focus_trend: FocusTrend;
};

export type WorkspaceSuggestion = {
  key: string;
  message_key: string;
  count?: number;
  severity: string;
};

export type WorkspaceAuditEntry = {
  id: string;
  event_type: string;
  summary: string;
  created_at: string;
};

export type WorkspaceFilters = {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: string;
  due_from?: string;
  due_to?: string;
};

export type WorkspaceProductivityHub = {
  has_customer: boolean;
  user_name?: string;
  overview?: WorkspaceOverview;
  my_day?: WorkspaceMyDay;
  tasks?: WorkspaceTask[];
  reminders?: WorkspaceReminder[];
  notes?: WorkspaceNote[];
  insights?: WorkspaceInsights;
  suggestions?: WorkspaceSuggestion[];
  audit?: WorkspaceAuditEntry[];
  filters?: WorkspaceFilters;
  principle?: string;
};

export type WorkspaceProductivityHubLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  overview: Record<string, string>;
  sections: Record<string, string>;
  quickActions: Record<string, string>;
  priorities: Record<string, string>;
  statuses: Record<string, string>;
  reminderTypes: Record<string, string>;
  noteTypes: Record<string, string>;
  focusTrends: Record<string, string>;
  suggestions: Record<string, string>;
  filters: Record<string, string>;
  empty: string;
  searchPlaceholder: string;
  applyFilters: string;
  clearFilters: string;
  viewApprovals: string;
  youDecide: string;
};
