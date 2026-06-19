import type {
  DepartmentTaskStats,
  TaskApproval,
  TaskManagementCenter,
  TaskRecord,
  TaskTemplate,
} from "./types";

function parseTask(raw: unknown): TaskRecord | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.title !== "string") return null;
  return {
    id: o.id,
    task_number: typeof o.task_number === "string" ? o.task_number : null,
    title: o.title,
    description: typeof o.description === "string" ? o.description : null,
    priority: (o.priority as TaskRecord["priority"]) ?? "normal",
    status: (o.status as TaskRecord["status"]) ?? "waiting",
    assigned_user_id: typeof o.assigned_user_id === "string" ? o.assigned_user_id : null,
    created_by: typeof o.created_by === "string" ? o.created_by : null,
    department_id: typeof o.department_id === "string" ? o.department_id : null,
    domain_id: typeof o.domain_id === "string" ? o.domain_id : null,
    related_module_key: typeof o.related_module_key === "string" ? o.related_module_key : null,
    business_pack_key: typeof o.business_pack_key === "string" ? o.business_pack_key : null,
    due_date: typeof o.due_date === "string" ? o.due_date : null,
    requires_approval: Boolean(o.requires_approval),
    created_at: typeof o.created_at === "string" ? o.created_at : "",
    updated_at: typeof o.updated_at === "string" ? o.updated_at : "",
    completed_at: typeof o.completed_at === "string" ? o.completed_at : null,
  };
}

function parseTasks(raw: unknown): TaskRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseTask).filter((t): t is TaskRecord => t !== null);
}

export function parseTaskManagementCenter(data: unknown): TaskManagementCenter | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const overview = o.overview as Record<string, unknown> | undefined;
  const reports = o.reports as Record<string, unknown> | undefined;

  return {
    found: Boolean(o.found),
    principle: typeof o.principle === "string" ? o.principle : undefined,
    structure: typeof o.structure === "string" ? o.structure : undefined,
    statuses: Array.isArray(o.statuses) ? (o.statuses as TaskManagementCenter["statuses"]) : undefined,
    priorities: Array.isArray(o.priorities) ? (o.priorities as TaskManagementCenter["priorities"]) : undefined,
    overview: overview
      ? {
          open: Number(overview.open ?? 0),
          my_open: Number(overview.my_open ?? 0),
          overdue: Number(overview.overdue ?? 0),
          awaiting_approval: Number(overview.awaiting_approval ?? 0),
          completed_30d: Number(overview.completed_30d ?? 0),
          completion_rate: Number(overview.completion_rate ?? 0),
        }
      : undefined,
    my_tasks: parseTasks(o.my_tasks),
    assigned_by_me: parseTasks(o.assigned_by_me),
    department_tasks: Array.isArray(o.department_tasks)
      ? (o.department_tasks as DepartmentTaskStats[])
      : [],
    completed: parseTasks(o.completed),
    approvals: Array.isArray(o.approvals) ? (o.approvals as TaskApproval[]) : [],
    templates: Array.isArray(o.templates) ? (o.templates as TaskTemplate[]) : [],
    reports: reports
      ? {
          open_tasks: Number(reports.open_tasks ?? 0),
          completed_tasks: Number(reports.completed_tasks ?? 0),
          overdue_tasks: Number(reports.overdue_tasks ?? 0),
          by_priority: {
            critical: Number((reports.by_priority as Record<string, unknown>)?.critical ?? 0),
            high: Number((reports.by_priority as Record<string, unknown>)?.high ?? 0),
          },
          by_pack: Array.isArray(reports.by_pack)
            ? (reports.by_pack as { pack_key: string; count: number }[])
            : [],
        }
      : undefined,
    domains_route: typeof o.domains_route === "string" ? o.domains_route : undefined,
  };
}
