import type {
  CollaborationMeeting,
  MeetingActionItem,
  MeetingCollaborationExport,
  MeetingCollaborationIntelligenceEngineCard,
  MeetingCollaborationIntelligenceEngineDashboard,
  MeetingDecision,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

export function parseMeetingCollaborationIntelligenceEngineCard(
  data: unknown
): MeetingCollaborationIntelligenceEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as MeetingCollaborationIntelligenceEngineCard;
}

export function parseMeetingCollaborationIntelligenceEngineDashboard(
  data: unknown
): MeetingCollaborationIntelligenceEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    meetings: parseRecordList<CollaborationMeeting>(d.meetings),
    action_items: parseRecordList<MeetingActionItem>(d.action_items),
    decisions: parseRecordList<MeetingDecision>(d.decisions),
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
    workflow_examples:
      typeof d.workflow_examples === "object" && d.workflow_examples
        ? (d.workflow_examples as Record<string, unknown>)
        : undefined,
    ...d,
  } as MeetingCollaborationIntelligenceEngineDashboard;
}

export function parseMeetingCollaborationExport(data: unknown): MeetingCollaborationExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    meetings: parseRecordList<CollaborationMeeting>(d.meetings),
    action_items: parseRecordList<MeetingActionItem>(d.action_items),
    decisions: parseRecordList<MeetingDecision>(d.decisions),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    ...d,
  } as MeetingCollaborationExport;
}
