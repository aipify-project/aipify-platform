import type {
  IncidentCommunication,
  IncidentLessonLearned,
  IncidentRecord,
  IncidentResponseCoordinationEngineCard,
  IncidentResponseCoordinationEngineDashboard,
  IncidentTimelineEvent,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

export function parseIncidentResponseCoordinationEngineCard(
  data: unknown
): IncidentResponseCoordinationEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as IncidentResponseCoordinationEngineCard;
}

export function parseIncidentResponseCoordinationEngineDashboard(
  data: unknown
): IncidentResponseCoordinationEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    incidents: parseRecordList<IncidentRecord>(d.incidents),
    timeline_events: parseRecordList<IncidentTimelineEvent>(d.timeline_events),
    communications: parseRecordList<IncidentCommunication>(d.communications),
    lessons_learned: parseRecordList<IncidentLessonLearned>(d.lessons_learned),
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
  } as IncidentResponseCoordinationEngineDashboard;
}
