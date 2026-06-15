import type {
  HostsPlaybookDefinition,
  HostsPlaybookRunRow,
  HostsTaskNotification,
  HostsTaskRow,
  HostsTasksCenterActionResult,
  HostsTasksCenterDashboard,
  HostsTaskTemplateRow,
  HostsTaskPropertyOption,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseTaskRow(data: unknown): HostsTaskRow | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.id) return null;
  return {
    id: String(d.id),
    task_key: typeof d.task_key === "string" ? d.task_key : "",
    title: typeof d.title === "string" ? d.title : "",
    description: typeof d.description === "string" ? d.description : null,
    property: typeof d.property === "string" ? d.property : "",
    property_id: d.property_id != null ? String(d.property_id) : null,
    category: typeof d.category === "string" ? d.category : "",
    status: typeof d.status === "string" ? d.status : "",
    priority: typeof d.priority === "string" ? d.priority : "",
    assignee_role: typeof d.assignee_role === "string" ? d.assignee_role : null,
    assignee_name: typeof d.assignee_name === "string" ? d.assignee_name : null,
    due_date: d.due_date != null ? String(d.due_date) : null,
    scheduled_for: d.scheduled_for != null ? String(d.scheduled_for) : null,
    recurrence: typeof d.recurrence === "string" ? d.recurrence : null,
    playbook_key: typeof d.playbook_key === "string" ? d.playbook_key : null,
    is_overdue: Boolean(d.is_overdue),
  };
}

function parseTasks(data: unknown): HostsTaskRow[] {
  return asArray<unknown>(data)
    .map((row) => parseTaskRow(row))
    .filter((r): r is HostsTaskRow => r !== null);
}

function parseTemplates(data: unknown): HostsTaskTemplateRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        template_key: typeof d.template_key === "string" ? d.template_key : "",
        title: typeof d.title === "string" ? d.title : "",
        description: typeof d.description === "string" ? d.description : null,
        category: typeof d.category === "string" ? d.category : "",
        default_priority: typeof d.default_priority === "string" ? d.default_priority : "medium",
        default_assignee_role: typeof d.default_assignee_role === "string" ? d.default_assignee_role : null,
        recurrence: typeof d.recurrence === "string" ? d.recurrence : null,
      };
    })
    .filter((r): r is HostsTaskTemplateRow => r !== null);
}

function parsePlaybooks(data: unknown): HostsPlaybookDefinition[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.key) return null;
      return {
        key: String(d.key),
        label: typeof d.label === "string" ? d.label : "",
        steps: asArray<string>(d.steps).map(String),
      };
    })
    .filter((r): r is HostsPlaybookDefinition => r !== null);
}

function parsePlaybookRuns(data: unknown): HostsPlaybookRunRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        playbook_key: typeof d.playbook_key === "string" ? d.playbook_key : "",
        property: typeof d.property === "string" ? d.property : "",
        property_id: d.property_id != null ? String(d.property_id) : null,
        run_status: typeof d.run_status === "string" ? d.run_status : "",
        steps_completed: asArray<unknown>(d.steps_completed),
        started_at: typeof d.started_at === "string" ? d.started_at : "",
      };
    })
    .filter((r): r is HostsPlaybookRunRow => r !== null);
}

function parseProperties(data: unknown): HostsTaskPropertyOption[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return { id: String(d.id), display_name: typeof d.display_name === "string" ? d.display_name : "" };
    })
    .filter((r): r is HostsTaskPropertyOption => r !== null);
}

function parseNotifications(data: unknown): HostsTaskNotification[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.key) return null;
      return {
        key: String(d.key),
        active: Boolean(d.active),
        count: Number(d.count ?? 0),
        message: typeof d.message === "string" ? d.message : "",
      };
    })
    .filter((r): r is HostsTaskNotification => r !== null);
}

export function parseAipifyHostsTasksCenterDashboard(data: unknown): HostsTasksCenterDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;
  return {
    has_customer: true,
    enabled: Boolean(d.enabled ?? true),
    package_key: typeof d.package_key === "string" ? d.package_key : "hosts_solo",
    active_section: typeof d.active_section === "string" ? d.active_section : "active_tasks",
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    sections: asArray<{ key: string; label: string }>(d.sections),
    categories: asArray<string>(d.categories),
    task_statuses: asArray<string>(d.task_statuses),
    priorities: asArray<string>(d.priorities),
    assignee_roles: asArray<string>(d.assignee_roles),
    recurrence_options: asArray<string>(d.recurrence_options),
    playbooks: parsePlaybooks(d.playbooks),
    notifications: parseNotifications(d.notifications),
    active_tasks: parseTasks(d.active_tasks),
    scheduled_tasks: parseTasks(d.scheduled_tasks),
    completed_tasks: parseTasks(d.completed_tasks),
    templates: parseTemplates(d.templates),
    playbook_runs: parsePlaybookRuns(d.playbook_runs),
    properties: parseProperties(d.properties),
  };
}

export function parseAipifyHostsTasksCenterActionResult(data: unknown): HostsTasksCenterActionResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    task_id: d.task_id != null ? String(d.task_id) : undefined,
    playbook_run_id: d.playbook_run_id != null ? String(d.playbook_run_id) : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
  };
}
