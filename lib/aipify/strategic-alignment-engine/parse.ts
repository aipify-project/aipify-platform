import type {
  StrategicAlignmentEngineCard,
  StrategicAlignmentEngineDashboard,
  StrategicAlignmentReportExport,
  StrategicAlignmentSnapshot,
  StrategicObjective,
  StrategicObjectiveLink,
  StrategicReview,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

export function parseStrategicAlignmentEngineCard(data: unknown): StrategicAlignmentEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as StrategicAlignmentEngineCard;
}

export function parseStrategicAlignmentEngineDashboard(
  data: unknown
): StrategicAlignmentEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    objectives: parseRecordList<StrategicObjective>(d.objectives),
    links: parseRecordList<StrategicObjectiveLink>(d.links),
    reviews: parseRecordList<StrategicReview>(d.reviews),
    snapshots: parseRecordList<StrategicAlignmentSnapshot>(d.snapshots),
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
  } as StrategicAlignmentEngineDashboard;
}

export function parseStrategicAlignmentReportExport(data: unknown): StrategicAlignmentReportExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    objective:
      typeof d.objective === "object" && d.objective
        ? (d.objective as StrategicObjective)
        : undefined,
    objectives: parseRecordList<StrategicObjective>(d.objectives),
    links: parseRecordList<StrategicObjectiveLink>(d.links),
    reviews: parseRecordList<StrategicReview>(d.reviews),
    snapshots: parseRecordList<StrategicAlignmentSnapshot>(d.snapshots),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    ...d,
  } as StrategicAlignmentReportExport;
}
