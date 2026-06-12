export type OrganizationTask = {
  id?: string;
  title?: string;
  description?: string;
  assigned_user_id?: string;
  created_by?: string;
  priority?: string;
  status?: string;
  due_date?: string;
  source_type?: string;
  source_id?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type OrganizationTaskReminder = {
  id?: string;
  task_id?: string;
  remind_at?: string;
  channel?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type OrganizationTaskEscalation = {
  id?: string;
  task_id?: string;
  escalation_level?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type UnifiedTaskFollowUpEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  my_open_tasks?: number;
  overdue_tasks?: number;
  critical_tasks?: number;
  completed_tasks_30d?: number;
  [key: string]: unknown;
};

export type UnifiedTaskFollowUpEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  sections?: {
    my_tasks?: OrganizationTask[];
    team_tasks?: OrganizationTask[];
    overdue_tasks?: OrganizationTask[];
    upcoming_deadlines?: OrganizationTask[];
    critical_tasks?: OrganizationTask[];
    completed_tasks?: OrganizationTask[];
  };
  reminders?: OrganizationTaskReminder[];
  escalations?: OrganizationTaskEscalation[];
  settings?: Record<string, unknown>;
  executive_summary?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};

export type UnifiedTaskFollowUpExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  tasks?: OrganizationTask[];
  reminders?: OrganizationTaskReminder[];
  escalations?: OrganizationTaskEscalation[];
  summary?: Record<string, unknown>;
  [key: string]: unknown;
};
