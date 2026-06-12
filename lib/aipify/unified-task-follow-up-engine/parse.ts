import type {
  OrganizationTask,
  OrganizationTaskEscalation,
  OrganizationTaskReminder,
  UnifiedTaskFollowUpExport,
  UnifiedTaskFollowUpEngineCard,
  UnifiedTaskFollowUpEngineDashboard,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSections(data: unknown): UnifiedTaskFollowUpEngineDashboard["sections"] {
  if (typeof data !== "object" || !data) return undefined;
  const s = data as Record<string, unknown>;
  return {
    my_tasks: parseRecordList<OrganizationTask>(s.my_tasks),
    team_tasks: parseRecordList<OrganizationTask>(s.team_tasks),
    overdue_tasks: parseRecordList<OrganizationTask>(s.overdue_tasks),
    upcoming_deadlines: parseRecordList<OrganizationTask>(s.upcoming_deadlines),
    critical_tasks: parseRecordList<OrganizationTask>(s.critical_tasks),
    completed_tasks: parseRecordList<OrganizationTask>(s.completed_tasks),
  };
}

export function parseUnifiedTaskFollowUpEngineCard(data: unknown): UnifiedTaskFollowUpEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as UnifiedTaskFollowUpEngineCard;
}

export function parseUnifiedTaskFollowUpEngineDashboard(
  data: unknown
): UnifiedTaskFollowUpEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    sections: parseSections(d.sections),
    reminders: parseRecordList<OrganizationTaskReminder>(d.reminders),
    escalations: parseRecordList<OrganizationTaskEscalation>(d.escalations),
    settings: typeof d.settings === "object" && d.settings ? (d.settings as Record<string, unknown>) : undefined,
    executive_summary:
      typeof d.executive_summary === "object" && d.executive_summary
        ? (d.executive_summary as Record<string, unknown>)
        : undefined,
    integration_notes:
      typeof d.integration_notes === "object" && d.integration_notes
        ? (d.integration_notes as Record<string, string>)
        : undefined,
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    ...d,
  } as UnifiedTaskFollowUpEngineDashboard;
}

export function parseUnifiedTaskFollowUpExport(data: unknown): UnifiedTaskFollowUpExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    tasks: parseRecordList<OrganizationTask>(d.tasks),
    reminders: parseRecordList<OrganizationTaskReminder>(d.reminders),
    escalations: parseRecordList<OrganizationTaskEscalation>(d.escalations),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    ...d,
  } as UnifiedTaskFollowUpExport;
}
