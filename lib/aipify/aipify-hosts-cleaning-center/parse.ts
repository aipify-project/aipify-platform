import type {
  HostsCleaningCenterActionResult,
  HostsCleaningCenterDashboard,
  HostsCleaningChecklistProgress,
  HostsCleaningCleanerRow,
  HostsCleaningIssueRow,
  HostsCleaningStats,
  HostsCleaningTaskRow,
  HostsCleaningTimelineRow,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseChecklist(data: unknown): HostsCleaningChecklistProgress {
  const d = (data ?? {}) as Record<string, unknown>;
  const items = (d.items && typeof d.items === "object" ? d.items : {}) as Record<string, boolean>;
  return {
    completed_count: Number(d.completed_count ?? 0),
    total_count: Number(d.total_count ?? 9),
    items,
  };
}

function parseTasks(data: unknown): HostsCleaningTaskRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        cleaning_key: typeof d.cleaning_key === "string" ? d.cleaning_key : "",
        property_id: d.property_id != null ? String(d.property_id) : null,
        property: typeof d.property === "string" ? d.property : "—",
        cleaner_id: d.cleaner_id != null ? String(d.cleaner_id) : null,
        assigned_cleaner: typeof d.assigned_cleaner === "string" ? d.assigned_cleaner : "—",
        category: typeof d.category === "string" ? d.category : "",
        departure_date: typeof d.departure_date === "string" ? d.departure_date : "",
        arrival_date: typeof d.arrival_date === "string" ? d.arrival_date : "",
        cleaning_status: typeof d.cleaning_status === "string" ? d.cleaning_status : "scheduled",
        due_time: typeof d.due_time === "string" ? d.due_time : "",
        scheduled_date: typeof d.scheduled_date === "string" ? d.scheduled_date : "",
        started_at: typeof d.started_at === "string" ? d.started_at : "",
        completed_at: typeof d.completed_at === "string" ? d.completed_at : "",
        checklist: parseChecklist(d.checklist),
        completion_notes: typeof d.completion_notes === "string" ? d.completion_notes : "",
        issue_count: Number(d.issue_count ?? 0),
        is_overdue: Boolean(d.is_overdue),
        is_today: Boolean(d.is_today),
      };
    })
    .filter((r): r is HostsCleaningTaskRow => r !== null);
}

function parseCleaners(data: unknown): HostsCleaningCleanerRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        cleaner_key: typeof d.cleaner_key === "string" ? d.cleaner_key : "",
        cleaner_name: typeof d.cleaner_name === "string" ? d.cleaner_name : "",
        contact_email: typeof d.contact_email === "string" ? d.contact_email : "",
        contact_phone: typeof d.contact_phone === "string" ? d.contact_phone : "",
        assigned_properties: d.assigned_properties ?? [],
        cleaner_status: typeof d.cleaner_status === "string" ? d.cleaner_status : "active",
        active_tasks: Number(d.active_tasks ?? 0),
      };
    })
    .filter((r): r is HostsCleaningCleanerRow => r !== null);
}

function parseIssues(data: unknown): HostsCleaningIssueRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        cleaning_task_id: typeof d.cleaning_task_id === "string" ? d.cleaning_task_id : "",
        issue_category: typeof d.issue_category === "string" ? d.issue_category : "",
        description: typeof d.description === "string" ? d.description : "",
        property: typeof d.property === "string" ? d.property : "—",
        reported_at: typeof d.reported_at === "string" ? d.reported_at : "",
      };
    })
    .filter((r): r is HostsCleaningIssueRow => r !== null);
}

function parseTimeline(data: unknown): HostsCleaningTimelineRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        cleaning_task_id: typeof d.cleaning_task_id === "string" ? d.cleaning_task_id : "",
        event_type: typeof d.event_type === "string" ? d.event_type : "",
        summary: typeof d.summary === "string" ? d.summary : "",
        occurred_at: typeof d.occurred_at === "string" ? d.occurred_at : "",
      };
    })
    .filter((r): r is HostsCleaningTimelineRow => r !== null);
}

function parseStats(data: unknown): HostsCleaningStats {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    cleanings_today: Number(d.cleanings_today ?? 0),
    overdue_cleanings: Number(d.overdue_cleanings ?? 0),
    properties_awaiting_cleaning: Number(d.properties_awaiting_cleaning ?? 0),
    issues_requiring_attention: Number(d.issues_requiring_attention ?? 0),
    active_tasks: Number(d.active_tasks ?? 0),
    active_cleaners: Number(d.active_cleaners ?? 0),
  };
}

export function parseAipifyHostsCleaningCenterDashboard(
  data: unknown,
): HostsCleaningCenterDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;

  return {
    has_customer: true,
    enabled: Boolean(d.enabled),
    package_key: typeof d.package_key === "string" ? d.package_key : "",
    active_section: typeof d.active_section === "string" ? d.active_section : "todays_cleaning",
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    sections: asArray<{ key: string; label: string }>(d.sections),
    checklist_keys: asArray<string>(d.checklist_keys),
    stats: parseStats(d.stats),
    properties: asArray<{ id: string; display_name: string }>(d.properties),
    cleaning_tasks: parseTasks(d.cleaning_tasks),
    cleaners: parseCleaners(d.cleaners),
    issues: parseIssues(d.issues),
    timeline: parseTimeline(d.timeline),
  };
}

export function parseAipifyHostsCleaningCenterActionResult(
  data: unknown,
): HostsCleaningCenterActionResult {
  if (!data || typeof data !== "object") return { success: false };
  const d = data as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    action_type: typeof d.action_type === "string" ? d.action_type : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
    cleaning_task_id: typeof d.cleaning_task_id === "string" ? d.cleaning_task_id : undefined,
  };
}
