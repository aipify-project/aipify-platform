import type {
  ArchivedRecord,
  RecordDisposalRequest,
  RecordsRetentionManagementEngineCard,
  RecordsRetentionManagementEngineDashboard,
  RetentionPolicy,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

export function parseRecordsRetentionManagementEngineCard(
  data: unknown
): RecordsRetentionManagementEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as RecordsRetentionManagementEngineCard;
}

export function parseRecordsRetentionManagementEngineDashboard(
  data: unknown
): RecordsRetentionManagementEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    policies: parseRecordList<RetentionPolicy>(d.policies),
    archived_records: parseRecordList<ArchivedRecord>(d.archived_records),
    disposal_requests: parseRecordList<RecordDisposalRequest>(d.disposal_requests),
    compliance:
      typeof d.compliance === "object" && d.compliance ? (d.compliance as Record<string, unknown>) : undefined,
    upcoming_expirations:
      typeof d.upcoming_expirations === "object" && d.upcoming_expirations
        ? (d.upcoming_expirations as Record<string, unknown>)
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
  } as RecordsRetentionManagementEngineDashboard;
}
