export type HostsCleaningSectionKey =
  | "todays_cleaning"
  | "upcoming_cleaning"
  | "active_cleaning_tasks"
  | "cleaning_teams"
  | "cleaning_history";

export type HostsCleaningChecklistProgress = {
  completed_count: number;
  total_count: number;
  items: Record<string, boolean>;
};

export type HostsCleaningTaskRow = {
  id: string;
  cleaning_key: string;
  property_id: string | null;
  property: string;
  cleaner_id: string | null;
  assigned_cleaner: string;
  category: string;
  departure_date: string;
  arrival_date: string;
  cleaning_status: string;
  due_time: string;
  scheduled_date: string;
  started_at: string;
  completed_at: string;
  checklist: HostsCleaningChecklistProgress;
  completion_notes: string;
  issue_count: number;
  is_overdue: boolean;
  is_today: boolean;
};

export type HostsCleaningCleanerRow = {
  id: string;
  cleaner_key: string;
  cleaner_name: string;
  contact_email: string;
  contact_phone: string;
  assigned_properties: unknown;
  cleaner_status: string;
  active_tasks: number;
};

export type HostsCleaningIssueRow = {
  id: string;
  cleaning_task_id: string;
  issue_category: string;
  description: string;
  property: string;
  reported_at: string;
};

export type HostsCleaningTimelineRow = {
  id: string;
  cleaning_task_id: string;
  event_type: string;
  summary: string;
  occurred_at: string;
};

export type HostsCleaningStats = {
  cleanings_today: number;
  overdue_cleanings: number;
  properties_awaiting_cleaning: number;
  issues_requiring_attention: number;
  active_tasks: number;
  active_cleaners: number;
};

export type HostsCleaningCenterDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  active_section: string;
  positioning: string;
  governance: Record<string, boolean>;
  sections: Array<{ key: string; label: string }>;
  checklist_keys: string[];
  stats: HostsCleaningStats;
  properties: Array<{ id: string; display_name: string }>;
  cleaning_tasks: HostsCleaningTaskRow[];
  cleaners: HostsCleaningCleanerRow[];
  issues: HostsCleaningIssueRow[];
  timeline: HostsCleaningTimelineRow[];
};

export type HostsCleaningCenterActionResult = {
  success: boolean;
  action_type?: string;
  summary?: string;
  cleaning_task_id?: string;
};
