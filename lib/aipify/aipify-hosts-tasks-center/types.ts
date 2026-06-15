export type HostsTasksCenterSectionKey =
  | "active_tasks"
  | "scheduled_tasks"
  | "completed_tasks"
  | "playbooks"
  | "templates";

export type HostsTaskRow = {
  id: string;
  task_key: string;
  title: string;
  description: string | null;
  property: string;
  property_id: string | null;
  category: string;
  status: string;
  priority: string;
  assignee_role: string | null;
  assignee_name: string | null;
  due_date: string | null;
  scheduled_for: string | null;
  recurrence: string | null;
  playbook_key: string | null;
  is_overdue: boolean;
};

export type HostsTaskTemplateRow = {
  id: string;
  template_key: string;
  title: string;
  description: string | null;
  category: string;
  default_priority: string;
  default_assignee_role: string | null;
  recurrence: string | null;
};

export type HostsPlaybookDefinition = {
  key: string;
  label: string;
  steps: string[];
};

export type HostsPlaybookRunRow = {
  id: string;
  playbook_key: string;
  property: string;
  property_id: string | null;
  run_status: string;
  steps_completed: unknown[];
  started_at: string;
};

export type HostsTaskPropertyOption = {
  id: string;
  display_name: string;
};

export type HostsTaskNotification = {
  key: string;
  active: boolean;
  count: number;
  message: string;
};

export type HostsTasksCenterDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  active_section: string;
  positioning: string;
  governance: Record<string, boolean>;
  sections: Array<{ key: string; label: string }>;
  categories: string[];
  task_statuses: string[];
  priorities: string[];
  assignee_roles: string[];
  recurrence_options: string[];
  playbooks: HostsPlaybookDefinition[];
  notifications: HostsTaskNotification[];
  active_tasks: HostsTaskRow[];
  scheduled_tasks: HostsTaskRow[];
  completed_tasks: HostsTaskRow[];
  templates: HostsTaskTemplateRow[];
  playbook_runs: HostsPlaybookRunRow[];
  properties: HostsTaskPropertyOption[];
};

export type HostsTasksCenterActionResult = {
  success: boolean;
  task_id?: string;
  playbook_run_id?: string;
  status?: string;
};
